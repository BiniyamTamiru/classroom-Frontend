import { useOne } from "@refinedev/core";
import { Link, useParams } from "react-router";
import { ArrowLeft, BookOpen, CalendarDays, GraduationCap, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type ClassDetail = {
    id: number;
    name: string;
    description?: string | null;
    status: "active" | "inactive" | "archived";
    capacity?: number | null;
    bannerUrl?: string | null;
    inviteCode?: string;
    createdAt?: string;
    isEnrolled: boolean;
    teacher: {
        id: string;
        name?: string | null;
        email?: string | null;
        image?: string | null;
    } | null;
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
    };
};

export default function StudentClassDetailPage() {
    const { id } = useParams();
    const classId = Number(id);

    const classQuery = useOne<ClassDetail>({
        resource: "student-class-detail",
        id: String(classId),
    });

    // classQuery.result is already ClassDetail | undefined, so we don't need .data
    const classRecord = classQuery.result;

    if (classQuery.query.isLoading) {
        return <div className="p-6 text-sm text-muted-foreground">Loading class details...</div>;
    }

    if (classQuery.query.isError || !classRecord) {
        return (
            <div className="p-6 text-sm text-destructive">
                {classQuery.query.error?.message ?? "Unable to load class details."}
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-5xl space-y-6 p-6">
            <div className="flex items-center gap-3">
                <Button asChild variant="outline" size="sm">
                    <Link to="/student/classes">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to classes
                    </Link>
                </Button>
            </div>

            <div className="overflow-hidden rounded-2xl border bg-card">
                {classRecord.bannerUrl ? (
                    <img
                        src={classRecord.bannerUrl}
                        alt={classRecord.name}
                        className="h-52 w-full object-cover"
                    />
                ) : (
                    <div className="flex h-52 items-center justify-center bg-muted text-muted-foreground">
                        No banner available
                    </div>
                )}

                <div className="space-y-6 p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">{classRecord.name}</h1>
                            <p className="mt-2 text-sm text-muted-foreground">
                                {classRecord.description ?? "No description provided."}
                            </p>
                        </div>
                        <Badge variant={classRecord.status === "active" ? "default" : "secondary"}>
                            {classRecord.status}
                        </Badge>
                    </div>

                    <div className="grid gap-4 md:grid-cols-3">
                        <Card className="p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <BookOpen className="h-4 w-4" />
                                Subject
                            </div>
                            <p className="mt-3 font-semibold">{classRecord.subject.name}</p>
                            <p className="text-sm text-muted-foreground">{classRecord.subject.code}</p>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <GraduationCap className="h-4 w-4" />
                                Department
                            </div>
                            <p className="mt-3 font-semibold">{classRecord.department.name}</p>
                            <p className="text-sm text-muted-foreground">{classRecord.department.code}</p>
                        </Card>

                        <Card className="p-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <CalendarDays className="h-4 w-4" />
                                Enrollment
                            </div>
                            <p className="mt-3 font-semibold">
                                {classRecord.isEnrolled ? "Enrolled" : "Not enrolled"}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {classRecord.capacity ? `${classRecord.capacity} seats` : "Open enrollment"}
                            </p>
                        </Card>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="p-5">
                            <h2 className="text-lg font-semibold">Teacher</h2>
                            <div className="mt-4 flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <UserRound className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="font-medium">{classRecord.teacher?.name ?? "Unassigned"}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {classRecord.teacher?.email ?? "No teacher email available"}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-5">
                            <h2 className="text-lg font-semibold">Invite code</h2>
                            <p className="mt-4 rounded-md bg-muted px-3 py-2 font-mono text-sm">
                                {classRecord.inviteCode ?? "Not available"}
                            </p>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}