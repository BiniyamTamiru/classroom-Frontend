import { useGo, useShow, type HttpError } from "@refinedev/core";
import {
    ArrowLeft,
    BookOpen,
    Building2,
    GraduationCap,
    Loader2,
} from "lucide-react";
import { useParams } from "react-router";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowView } from "@/components/refine-ui/views/show-view";
import { SubjectDeleteAction } from "@/pages/Subjects/delete-action";
import type { SubjectDetailsResponse } from "@/types";

const SubjectShow = () => {
    const { id } = useParams<{ id: string }>();
    const go = useGo();
    const { query } = useShow<SubjectDetailsResponse, HttpError>({
        resource: "subjects",
        id,
        queryOptions: { enabled: Boolean(id) },
    });
    const details = query.data?.data?.subjectWithDepartment;

    return (
        <ShowView>
            <Breadcrumb />
            {!id ? (
                <p role="alert" className="text-sm text-destructive">A subject ID is required.</p>
            ) : query.isLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading subject...
                </div>
            ) : query.isError ? (
                <p role="alert" className="text-sm text-destructive">
                    {query.error.message || "Unable to load this subject."}
                </p>
            ) : !details ? (
                <p role="status" className="text-sm text-muted-foreground">Subject not found.</p>
            ) : (
                <div className="space-y-6">
                    <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                        <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <h1 className="text-2xl font-bold tracking-tight">{details.name}</h1>
                                    <Badge variant="outline" className="font-mono">{details.code}</Badge>
                                </div>
                                <p className="mt-1 text-sm text-muted-foreground">Subject details and related academic classes.</p>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => go({ to: { resource: "subjects", action: "list" } })}
                            >
                                <ArrowLeft className="h-4 w-4" /> Back to Subjects
                            </Button>
                            <EditButton resource="subjects" recordItemId={details.id} variant="outline">
                                Edit Subject
                            </EditButton>
                            <SubjectDeleteAction subject={details} />
                        </div>
                    </header>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-primary" /> Subject Information
                                </CardTitle>
                                <CardDescription>Academic subject record.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <InfoRow label="Subject name" value={details.name} />
                                <InfoRow label="Subject code" value={details.code} />
                                <InfoRow label="Description" value={details.description || "No description provided."} />
                                <InfoRow label="Subject ID" value={String(details.id)} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Building2 className="h-5 w-5 text-primary" /> Department
                                </CardTitle>
                                <CardDescription>The department assigned to this subject.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <InfoRow label="Department name" value={details.department.name} />
                                <InfoRow label="Department code" value={details.department.code} />
                                <InfoRow label="Department ID" value={String(details.department.id)} />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => go({
                                        to: {
                                            resource: "departments",
                                            action: "show",
                                            id: details.department.id,
                                        },
                                    })}
                                >
                                    <Building2 className="h-4 w-4" /> View Department
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <GraduationCap className="h-5 w-5 text-primary" /> Related Classes
                            </CardTitle>
                            <CardDescription>
                                Classes assigned to {details.name} ({details.code}).
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {details.classes.length === 0 ? (
                                <div className="rounded-lg border border-dashed px-6 py-10 text-center">
                                    <p className="font-medium">No classes for this subject yet.</p>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Classes created for this subject will appear here.
                                    </p>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Class name</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Teacher</TableHead>
                                                <TableHead>Class ID</TableHead>
                                                <TableHead className="text-right">Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {details.classes.map((classRecord) => (
                                                <TableRow key={classRecord.id}>
                                                    <TableCell className="font-medium">{classRecord.name}</TableCell>
                                                    <TableCell>
                                                        <Badge variant={classRecord.status === "active" ? "default" : "secondary"}>
                                                            {classRecord.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>{classRecord.teacher?.name || "Not available"}</TableCell>
                                                    <TableCell className="font-mono text-xs">{classRecord.id}</TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => go({
                                                                to: {
                                                                    resource: "classes",
                                                                    action: "show",
                                                                    id: classRecord.id,
                                                                },
                                                            })}
                                                        >
                                                            View Class
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
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

export default SubjectShow;
