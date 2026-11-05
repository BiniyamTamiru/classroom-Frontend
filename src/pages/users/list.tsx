import { useMemo, useState } from "react";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";
import { Search } from "lucide-react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ListView } from "@/components/refine-ui/views/list-view";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { CreateButton } from "@/components/refine-ui/buttons/create.tsx";
import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowButton } from "@/components/refine-ui/buttons/show";
import { UserDeleteAction } from "@/components/users/user-delete-action";

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt?: string;
}

const UserList = () => {
    const [searchQuery, setSearchQuery] = useState("");

    // Follow the same filtering pattern as your Subjects page.
    const searchFilters = useMemo(
        () =>
            searchQuery.trim()
                ? [
                    {
                        field: "search",
                        operator: "eq" as const,
                        value: searchQuery.trim(),
                    },
                ]
                : [],
        [searchQuery],
    );

    const userTable = useTable<User>({
        columns: useMemo<ColumnDef<User>[]>(
            () => [
                {
                    id: "name",
                    accessorKey: "name",
                    header: () => (
                        <p className="column-title">Name</p>
                    ),
                },
                {
                    id: "email",
                    accessorKey: "email",
                    header: () => (
                        <p className="column-title">Email</p>
                    ),
                },
                {
                    id: "role",
                    accessorKey: "role",
                    header: () => (
                        <p className="column-title">Role</p>
                    ),
                },
                {
                    id: "createdAt",
                    accessorKey: "createdAt",
                    header: () => (
                        <p className="column-title">CreatedAt</p>
                    ),
                },
                {
                    id: "actions",
                    header: () => <p className="column-title">Actions</p>,
                    enableSorting: false,
                    cell: ({ row }) => (
                        <div className="flex items-center gap-1">
                            <ShowButton
                                resource="users"
                                recordItemId={row.original.id}
                                variant="ghost"
                                size="sm"
                                aria-label={`View ${row.original.name}`}
                            />
                            <EditButton
                                resource="users"
                                recordItemId={row.original.id}
                                variant="ghost"
                                size="sm"
                                aria-label={`Edit ${row.original.name}`}
                            />
                            <UserDeleteAction
                                user={row.original}
                                compact
                            />
                        </div>
                    ),
                    size: 190,
                },
            ],
            [],
        ),
        refineCoreProps: {
            resource: "users",
            pagination: {
                pageSize: 10,
                mode: "server",
            },
            filters: {
                permanent: searchFilters,
            },
        },
    });

    return (
        <ListView>
            <Breadcrumb />

            <div className="flex flex-col gap-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                    <h1 className="page-title shrink-0">Users</h1>

                    <div className="flex w-full items-center gap-3 sm:w-auto sm:flex-1 sm:justify-end">
                        <div className="relative w-full sm:max-w-sm">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />

                            <input
                                type="text"
                                placeholder="Search users by name..."
                                className="h-11 w-full rounded-lg border border-gray-200 bg-background pl-10 pr-4 text-sm outline-none transition-shadow focus:border-primary focus:ring-2 focus:ring-primary/20"
                                value={searchQuery}
                                onChange={(e) =>
                                    setSearchQuery(e.target.value)
                                }
                            />
                        </div>

                        <CreateButton />
                    </div>
                </div>

                <DataTable table={userTable} />
            </div>
        </ListView>
    );
};

export default UserList;