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
import { getUserErrorMessage } from "@/components/users/get-user-error-message";
import type { User } from "@/types";

type UserDeleteActionProps = {
    user: Pick<User, "id" | "name" | "email">;
    onDeleted?: () => void;
    compact?: boolean;
};

export function UserDeleteAction({
    user,
    onDeleted,
    compact = false,
}: UserDeleteActionProps) {
    const [open, setOpen] = useState(false);
    const { mutateAsync, mutation } = useDelete<User, HttpError>();

    const handleDelete = async () => {
        if (mutation.isPending) return;

        try {
            await mutateAsync({
                resource: "users",
                id: user.id,
                successNotification: false,
                errorNotification: false,
            });
            toast.success(`User "${user.name}" was deleted.`);
            setOpen(false);
            onDeleted?.();
        } catch (error: unknown) {
            toast.error(
                getUserErrorMessage(error, "Unable to delete this user."),
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
                aria-label={`Delete ${user.name}`}
                onClick={() => setOpen(true)}
            >
                <Trash2 className="h-4 w-4" />
                {!compact && <span>Delete</span>}
            </Button>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete this user?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Delete <strong>{user.name}</strong> ({user.email})
                        permanently? This also removes the user&apos;s Better
                        Auth sessions and accounts. Users who teach or are
                        enrolled in classes cannot be deleted until those
                        associations are resolved.
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
                        {mutation.isPending ? "Deleting..." : "Delete user"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
