import { useState } from "react";
import { useDelete, useGo, useOne, type HttpError } from "@refinedev/core";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { Subject, SubjectDetailsResponse } from "@/types";

type SubjectDeleteActionProps = {
    subject: Pick<Subject, "id" | "code" | "name">;
    compact?: boolean;
};

export function SubjectDeleteAction({
    subject,
    compact = false,
}: SubjectDeleteActionProps) {
    const [open, setOpen] = useState(false);
    const go = useGo();
    const { query } = useOne<SubjectDetailsResponse, HttpError>({
        resource: "subjects",
        id: subject.id,
        queryOptions: { enabled: open },
    });
    const { mutateAsync, mutation } = useDelete<SubjectDetailsResponse, HttpError>();
    const details = query.data?.data?.subjectWithDepartment;
    const classCount = details?.classes.length;
    const isBlocked = classCount !== undefined && classCount > 0;

    const handleDelete = async () => {
        if (mutation.isPending || classCount === undefined || isBlocked) return;
        try {
            await mutateAsync({
                resource: "subjects",
                id: subject.id,
                successNotification: false,
                errorNotification: false,
            });
            toast.success(`Subject "${subject.name}" was deleted.`);
            setOpen(false);
            go({ to: { resource: "subjects", action: "list" } });
        } catch (error: unknown) {
            toast.error(error instanceof Error ? error.message : "Unable to delete this subject.");
        }
    };

    return (
        <AlertDialog
            open={open}
            onOpenChange={(nextOpen) => {
                if (!mutation.isPending) setOpen(nextOpen);
            }}
        >
            <Button
                type="button"
                variant={compact ? "ghost" : "destructive"}
                size={compact ? "icon" : "default"}
                aria-label={`Delete ${subject.name}`}
                onClick={() => setOpen(true)}
            >
                <Trash2 className="h-4 w-4" />
                {!compact && <span>Delete</span>}
            </Button>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this subject?</AlertDialogTitle>
                    <AlertDialogDescription>
                        You are attempting to delete <strong>{subject.name}</strong> (
                        <strong>{subject.code}</strong>). Academic records will not be deleted.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {query.isLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Checking subject relationships...
                    </div>
                )}
                {query.isError && (
                    <Alert variant="destructive">
                        <AlertTitle>Unable to check related records</AlertTitle>
                        <AlertDescription>
                            {query.error.message || "Try again before deleting this subject."}
                        </AlertDescription>
                    </Alert>
                )}
                {details && (
                    <Alert variant={isBlocked ? "destructive" : "default"}>
                        <AlertTitle>
                            {isBlocked ? "This subject cannot be deleted yet" : "No related classes"}
                        </AlertTitle>
                        <AlertDescription>
                            {isBlocked ? (
                                <>
                                    <p>
                                        Cannot delete this subject because it has related classes.
                                        Please reassign or remove the related classes before deleting.
                                    </p>
                                    <p className="mt-2">Related Classes: {classCount}</p>
                                </>
                            ) : (
                                "This subject has no related classes and can be safely deleted."
                            )}
                        </AlertDescription>
                    </Alert>
                )}
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={mutation.isPending}>Cancel</AlertDialogCancel>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={mutation.isPending || query.isLoading || query.isError || classCount === undefined || isBlocked}
                        onClick={handleDelete}
                    >
                        {mutation.isPending && <Loader2 className="h-4 w-4 animate-spin" />}
                        {mutation.isPending ? "Deleting..." : "Delete subject"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
