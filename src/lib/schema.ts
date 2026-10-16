import { z } from "zod";

export const facultySchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    role: z.enum(["admin", "teacher", "student"], {
        required_error: "Please select a role",
    }),
    department: z.string(),
    image: z.string().optional(),
    imageCldPubId: z.string().optional(),
});

export const subjectSchema = z.object({
    name: z.string().min(3, "Subject name must be at least 3 characters"),
    code: z.string().min(5, "Subject code must be at least 5 characters"),
    description: z
        .string()
        .min(5, "Subject description must be at least 5 characters"),
    department: z
        .string()
        .min(2, "Subject department must be at least 2 characters"),
});

const scheduleSchema = z.object({
    day: z.string().min(1, "Day is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
});

export const classSchema = z.object({
    name: z.string().min(1, "Class name is required"),
    description: z.string().min(1, "Description is required"),
    status: z.enum(["active", "inactive"]),

    subjectId: z.number({
        required_error: "Subject is required",
        invalid_type_error: "Subject is required",
    }),
    teacherId: z.number({
        required_error: "Teacher is required",
        invalid_type_error: "Teacher is required",
    }),

    capacity: z.number().optional(),
    bannerUrl: z.string().optional(),
    bannerCldPubId: z.string().optional(),
    inviteCode: z.string().optional(),
    schedules: z.array(scheduleSchema).optional(),
});

export const enrollmentSchema = z.object({
    classId: z.coerce
        .number({
            required_error: "Class ID is required",
            invalid_type_error: "Class ID is required",
        })
        .min(1, "Class ID is required"),

    studentId: z.string().min(1, "Student ID is required"),
});