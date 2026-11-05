import { useState, type FormEvent } from "react";
import {
    useCreate,
    useGetIdentity,
    useGo,
    useList,
    type HttpError,
} from "@refinedev/core";
import { Loader2, Save } from "lucide-react";
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
import type { Enrollment, User } from "@/types";

type ClassOption = {
    id: number;
    name: string;
    subject?: { name?: string; code?: string } | null;
};
type EnrollmentInput = { studentId: string; classId: number };

const EnrollmentCreate = () => {
    const go = useGo();
    const { data: identity, isLoading: identityLoading } = useGetIdentity<User>();
    const isAdmin = identity?.role === "admin";
    const usersQuery = useList<User, HttpError>({
        resource: "users",
        filters: [{ field: "role", operator: "eq", value: "student" }],
        pagination: { currentPage: 1, pageSize: 100 },
        meta: { query: { limit: 100 } },
        queryOptions: { enabled: isAdmin },
    });
    const classesQuery = useList<ClassOption, HttpError>({
        resource: "classes",
        pagination: { currentPage: 1, pageSize: 100 },
        meta: { query: { limit: 100 } },
        queryOptions: { enabled: isAdmin },
    });
    const { mutateAsync, mutation } = useCreate<Enrollment, HttpError, EnrollmentInput>();
    const [studentId, setStudentId] = useState("");
    const [classId, setClassId] = useState("");
    const [error, setError] = useState("");
    const students = usersQuery.query.data?.data ?? [];
    const classes = classesQuery.query.data?.data ?? [];

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isAdmin || mutation.isPending) return;

        const selectedStudent = students.find((student) => student.id === studentId);
        const selectedClass = classes.find((classRecord) => classRecord.id === Number(classId));
        if (!selectedStudent || selectedStudent.role !== "student") {
            setError("Select an available user with the student role.");
            return;
        }
        if (!selectedClass) {
            setError("Select an available class.");
            return;
        }

        setError("");
        try {
            const result = await mutateAsync({
                resource: "enrollments",
                values: { studentId: selectedStudent.id, classId: selectedClass.id },
                successNotification: false,
                errorNotification: false,
            });
            toast.success(`Enrollment for ${selectedStudent.name} was created.`);
            go({
                to: {
                    resource: "enrollments",
                    action: "show",
                    id: result.data.id,
                },
            });
        } catch (submitError: unknown) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Unable to create this enrollment.",
            );
        }
    };

    return (
        <CreateView>
            <Breadcrumb />
            <div className="mx-auto mt-6 w-full max-w-2xl">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Create Enrollment</h1>
                    <p className="text-sm text-muted-foreground">
                        Assign a student to a class. The enrollment date is set automatically.
                    </p>
                </header>
                {identityLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Checking access...
                    </div>
                ) : !isAdmin ? (
                    <p role="alert" className="text-sm text-destructive">
                        Only administrators can create enrollments.
                    </p>
                ) : usersQuery.query.isError ? (
                    <p role="alert" className="text-sm text-destructive">
                        {usersQuery.query.error.message || "Unable to load students."}
                    </p>
                ) : classesQuery.query.isError ? (
                    <p role="alert" className="text-sm text-destructive">
                        {classesQuery.query.error.message || "Unable to load classes."}
                    </p>
                ) : (
                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5 rounded-xl border bg-card p-5 shadow-sm sm:p-7"
                    >
                        <div className="space-y-2">
                            <label htmlFor="enrollment-student" className="text-sm font-medium">
                                Student <span className="text-destructive">*</span>
                            </label>
                            <Select
                                value={studentId}
                                onValueChange={setStudentId}
                                disabled={usersQuery.query.isLoading || students.length === 0 || mutation.isPending}
                            >
                                <SelectTrigger id="enrollment-student" className="w-full">
                                    <SelectValue
                                        placeholder={usersQuery.query.isLoading ? "Loading students..." : "Select a student"}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {students.map((student) => (
                                        <SelectItem key={student.id} value={student.id}>
                                            {student.name} ({student.email})
                                        </SelectItem>
                                    ))}
                                    {students.length === 0 && !usersQuery.query.isLoading && (
                                        <SelectItem value="no-students" disabled>
                                            No students available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            {students.length === 0 && !usersQuery.query.isLoading && (
                                <p className="text-sm text-muted-foreground">No student accounts are available.</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="enrollment-class" className="text-sm font-medium">
                                Class <span className="text-destructive">*</span>
                            </label>
                            <Select
                                value={classId}
                                onValueChange={setClassId}
                                disabled={classesQuery.query.isLoading || classes.length === 0 || mutation.isPending}
                            >
                                <SelectTrigger id="enrollment-class" className="w-full">
                                    <SelectValue
                                        placeholder={classesQuery.query.isLoading ? "Loading classes..." : "Select a class"}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes.map((classRecord) => (
                                        <SelectItem key={classRecord.id} value={String(classRecord.id)}>
                                            {classRecord.name}
                                            {classRecord.subject?.name
                                                ? ` - ${classRecord.subject.name}`
                                                : ""}
                                        </SelectItem>
                                    ))}
                                    {classes.length === 0 && !classesQuery.query.isLoading && (
                                        <SelectItem value="no-classes" disabled>
                                            No classes available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                            {classes.length === 0 && !classesQuery.query.isLoading && (
                                <p className="text-sm text-muted-foreground">No classes are available.</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="enrollment-date" className="text-sm font-medium">
                                Enrollment date
                            </label>
                            <Input
                                id="enrollment-date"
                                value="Set automatically when saved"
                                readOnly
                                aria-readonly="true"
                            />
                        </div>
                        {error && (
                            <p role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                                {error}
                            </p>
                        )}
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => go({ to: { resource: "enrollments", action: "list" } })}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={mutation.isPending || usersQuery.query.isLoading || classesQuery.query.isLoading || students.length === 0 || classes.length === 0}
                            >
                                {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {mutation.isPending ? "Creating..." : "Create enrollment"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </CreateView>
    );
};

export default EnrollmentCreate;
