import { useOne } from "@refinedev/core";
import { useParams } from "react-router";
import { BookOpen, Users, GraduationCap, Building2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";

type TeacherClassDetail = {
    id: number;
    name: string;
    description?: string | null;
    status: "active" | "inactive" | "archived";
    capacity?: number | null;
    inviteCode?: string | null;
    subject: {
        id: number;
        name: string;
        code: string;
        description?: string | null;
    };
    department: {
        id: number;
        name: string;
        code: string;
        description?: string | null;
    };
    teacher: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
    };
    enrolledStudents: number;
    students: Array<{
        id: string;
        name: string;
        email: string;
        image?: string | null;
        enrolledAt: string;
    }>;
    totalEnrollments: number;
};

export default function TeacherClassesShow() {
    const { id } = useParams();
    const classQuery = useOne<TeacherClassDetail>({
        resource: "classes",
        id: id ?? "",
    });

    // classQuery.result is already the record object
    const record = classQuery.result as TeacherClassDetail | undefined;

    if (classQuery.query.isLoading) {
        return <div className="p-8 text-sm text-muted-foreground">Loading class details...</div>;
    }

    if (classQuery.query.isError || !record) {
        return (
            <div className="p-8 text-sm text-destructive">
                {classQuery.query.error?.message ?? "Class not found."}
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
            <div className="rounded-2xl border bg-card p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">
                            Class overview
                        </p>
                        <h1 className="mt-2 text-3xl font-bold">{record.name}</h1>
                    </div>
                    <Badge variant={record.status === "active" ? "default" : "secondary"}>
                        {record.status}
                    </Badge>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-3">
                    <div className="rounded-xl border p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BookOpen className="size-4" />
                            Subject
                        </div>
                        <p className="mt-2 font-medium">{record.subject.name}</p>
                        <p className="text-sm text-muted-foreground">{record.subject.code}</p>
                    </div>

                    <div className="rounded-xl border p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="size-4" />
                            Department
                        </div>
                        <p className="mt-2 font-medium">{record.department.name}</p>
                        <p className="text-sm text-muted-foreground">{record.department.code}</p>
                    </div>

                    <div className="rounded-xl border p-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Users className="size-4" />
                            Enrolled students
                        </div>
                        <p className="mt-2 font-medium">{record.totalEnrollments}</p>
                    </div>
                </div>

                <div className="mt-6 space-y-3">
                    <div>
                        <p className="font-semibold">Description</p>
                        <p className="text-sm text-muted-foreground">
                            {record.description || "No class description provided."}
                        </p>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-xl border p-4">
                            <p className="font-semibold">Teacher</p>
                            <p className="mt-2 text-sm">{record.teacher.name}</p>
                            <p className="text-xs text-muted-foreground">{record.teacher.email}</p>
                        </div>

                        <div className="rounded-xl border p-4">
                            <p className="font-semibold">Invite code</p>
                            <p className="mt-2 text-sm font-mono">{record.inviteCode ?? "N/A"}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border bg-card p-6">
                <div className="mb-4 flex items-center gap-2">
                    <GraduationCap className="size-5" />
                    <h2 className="text-xl font-semibold">Enrolled students</h2>
                </div>

                {record.students.length === 0 ? (
                    <div className="text-sm text-muted-foreground">No students enrolled in this class yet.</div>
                ) : (
                    <div className="space-y-3">
                        {record.students.map((student) => (
                            <div key={student.id} className="flex items-center justify-between rounded-xl border p-3">
                                <div>
                                    <p className="font-medium">{student.name}</p>
                                    <p className="text-xs text-muted-foreground">{student.email}</p>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Enrolled: {new Date(student.enrolledAt).toLocaleDateString()}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}