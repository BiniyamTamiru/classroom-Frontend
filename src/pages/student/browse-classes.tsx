import { useState } from "react";
import { useList } from "@refinedev/core";
import { Search, GraduationCap, Loader2, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type AvailableClass = {
    id: number;
    name: string;
    description?: string | null;
    status: "active" | "inactive" | "archived";
    capacity?: number | null;
    bannerUrl?: string | null;
    inviteCode?: string;
    subject: {
        id: number;
        name: string;
        code: string;
        department: { id: number; name: string };
    };
    teacher: { id: string; name: string } | null;
};

export default function StudentBrowseClassesPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [isEnrollingId, setIsEnrollingId] = useState<number | null>(null);

    const listQuery = useList<AvailableClass>({
        resource: "student-browse-classes",
        pagination: { currentPage: page, pageSize: 9 },
        meta: { query: { search: search || undefined, page, limit: 9 } },
    });

    const records = listQuery.result?.data ?? [];
    const total = listQuery.result?.total ?? 0;
    const totalPages = Math.max(1, Math.ceil(total / 9));

    const enroll = async (classId: number) => {
        setIsEnrollingId(classId);

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_BASE_URL}/student/classes/enroll`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ classId }),
            });

            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.message || "Unable to enroll.");
            }

            window.location.reload();
        } catch (error) {
            alert(error instanceof Error ? error.message : "Unable to enroll in this class.");
        } finally {
            setIsEnrollingId(null);
        }
    };

    if (listQuery.query.isLoading) {
        return (
            <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading available classes...
            </div>
        );
    }

    if (listQuery.query.isError) {
        return (
            <div className="p-6 text-sm text-destructive">
                {listQuery.query.error?.message ?? "Unable to load available classes."}
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Browse Classes</h1>
                    <p className="text-sm text-muted-foreground">
                        Explore active classes and enroll in the ones that fit your path.
                    </p>
                </div>
            </header>

            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(event) => {
                        setPage(1);
                        setSearch(event.target.value);
                    }}
                    placeholder="Search class or subject..."
                    className="pl-10"
                />
            </div>

            {!records.length ? (
                <div className="rounded-xl border border-dashed p-8 text-center">
                    <GraduationCap className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">No available classes</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {search
                            ? "Try another search keyword."
                            : "There are no active classes available right now."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {records.map((classItem) => (
                        <Card key={classItem.id}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    <Badge>{classItem.status}</Badge>
                                </div>

                                <h2 className="mt-4 text-lg font-semibold">{classItem.name}</h2>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {classItem.description ?? "No description provided."}
                                </p>

                                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                                    <p>Subject: {classItem.subject.name}</p>
                                    <p>Code: {classItem.subject.code}</p>
                                    <p>Department: {classItem.subject.department.name}</p>
                                    {classItem.teacher ? <p>Teacher: {classItem.teacher.name}</p> : null}
                                    <p>Capacity: {classItem.capacity ?? "Open"}</p>
                                </div>

                                <Button
                                    className="mt-5 w-full"
                                    onClick={() => void enroll(classItem.id)}
                                    disabled={isEnrollingId === classItem.id}
                                >
                                    {isEnrollingId === classItem.id ? "Enrolling..." : "Enroll"}
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {total > 9 && (
                <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage((value) => Math.max(1, value - 1))}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page >= totalPages}
                            onClick={() => setPage((value) => value + 1)}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}