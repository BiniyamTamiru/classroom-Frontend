import { useGo, useShow, type HttpError } from "@refinedev/core";
import type { ReactNode } from "react";
import {
    ArrowLeft,
    BookOpen,
    Building2,
    GraduationCap,
    Loader2,
    UsersRound,
} from "lucide-react";
import { useParams } from "react-router";

import { DepartmentDeleteAction } from "@/pages/departments/delete-action";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import type { DepartmentDetails } from "@/types";

const DepartmentShow = () => {
    const { id } = useParams<{ id: string }>();
    const go = useGo();
    const { query } = useShow<DepartmentDetails, HttpError>({
        resource: "departments",
        id,
        queryOptions: { enabled: Boolean(id) },
    });
    const details = query.data?.data;
    const department = details?.department;

    return (
        <ShowView>
            <Breadcrumb />

            <div className="space-y-6">
                {!id ? (
                    <p role="alert" className="text-sm text-destructive">
                        A department ID is required to view a department.
                    </p>
                ) : query.isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading department...
                    </div>
                ) : query.isError ? (
                    <p role="alert" className="text-sm text-destructive">
                        {query.error.message || "Unable to load this department."}
                    </p>
                ) : !details || !department ? (
                    <p role="status" className="text-sm text-muted-foreground">
                        Department not found.
                    </p>
                ) : (
                    <>
                        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                            <div className="flex items-start gap-3">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                    <Building2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h1 className="text-2xl font-bold tracking-tight">
                                            {department.name}
                                        </h1>
                                        <Badge variant="outline" className="font-mono">
                                            {department.code}
                                        </Badge>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        Department details and related academic
                                        records.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() =>
                                        go({
                                            to: {
                                                resource: "departments",
                                                action: "list",
                                            },
                                        })
                                    }
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Back to Departments
                                </Button>
                                <EditButton
                                    resource="departments"
                                    recordItemId={department.id}
                                    variant="outline"
                                >
                                    Edit
                                </EditButton>
                                <DepartmentDeleteAction
                                    department={department}
                                />
                            </div>
                        </header>

                        <section
                            aria-label="Department statistics"
                            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        >
                            <StatisticCard
                                title="Total Subjects"
                                value={details.totalSubjects}
                                icon={<BookOpen className="h-5 w-5" />}
                            />
                            <StatisticCard
                                title="Total Classes"
                                value={details.totalClasses}
                                icon={<GraduationCap className="h-5 w-5" />}
                            />
                            <StatisticCard
                                title="Enrolled Students"
                                value={details.totalEnrolledStudents}
                                icon={<UsersRound className="h-5 w-5" />}
                            />
                        </section>
                        <p className="-mt-3 text-xs text-muted-foreground">
                            Class and enrollment totals include active classes
                            only; student totals count distinct enrolled students.
                        </p>

                        <Card>
                            <CardHeader>
                                <CardTitle>Department Information</CardTitle>
                                <CardDescription>
                                    Core information for this academic department.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-5 sm:grid-cols-2">
                                <InfoField label="Department code">
                                    <Badge variant="outline" className="font-mono">
                                        {department.code}
                                    </Badge>
                                </InfoField>
                                <InfoField label="Department name">
                                    {department.name}
                                </InfoField>
                                <InfoField label="Department ID">
                                    <span className="font-mono">{department.id}</span>
                                </InfoField>
                                <InfoField label="Description">
                                    {department.description || "No description provided."}
                                </InfoField>
                            </CardContent>
                        </Card>

                        <RelatedSection
                            title="Related Subjects"
                            description="Subjects assigned to this department."
                        >
                            {details.subjects.length === 0 ? (
                                <EmptyMessage>
                                    No subjects are assigned to this department.
                                </EmptyMessage>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Subject Code</TableHead>
                                                <TableHead>Subject Name</TableHead>
                                                <TableHead>Description</TableHead>
                                                <TableHead>Subject ID</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {details.subjects.map((subject) => (
                                                <TableRow key={subject.id}>
                                                    <TableCell>
                                                        <Badge variant="outline" className="font-mono">
                                                            {subject.code}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {subject.name}
                                                    </TableCell>
                                                    <TableCell className="text-muted-foreground">
                                                        {subject.description || "—"}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-muted-foreground">
                                                        {subject.id}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </RelatedSection>

                        <RelatedSection
                            title="Related Classes"
                            description="Classes linked to this department through their subjects."
                        >
                            {details.classes.length === 0 ? (
                                <EmptyMessage>
                                    No classes are linked to this department.
                                </EmptyMessage>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Class</TableHead>
                                                <TableHead>Subject</TableHead>
                                                <TableHead>Teacher</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Class ID</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {details.classes.map((classRecord) => (
                                                <TableRow key={classRecord.id}>
                                                    <TableCell className="font-medium">
                                                        {classRecord.name}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span>{classRecord.subject.name}</span>
                                                            <span className="font-mono text-xs text-muted-foreground">
                                                                {classRecord.subject.code}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span>{classRecord.teacher.name}</span>
                                                            <span className="text-xs text-muted-foreground">
                                                                {classRecord.teacher.email}
                                                            </span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant={
                                                                classRecord.status === "active"
                                                                    ? "default"
                                                                    : "secondary"
                                                            }
                                                        >
                                                            {classRecord.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="font-mono text-muted-foreground">
                                                        {classRecord.id}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                go({
                                                                    to: {
                                                                        resource: "classes",
                                                                        action: "show",
                                                                        id: classRecord.id,
                                                                    },
                                                                })
                                                            }
                                                        >
                                                            View class
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </RelatedSection>

                        <RelatedSection
                            title="Related Users"
                            description="Teachers assigned to department classes and students enrolled in those classes."
                        >
                            {details.users.length === 0 ? (
                                <EmptyMessage>
                                    No teachers or enrolled students are associated
                                    with this department.
                                </EmptyMessage>
                            ) : (
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Relationship</TableHead>
                                                <TableHead>Action</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {details.users.map((relatedUser) => (
                                                <TableRow key={relatedUser.id}>
                                                    <TableCell className="font-medium">
                                                        {relatedUser.name}
                                                    </TableCell>
                                                    <TableCell>{relatedUser.email}</TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary">
                                                            {relatedUser.role}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-wrap gap-1">
                                                            {relatedUser.relationships.map(
                                                                (relationship) => (
                                                                    <Badge
                                                                        key={relationship}
                                                                        variant="outline"
                                                                    >
                                                                        {relationship}
                                                                    </Badge>
                                                                ),
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                go({
                                                                    to: {
                                                                        resource: "users",
                                                                        action: "show",
                                                                        id: relatedUser.id,
                                                                    },
                                                                })
                                                            }
                                                        >
                                                            View user
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </RelatedSection>
                    </>
                )}
            </div>
        </ShowView>
    );
};

function StatisticCard({
    title,
    value,
    icon,
}: {
    title: string;
    value: number;
    icon: ReactNode;
}) {
    return (
        <Card>
            <CardContent className="flex items-center justify-between gap-4 pt-6">
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
                </div>
                <div className="rounded-lg bg-primary/10 p-3 text-primary">
                    {icon}
                </div>
            </CardContent>
        </Card>
    );
}

function InfoField({
    label,
    children,
}: {
    label: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <div className="text-sm">{children}</div>
        </div>
    );
}

function RelatedSection({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

function EmptyMessage({ children }: { children: ReactNode }) {
    return (
        <div className="rounded-lg border border-dashed px-4 py-10 text-center text-sm text-muted-foreground">
            {children}
        </div>
    );
}

export default DepartmentShow;
