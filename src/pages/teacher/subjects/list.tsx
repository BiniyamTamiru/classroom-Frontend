import { useList } from "@refinedev/core";
import { useState } from "react";
import { Link } from "react-router";
import { Search, Eye, BookOpen } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type SubjectRow = {
    id: number;
    name: string;
    code: string;
    department?: {
        id: number;
        name: string;
        code: string;
    } | null;
    totalClasses: number;
};

export default function TeacherSubjectsList() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const subjectsQuery = useList<SubjectRow>({
        resource: "teacher-subjects",
        pagination: { currentPage: page, pageSize: 10 },
        filters: search
            ? [{ field: "search", operator: "contains", value: search }]
            : [],
    });

    const rows = (subjectsQuery.result?.data ?? []) as SubjectRow[];
    const total = Number(subjectsQuery.result?.total ?? rows.length);

    return (
        <div className="mx-auto w-full max-w-7xl space-y-6 p-6">
            <div>
                <p className="text-sm font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    Teacher workspace
                </p>
                <h1 className="mt-2 text-3xl font-bold">My subjects</h1>
            </div>

            <div className="rounded-2xl border bg-card p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                        placeholder="Search by subject or code"
                        className="pl-9"
                    />
                </div>
            </div>

            {subjectsQuery.query.isLoading ? (
                <div className="rounded-2xl border bg-card p-8 text-sm text-muted-foreground">Loading subjects...</div>
            ) : subjectsQuery.query.isError ? (
                <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-8 text-sm text-destructive">
                    {subjectsQuery.query.error?.message ?? "Unable to load subjects."}
                </div>
            ) : rows.length === 0 ? (
                <div className="rounded-2xl border border-dashed bg-card p-12 text-center text-muted-foreground">
                    No subjects assigned to your classes.
                </div>
            ) : (
                <>
                    <div className="space-y-3">
                        {rows.map((subject) => (
                            <div key={subject.id} className="rounded-2xl border bg-card p-4">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex size-11 items-center justify-center rounded-full bg-primary/10 text-primary">
                                            <BookOpen className="size-5" />
                                        </div>
                                        <div>
                                            <p className="font-semibold">{subject.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {subject.code} · {subject.department?.name ?? "No Department"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <Badge variant="secondary">{subject.totalClasses} class(es)</Badge>
                                    </div>

                                    <Button asChild variant="outline">
                                        <Link to={`/teacher/subjects/show/${subject.id}`}>
                                            <Eye className="mr-2 size-4" />
                                            View
                                        </Link>
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground">Total subjects: {total}</p>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page <= 1}
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= Math.ceil(total / 10)}
                                onClick={() => setPage((prev) => prev + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}