import { useState } from "react";
import { useList } from "@refinedev/core";
import { Link } from "react-router";
import { GraduationCap, Loader2, Search, ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type StudentClassRow = {
    id: number;
    name: string;
    status: "active" | "inactive" | "archived";
    enrolledAt: string;
    bannerUrl?: string | null;
    subject: {
        id: number;
        name: string;
        code: string;
        department: { id: number; name: string };
    };
    teacher: { id: string; name: string } | null;
};

export default function StudentClassesPage() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const listQuery = useList<StudentClassRow>({
        resource: "student/classes",
        pagination: { currentPage: page, pageSize: 9 },
        meta: { query: { search: search || undefined, page, limit: 9 } },
    });

    const records = listQuery.result?.data ?? [];
    // Read total from the pagination object returned by your backend structure
    const total = (listQuery.result as any)?.pagination?.total ?? records.length;
    const totalPages = Math.max(1, Math.ceil(total / 9));

    if (listQuery.query.isLoading) {
        return (
            <div className="flex items-center gap-2 p-6 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading your classes...
            </div>
        );
    }

    if (listQuery.query.isError) {
        return (
            <div className="p-6 text-sm text-destructive">
                {listQuery.query.error?.message ?? "Unable to load your classes."}
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-6xl space-y-6 p-6">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">My Classes</h1>
                    <p className="text-sm text-muted-foreground">
                        Your enrolled classes and classroom access.
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
                    placeholder="Search your classes..."
                    className="pl-10"
                />
            </div>

            {!records.length ? (
                <div className="rounded-xl border border-dashed p-8 text-center">
                    <GraduationCap className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">No classes yet</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {search
                            ? "Try another search term."
                            : "Enroll in a class to see it here."}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {records.map((classItem) => (
                        <Card key={classItem.id}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                        <GraduationCap className="h-5 w-5" />
                                    </div>
                                    <Badge variant={classItem.status === "active" ? "default" : "secondary"}>
                                        {classItem.status}
                                    </Badge>
                                </div>

                                <h2 className="mt-4 text-lg font-semibold">{classItem.name}</h2>

                                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                                    <p>
                                        Subject: <span className="font-medium text-foreground">{classItem.subject.name}</span>
                                    </p>
                                    <p>Code: {classItem.subject.code}</p>
                                    <p>Department: {classItem.subject.department.name}</p>
                                    {classItem.teacher ? <p>Teacher: {classItem.teacher.name}</p> : null}
                                    <p>Enrolled: {new Date(classItem.enrolledAt).toLocaleDateString()}</p>
                                </div>

                                <Button asChild variant="outline" className="mt-5 w-full">
                                    <Link to={`/student/classes/${classItem.id}`}>
                                        Open class
                                        <ArrowUpRight className="ml-2 h-4 w-4" />
                                    </Link>
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