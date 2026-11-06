import { useState } from "react";
import { useList } from "@refinedev/core";
import { Search, GraduationCap, Loader2, FolderOpen } from "lucide-react";
import { Link } from "react-router";

import { ListView } from "@/components/refine-ui/views/list-view";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type TeacherClassRow = {
    id: number;
    name: string;
    status: "active" | "inactive" | "archived";
    subjectName: string;
    subjectCode: string;
    departmentName: string;
    enrolledStudents: number;
};

export default function TeacherClassList() {
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const listQuery = useList<TeacherClassRow>({
        resource: "teacher-classes",
        pagination: { currentPage: page, pageSize: 10 },
        filters: search
            ? [{ field: "search", operator: "contains", value: search }]
            : [],
    });

    const records = listQuery.result?.data ?? [];
    const total = listQuery.result?.total ?? records.length;

    if (listQuery.query.isLoading) {
        return (
            <ListView>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading your classes...
                </div>
            </ListView>
        );
    }

    if (listQuery.query.isError) {
        return (
            <ListView>
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
                    {listQuery.query.error?.message ?? "Unable to load your classes."}
                </div>
            </ListView>
        );
    }

    return (
        <ListView>
            <div className="space-y-6">
                <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="page-title">My Classes</h1>
                        <p className="text-sm text-muted-foreground">
                            Manage the classes assigned to you.
                        </p>
                    </div>
                </header>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => {
                            setPage(1);
                            setSearch(e.target.value);
                        }}
                        placeholder="Search classes..."
                        className="pl-10"
                    />
                </div>

                {!records.length ? (
                    <div className="rounded-xl border border-dashed p-8 text-center">
                        <GraduationCap className="mx-auto mb-3 h-7 w-7 text-muted-foreground" />
                        <h2 className="font-semibold">No classes found</h2>
                        <p className="mt-2 text-sm text-muted-foreground">
                            {search
                                ? "Try another class name or keyword."
                                : "You currently have no classes assigned."}
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {records.map((classItem) => (
                            <Card key={classItem.id}>
                                <CardContent className="p-5">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                                            <FolderOpen className="h-5 w-5" />
                                        </div>
                                        <Badge variant={classItem.status === "active" ? "default" : "secondary"}>
                                            {classItem.status}
                                        </Badge>
                                    </div>

                                    <h2 className="mt-4 text-lg font-semibold">{classItem.name}</h2>

                                    <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                                        <p>
                                            Subject: <span className="font-medium text-foreground">{classItem.subjectName}</span>
                                        </p>
                                        <p>Code: {classItem.subjectCode}</p>
                                        <p>Department: {classItem.departmentName}</p>
                                        <p>Students: {classItem.enrolledStudents}</p>
                                    </div>

                                    <Button asChild variant="outline" className="mt-5 w-full">
                                        <Link to={`/teacher/classes/show/${classItem.id}`}>View details</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}

                {total > 10 && (
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Page {page} of {Math.ceil(total / 10)}
                        </span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                                Prev
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                disabled={page >= Math.ceil(total / 10)}
                                onClick={() => setPage((p) => p + 1)}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </ListView>
    );
}