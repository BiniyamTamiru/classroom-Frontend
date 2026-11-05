import {
  createDataProvider,
  type CreateDataProviderOptions,
} from "@refinedev/rest";

import { BACKEND_BASE_URL } from "@/components/constant";
import type { GetOneResponse, ListResponse } from "@/types";
import type { HttpError, CreateResponse } from "@refinedev/core";

const resourceEndpoints: Record<string, string> = {
  users: "users",
  subjects: "subjects",
  departments: "departments",
  classes: "classes",
  enrollments: "enrollments",
  "teacher-classes": "teacher/classes",
  "teacher-students": "teacher/students",
  "teacher-subjects": "teacher/subjects",
  "teacher-enrollments": "teacher/enrollments",
  "teacher-profile": "teacher/profile",
  "student-dashboard": "student/dashboard",
  "student-classes": "student/classes",
  "student-class-detail": "student/classes",
  "student-browse-classes": "student/browse-classes",
  "student-subjects": "student/subjects",
  "student-enrollments": "student/enrollments",
  "student-profile": "student/profile",
};

const getResourceEndpoint = (resource: string) =>
    resourceEndpoints[resource] ?? resource;

const buildHttpError = async (response: Response): Promise<HttpError> => {
  let message = `Request failed with status ${response.status}.`;

  try {
    const payload = (await response.clone().json()) as {
      message?: string;
      error?: string;
    };

    if (payload.message) {
      message = payload.message;
    } else if (payload.error) {
      message = payload.error;
    }
  } catch {
    // ignore invalid JSON
  }

  return { message, statusCode: response.status };
};

const options: CreateDataProviderOptions = {
  getList: {
    getEndpoint: ({ resource }) => getResourceEndpoint(resource),

    buildQueryParams: async ({ resource, pagination, filters, meta }) => {
      const page = pagination?.currentPage ?? 1;
      const pageSize = pagination?.pageSize ?? 10;

      const params: Record<string, string | number> = {
        page,
        limit: pageSize,
      };

      filters?.forEach((filter) => {
        if (!("field" in filter)) return;

        const field = filter.field;
        const value =
            filter.value !== undefined && filter.value !== null
                ? String(filter.value).trim()
                : "";

        if (resource === "subjects") {
          if ((field === "department" || field === "department_id") && value) {
            params.department = value;
          }
          if ((field === "name" || field === "code") && value) {
            params.search = value;
          }
        }

        if (resource === "classes") {
          if (field === "name") {
            if (value) params.search = value;
            else delete params.search;
          }
          if (field === "subject" && value && value !== "all") {
            params.subject = value;
          }
          if (field === "teacher" && value && value !== "all") {
            params.teacher = value;
          }
          if (field === "status" && value && value !== "all") {
            params.status = value;
          }
        }

        if (resource === "users") {
          if (field === "search") {
            if (value) params.search = value;
            else delete params.search;
          }
          if (field === "role") {
            if (value && value !== "all") params.role = value;
            else delete params.role;
          }
        }

        if (resource === "enrollments") {
          if (field === "search") {
            if (value) params.search = value;
            else delete params.search;
          }
          if (field === "classId" && value && value !== "all") {
            params.classId = value;
          }
        }

        if (resource === "teacher-classes") {
          if (field === "search" && value) params.search = value;
          if (field === "status" && value && value !== "all") params.status = value;
        }

        if (resource === "teacher-students") {
          if (field === "search" && value) params.search = value;
          if (field === "classId" && value && value !== "all") params.classId = value;
        }

        if (resource === "teacher-subjects") {
          if ((field === "search" || field === "name" || field === "code") && value) {
            params.search = value;
          }
          if (field === "departmentId" && value && value !== "all") {
            params.departmentId = value;
          }
        }

        if (resource === "teacher-enrollments") {
          if (field === "search" && value) params.search = value;
          if (field === "classId" && value && value !== "all") params.classId = value;
        }

        if (resource === "departments") {
          if (["search", "name", "code"].includes(field)) {
            if (value) params.search = value;
            else delete params.search;
          }
        }
      });

      if (meta?.query) {
        Object.entries(meta.query).forEach(([key, value]) => {
          if (
              value !== undefined &&
              value !== null &&
              value !== "all" &&
              String(value).trim() !== ""
          ) {
            params[key] = String(value).trim();
          }
        });
      }

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
    getEndpoint: ({ resource }) => getResourceEndpoint(resource),
    buildBodyParams: async ({ variables }) => variables,
    transformError: async (response) => buildHttpError(response),
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const json: CreateResponse = await response.json();
      return json.data ?? [];
    },
  },

  getOne: {
    getEndpoint: ({ resource, id }) => {
      const endpoint = getResourceEndpoint(resource);
      return resource === "teacher-profile" || !id ? endpoint : `${endpoint}/${id}`;
    },
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const json: GetOneResponse = await response.json();
      return json.data ?? {};
    },
  },

  update: {
    getEndpoint: ({ resource, id }) => {
      const endpoint = getResourceEndpoint(resource);
      return resource === "teacher-profile" || !id ? endpoint : `${endpoint}/${id}`;
    },
    getRequestMethod: ({ resource }) =>
        resource === "teacher-profile" ? "patch" :
            resource === "departments" ||
            resource === "subjects" ||
            resource === "enrollments"
                ? "patch"
                : "put",
    buildBodyParams: async ({ variables }) => variables,
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const json: GetOneResponse = await response.json();
      return json.data ?? {};
    },
    transformError: async (response) => buildHttpError(response),
  },

  deleteOne: {
    getEndpoint: ({ resource, id }) => {
      const endpoint = getResourceEndpoint(resource);
      return !id ? endpoint : `${endpoint}/${id}`;
    },
    mapResponse: async (response) => {
      if (!response.ok) throw await buildHttpError(response);
      const json: GetOneResponse = await response.json();
      return json.data ?? {};
    },
    transformError: async (response) => buildHttpError(response),
  },

  custom: {
    transformError: async (response) => buildHttpError(response),
  },
};

const { dataProvider } = createDataProvider(
    BACKEND_BASE_URL,
    options,
    {
      credentials: "include",
    },
);

export default dataProvider;