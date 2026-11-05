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
import type { DepartmentDetails, DepartmentListItem } from "@/types";

type DepartmentDeleteActionProps = {
    department: Pick<DepartmentListItem, "id" | "code" | "name">;
    compact?: boolean;
    onDeleted?: () => void;
};

export function DepartmentDeleteAction({
    department,
    compact = false,
    onDeleted,
}: DepartmentDeleteActionProps) {
    const [open, setOpen] = useState(false);
    const go = useGo();
    const { query } = useOne<DepartmentDetails, HttpError>({
        resource: "departments",
        id: department.id,
        queryOptions: { enabled: open },
    });
    const { mutateAsync, mutation } = useDelete<DepartmentDetails, HttpError>();
    const details = query.data?.data;
    const constraints = details
        ? {
              subjects: details.totalSubjects,
              classes: details.classes.length,
          }
        : undefined;
    const isBlocked =
        constraints !== undefined &&
        (constraints.subjects > 0 || constraints.classes > 0);

    const handleDelete = async () => {
        if (mutation.isPending || !constraints || isBlocked) return;

        try {
            await mutateAsync({
                resource: "departments",
                id: department.id,
                successNotification: false,
                errorNotification: false,
            });
            toast.success(`Department "${department.name}" was deleted.`);
            setOpen(false);
            if (onDeleted) {
                onDeleted();
            } else {
                go({ to: { resource: "departments", action: "list" } });
            }
        } catch (error: unknown) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to delete this department.",
            );
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
                aria-label={`Delete ${department.name}`}
                onClick={() => setOpen(true)}
            >
                <Trash2 className="h-4 w-4" />
                {!compact && <span>Delete</span>}
            </Button>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Delete this department?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        You are attempting to delete{" "}
                        <strong>{department.name}</strong> (
                        <strong>{department.code}</strong>). This action cannot
                        be undone.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                {query.isLoading && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Checking department relationships...
                    </div>
                )}
                {query.isError && (
                    <Alert variant="destructive">
                        <AlertTitle>Unable to check related records</AlertTitle>
                        <AlertDescription>
                            {query.error.message ||
                                "Try again before deleting this department."}
                        </AlertDescription>
                    </Alert>
                )}
                {constraints && (
                    <Alert variant={isBlocked ? "destructive" : "default"}>
                        <AlertTitle>
                            {isBlocked
                                ? "This department cannot be deleted yet"
                                : "No related academic records"}
                        </AlertTitle>
                        <AlertDescription>
                            {isBlocked ? (
                                <>
                                    <p>
                                        Reassign or remove the related records
                                        before deleting this department.
                                    </p>
                                    <p className="mt-2">
                                        Subjects: {constraints.subjects}
                                        <br />
                                        Classes: {constraints.classes}
                                    </p>
                                </>
                            ) : (
                                "This department has no subjects or classes and can be safely deleted."
                            )}
                        </AlertDescription>
                    </Alert>
                )}

                <AlertDialogFooter>
                    <AlertDialogCancel disabled={mutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={
                            mutation.isPending ||
                            query.isLoading ||
                            query.isError ||
                            !constraints ||
                            isBlocked
                        }
                        onClick={handleDelete}
                    >
                        {mutation.isPending && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {mutation.isPending ? "Deleting..." : "Delete department"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
