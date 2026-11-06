import React from "react";
import { Link } from "react-router";
import { useList } from "@refinedev/core";

type StudentRow = {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    classCount: number;
    latestEnrollmentAt?: string | null;
};

const TeacherStudentsList = () => {
    const {
        result: { data: students, total },
        query: { isLoading, isError },
    } = useList<StudentRow>({
        resource: "teacher-students",
        pagination: {
            currentPage: 1,
            pageSize: 10,
        },
    });

    if (isLoading) {
        return (
            <div className="p-6 text-center">
                Loading students...
            </div>
        );
    }

    if (isError) {
        return (
            <div className="p-6 text-center text-red-500">
                Failed to load students. Please try again.
            </div>
        );
    }

    return (
        <div className="space-y-6 p-6">
            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Students
                </h1>

                <p className="text-sm text-muted-foreground">
                    View and manage students enrolled in your classes.
                </p>
            </div>

            {/* Students Table */}
            <div className="overflow-hidden rounded-lg border">
                <table className="w-full">
                    <thead className="bg-muted">
                    <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold">
                            Student
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">
                            Email
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">
                            Classes
                        </th>

                        <th className="px-4 py-3 text-left text-sm font-semibold">
                            Action
                        </th>
                    </tr>
                    </thead>

                    <tbody>
                    {students.length > 0 ? (
                        students.map((student) => (
                            <tr
                                key={student.id}
                                className="border-t transition-colors hover:bg-muted/50"
                            >
                                {/* Student Information */}
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        {student.image ? (
                                            <img
                                                src={student.image}
                                                alt={student.name}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-semibold">
                                                {student.name?.charAt(0).toUpperCase() || "S"}
                                            </div>
                                        )}

                                        <span className="font-medium">
                        {student.name}
                      </span>
                                    </div>
                                </td>

                                {/* Email */}
                                <td className="px-4 py-3 text-sm">
                                    {student.email}
                                </td>

                                {/* Class Count */}
                                <td className="px-4 py-3 text-sm">
                                    {student.classCount}
                                </td>

                                {/* View Details */}
                                <td className="px-4 py-3">
                                    <Link
                                        to={`/teacher/students/show/${student.id}`}
                                        className="font-medium text-primary hover:underline"
                                    >
                                        View Details
                                    </Link>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={4}
                                className="px-4 py-10 text-center text-muted-foreground"
                            >
                                No students found.
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>

            {/* Total Students */}
            <p className="text-sm text-muted-foreground">
                Total students: {total ?? students.length}
            </p>
        </div>
    );
};

export default TeacherStudentsList;