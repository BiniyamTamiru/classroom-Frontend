import { useState } from "react";
import { useList } from "@refinedev/core";
import { Search, BookOpen, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

type StudentSubjectRow = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    department: { id: number; name: string };
    relatedClasses: Array<{ id: number; name: string }>;
};

export default function StudentSubjectsPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const listQuery = useList<StudentSubjectRow>({
        resource: "student-subjects",
        pagination: { currentPage: page, pageSize: 9 },
        meta: { query: { search: search || undefined, page, limit: 9 } },
    });

    const records = listQuery.result?.data ?? [];

    if (listQuery.query.isLoading) {
        return (
            <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading subjects...
            </div>
        );
    }

    if (listQuery.query.isError) {
        return <div className="p-6 text-sm text-destructive">{listQuery.query.error?.message ?? "Unable to load your subjects."}</div>;
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">My Subjects</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Subjects tied to your enrolled classes.
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
                    placeholder="Search subject or department..."
                    className="pl-10"
                />
            </div>

            {!records.length ? (
                <div className="rounded-xl border border-dashed p-8 text-center">
                    <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">No subjects found</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {search ? "Try another search term." : "Your subjects will appear after you enroll in classes."}
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {records.map((subject) => (
                        <div key={subject.id} className="rounded-2xl border bg-card p-5">
                            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-xl font-semibold">{subject.name}</h2>
                                        <Badge variant="secondary">{subject.code}</Badge>
                                    </div>
                                    <p className="mt-1 text-sm text-muted-foreground">{subject.department.name}</p>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {subject.description ?? "No description provided."}
                                </p>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-medium text-muted-foreground">Related classes</p>
                                <div className="mt-2 flex flex-wrap gap-2">
                                    {subject.relatedClasses.map((item) => (
                                        <Badge key={item.id} variant="outline">
                                            {item.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}