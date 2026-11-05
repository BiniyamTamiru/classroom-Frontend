import { useEffect, useState, type FormEvent } from "react";
import { useGo, useShow, useUpdate, type HttpError } from "@refinedev/core";
import { Loader2, Save } from "lucide-react";
import { useParams } from "react-router";
import { toast } from "sonner";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EditView } from "@/components/refine-ui/views/edit-view";
import type { Department, DepartmentDetails } from "@/types";

type DepartmentInput = {
    code: string;
    name: string;
    description: string | null;
};

const DepartmentEdit = () => {
    const { id } = useParams<{ id: string }>();
    const go = useGo();
    const { query } = useShow<DepartmentDetails, HttpError>({
        resource: "departments",
        id,
        queryOptions: { enabled: Boolean(id) },
    });
    const { mutateAsync } = useUpdate<Department, HttpError, DepartmentInput>();
    const details = query.data?.data;
    const record = details?.department;
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!record) return;
        setCode(record.code);
        setName(record.name);
        setDescription(record.description ?? "");
    }, [record]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!id || isSaving) return;

        const normalizedCode = code.trim().toUpperCase();
        const trimmedName = name.trim();
        const trimmedDescription = description.trim();
        if (!normalizedCode || normalizedCode.length > 50) {
            setError("Enter a department code of 1 to 50 characters.");
            return;
        }
        if (!trimmedName || trimmedName.length > 255) {
            setError("Enter a department name of 1 to 255 characters.");
            return;
        }
        if (trimmedDescription.length > 255) {
            setError("Description must be 255 characters or fewer.");
            return;
        }

        setError("");
        setIsSaving(true);
        try {
            const result = await mutateAsync({
                resource: "departments",
                id,
                values: {
                    code: normalizedCode,
                    name: trimmedName,
                    description: trimmedDescription || null,
                },
                successNotification: false,
                errorNotification: false,
            });
            toast.success(`Department "${result.data.name}" was updated.`);
            go({ to: { resource: "departments", action: "show", id } });
        } catch (submitError: unknown) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Unable to update the department. Please try again.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <EditView>
            <Breadcrumb />
            <div className="mx-auto mt-4 w-full max-w-2xl">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Edit Department
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Update this department&apos;s information.
                    </p>
                </div>

                {!id ? (
                    <p role="alert" className="text-sm text-destructive">
                        A department ID is required.
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
                ) : !record ? (
                    <p role="status" className="text-sm text-muted-foreground">
                        Department not found.
                    </p>
                ) : (
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
                                value={code}
                                onChange={(event) => setCode(event.target.value)}
                                maxLength={50}
                                required
                                disabled={isSaving}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="department-name" className="text-sm font-medium">
                                Department name <span aria-hidden="true" className="text-destructive">*</span>
                            </label>
                            <Input
                                id="department-name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                maxLength={255}
                                required
                                disabled={isSaving}
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="department-description" className="text-sm font-medium">
                                Description
                            </label>
                            <Textarea
                                id="department-description"
                                placeholder="Add an optional department description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                maxLength={255}
                                rows={4}
                                disabled={isSaving}
                            />
                            <p className="text-xs text-muted-foreground">
                                {description.length}/255 characters
                            </p>
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
                                    go({ to: { resource: "departments", action: "show", id } })
                                }
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSaving}>
                                {isSaving ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {isSaving ? "Saving changes..." : "Save changes"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </EditView>
    );
};

export default DepartmentEdit;
