import { useState } from "react";
import { useList } from "@refinedev/core";
import { Search, Loader2, ClipboardList } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type StudentEnrollmentRow = {
    id: number;
    classId: number;
    className: string;
    createdAt: string;
    subject: {
        id: number;
        name: string;
        code: string;
    };
    teacher: { id: string; name: string } | null;
};

export default function StudentEnrollmentsPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const listQuery = useList<StudentEnrollmentRow>({
        resource: "student-enrollments",
        pagination: { currentPage: page, pageSize: 10 },
        meta: { query: { search: search || undefined, page, limit: 10 } },
    });

    const records = listQuery.result?.data ?? [];

    if (listQuery.query.isLoading) {
        return (
            <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading enrollments...
            </div>
        );
    }

    if (listQuery.query.isError) {
        return <div className="p-6 text-sm text-destructive">{listQuery.query.error?.message ?? "Unable to load your enrollments."}</div>;
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">My Enrollments</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Your class registrations and enrollment history.
                </p>
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
                    <ClipboardList className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">No enrollments yet</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {search ? "Try another search term." : "Once you enroll, your records will appear here."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {records.map((item) => (
                        <div key={item.id} className="rounded-2xl border bg-card p-5">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <h2 className="text-xl font-semibold">{item.className}</h2>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        {item.subject.name} · {item.subject.code}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {item.teacher ? <Badge variant="secondary">{item.teacher.name}</Badge> : null}
                                    <Badge variant="outline">
                                        {new Date(item.createdAt).toLocaleDateString()}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}