import { useGetIdentity, useGo, useShow, type HttpError } from "@refinedev/core";
import {
    ArrowLeft,
    ClipboardList,
    Loader2,
} from "lucide-react";
import { useParams } from "react-router";

import { EnrollmentDeleteAction } from "@/components/enrollments/enrollment-delete-action";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowView } from "@/components/refine-ui/views/show-view";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import type { EnrollmentShowResponse, User } from "@/types";

const EnrollmentShow = () => {
    const { id } = useParams<{ id: string }>();
    const go = useGo();
    const { data: identity } = useGetIdentity<User>();
    const isAdmin = identity?.role === "admin";
    const { query } = useShow<EnrollmentShowResponse, HttpError>({
        resource: "enrollments",
        id,
        queryOptions: { enabled: Boolean(id) },
    });
    const details = query.data?.data?.enrollmentWithRelations;

    return (
        <ShowView>
            <Breadcrumb />
            {!id ? (
                <p role="alert" className="text-sm text-destructive">An enrollment ID is required.</p>
            ) : query.isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading enrollment...
                </div>
            ) : query.isError && query.error?.statusCode !== 404 ? (
                <p role="alert" className="text-sm text-destructive">
                    {query.error.message || "Unable to load this enrollment."}
                </p>
            ) : !details ? (
                <p role="status" className="text-sm text-muted-foreground">
                    Enrollment not found.
                </p>
            ) : (
                <div className="space-y-6">
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <ClipboardList className="h-6 w-6" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">
                                    Enrollment #{details.id}
                                </h1>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {details.student.name} in {details.class.name}
                                </p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => go({ to: { resource: "enrollments", action: "list" } })}
                            >
                                <ArrowLeft className="h-4 w-4" /> Back to Enrollments
                            </Button>
                            {isAdmin && (
                                <>
                                    <EditButton
                                        resource="enrollments"
                                        recordItemId={details.id}
                                        variant="outline"
                                    >
                                        Edit Enrollment
                                    </EditButton>
                                    <EnrollmentDeleteAction
                                        enrollment={details}
                                        onDeleted={() => go({ to: { resource: "enrollments", action: "list" } })}
                                    />
                                </>
                            )}
                        </div>
                    </header>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Student</CardTitle>
                                <CardDescription>Student associated with this enrollment.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <InfoRow label="Student name" value={details.student.name} />
                                <InfoRow label="Student email" value={details.student.email} />
                                <InfoRow label="Student ID" value={details.studentId} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Class</CardTitle>
                                <CardDescription>Class and subject associated with this enrollment.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <InfoRow label="Class name" value={details.class.name} />
                                <InfoRow label="Class ID" value={String(details.classId)} />
                                {details.class.subject ? (
                                    <>
                                        <InfoRow label="Subject name" value={details.class.subject.name} />
                                        <InfoRow label="Subject code" value={details.class.subject.code} />
                                        <InfoRow label="Subject ID" value={String(details.class.subject.id)} />
                                    </>
                                ) : (
                                    <InfoRow label="Subject" value="Not available" />
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Enrollment record</CardTitle>
                            <CardDescription>System-managed enrollment information.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-4 sm:grid-cols-2">
                            <InfoRow label="Enrollment ID" value={String(details.id)} />
                            <div className="space-y-1">
                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                    Enrollment date
                                </p>
                                <Badge variant="outline">
                                    {new Date(details.createdAt).toLocaleDateString()}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </ShowView>
    );
};

function InfoRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
            <p className="break-words text-sm">{value}</p>
        </div>
    );
}

export default EnrollmentShow;
