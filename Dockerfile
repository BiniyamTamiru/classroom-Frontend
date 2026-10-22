# This Dockerfile uses `serve` npm package to serve the static files with node process.
# You can find the Dockerfile for nginx in the following link:
# https://github.com/refinedev/dockerfiles/blob/main/vite/Dockerfile.nginx
FROM docker.io/refinedev/node:22 AS base

FROM base as deps

COPY package.json yarn.lock* package-lock.json* pnpm-lock.yaml* .npmrc* ./

RUN \
  if [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  elif [ -f package-lock.json ]; then npm ci; \
  elif [ -f pnpm-lock.yaml ]; then yarn global add pnpm && pnpm i --frozen-lockfile; \
  else echo "Lockfile not found." && exit 1; \
  fi

FROM base as builder

ENV NODE_ENV production

# Pass Render environment variables into the Vite build process
ARG VITE_BACKEND_BASE_URL
ENV VITE_BACKEND_BASE_URL=$VITE_BACKEND_BASE_URL

ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

ARG VITE_ACCESS_TOKEN_KEY
ENV VITE_ACCESS_TOKEN_KEY=$VITE_ACCESS_TOKEN_KEY

ARG VITE_REFRESH_TOKEN_KEY
ENV VITE_REFRESH_TOKEN_KEY=$VITE_REFRESH_TOKEN_KEY

ARG VITE_CLOUDINARY_CLOUD_NAME
ENV VITE_CLOUDINARY_CLOUD_NAME=$VITE_CLOUDINARY_CLOUD_NAME

ARG VITE_CLOUDINARY_UPLOAD_PRESET
ENV VITE_CLOUDINARY_UPLOAD_PRESET=$VITE_CLOUDINARY_UPLOAD_PRESET

ARG VITE_CLOUDINARY_UPLOAD_URL
ENV VITE_CLOUDINARY_UPLOAD_URL=$VITE_CLOUDINARY_UPLOAD_URL

COPY --from=deps /app/refine/node_modules ./node_modules

COPY . .

RUN npm run build

FROM base as runner

ENV NODE_ENV production

RUN npm install -g serve

COPY --from=builder /app/refine/dist ./

USER refine

CMD ["serve"]