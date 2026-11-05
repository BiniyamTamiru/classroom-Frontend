import { useState } from "react";
import { useDelete, type HttpError } from "@refinedev/core";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";

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
import type { Enrollment } from "@/types";

type EnrollmentDeleteActionProps = {
    enrollment: Pick<Enrollment, "id" | "student" | "class">;
    onDeleted?: () => void;
    compact?: boolean;
};

export function EnrollmentDeleteAction({
    enrollment,
    onDeleted,
    compact = false,
}: EnrollmentDeleteActionProps) {
    const [open, setOpen] = useState(false);
    const { mutateAsync, mutation } = useDelete<Enrollment, HttpError>();

    const handleDelete = async () => {
        if (mutation.isPending) return;
        try {
            await mutateAsync({
                resource: "enrollments",
                id: enrollment.id,
                successNotification: false,
                errorNotification: false,
            });
            toast.success(
                `${enrollment.student.name}'s enrollment in "${enrollment.class.name}" was deleted.`,
            );
            setOpen(false);
            onDeleted?.();
        } catch (error: unknown) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "Unable to delete this enrollment.",
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
                aria-label={`Delete ${enrollment.student.name}'s enrollment in ${enrollment.class.name}`}
                onClick={() => setOpen(true)}
            >
                <Trash2 className="h-4 w-4" />
                {!compact && <span>Delete</span>}
            </Button>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this enrollment?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Remove <strong>{enrollment.student.name}</strong>&apos;s
                        enrollment from <strong>{enrollment.class.name}</strong>?
                        This deletes only this enrollment record.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={mutation.isPending}>
                        Cancel
                    </AlertDialogCancel>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={mutation.isPending}
                        onClick={handleDelete}
                    >
                        {mutation.isPending && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {mutation.isPending ? "Deleting..." : "Delete enrollment"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
