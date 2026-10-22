import {
  createDataProvider,
  type CreateDataProviderOptions,
} from "@refinedev/rest";

import { BACKEND_BASE_URL } from "@/components/constant";
import type { ListResponse } from "@/types";
import type { HttpError, CreateResponse } from "@refinedev/core";

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = 'Request failed.';
  try {
    const payload = (await response.json()) as { message?: string };

    if (payload?.message) message = payload.message;
  } catch (e) {
    // ignore
  }

  return {
    message,
    statusCode: response.status,
  };
};

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => resource, // 👈 Removed explicit parameter type annotation

    buildQueryParams: async ({ resource, pagination, filters }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string | number> = {
        page,
        limit: pageSize,
      };

      filters?.forEach((filter) => {
        if (!("field" in filter)) return;

        const field = filter.field;
        const value = String(filter.value);

        if (resource === "subjects") {
          if (field === "department") {
            params.department = value;
          }

          if (field === "department_id") {
            params.department_id = value;
          }

          if (field === "name" || field === "code") {
            params.search = value;
          }
        }
      });

      return params;
    },

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const payload: ListResponse = await response.json();
      return payload.data ?? [];
    },

    getTotalCount: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const payload: ListResponse = await response.json();
      return payload.pagination?.total ?? payload.data?.length ?? 0;
    },
  },

  create: {
    getEndpoint: ({ resource }) => resource, // 👈 Removed explicit parameter type annotation

    buildBodyParams: async ({ variables }) => variables,

    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);

      const json: CreateResponse = await response.json(); // 👈 CreateResponse is now properly imported
      return json.data ?? [];
    },
  },
};

const { dataProvider } = createDataProvider(
    BACKEND_BASE_URL,
    options
);

export default dataProvider;