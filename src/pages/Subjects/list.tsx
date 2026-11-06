import { ListView } from "@/components/refine-ui/views/list-view.tsx";
import { Breadcrumb } from "@/components/ui/breadcrumb.tsx";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import { CreateButton } from "@/components/refine-ui/buttons/create.tsx";
import { EditButton } from "@/components/refine-ui/buttons/edit.tsx";
import { ShowButton } from "@/components/refine-ui/buttons/show.tsx";
import { DataTable } from "@/components/refine-ui/data-table/data-table.tsx";
import { useList } from "@refinedev/core";
import { useTable } from "@refinedev/react-table";
import type { Department, Subject } from "@/types";
import { Badge } from "@/components/ui/badge.tsx";
import { Search } from "lucide-react";
import { SubjectDeleteAction } from "@/pages/Subjects/delete-action";


const SubjectsList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const departmentsQuery = useList<Department>({
        resource: "departments",
        pagination: { currentPage: 1, pageSize: 100 },
        meta: { query: { limit: 100 } },
    });
    const departmentOptions = departmentsQuery.query.data?.data ?? [];


    const departmentFilters =
        selectedDepartment === "all"
            ? []
            : [
                {
                    field: "department_id",
                    operator: "eq" as const,
                    value: selectedDepartment,
                },
            ];

    const searchFilters = searchQuery
        ? [
            {
                field: "name",
                operator: "contains" as const,
                value: searchQuery,
            },
        ]
        : [];

    const subjectTable = useTable<Subject>({
        columns: useMemo(
            () => [
                {
                    id: "code",
                    accessorKey: "code",
                    size: 100,
                    header: () => <p className="column-title ml-2">Code</p>,
                    cell: ({ getValue }) => (
                        <Badge>{getValue<string>()}</Badge>
                    ),
                },
                {
                    id: "name",
                    accessorKey: "name",
                    size: 200,
                    header: () => <p className="column-title">Name</p>,
                    cell: ({ getValue }) => (
                        <span className="text-foreground">
                            {getValue<string>()}
                        </span>
                    ),
                    filterFn: "includesString",
                },
                {
                    id: "department",
                    accessorKey: "department.name",
                    size: 150,
                    header: () => (
                        <p className="column-title">Department</p>
                    ),
                    cell: ({ getValue }) => (
                        <Badge variant="secondary">
                            {getValue<string>()}
                        </Badge>
                    ),
                },
                {
                    id: "description",
                    accessorKey: "description",
                    size: 300,
                    header: () => (
                        <p className="column-title">Description</p>
                    ),
                    cell: ({ getValue }) => (
                        <span className="truncate line-clamp-2">
                            {getValue<string>()}
                        </span>
                    ),
                },
                {
                    id: "actions",
                    size: 150,
                    header: () => <p className="column-title">Actions</p>,
                    cell: ({ row }) => (
                        <div className="flex items-center gap-1">
                            <ShowButton
                                resource="subjects"
                                recordItemId={row.original.id}
                                variant="ghost"
                                size="icon"
                                aria-label={`View ${row.original.name}`}
                            />
                            <EditButton
                                resource="subjects"
                                recordItemId={row.original.id}
                                variant="ghost"
                                size="icon"
                                aria-label={`Edit ${row.original.name}`}
                            />
                            <SubjectDeleteAction subject={row.original} compact />
                        </div>
                    ),
                },
            ],
            []
        ),
        refineCoreProps: {
            resource: "subjects",
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: [...departmentFilters, ...searchFilters],
            },
            sorters: {
                initial: [
                    {
                        field: "name", // or "code"
                        order: "asc",
                    },
                ],
            },
        },
    });

    return (
        <ListView>
            <Breadcrumb />

            <h1 className="page-title">Subjects</h1>

            <div className="intro-row flex flex-col gap-4">
                <p>
                    Quick access to essential metric and management tools.
                </p>

                <div className="action-row flex flex-col gap-4">
                    <div className="search-field relative">
                        <Search className="search-icon absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />

                        <Input
                            type="text"
                            placeholder="Search by name..."
                            className="w-full pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        <Select
                            value={selectedDepartment}
                            onValueChange={setSelectedDepartment}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by department..." />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectItem value="all">
                                    All departments
                                </SelectItem>

                                {departmentOptions.map((department) => (
                                    <SelectItem
                                        key={department.id}
                                        value={String(department.id)}
                                    >
                                        {department.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <CreateButton />
                    </div>
                    {departmentsQuery.query.isError && (
                        <p role="alert" className="text-sm text-destructive">
                            {departmentsQuery.query.error.message || "Unable to load department filters."}
                        </p>
                    )}
                </div>
            </div>

            <DataTable table={subjectTable} />
        </ListView>
    );
};

export default SubjectsList;