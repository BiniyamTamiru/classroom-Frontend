import { useEffect, useState, type FormEvent } from "react";
import {
    useGetIdentity,
    useGo,
    useList,
    useShow,
    useUpdate,
    type HttpError,
} from "@refinedev/core";
import { Loader2, Save } from "lucide-react";
import { useParams } from "react-router";
import { toast } from "sonner";

import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { EditView } from "@/components/refine-ui/views/edit-view";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { Enrollment, EnrollmentShowResponse, User } from "@/types";

type ClassOption = {
    id: number;
    name: string;
    subject?: { id?: number; name?: string; code?: string } | null;
};
type EnrollmentInput = { studentId: string; classId: number };

const EnrollmentEdit = () => {
    const { id } = useParams<{ id: string }>();
    const go = useGo();
    const { data: identity, isLoading: identityLoading } = useGetIdentity<User>();
    const isAdmin = identity?.role === "admin";
    const enrollmentQuery = useShow<EnrollmentShowResponse, HttpError>({
        resource: "enrollments",
        id,
        queryOptions: { enabled: Boolean(id) && isAdmin },
    });
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
    const { mutateAsync, mutation } = useUpdate<Enrollment, HttpError, EnrollmentInput>();
    const details = enrollmentQuery.query.data?.data?.enrollmentWithRelations;
    const [studentId, setStudentId] = useState("");
    const [classId, setClassId] = useState("");
    const [error, setError] = useState("");
    const students = usersQuery.query.data?.data ?? [];
    const fetchedClasses = classesQuery.query.data?.data ?? [];
    const studentOptions =
        details?.student.role === "student" &&
        !students.some((student) => student.id === details.student.id)
            ? [...students, details.student]
            : students;
    const classOptions =
        details && !fetchedClasses.some((classRecord) => classRecord.id === details.class.id)
            ? [...fetchedClasses, details.class]
            : fetchedClasses;

    useEffect(() => {
        if (!details) return;
        setStudentId(details.studentId);
        setClassId(String(details.classId));
    }, [details]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!id || !isAdmin || mutation.isPending) return;
        const selectedStudent = studentOptions.find((student) => student.id === studentId);
        const selectedClass = classOptions.find((classRecord) => classRecord.id === Number(classId));
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
                id,
                values: { studentId: selectedStudent.id, classId: selectedClass.id },
                successNotification: false,
                errorNotification: false,
            });
            toast.success(`Enrollment for ${result.data.student.name} was updated.`);
            go({ to: { resource: "enrollments", action: "show", id } });
        } catch (submitError: unknown) {
            setError(
                submitError instanceof Error
                    ? submitError.message
                    : "Unable to update this enrollment.",
            );
        }
    };

    return (
        <EditView>
            <Breadcrumb />
            <div className="mx-auto mt-6 w-full max-w-2xl">
                <header className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight">Edit Enrollment</h1>
                    <p className="text-sm text-muted-foreground">
                        Update the student or class. The enrollment date cannot be changed.
                    </p>
                </header>
                {!id ? (
                    <p role="alert" className="text-sm text-destructive">An enrollment ID is required.</p>
                ) : identityLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Checking access...
                    </div>
                ) : !isAdmin ? (
                    <p role="alert" className="text-sm text-destructive">
                        Only administrators can edit enrollments.
                    </p>
                ) : enrollmentQuery.query.isLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading enrollment...
                    </div>
                ) : enrollmentQuery.query.isError ? (
                    <p role="alert" className="text-sm text-destructive">
                        {enrollmentQuery.query.error.message || "Unable to load this enrollment."}
                    </p>
                ) : !details ? (
                    <p role="status" className="text-sm text-muted-foreground">Enrollment not found.</p>
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
                            <label htmlFor="edit-enrollment-student" className="text-sm font-medium">
                                Student <span className="text-destructive">*</span>
                            </label>
                            <Select
                                value={studentId}
                                onValueChange={setStudentId}
                                disabled={mutation.isPending || usersQuery.query.isLoading || studentOptions.length === 0}
                            >
                                <SelectTrigger id="edit-enrollment-student" className="w-full">
                                    <SelectValue placeholder={usersQuery.query.isLoading ? "Loading students..." : "Select a student"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {studentOptions.map((student) => (
                                        <SelectItem key={student.id} value={student.id}>
                                            {student.name} ({student.email})
                                        </SelectItem>
                                    ))}
                                    {usersQuery.query.isLoading ? (
                                        <SelectItem value="loading-students" disabled>Loading students...</SelectItem>
                                    ) : studentOptions.length === 0 ? (
                                        <SelectItem value="no-students" disabled>No students available</SelectItem>
                                    ) : null}
                                </SelectContent>
                            </Select>
                            {studentOptions.length === 0 && !usersQuery.query.isLoading && (
                                <p className="text-sm text-muted-foreground">No student accounts are available.</p>
                            )}
                            {details.student.role !== "student" && (
                                <p className="text-sm text-destructive">
                                    The currently assigned account is no longer a student; select a student to continue.
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="edit-enrollment-class" className="text-sm font-medium">
                                Class <span className="text-destructive">*</span>
                            </label>
                            <Select
                                value={classId}
                                onValueChange={setClassId}
                                disabled={mutation.isPending || classesQuery.query.isLoading || classOptions.length === 0}
                            >
                                <SelectTrigger id="edit-enrollment-class" className="w-full">
                                    <SelectValue placeholder={classesQuery.query.isLoading ? "Loading classes..." : "Select a class"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {classOptions.map((classRecord) => (
                                        <SelectItem key={classRecord.id} value={String(classRecord.id)}>
                                            {classRecord.name}
                                            {classRecord.subject?.name ? ` - ${classRecord.subject.name}` : ""}
                                        </SelectItem>
                                    ))}
                                    {classesQuery.query.isLoading ? (
                                        <SelectItem value="loading-classes" disabled>Loading classes...</SelectItem>
                                    ) : classOptions.length === 0 ? (
                                        <SelectItem value="no-classes" disabled>No classes available</SelectItem>
                                    ) : null}
                                </SelectContent>
                            </Select>
                            {classOptions.length === 0 && !classesQuery.query.isLoading && (
                                <p className="text-sm text-muted-foreground">No classes are available.</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="edit-enrollment-date" className="text-sm font-medium">
                                Enrollment date
                            </label>
                            <Input
                                id="edit-enrollment-date"
                                value={new Date(details.createdAt).toLocaleDateString()}
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
                            <Button type="button" variant="outline" disabled={mutation.isPending} onClick={() => go({ to: { resource: "enrollments", action: "show", id } })}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={mutation.isPending || usersQuery.query.isLoading || classesQuery.query.isLoading || studentOptions.length === 0 || classOptions.length === 0}>
                                {mutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                                {mutation.isPending ? "Saving..." : "Save changes"}
                            </Button>
                        </div>
                    </form>
                )}
            </div>
        </EditView>
    );
};

export default EnrollmentEdit;
