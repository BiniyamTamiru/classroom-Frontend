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
    description: string | null;
    departmentId?: number;
    department: Department;
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
    id: string;
    name: string;
    email: string;
    image?: string;
    imageCldPubId?: string;
    role: UserRole;
};

export type UserRole = "admin" | "teacher" | "student";

export type Enrollment = {
    id: number;
    studentId: string;
    classId: number;
    createdAt: string;
    updatedAt: string;
    student: Pick<User, "id" | "name" | "email" | "role">;
    class: {
        id: number;
        name: string;
        subjectId: number;
        teacherId: string;
        subject: {
            id: number;
            name: string;
            code: string;
        } | null;
    };
};

export type EnrollmentShowResponse = {
    enrollmentWithRelations: Enrollment;
};

export type Department = {
    id: number;
    name: string;
    code: string;
};

export type SubjectDetails = Subject & {
    classes: Array<{
        id: number;
        name: string;
        status: "active" | "inactive" | "archived";
        teacher: {
            id: string | null;
            name: string | null;
        } | null;
    }>;
};

export type SubjectDetailsResponse = {
    subjectWithDepartment: SubjectDetails;
};

export type DepartmentListItem = Department & {
    totalSubjects: number;
};

export type DepartmentDetails = {
    department: Department & {
        description: string | null;
    };
    totalSubjects: number;
    totalClasses: number;
    totalEnrolledStudents: number;
    subjects: Array<{
        id: number;
        code: string;
        name: string;
        description: string | null;
    }>;
    classes: Array<{
        id: number;
        name: string;
        status: "active" | "inactive" | "archived";
        subject: {
            id: number;
            code: string;
            name: string;
        };
        teacher: {
            id: string;
            name: string;
            email: string;
            role: UserRole;
        };
    }>;
    users: Array<{
        id: string;
        name: string;
        email: string;
        role: UserRole;
        relationships: string[];
    }>;
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
    description?: string | null; // Added description
    status: string;
    capacity?: number | null;
    subject?: {
        code?: string;
        name: string;
        description?: string;
    };
    teacher?: string | User;
    teacherId?: string;
    department?: {
        name: string;
        description?: string;
    }; // Added department
    bannerUrl?: string | null;
    bannerCldPubId?: string | null; // Matches your Drizzle schema capital 'P'
    inviteCode?: string;
};