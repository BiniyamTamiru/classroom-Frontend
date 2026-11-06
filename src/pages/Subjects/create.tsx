import { useState, type FormEvent } from "react";
import { useCreate, useGo, useList, type HttpError } from "@refinedev/core";
import { ArrowLeft, BookPlus, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Department, Subject } from "@/types";

type SubjectInput = {
    name: string;
    code: string;
    departmentId: number;
};

const SubjectCreate = () => {
    const go = useGo();
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const departmentsQuery = useList<Department, HttpError>({
        resource: "departments",
        pagination: { currentPage: 1, pageSize: 100 },
        meta: { query: { limit: 100 } },
    });
    const { mutateAsync } = useCreate<Subject, HttpError, SubjectInput>({
        resource: "subjects",
        successNotification: false,
        errorNotification: false,
    });
    const departmentOptions = departmentsQuery.query.data?.data ?? [];

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isSaving) return;
        const trimmedName = name.trim();
        const normalizedCode = code.trim().toUpperCase();
        setError("");

        if (!trimmedName) {
            setError("Subject name is required.");
            return;
        }
        if (!normalizedCode) {
            setError("Subject code is required.");
            return;
        }
        if (!departmentId) {
            setError("Please select a department.");
            return;
        }

        setIsSaving(true);
        try {
            const result = await mutateAsync({
                values: {
                    name: trimmedName,
                    code: normalizedCode,
                    departmentId: Number(departmentId),
                },
            });
            toast.success(`Subject "${result.data.name}" was created.`);
            go({ to: { resource: "subjects", action: "list" } });
        } catch (submitError: unknown) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Unable to create this subject.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <CreateView>
            <Breadcrumb />
            <div className="mx-auto mt-6 w-full max-w-2xl">
                <header className="mb-6 flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <BookPlus className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Create Subject</h1>
                        <p className="text-sm text-muted-foreground">Add a new academic subject.</p>
                    </div>
                </header>
                <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-7">
                    <div className="space-y-2">
                        <label htmlFor="subject-name" className="text-sm font-medium">
                            Subject name <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="subject-name"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="e.g. Introduction to Computer Science"
                            maxLength={255}
                            required
                            disabled={isSaving}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="subject-code" className="text-sm font-medium">
                            Subject code <span className="text-destructive">*</span>
                        </label>
                        <Input
                            id="subject-code"
                            value={code}
                            onChange={(event) => setCode(event.target.value)}
                            placeholder="e.g. CS101"
                            maxLength={50}
                            required
                            disabled={isSaving}
                        />
                        <p className="text-xs text-muted-foreground">Codes are saved in uppercase and must be unique.</p>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="subject-department" className="text-sm font-medium">
                            Department <span className="text-destructive">*</span>
                        </label>
                        {departmentsQuery.query.isError ? (
                            <p role="alert" className="text-sm text-destructive">
                                {departmentsQuery.query.error.message || "Unable to load departments."}
                            </p>
                        ) : (
                            <Select
                                value={departmentId}
                                onValueChange={setDepartmentId}
                                disabled={isSaving || departmentsQuery.query.isLoading || departmentOptions.length === 0}
                            >
                                <SelectTrigger id="subject-department" className="w-full">
                                    <SelectValue
                                        placeholder={
                                            departmentsQuery.query.isLoading
                                                ? "Loading departments..."
                                                : departmentOptions.length === 0
                                                  ? "No departments available"
                                                  : "Select a department"
                                        }
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {departmentOptions.map((department) => (
                                        <SelectItem key={department.id} value={String(department.id)}>
                                            {department.name} ({department.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                        {departmentOptions.length === 0 && !departmentsQuery.query.isLoading && !departmentsQuery.query.isError && (
                            <p className="text-sm text-muted-foreground">Create a department before adding a subject.</p>
                        )}
                    </div>
                    {error && (
                        <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                            {error}
                        </p>
                    )}
                    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isSaving}
                            onClick={() => go({ to: { resource: "subjects", action: "list" } })}
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSaving || departmentsQuery.query.isLoading || departmentOptions.length === 0}
                        >
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                            {isSaving ? "Creating..." : "Create subject"}
                        </Button>
                    </div>
                </form>
            </div>
        </CreateView>
    );
};

export default SubjectCreate;
