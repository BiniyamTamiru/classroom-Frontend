export const DEPARTEMENTS = [
    "CS",
    "Math",
    "Software Engineering",
    "IT",
    "Law",
];

export const DEPARTMENTS_OPTIONS = DEPARTEMENTS.map((dept) => ({
    value: dept,
    label: dept,
}));

export const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB in bytes

export const ALLOWED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
];

const requireEnv = (name: string, value: string | undefined): string => {
    const trimmedValue = value?.trim();
    if (!trimmedValue) {
        throw new Error(`Missing required environment variable: ${name}`);
    }

    return trimmedValue;
};

const requireUrlEnv = (name: string, value: string | undefined): string => {
    const url = requireEnv(name, value);
    let parsedUrl: URL;
    try {
        parsedUrl = new URL(url);
    } catch (error) {
        throw new Error(`Invalid URL in environment variable: ${name}`, { cause: error });
    }
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        throw new Error(`Invalid URL in environment variable: ${name}`);
    }

    return url;
};

export const CLOUDINARY_UPLOAD_URL = requireUrlEnv(
    "VITE_CLOUDINARY_UPLOAD_URL",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_URL
);
export const CLOUDINARY_CLOUD_NAME = requireEnv(
    "VITE_CLOUDINARY_CLOUD_NAME",
    import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
);

export const BACKEND_BASE_URL = requireUrlEnv(
    "VITE_BACKEND_BASE_URL",
    import.meta.env.VITE_BACKEND_BASE_URL
);

export const BASE_URL = requireUrlEnv("VITE_API_URL", import.meta.env.VITE_API_URL);
export const ACCESS_TOKEN_KEY = requireEnv(
    "VITE_ACCESS_TOKEN_KEY",
    import.meta.env.VITE_ACCESS_TOKEN_KEY
);
export const REFRESH_TOKEN_KEY = requireEnv(
    "VITE_REFRESH_TOKEN_KEY",
    import.meta.env.VITE_REFRESH_TOKEN_KEY
);

export const REFRESH_TOKEN_URL = `${BASE_URL}/refresh-token`;

export const CLOUDINARY_UPLOAD_PRESET = requireEnv(
    "VITE_CLOUDINARY_UPLOAD_PRESET",
    import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
);