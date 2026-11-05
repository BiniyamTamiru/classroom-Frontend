import { useEffect, useState, type FormEvent } from "react";
import { useGo, useList, useShow, useUpdate, type HttpError } from "@refinedev/core";
import { Loader2, Save } from "lucide-react";
import { useParams } from "react-router";
import { toast } from "sonner";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { EditView } from "@/components/refine-ui/views/edit-view";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Department, Subject, SubjectDetailsResponse } from "@/types";

type SubjectInput = {
    name: string;
    code: string;
    departmentId: number;
    description: string | null;
};

const SubjectEdit = () => {
    const { id } = useParams<{ id: string }>();
    const go = useGo();
    const subjectQuery = useShow<SubjectDetailsResponse, HttpError>({
        resource: "subjects",
        id,
        queryOptions: { enabled: Boolean(id) },
    });
    const departmentsQuery = useList<Department, HttpError>({
        resource: "departments",
        pagination: { currentPage: 1, pageSize: 100 },
        meta: { query: { limit: 100 } },
    });
    const { mutateAsync } = useUpdate<Subject, HttpError, SubjectInput>();
    const subject = subjectQuery.query.data?.data?.subjectWithDepartment;
    const [name, setName] = useState("");
    const [code, setCode] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!subject) return;
        setName(subject.name);
        setCode(subject.code);
        setDepartmentId(String(subject.departmentId));
        setDescription(subject.description ?? "");
    }, [subject]);

    const fetchedDepartments = departmentsQuery.query.data?.data ?? [];
    const departmentOptions =
        subject &&
        !fetchedDepartments.some((department) => department.id === subject.departmentId)
            ? [
                  ...fetchedDepartments,
                  {
                      id: subject.department.id,
                      name: subject.department.name,
                      code: subject.department.code,
                  },
              ]
            : fetchedDepartments;
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!id || isSaving) return;
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
        if (description.trim().length > 255) {
            setError("Description must be 255 characters or fewer.");
            return;
        }

        setIsSaving(true);
        try {
            const result = await mutateAsync({
                resource: "subjects",
                id,
                values: {
                    name: trimmedName,
                    code: normalizedCode,
                    departmentId: Number(departmentId),
                    description: description.trim() || null,
                },
                successNotification: false,
                errorNotification: false,
            });
            toast.success(`Subject "${result.data.name}" was updated.`);
            go({ to: { resource: "subjects", action: "show", id } });
        } catch (submitError: unknown) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Unable to update this subject.",
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <EditView>
            <Breadcrumb />
            <div className="mx-auto mt-6 w-full max-w-2xl">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Edit Subject</h1>
                    <p className="text-sm text-muted-foreground">Update the subject name, code, department, or description.</p>
                </header>
                {!id ? (
                    <p role="alert" className="text-sm text-destructive">A subject ID is required.</p>
                ) : subjectQuery.query.isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading subject...
                    </div>
                ) : subjectQuery.query.isError ? (
                    <p role="alert" className="text-sm text-destructive">
                        {subjectQuery.query.error.message || "Unable to load this subject."}
                    </p>
                ) : !subject ? (
                    <p role="status" className="text-sm text-muted-foreground">Subject not found.</p>
                ) : departmentsQuery.query.isError ? (
                    <p role="alert" className="text-sm text-destructive">
                        {departmentsQuery.query.error.message || "Unable to load departments."}
                    </p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-7">
                        <div className="space-y-2">
                            <label htmlFor="edit-subject-name" className="text-sm font-medium">
                                Subject name <span className="text-destructive">*</span>
                            </label>
                            <Input id="edit-subject-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={255} required disabled={isSaving} />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-subject-code" className="text-sm font-medium">
                                Subject code <span className="text-destructive">*</span>
                            </label>
                            <Input id="edit-subject-code" value={code} onChange={(event) => setCode(event.target.value)} maxLength={50} required disabled={isSaving} />
                            <p className="text-xs text-muted-foreground">Codes are saved in uppercase and must be unique.</p>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-subject-department" className="text-sm font-medium">
                                Department <span className="text-destructive">*</span>
                            </label>
                            <Select value={departmentId} onValueChange={setDepartmentId} disabled={isSaving || departmentsQuery.query.isLoading || departmentOptions.length === 0}>
                                <SelectTrigger id="edit-subject-department" className="w-full">
                                    <SelectValue placeholder={departmentsQuery.query.isLoading ? "Loading departments..." : "Select a department"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {departmentOptions.map((department) => (
                                        <SelectItem key={department.id} value={String(department.id)}>
                                            {department.name} ({department.code})
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {departmentOptions.length === 0 && !departmentsQuery.query.isLoading && (
                                <p className="text-sm text-muted-foreground">No departments are available.</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="edit-subject-description" className="text-sm font-medium">Description</label>
                            <Textarea
                                id="edit-subject-description"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                                placeholder="Add an optional subject description"
                                maxLength={255}
                                rows={4}
                                disabled={isSaving}
                            />
                        </div>
                        {error && <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</p>}
                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Button type="button" variant="outline" disabled={isSaving} onClick={() => go({ to: { resource: "subjects", action: "show", id } })}>Cancel</Button>
                            <Button type="submit" disabled={isSaving || departmentsQuery.query.isLoading || departmentOptions.length === 0}>
                                {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {isSaving ? "Saving..." : "Save changes"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </EditView>
    );
};

export default SubjectEdit;
