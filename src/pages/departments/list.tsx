import { useEffect, useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import { Building2, Search } from "lucide-react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView } from "@/components/refine-ui/views/list-view";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { DepartmentDeleteAction } from "@/pages/departments/delete-action";
import type { DepartmentListItem } from "@/types";

const DepartmentsList = () => {
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const timeoutId = window.setTimeout(() => {
            setSearchQuery(inputValue.trim());
        }, 400);

        return () => window.clearTimeout(timeoutId);
    }, [inputValue]);

    const departmentTable = useTable<DepartmentListItem>({
        columns: useMemo(
            () => [
                {
                    id: "code",
                    accessorKey: "code",
                    size: 180,
                    header: () => <span>Department Code</span>,
                    cell: ({ getValue }) => (
                        <Badge variant="outline" className="font-mono">
                            {getValue<string>()}
                        </Badge>
                    ),
                },
                {
                    id: "name",
                    accessorKey: "name",
                    size: 360,
                    header: () => <span>Department Name</span>,
                    cell: ({ getValue }) => (
                        <span className="font-medium text-foreground">
                            {getValue<string>()}
                        </span>
                    ),
                },
                {
                    id: "totalSubjects",
                    accessorKey: "totalSubjects",
                    size: 180,
                    header: () => <span>Total Subjects</span>,
                    cell: ({ getValue }) => (
                        <Badge variant="secondary">
                            {getValue<number>()}
                        </Badge>
                    ),
                },
                {
                    id: "actions",
                    size: 210,
                    header: () => <span>Actions</span>,
                    cell: ({ row }) => (
                        <div className="flex items-center gap-1">
                            <ShowButton
                                resource="departments"
                                recordItemId={row.original.id}
                                variant="ghost"
                                size="icon"
                                aria-label={`View ${row.original.name}`}
                            />
                            <EditButton
                                resource="departments"
                                recordItemId={row.original.id}
                                variant="ghost"
                                size="icon"
                                aria-label={`Edit ${row.original.name}`}
                            />
                            <DepartmentDeleteAction
                                department={row.original}
                                compact
                            />
                        </div>
                    ),
                },
            ],
            [],
        ),
        refineCoreProps: {
            resource: "departments",
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            meta: {
                query: {
                    search: searchQuery || undefined,
                },
            },
        },
    });

    const {
        tableQuery,
        setCurrentPage,
    } = departmentTable.refineCore;
    const isEmpty = !tableQuery.isLoading && tableQuery.data?.data.length === 0;

    return (
        <ListView>
            <Breadcrumb />

            <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div className="space-y-2">
                    <h1 className="page-title">Departments</h1>
                    <p className="text-muted-foreground">
                        Browse departments and the subjects assigned to each one.
                    </p>
                </div>
                <CreateButton />
            </header>

            <div className="relative w-full max-w-md">
                <label htmlFor="department-search" className="sr-only">
                    Search departments by name or code
                </label>
                <Search
                    aria-hidden="true"
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                    id="department-search"
                    type="search"
                    placeholder="Search by department name or code..."
                    className="pl-10"
                    value={inputValue}
                    onChange={(event) => {
                        setInputValue(event.target.value);
                        setCurrentPage(1);
                    }}
                />
            </div>

            {tableQuery.isError ? (
                <Alert variant="destructive">
                    <AlertTitle>Unable to load departments</AlertTitle>
                    <AlertDescription>
                        {tableQuery.error?.message ||
                            "Please try again in a moment."}
                    </AlertDescription>
                </Alert>
            ) : isEmpty ? (
                <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 text-center">
                    <div className="rounded-full bg-muted p-3 text-muted-foreground">
                        <Building2 aria-hidden="true" className="h-5 w-5" />
                    </div>
                    <div className="space-y-1">
                        <h2 className="font-semibold">
                            {searchQuery
                                ? "No departments match your search"
                                : "No departments yet"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {searchQuery
                                ? "Try another department name or code."
                                : "Departments will appear here once they are added."}
                        </p>
                    </div>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <DataTable table={departmentTable} />
                </div>
            )}
        </ListView>
    );
};

export default DepartmentsList;
