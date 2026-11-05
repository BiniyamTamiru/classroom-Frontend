import { useOne } from "@refinedev/core";
import { Loader2, ArrowLeft, BookOpen, Building2 } from "lucide-react";
import { Link, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type TeacherSubjectDetails = {
    id: number;
    name: string;
    code: string;
    description?: string | null;
    department?: {
        id: number;
        name: string;
        code: string;
    } | null;
    classes?: Array<{
        id: number;
        name: string;
        status: string;
        teacher?: {
            id: string;
            name: string | null;
        } | null;
    }>;
};

export default function TeacherSubjectShow() {
    const { id } = useParams<{ id: string }>();
    const subjectQuery = useOne<{ subjectWithDepartment: TeacherSubjectDetails }>({
        resource: "teacher-subjects",
        id: id ?? "",
        queryOptions: { enabled: !!id },
    });

    // Extract the nested subject record returned by your backend router
    const record = subjectQuery.result?.subjectWithDepartment;

    if (!id) {
        return <div className="p-4 text-sm text-destructive">A subject ID is required.</div>;
    }

    if (subjectQuery.query.isLoading) {
        return (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading subject details...
            </div>
        );
    }

    if (subjectQuery.query.isError) {
        return (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                {subjectQuery.query.error?.message ?? "Unable to load this subject."}
            </div>
        );
    }

    if (!record) {
        return <div className="p-4 text-sm text-muted-foreground">Subject not found.</div>;
    }

    return (
        <div className="space-y-6">
            <header className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Button asChild variant="outline" size="sm">
                        <Link to="/teacher/subjects">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold">{record.name}</h1>
                        <p className="text-sm text-muted-foreground">Subject details</p>
                    </div>
                </div>
                <Badge variant="secondary">{record.code}</Badge>
            </header>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        Subject information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                    <p><strong>Department:</strong> {record.department?.name ?? "No Department"}</p>
                    <p><strong>Code:</strong> {record.code}</p>
                    <p><strong>Description:</strong> {record.description || "No description provided."}</p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        Related classes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {!record.classes || record.classes.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No classes exist for this subject.</p>
                    ) : (
                        <div className="space-y-3">
                            {record.classes.map((classItem) => (
                                <div key={classItem.id} className="flex items-center justify-between rounded-lg border p-3">
                                    <div>
                                        <p className="font-medium">{classItem.name}</p>
                                        <p className="text-sm text-muted-foreground">
                                            {classItem.teacher?.name ? `Teacher: ${classItem.teacher.name}` : "Teacher record"}
                                        </p>
                                    </div>
                                    <Badge>{classItem.status}</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}