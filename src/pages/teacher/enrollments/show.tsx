import { useOne } from "@refinedev/core";
import { Loader2, ArrowLeft, ClipboardList } from "lucide-react";
import { Link, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TeacherEnrollmentDetails = {
    id: number;
    enrolledAt: string;
    student: {
        id: string;
        name: string;
        email: string;
        image?: string | null;
    };
    class: {
        id: number;
        name: string;
        status: string;
        subject: {
            id: number;
            name: string;
            code: string;
        };
        department: {
            id: number;
            name: string;
        };
    };
};

export default function TeacherEnrollmentShow() {
    const { id } = useParams<{ id: string }>();
    const query = useOne<TeacherEnrollmentDetails>({
        resource: "teacher-enrollments",
        id: id ?? "",
        queryOptions: { enabled: !!id },
    });

    const record = query.result as TeacherEnrollmentDetails | undefined;

    if (!id) {
        return <div className="p-4 text-sm text-destructive">An enrollment ID is required.</div>;
    }

    if (query.query.isLoading) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading enrollment details...
            </div>
        );
    }

    if (query.query.isError) {
        return (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {query.query.error?.message ?? "Unable to load this enrollment."}
            </div>
        );
    }

    if (!record) {
        return <div className="p-4 text-sm text-muted-foreground">Enrollment not found.</div>;
    }

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="sm">
                        <Link to="/teacher/enrollments">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">Enrollment Details</h1>
                        <p className="text-sm text-muted-foreground">Student enrollment record</p>
                    </div>
                </div>
                <Badge>{record.class.status}</Badge>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ClipboardList className="h-5 w-5 text-primary" />
                        Enrollment information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p><strong>Student:</strong> {record.student.name}</p>
                    <p><strong>Email:</strong> {record.student.email}</p>
                    <p><strong>Class:</strong> {record.class.name}</p>
                    <p><strong>Subject:</strong> {record.class.subject.name}</p>
                    <p><strong>Department:</strong> {record.class.department.name}</p>
                    <p><strong>Enrolled on:</strong> {new Date(record.enrolledAt).toLocaleDateString()}</p>
                </CardContent>
            </Card>
        </div>
    );
}