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
import { DEPARTMENTS_OPTIONS } from "@/components/constant";
import { CreateButton } from "@/components/refine-ui/buttons/create.tsx";
import { DataTable } from "@/components/refine-ui/data-table/data-table.tsx";
import { useTable } from "@refinedev/react-table";
import { Subject } from "@/types";
import { Badge } from "@/components/ui/badge.tsx";

const SubjectsList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("");

    const departementFilters = selectedDepartment == "all" ? [] : [
        { field: "department", operator: "eq" as const, value: selectedDepartment }
    ];

    const SearchFilters = searchQuery ? [
        { field: "name", operator: "contains" as const, value: searchQuery }
    ] : [];

    const subjectTable = useTable<Subject>({
        columns: useMemo(
            () => [
                {
                    id: "code",
                    accessorKey: "code",
                    size: 100,
                    header: () => (
                        <p className="column-title ml-2">Code</p>
                    ),
                    cell: ({ getValue }) => (
                        <Badge>
                            {getValue<string>()}
                        </Badge>
                    ),
                },
                {
                    id: "name",
                    accessorKey: "name",
                    size: 200,
                    header: () => (
                        <p className="column-title">Name</p>
                    ),
                    cell: ({ getValue }) => (
                        <span className="text-foreground">
                            {getValue<string>()}
                        </span>
                    ),
                    filterFn: "includesString",
                },
                {
                    id: "department",
                    accessorKey: "department",
                    size: 150,
                    header: () => <p className="column-title">Departement</p>,
                    cell: ({ getValue }) => (
                        <Badge variant="secondary">
                            {getValue<string>()}
                        </Badge>
                    ),
                },
                {
                    id: "description",
                    accessorKey: "description",
                    name: "description",
                    size: 300,
                    header: () => <p className="column-title">Description</p>,
                    cell: ({ getValue }) => (
                        <span className="truncate line-clamp-2">
                            {getValue<string>()}
                        </span>
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
                permanent: [...departementFilters, ...SearchFilters],
            },
            sorters: [
                {
                    field: "id",
                    order: "desc",
                },
            ],
        },
    });

    // @ts-ignore
    return (
        <ListView>
            <Breadcrumb />

            <h1 className="page-title">Subjects</h1>

            <div className="intro-row flex flex-col gap-4">
                <p>
                    Quick access to essential metric and management tools.
                </p>

                <div className="action-row flex flex-col gap-4">
                    <div className="search-field">
                        <search className="search-icon" />

                        <Input
                            type="text"
                            placeholder="Search by name..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) =>
                                setSearchQuery(e.target.value)
                            }
                        />
                    </div>

                    <div className="flex items-center gap-4">
                        <Select
                            value={selectedDepartment}
                            onValueChange={setSelectedDepartment}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Filter by department..." />
                            </SelectTrigger>

                            <SelectContent>
                                {DEPARTMENTS_OPTIONS.map((department) => (
                                    <SelectItem
                                        key={department.value}
                                        value={department.value}
                                    >
                                        {department.label}
                                    </SelectItem>
                                ))}

                                <SelectItem value="all">
                                    All departments
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        <CreateButton />
                    </div>
                </div>
            </div>

            <DataTable table={subjectTable} />
        </ListView>
    );
};

export default SubjectsList;