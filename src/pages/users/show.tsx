import { useGo, useShow, type HttpError } from "@refinedev/core";
import { ArrowLeft, Loader2, Mail, Shield, UserRound } from "lucide-react";
import { useParams } from "react-router";

import { EditButton } from "@/components/refine-ui/buttons/edit";
import { ShowView } from "@/components/refine-ui/views/show-view";
import { UserDeleteAction } from "@/components/users/user-delete-action";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { User } from "@/types";

const roleLabels = {
    student: "Student",
    teacher: "Teacher",
    admin: "Administrator",
} as const;

const UserShow = () => {
    const { id } = useParams<{ id: string }>();
    const go = useGo();
    const { query } = useShow<User, HttpError>({
        resource: "users",
        id,
        queryOptions: { enabled: Boolean(id) },
    });

    const record = query.data?.data;

    return (
        <ShowView>
            <Breadcrumb />

            <div className="mx-auto mt-4 w-full max-w-3xl">
                <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            User Details
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            View this account&apos;s profile information.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() =>
                                go({
                                    to: { resource: "users", action: "list" },
                                })
                            }
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Back to Users
                        </Button>
                        {record && (
                            <>
                                <EditButton
                                    resource="users"
                                    recordItemId={record.id}
                                    variant="outline"
                                />
                                <UserDeleteAction
                                    user={record}
                                    onDeleted={() =>
                                        go({
                                            to: {
                                                resource: "users",
                                                action: "list",
                                            },
                                        })
                                    }
                                />
                            </>
                        )}
                    </div>
                </div>

                {!id ? (
                    <p role="alert" className="text-sm text-destructive">
                        A user ID is required to view a user.
                    </p>
                ) : query.isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Loading user...
                    </div>
                ) : query.isError ? (
                    <p role="alert" className="text-sm text-destructive">
                        {query.error.message || "Unable to load this user."}
                    </p>
                ) : !record ? (
                    <p role="status" className="text-sm text-muted-foreground">
                        User not found.
                    </p>
                ) : (
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                                    <UserRound className="h-6 w-6" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl">
                                        {record.name}
                                    </CardTitle>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {record.email}
                                    </p>
                                </div>
                            </div>
                            <Badge
                                variant={
                                    record.role === "admin"
                                        ? "default"
                                        : "secondary"
                                }
                            >
                                <Shield className="mr-1 h-3 w-3" />
                                {roleLabels[record.role]}
                            </Badge>
                        </CardHeader>
                        <CardContent className="grid gap-5 sm:grid-cols-2">
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Email address
                                </p>
                                <p className="flex items-center gap-2 break-all text-sm">
                                    <Mail className="h-4 w-4 shrink-0 text-muted-foreground" />
                                    {record.email}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    User ID
                                </p>
                                <p className="break-all font-mono text-sm">
                                    {record.id}
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                    Role
                                </p>
                                <p className="text-sm">{roleLabels[record.role]}</p>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </ShowView>
    );
};

export default UserShow;
