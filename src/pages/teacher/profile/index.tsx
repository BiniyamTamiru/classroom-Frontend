import { useOne, useUpdate } from "@refinedev/core";
import { useState, useEffect } from "react";
import { AlertCircle, Save, UserRound, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type TeacherProfile = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    role?: "teacher" | "admin" | "student";
    createdAt?: string;
};

export default function TeacherProfilePage() {
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [submitState, setSubmitState] = useState<"idle" | "success" | "error">("idle");

    const profileQuery = useOne<TeacherProfile>({
        resource: "teacher-profile",
        id: "", // empty id since teacher-profile endpoint does not require an ID parameter
    });

    const profile = profileQuery.result;

    const { mutate: updateProfile, mutation: updateMutation } = useUpdate();

    useEffect(() => {
        if (profile) {
            setName(profile.name ?? "");
            setImage(profile.image ?? "");
        }
    }, [profile]);

    if (profileQuery.query.isLoading) {
        return (
            <div className="flex items-center gap-2 p-8 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" />
                Loading profile...
            </div>
        );
    }

    if (profileQuery.query.isError || !profile) {
        return (
            <div className="p-8 text-sm text-destructive">
                {profileQuery.query.error?.message ?? "Unable to load your profile."}
            </div>
        );
    }

    const handleSave = () => {
        setSubmitState("idle");
        updateProfile(
            {
                resource: "teacher-profile",
                id: "",
                values: {
                    name,
                    image,
                },
            },
            {
                onSuccess: () => {
                    setSubmitState("success");
                },
                onError: () => {
                    setSubmitState("error");
                },
            }
        );
    };

    return (
        <div className="mx-auto w-full max-w-4xl space-y-6 p-6">
            <div className="rounded-2xl border bg-card p-6">
                <div className="flex items-center gap-4">
                    <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <UserRound className="size-8" />
                    </div>
                    <div>
                        <p className="text-sm uppercase tracking-[0.12em] text-muted-foreground">
                            Teacher profile
                        </p>
                        <h1 className="mt-2 text-2xl font-bold">{profile.name}</h1>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    <div className="rounded-xl border p-4">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="mt-2">{profile.email}</p>
                    </div>
                    <div className="rounded-xl border p-4">
                        <p className="text-sm text-muted-foreground">Role</p>
                        <p className="mt-2"><Badge>{profile.role ?? "teacher"}</Badge></p>
                    </div>
                    <div className="rounded-xl border p-4">
                        <p className="text-sm text-muted-foreground">User ID</p>
                        <p className="mt-2 text-xs font-mono">{profile.id}</p>
                    </div>
                    <div className="rounded-xl border p-4">
                        <p className="text-sm text-muted-foreground">Created</p>
                        <p className="mt-2">
                            {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : "N/A"}
                        </p>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Edit profile</h2>

                <div className="space-y-4">
                    <div>
                        <label className="mb-1 block text-sm font-medium">Full name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">Profile image URL</label>
                        <Input
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            placeholder="https://..."
                        />
                    </div>

                    {submitState === "error" && (
                        <div className="flex items-center gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                            <AlertCircle className="size-4" />
                            Profile update failed.
                        </div>
                    )}

                    {submitState === "success" && (
                        <div className="rounded-md border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-700">
                            Profile updated successfully.
                        </div>
                    )}

                    <Button
                        className="w-full md:w-auto"
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                    >
                        <Save className="mr-2 size-4" />
                        {updateMutation.isPending ? "Saving..." : "Save changes"}
                    </Button>
                </div>
            </div>
        </div>
    );
}