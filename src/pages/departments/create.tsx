import { useState, type FormEvent } from "react";
import { useCreate, useGo, type HttpError } from "@refinedev/core";
import { Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreateView } from "@/components/refine-ui/views/create-view";
import type { Department } from "@/types";

type DepartmentInput = {
    code: string;
    name: string;
    description: string | null;
};

const DepartmentCreate = () => {
    const go = useGo();
    const { mutateAsync } = useCreate<Department, HttpError, DepartmentInput>({
        resource: "departments",
        successNotification: false,
        errorNotification: false,
    });
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSaving) return;

        const normalizedCode = code.trim().toUpperCase();
        const trimmedName = name.trim();
        if (!normalizedCode || normalizedCode.length > 50) {
            setError("Enter a department code of 1 to 50 characters.");
            return;
        }
        if (!trimmedName || trimmedName.length > 255) {
            setError("Enter a department name of 1 to 255 characters.");
            return;
        }

        setError("");
        setIsSaving(true);
        try {
            const result = await mutateAsync({
                values: {
                    code: normalizedCode,
                    name: trimmedName,
                    description: null,
                },
            });
            toast.success(`Department "${result.data.name}" was created.`);
            go({ to: { resource: "departments", action: "list" } });
        } catch (submitError: unknown) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Unable to create the department. Please try again.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <CreateView>
            <Breadcrumb />
            <div className="mx-auto mt-4 w-full max-w-2xl">
                <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Building2 className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Create Department
                        </h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Add a new academic department.
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-7"
                >
                    <div className="space-y-2">
                        <label htmlFor="department-code" className="text-sm font-medium">
                            Department code <span aria-hidden="true" className="text-destructive">*</span>
                        </label>
                        <Input
                            id="department-code"
                            placeholder="e.g. CS"
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                            autoComplete="off"
                            maxLength={50}
                            required
                            disabled={isSaving}
                        />
                        <p className="text-xs text-muted-foreground">
                            Codes are saved in uppercase and must be unique.
                        </p>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="department-name" className="text-sm font-medium">
                            Department name <span aria-hidden="true" className="text-destructive">*</span>
                        </label>
                        <Input
                            id="department-name"
                            placeholder="e.g. Computer Science"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            autoComplete="organization"
                            maxLength={255}
                            required
                            disabled={isSaving}
                        />
                    </div>

                    {error && (
                        <p
                            role="alert"
                            className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
                        >
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSaving}
                            onClick={() =>
                                go({ to: { resource: "departments", action: "list" } })
                            }
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSaving}>
                            {isSaving ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Building2 className="h-4 w-4" />
                            )}
                            {isSaving ? "Creating department..." : "Create department"}
                        </Button>
                    </div>
                </form>
            </div>
        </CreateView>
    );
};

export default DepartmentCreate;
