
import { useEffect, useState, type FormEvent } from "react";
import { useCreate, useGo, type HttpError } from "@refinedev/core";
import { UserPlus, User, Mail, LockKeyhole } from "lucide-react";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

type UserRole = "student" | "teacher" | "admin";

type CreatedUser = {
    id: string;
    name: string;
    email: string;
    role: UserRole;
};

type CreateUserInput = {
    name: string;
    email: string;
    password: string;
    role: UserRole;
};

const UserCreate = () => {
    const go = useGo();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState<UserRole | "">("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isPending, setIsPending] = useState(false);

    const { mutateAsync } = useCreate<
        CreatedUser,
        HttpError,
        CreateUserInput
    >({
        resource: "users",
        successNotification: false,
        errorNotification: false,
    });

    useEffect(() => {
        if (!success) return;

        const timeout = window.setTimeout(() => {
            go({
                to: {
                    resource: "users",
                    action: "list",
                },
            });
        }, 1200);

        return () => window.clearTimeout(timeout);
    }, [go, success]);

    const handleSubmit = async (
        event: FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (isPending) return;

        setError("");
        setSuccess("");

        if (!role) {
            setError("Please select a role.");
            return;
        }

        setIsPending(true);

        try {
            const result = await mutateAsync({
                values: {
                    name: name.trim(),
                    email: email.trim(),
                    password,
                    role,
                },
            });

            setSuccess(
                `User "${result.data.name}" created successfully.`
            );

            setName("");
            setEmail("");
            setPassword("");
            setRole("");
        } catch (err: unknown) {
            const message =
                err instanceof Error
                    ? err.message
                    : "Unable to create user. Please try again.";

            setError(message);
        } finally {
            setIsPending(false);
        }
    };

    return (
        <CreateView>
            <Breadcrumb />

            <div className="mx-auto mt-6 max-w-2xl">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <UserPlus size={24} />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Create User
                        </h1>

                        <p className="text-sm text-muted-foreground">
                            Add a student, teacher, or administrator.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-7"
                >
                    {/* Full name */}
                    <div className="space-y-2">
                        <label
                            htmlFor="name"
                            className="text-sm font-medium"
                        >
                            Full name
                        </label>

                        <div className="relative">
                            <User
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />

                            <input
                                id="name"
                                type="text"
                                placeholder="Enter full name"
                                value={name}
                                onChange={(event) =>
                                    setName(event.target.value)
                                }
                                autoComplete="name"
                                maxLength={120}
                                className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium"
                        >
                            Email address
                        </label>

                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />

                            <input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                autoComplete="email"
                                maxLength={254}
                                className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium"
                        >
                            Initial password
                        </label>

                        <div className="relative">
                            <LockKeyhole
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                            />

                            <input
                                id="password"
                                type="password"
                                placeholder="At least 8 characters"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                                autoComplete="new-password"
                                minLength={8}
                                maxLength={128}
                                className="w-full rounded-lg border border-input bg-background py-3 pl-10 pr-4 text-sm outline-none transition focus-visible:ring-2 focus-visible:ring-ring"
                                required
                            />
                        </div>
                    </div>

                    {/* User role */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">
                            User role
                        </label>

                        <Select
                            value={role}
                            onValueChange={(value) =>
                                setRole(value as UserRole)
                            }
                        >
                            <SelectTrigger className="h-11 w-full">
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

                    {/* Error message */}
                    {error && (
                        <div
                            role="alert"
                            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                        >
                            {error}
                        </div>
                    )}

                    {/* Success message */}
                    {success && (
                        <div
                            role="status"
                            className="rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-green-400"
                        >
                            {success}
                        </div>
                    )}

                    {/* Submit button */}
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        <UserPlus size={18} />

                        {isPending
                            ? "Creating user..."
                            : "Create user"}
                    </button>
                </form>
            </div>
        </CreateView>
    );
};

export default UserCreate;
