
import { useOne } from "@refinedev/core";
import {
    Loader2,
    ArrowLeft,
    Users,
    Mail,
} from "lucide-react";
import { Link, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

type TeacherStudentDetails = {
    student: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
        role: string;
        createdAt?: string;
    };
    sharedClasses: Array<{
        id: number;
        name: string;
        status: string;
        subjectName: string;
        subjectCode: string;
        departmentName: string;
        enrolledAt: string;
    }>;
};

export default function TeacherStudentShow() {
    const { id } = useParams<{ id: string }>();

    const studentQuery = useOne<TeacherStudentDetails>({
        resource: "teacher-students",
        id: id ?? "",
        queryOptions: {
            enabled: Boolean(id),
        },
    });

    // Refine returns the API response in result.data
    const record = studentQuery.result;

    const student = record?.student;
    const sharedClasses = record?.sharedClasses ?? [];

    // Missing student ID
    if (!id || id === "undefined") {
        return (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                A valid student ID is required. Please return to the student list and select a student.
                <div className="mt-4">
                    <Button asChild variant="outline">
                        <Link to="/teacher/students">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to students
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Loading
    if (studentQuery.query.isLoading) {
        return (
            <div className="flex items-center gap-2 p-4 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading student details...
            </div>
        );
    }

    // Error
    if (studentQuery.query.isError) {
        return (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {studentQuery.query.error?.message ??
                    "Unable to load this student."}

                <div className="mt-4">
                    <Button asChild variant="outline">
                        <Link to="/teacher/students">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to students
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    // Student not found
    if (!student) {
        return (
            <div className="p-4 text-sm text-muted-foreground">
                Student not found.

                <div className="mt-4">
                    <Button asChild variant="outline">
                        <Link to="/teacher/students">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to students
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
            {/* Header */}
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="sm">
                        <Link to="/teacher/students">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>

                    <div>
                        <h1 className="text-2xl font-bold">
                            {student.name}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Student profile
                        </p>
                    </div>
                </div>

                <Badge variant="secondary">
                    {student.role}
                </Badge>
            </header>

            {/* Student Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-primary" />
                        Student information
                    </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4 text-sm">
                    {student.image && (
                        <img
                            src={student.image}
                            alt={student.name}
                            className="h-20 w-20 rounded-full object-cover"
                        />
                    )}

                    <p>
                        <strong>Name:</strong> {student.name}
                    </p>

                    <p>
                        <strong>Email:</strong> {student.email}
                    </p>

                    <p>
                        <strong>ID:</strong> {student.id}
                    </p>

                    <p>
                        <strong>Joined:</strong>{" "}
                        {student.createdAt
                            ? new Date(
                                student.createdAt
                            ).toLocaleDateString()
                            : "N/A"}
                    </p>
                </CardContent>
            </Card>

            {/* Shared Classes */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-primary" />
                        Shared classes
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    {sharedClasses.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                            No shared classes found for this student.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {sharedClasses.map((classItem) => (
                                <div
                                    key={classItem.id}
                                    className="flex flex-col justify-between gap-3 rounded-lg border p-3 sm:flex-row sm:items-center"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {classItem.name}
                                        </p>

                                        <p className="text-sm text-muted-foreground">
                                            {classItem.subjectName} •{" "}
                                            {classItem.subjectCode}
                                        </p>

                                        <p className="text-xs text-muted-foreground">
                                            {classItem.departmentName}
                                        </p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3">
                                        <Badge>
                                            {classItem.status}
                                        </Badge>

                                        <span className="text-xs text-muted-foreground">
                                            {classItem.enrolledAt
                                                ? new Date(
                                                    classItem.enrolledAt
                                                ).toLocaleDateString()
                                                : "N/A"}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
