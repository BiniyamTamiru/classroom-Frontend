import { useEffect, useMemo, useState } from "react";
import { useGetIdentity, useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";

import { EnrollmentDeleteAction } from "@/components/enrollments/enrollment-delete-action";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView } from "@/components/refine-ui/views/list-view";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Enrollment, User } from "@/types";

type ClassOption = {
    id: number;
    name: string;
};

const EnrollmentList = () => {
    const [inputValue, setInputValue] = useState("");
    const [search, setSearch] = useState("");
    const [classId, setClassId] = useState("all");
    const { data: identity } = useGetIdentity<User>();
    const isAdmin = identity?.role === "admin";
    const classesQuery = useList<ClassOption>({
        resource: "classes",
        pagination: { currentPage: 1, pageSize: 100 },
        meta: { query: { limit: 100 } },
    });

    useEffect(() => {
        const timer = window.setTimeout(() => setSearch(inputValue.trim()), 300);
        return () => window.clearTimeout(timer);
    }, [inputValue]);

    const classFilters = useMemo(
        () =>
            classId === "all"
                ? []
                : [{ field: "classId", operator: "eq" as const, value: classId }],
        [classId],
    );
    const searchFilters = useMemo(
        () =>
            search
                ? [{ field: "search", operator: "contains" as const, value: search }]
                : [],
        [search],
    );

    const table = useTable<Enrollment>({
        columns: useMemo<ColumnDef<Enrollment>[]>(
            () => [
                {
                    id: "student",
                    accessorKey: "student.name",
                    header: () => <p className="column-title">Student Name</p>,
                    cell: ({ row }) => (
                        <span className="font-medium">{row.original.student.name}</span>
                    ),
                    size: 190,
                },
                {
                    id: "email",
                    accessorKey: "student.email",
                    header: () => <p className="column-title">Student Email</p>,
                    cell: ({ row }) => row.original.student.email,
                    size: 220,
                },
                {
                    id: "class",
                    accessorKey: "class.name",
                    header: () => <p className="column-title">Class Name</p>,
                    cell: ({ row }) => row.original.class.name,
                    size: 190,
                },
                {
                    id: "subject",
                    accessorKey: "class.subject.name",
                    header: () => <p className="column-title">Subject Name</p>,
                    cell: ({ row }) => (
                        row.original.class.subject ? (
                            <Badge variant="secondary">{row.original.class.subject.name}</Badge>
                        ) : (
                            <span className="text-muted-foreground">Not available</span>
                        )
                    ),
                    size: 170,
                },
                {
                    id: "createdAt",
                    accessorKey: "createdAt",
                    header: () => <p className="column-title">Enrollment Date</p>,
                    cell: ({ row }) =>
                        new Date(row.original.createdAt).toLocaleDateString(),
                    size: 145,
                },
                {
                    id: "actions",
                    header: () => <p className="column-title">Actions</p>,
                    enableSorting: false,
                    cell: ({ row }) => (
                        <div className="flex items-center gap-1">
                            <ShowButton
                                resource="enrollments"
                                recordItemId={row.original.id}
                                variant="ghost"
                                size="icon"
                                aria-label={`View enrollment for ${row.original.student.name}`}
                            />
                            {isAdmin && (
                                <>
                                    <EditButton
                                        resource="enrollments"
                                        recordItemId={row.original.id}
                                        variant="ghost"
                                        size="icon"
                                        aria-label={`Edit enrollment for ${row.original.student.name}`}
                                    />
                                    <EnrollmentDeleteAction
                                        enrollment={row.original}
                                        compact
                                    />
                                </>
                            )}
                        </div>
                    ),
                    size: 145,
                },
            ],
            [isAdmin],
        ),
        refineCoreProps: {
            resource: "enrollments",
            pagination: { pageSize: 10, mode: "server" },
            filters: { permanent: [...classFilters, ...searchFilters] },
        },
    });

    const { tableQuery, setCurrentPage } = table.refineCore;
    const records = tableQuery.data?.data ?? [];
    const isEmpty = !tableQuery.isLoading && records.length === 0;

    return (
        <ListView>
            <Breadcrumb />
            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div className="space-y-2">
                    <h1 className="page-title">Enrollments</h1>
                    <p className="text-muted-foreground">
                        Browse student enrollments and their classes.
                    </p>
                </div>
                {isAdmin && <CreateButton resource="enrollments" />}
            </header>

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative w-full max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        type="search"
                        aria-label="Search enrollments by student name, email, or class"
                        placeholder="Search student name, email, or class..."
                        className="pl-10"
                        value={inputValue}
                        onChange={(event) => {
                            setInputValue(event.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <Select
                    value={classId}
                    onValueChange={(value) => {
                        setClassId(value);
                        setCurrentPage(1);
                    }}
                >
                    <SelectTrigger className="w-full sm:w-[240px]" aria-label="Filter by class">
                        <SelectValue placeholder="Filter by class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All classes</SelectItem>
                        {classesQuery.query.data?.data.map((classRecord) => (
                                <SelectItem key={classRecord.id} value={String(classRecord.id)}>
                                    {classRecord.name}
                                </SelectItem>
                        ))}
                        {classesQuery.query.isLoading && (
                            <SelectItem value="loading-classes" disabled>Loading classes...</SelectItem>
                        )}
                    </SelectContent>
                </Select>
                {classesQuery.query.isError && (
                    <p role="alert" className="text-sm text-destructive">
                        {classesQuery.query.error.message || "Unable to load class filters."}
                    </p>
                )}
            </div>

            {tableQuery.isError ? (
                <Alert variant="destructive">
                    <AlertTitle>Unable to load enrollments</AlertTitle>
                    <AlertDescription>
                        {tableQuery.error?.message || "Please try again in a moment."}
                    </AlertDescription>
                </Alert>
            ) : isEmpty ? (
                <div className="flex min-h-64 flex-col items-center justify-center gap-2 rounded-lg border border-dashed px-6 text-center">
                    <h2 className="font-semibold">
                        {search || classId !== "all"
                            ? "No enrollments match these filters"
                            : "No enrollments yet"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        {search || classId !== "all"
                            ? "Try changing the search or class filter."
                            : "Enrollments will appear here once they are created."}
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <DataTable table={table} />
                </div>
            )}
        </ListView>
    );
};

export default EnrollmentList;
