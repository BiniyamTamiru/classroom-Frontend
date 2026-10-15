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

export type SignUpPayload = {
    email: string;
    name: string;
    password: string;
    image?: string;
    imageCldPubId?: string;
    role: UserRole;
};