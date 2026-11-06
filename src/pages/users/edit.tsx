import { useEffect, useState, type FormEvent } from "react";
import { useGo, useShow, useUpdate, type HttpError } from "@refinedev/core";
import { Loader2, Mail, Save, UserRound } from "lucide-react";
import { useParams } from "react-router";
import { toast } from "sonner";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { EditView } from "@/components/refine-ui/views/edit-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,

} from "@/components/ui/select";



import { getUserErrorMessage } from "@/components/users/get-user-error-message";
import type { User, UserRole } from "@/types";

type UserUpdateInput = Pick<User, "name" | "email" | "role">;
const userRoles: UserRole[] = ["student", "teacher", "admin"];
const isUserRole = (value: string): value is UserRole =>
    userRoles.some((roleOption) => roleOption === value);

const UserEdit = () => {
    const { id } = useParams<{ id: string }>();
    const go = useGo();
    const { query } = useShow<User, HttpError>({
        resource: "users",
        id,
        queryOptions: { enabled: Boolean(id) },
    });
    const { mutateAsync } = useUpdate<User, HttpError, UserUpdateInput>();

    const record = query.data?.data;
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<UserRole | "">("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSaving, setIsSaving] = useState(false);


    useEffect(() => {
        if (!record) return;
        setName(record.name);
        setEmail(record.email);
        setRole(record.role);
    }, [record]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!id || isSaving) return;

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();
        setError("");
        setSuccess("");

        if (trimmedName.length < 1 || trimmedName.length > 120) {
            setError("Name must be between 1 and 120 characters.");
            return;
        }
        if (
            trimmedEmail.length > 254 ||
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)
        ) {
            setError("Enter a valid email address.");
            return;
        }
        if (!role) {
            setError("Please select a role.");
            return;
        }

        setIsSaving(true);
        try {
            const result = await mutateAsync({
                resource: "users",
                id,
                values: {
                    name: trimmedName,
                    email: trimmedEmail,
                    role,
                },
                successNotification: false,
                errorNotification: false,
            });
            setSuccess(`User "${result.data.name}" was updated successfully.`);
            toast.success(`User "${result.data.name}" was updated successfully.`);
        } catch (submitError: unknown) {
            setError(
                getUserErrorMessage(
                    submitError,
                    "Unable to update this user. Please try again.",
                ),
            );
        } finally {
            setIsSaving(false);
        }
    };

    useEffect(() => {
        if (!success || !id) return;

        const timeout = window.setTimeout(() => {
            go({ to: { resource: "users", action: "show", id } });
        }, 900);

        return () => window.clearTimeout(timeout);
    }, [go, id, success]);

    return (
        <EditView>
            <Breadcrumb />

            <div className="mx-auto mt-4 w-full max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Edit User
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update this user&apos;s profile and access role.
                    </p>
                </div>

                {!id ? (
                    <p role="alert" className="text-sm text-destructive">
                        A user ID is required to edit a user.
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
                    <p role="alert" className="text-sm text-destructive">
                        User not found.
                    </p>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-7"
                    >
                        <div className="space-y-2">
                            <label
                                htmlFor="user-name"
                                className="text-sm font-medium"
                            >
                                Full name
                            </label>
                            <div className="relative">
                                <UserRound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="user-name"
                                    className="pl-10"
                                    placeholder="Enter full name"
                                    autoComplete="name"
                                    value={name}
                                    onChange={(event) =>
                                        setName(event.target.value)
                                    }
                                    maxLength={120}
                                    required
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="user-email"
                                className="text-sm font-medium"
                            >
                                Email address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="user-email"
                                    className="pl-10"
                                    type="email"
                                    placeholder="name@example.com"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    maxLength={254}
                                    required
                                    disabled={isSaving}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="user-role"
                                className="text-sm font-medium"
                            >
                                User role
                            </label>
                            <Select
                                value={role}
                                onValueChange={(value) => {
                                    if (isUserRole(value)) {
                                        setRole(value);
                                    }
                                }}
                                disabled={isSaving}
                            >
                                <SelectTrigger id="user-role" className="w-full">
                                    <SelectValue placeholder="Select user role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="student">
                                        Student
                                    </SelectItem>
                                    <SelectItem value="teacher">
                                        Teacher
                                    </SelectItem>
                                    <SelectItem value="admin">
                                        Administrator
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {error && (
                            <div
                                role="alert"
                                className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                            >
                                {error}

                            </div>
                        )}
                        {success && (
                            <div
                                role="status"
                                className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
                            >
                                {success}
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={isSaving}
                        >
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Save className="h-4 w-4" />
                            )}
                            {isSaving ? "Saving changes..." : "Save changes"}
                        </Button>
                    </form>
                )}
            </div>
        </EditView>
    );
};

export default UserEdit;
