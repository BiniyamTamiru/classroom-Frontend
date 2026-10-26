export const DEPARTEMENTS = [
    "CS",
    "Math",
    "Software Engineering",
    "IT",
    "Law",
];

export const SUBJECTS = [
    "data structures",
    "signal",
    "math",
];

export const TEACHER = [
    "LALISA",
    "TOLA",
    "TEMESGEN",
];

export const DEPARTMENTS_OPTIONS = DEPARTEMENTS.map((dept) => ({
    value: dept,
    label: dept,
}));

export const SUBJECTS_OPTIONS = SUBJECTS.map((subjectItem) => ({
    value: subjectItem,
    label: subjectItem,
}));

export const TEACHERS_OPTIONS = TEACHER.map((tech) => ({
    value: tech,
    label: tech,
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

export type Subject = {
    id: number;
    name: string;
    code: string;
    description: string;
    department: string;
    createdAt?: string;
};

export type ListResponse<T = unknown> = {
    data?: T[];
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type CreateResponse<T = unknown> = {
    data?: T;
};

export type GetOneResponse<T = unknown> = {
    data?: T;
};

declare global {
    interface CloudinaryUploadWidgetResults {
        event: string;
        info: {
            secure_url: string;
            public_id: string;
            delete_token?: string;
            resource_type: string;
        };
    }
}

export type User = {
    id: number;
    name: string;
    email: string;
    image?: string;
    imageCldPubId?: string;
    role: UserRole;
};

export type UserRole = "admin" | "teacher" | "student";

export type Department = {
    id: number;
    name: string;
    code: string;
};

export type Schedule = {
    id: number;
    day: string;
    startTime: string;
    endTime: string;
};

export type Classroom = {
    id: number;
    status: "active" | "inactive";
    capacity: number;
    courseCode: string;
    courseName: string;
    bannerUrl?: string;
    bannerCldPubId?: string;
    subject?: Subject;
    teacher?: User;
    department?: Department;
    schedules: Schedule[];
    inviteCode?: string;
};

export type classes = {
    id: string | number;
    name: string;
    status: string;
    subject: string | { name: string };
    teacher?: string | User;
    teacherId?: string;
    capacity?: number | { capacity: number };
    bannerUrl?: string;
    bannerCldPubId?: string;
    inviteCode?: string;
};