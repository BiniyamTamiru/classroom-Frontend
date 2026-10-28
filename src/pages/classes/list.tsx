import { ListView } from "@/components/refine-ui/views/list-view.tsx";
import { Breadcrumb } from "@/components/ui/breadcrumb.tsx";
import { Search, Image as ImageIcon } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";
import { useMemo, useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import { CreateButton } from "@/components/refine-ui/buttons/create.tsx";
import { DataTable } from "@/components/refine-ui/data-table/data-table.tsx";
import { useTable } from "@refinedev/react-table";
import { useSelect } from "@refinedev/core";
import { Badge } from "@/components/ui/badge.tsx";
import { classes } from "@/types";
import {ShowButton} from "@/components/refine-ui/buttons/show.tsx";

const ClassesList = () => {
    const [inputValue, setInputValue] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedSubject, setSelectedSubject] = useState("all");
    const [selectedTeacher, setSelectedTeacher] = useState("all");


    // Debounce search input by 400ms to prevent API flooding and rate-limit triggers
    useEffect(() => {
        const handler = setTimeout(() => {
            setSearchQuery(inputValue);
        }, 400);

        return () => {
            clearTimeout(handler);

        };
    }, [inputValue]);

    // Fetch dynamic subjects from the database
    const { options: subjectOptions } = useSelect({
        resource: "subjects",
        optionLabel: "name",
        optionValue: "id",
    });

    // Fetch dynamic teachers/users from the database
    const { options: teacherOptions } = useSelect({
        resource: "users", // Adjust to "user" if your refine resource is registered singularly
        optionLabel: "name",
        optionValue: "id",
    });

    const classtable = useTable<classes>({
        refineCoreProps: {
            resource: "classes",
            pagination: { pageSize: 10, mode: "server" },
            sorts: {
                initial: [
                    { field: "id", order: "desc" },
                ],
            },
            meta: {
                query: {
                    search: searchQuery || undefined,
                    subject: selectedSubject === "all" ? undefined : selectedSubject,
                    teacher: selectedTeacher === "all" ? undefined : selectedTeacher,
                },
            },
        },
        columns: useMemo(
            () => [
                {
                    id: "bannerUrl",
                    accessorKey: "bannerUrl",
                    size: 140,
                    header: () => <p className="column-title">Banner</p>,
                    cell: ({ getValue }) => {
                        const bannerUrl = getValue<string>();
                        return (
                            <div className="flex items-center justify-center my-1">
                                {bannerUrl ? (
                                    <img
                                        src={bannerUrl}
                                        alt="classBanner"
                                        className="w-20 h-12 rounded-md object-cover shadow-sm border"
                                    />
                                ) : (
                                    <div className="w-20 h-12 rounded-md bg-muted flex items-center justify-center text-muted-foreground border">
                                        <ImageIcon className="w-6 h-6" />
                                    </div>
                                )}
                            </div>
                        );
                    },
                },
                {

                    id: "name",
                    accessorKey: "name",
                    size: 200,
                    header: () => <p className="column-title ml-2">Class Name</p>,
                    cell: ({ getValue }) => <Badge>{getValue<string>()}</Badge>,
                },
                {
                    id: "status",
                    accessorKey: "status",
                    size: 100,
                    header: () => <p className="column-title">Status</p>,
                    cell: ({ getValue }) => {
                        const status = getValue<string>() || "active";
                        return (
                            <Badge variant={status === "active" ? "default" : "secondary"}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </Badge>
                        );
                    },
                },
                {
                    id: "subject",
                    accessorKey: "subject",
                    size: 150,
                    header: () => <p className="column-title">Subject</p>,
                    cell: ({ getValue }) => {
                        const subject = getValue<any>();
                        const subjectName = typeof subject === "object" ? subject?.name : subject;
                        return (
                            <Badge variant="secondary">
                                {subjectName || "N/A"}
                            </Badge>
                        );
                    },
                },
                {
                    id: "teacher",
                    accessorKey: "teacher",
                    size: 150,
                    header: () => <p className="column-title">Teacher Name</p>,
                    cell: ({ row, getValue }) => {
                        const teacher = getValue<any>();
                        const teacherName = typeof teacher === "object" ? teacher?.name : teacher;
                        const fallbackId = row.original.teacherId;

                        return (
                            <Badge variant="secondary" className="truncate max-w-[120px]">
                                {teacherName || (fallbackId ? "Assigned Teacher" : "Unassigned")}
                            </Badge>
                        );
                    },
                },
                {
                    id: "capacity",
                    accessorKey: "capacity",
                    size: 100,
                    header: () => <p className="column-title">Capacity</p>,
                    cell: ({ getValue }) => {
                        const capacity = getValue<any>();
                        const val = typeof capacity === "object" ? capacity?.capacity : capacity;
                        return (
                            <Badge variant="secondary">
                                {val !== undefined && val !== null ? val : "N/A"}
                            </Badge>
                        );
                    },

                },
                {
                    id: "Class Detail",
                    size: 140,
                    header: () => (
                        <p className="column-title">Class Detail</p>
                    ),
                    cell: ({ row }) => (
                        <ShowButton
                            resource="classes"
                            recordItemId={row.original.id}
                            variant="outline"

                        >
                            View
                        </ShowButton>
                    ),
                }
            ],
            []
        ),
    });

    return (
        <ListView>
            <Breadcrumb />
            <h1 className="page-title">Classes</h1>
            <div className="intro-row flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <p className="text-muted-foreground">
                    Manage your Classes, Subjects and Teachers
                </p>

                <div className="action-row flex items-start gap-4">
                    {/* Search Field with Debounced Input */}
                    <div className="search-field relative w-full md:w-72">
                        <Search className="search-icon absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="search by name..."
                            className="w-full pl-10"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                        />
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Dynamic Subject Select Dropdown */}
                        <Select
                            value={selectedSubject}
                            onValueChange={setSelectedSubject}
                        >
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="All subject ..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All subject</SelectItem>
                                {subjectOptions.map((subject) => (
                                    <SelectItem
                                        key={subject.value}
                                        value={String(subject.value)}
                                    >
                                        {subject.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <div className="flex flex-row items-center gap-3">
                            {/* Dynamic Teacher Select Dropdown */}
                            <Select
                                value={selectedTeacher}
                                onValueChange={setSelectedTeacher}
                            >
                                <SelectTrigger className="w-[200px]">
                                    <SelectValue placeholder="All Teacher ..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        All Teacher
                                    </SelectItem>
                                    {teacherOptions.map((teacher) => (
                                        <SelectItem
                                            key={teacher.value}
                                            value={String(teacher.value)}
                                        >
                                            {teacher.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <CreateButton />
                        </div>
                    </div>
                </div>
            </div>
            <DataTable table={classtable} />
        </ListView>
    );
};

export default ClassesList;