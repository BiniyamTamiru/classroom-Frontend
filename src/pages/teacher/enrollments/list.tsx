import { useState } from "react";
import { useList } from "@refinedev/core";
import { Search, ClipboardList, Loader2 } from "lucide-react";
import { Link } from "react-router";

import { ListView } from "@/components/refine-ui/views/list-view";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type TeacherEnrollmentRow = {
    id: number;
    studentName: string;
    studentEmail: string;
    className: string;
    subjectName: string;
    subjectCode: string;
    enrolledAt: string;
};

export default function TeacherEnrollmentList() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const query = useList<TeacherEnrollmentRow>({
        resource: "teacher-enrollments",
        pagination: { currentPage: page, pageSize: 10 },
        filters: search ? [{ field: "search", operator: "contains", value: search }] : [],
    });

    const records = query.result?.data ?? [];
    const total = query.result?.total ?? records.length;

    if (query.query.isLoading) {
        return (
            <ListView>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading enrollments...
                </div>
            </ListView>
        );
    }

    if (query.query.isError) {
        return (
            <ListView>
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    {query.query.error?.message ?? "Unable to load enrollments."}
                </div>
            </ListView>
        );
    }

    return (
        <ListView>
            <div className="space-y-6">
                <header>
                    <h1 className="page-title">Enrollments</h1>
                    <p className="text-sm text-muted-foreground">Student enrollments in your classes.</p>
                </header>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                        placeholder="Search by student or class..."
                        className="pl-10"
                    />
                </div>

                {!records.length ? (
                    <div className="rounded-xl border border-dashed p-8 text-center">
                        <ClipboardList className="mx-auto mb-3 h-7 w-7 text-muted-foreground" />
                        <h2 className="font-semibold">No enrollments found</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {search ? "No enrollments match your search." : "No students have enrolled in your classes yet."}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {records.map((enrollment) => (
                            <div key={enrollment.id} className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <p className="font-medium">{enrollment.studentName}</p>
                                    <p className="text-sm text-muted-foreground">{enrollment.studentEmail}</p>
                                </div>

                                <div className="text-sm text-muted-foreground">
                                    <p>{enrollment.className}</p>
                                    <p>{enrollment.subjectName}</p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Badge variant="secondary">{new Date(enrollment.enrolledAt).toLocaleDateString()}</Badge>
                                    <Button asChild variant="outline" size="sm">
                                        <Link to={`/teacher/enrollments/show/${enrollment.id}`}>View</Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {total > 10 && (
                    <div className="mt-4 flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Page {page}</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                                Prev
                            </Button>
                            <Button variant="outline" size="sm" disabled={page >= Math.ceil(total / 10)} onClick={() => setPage((p) => p + 1)}>
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ListView>
    );
}