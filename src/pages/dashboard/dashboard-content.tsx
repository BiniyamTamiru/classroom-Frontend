
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useCustom, type HttpError } from "@refinedev/core";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clock3,
  GraduationCap,
  LoaderCircle,
  Mail,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BACKEND_BASE_URL } from "@/components/constant";
import type { HomeIdentity } from "@/components/home/home-navigation";

type Profile = {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "student" | "teacher";
  createdAt: string;
};

type SubjectInfo = {
  id: number;
  name: string;
  code: string;
  department: { id: number; name: string };
  classes: Array<{ id: number; name: string; status: string }>;
};

type StudentDashboardData = {
  profile: Profile;
  statistics: {
    totalEnrolledClasses: number;
    totalSubjects: number;
    activeEnrollments: number;
  };
  classes: Array<{
    id: number;
    name: string;
    status: string;
    enrolledAt: string;
    subject: {
      id: number;
      name: string;
      code: string;
      department: { id: number; name: string };
    };
    teacher: { name: string } | null;
  }>;
  subjects: SubjectInfo[];
  recentActivity: Array<{
    id: number;
    classId: number;
    className: string;
    subjectName: string;
    subjectCode: string;
    enrolledAt: string;
  }>;
};

type TeacherDashboardData = {
  profile: Profile;
  statistics: {
    totalTeachingClasses: number;
    totalEnrolledStudents: number;
    totalSubjects: number;
    activeClasses: number;
  };
  classes: Array<{
    id: number;
    name: string;
    status: string;
    subjectId: number;
    subjectName: string;
    subjectCode: string;
    departmentId: number;
    departmentName: string;
    enrolledStudents: number;
  }>;
  subjects: SubjectInfo[];
  students: {
    data: Array<{
      studentId: string;
      studentName: string;
      studentEmail: string;
      classes: Array<{ id: number; name: string; enrolledAt: string }>;
    }>;
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  recentActivity: Array<{
    id: number;
    studentName: string;
    classId: number;
    className: string;
    enrolledAt: string;
  }>;
};

type DashboardRole = "student" | "teacher";
type DashboardData = StudentDashboardData | TeacherDashboardData;

type DashboardResponse = {
  data: DashboardData;
};

const isTeacherData = (
    data: DashboardData
): data is TeacherDashboardData => "students" in data;

export function DashboardContent({
                                   role,
                                   identity,
                                 }: {
  role: DashboardRole;
  identity?: HomeIdentity;
}) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(
        () => setSearch(searchValue.trim()),
        250
    );

    return () => window.clearTimeout(timer);
  }, [searchValue]);

  useEffect(() => {
    setPage(1);
  }, [search]);

  const dashboardQuery = useCustom<
      DashboardResponse,
      HttpError,
      {
        page?: number;
        limit?: number;
        search?: string;
      }
  >({
    url: `${BACKEND_BASE_URL}/dashboard/${role}`,
    method: "get",
    config: {
      query:
          role === "teacher"
              ? { page, limit: 8, search }
              : {},
    },
    queryOptions: {
      retry: 1,
    },
  });

  const data = dashboardQuery.result.data?.data;

  if (dashboardQuery.query.isError) {
    return (
        <section className="mx-auto w-full max-w-6xl rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <p className="font-semibold">
            We couldn&apos;t load your dashboard
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            {dashboardQuery.query.error?.message ??
                "Unable to load your dashboard."}
          </p>

          <Button
              className="mt-5"
              variant="outline"
              onClick={() => void dashboardQuery.query.refetch()}
          >
            Try again
          </Button>
        </section>
    );
  }

  if (dashboardQuery.query.isLoading || !data) {
    return <DashboardSkeleton />;
  }

  const teacherData = isTeacherData(data) ? data : undefined;
  const studentData = isTeacherData(data) ? undefined : data;

  const profile = data.profile;
  const firstName =
      profile.name.trim().split(/\s+/)[0] || profile.name;

  const stats = isTeacherData(data)
      ? [
        {
          label: "Teaching classes",
          value: data.statistics.totalTeachingClasses,
          icon: GraduationCap,
          tone: "text-blue-600 bg-blue-500/10",
        },
        {
          label: "Enrolled students",
          value: data.statistics.totalEnrolledStudents,
          icon: Users,
          tone: "text-violet-600 bg-violet-500/10",
        },
        {
          label: "Subjects taught",
          value: data.statistics.totalSubjects,
          icon: BookOpen,
          tone: "text-emerald-600 bg-emerald-500/10",
        },
        {
          label: "Active classes",
          value: data.statistics.activeClasses,
          icon: CheckCircle2,
          tone: "text-amber-600 bg-amber-500/10",
        },
      ]
      : [
        {
          label: "Enrolled classes",
          value: data.statistics.totalEnrolledClasses,
          icon: GraduationCap,
          tone: "text-blue-600 bg-blue-500/10",
        },
        {
          label: "Subjects",
          value: data.statistics.totalSubjects,
          icon: BookOpen,
          tone: "text-violet-600 bg-violet-500/10",
        },
        {
          label: "Active enrollments",
          value: data.statistics.activeEnrollments,
          icon: CheckCircle2,
          tone: "text-emerald-600 bg-emerald-500/10",
        },
      ];

  return (
      <div
          id="overview"
          className="mx-auto w-full max-w-6xl space-y-8 pb-12"
      >
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-indigo-950 to-blue-900 px-6 py-8 text-white shadow-lg sm:px-9 sm:py-10">
          <div className="pointer-events-none absolute -right-16 -top-32 size-80 rounded-full border border-white/10" />

          <div className="pointer-events-none absolute -bottom-40 right-24 size-72 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="relative flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-blue-100/80">
                {role === "student"
                    ? "Student workspace"
                    : "Teacher workspace"}
              </p>

              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Welcome back, {firstName}
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100/80 sm:text-base">
                {role === "student"
                    ? "Every class is a new opportunity to learn something remarkable. Keep up your great work."
                    : "Your guidance helps students grow. Here is what is happening across your classrooms."}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-blue-100/80">
              <span className="inline-flex items-center gap-2">
                <Mail className="size-4" />
                {profile.email}
              </span>

                <span className="inline-flex items-center gap-2">
                <CalendarDays className="size-4" />
                  {formatDate(new Date())}
              </span>
              </div>
            </div>

            <ProfileAvatar
                name={profile.name}
                image={profile.image ?? identity?.avatar}
                className="size-16 shrink-0 border-2 border-white/20 sm:size-20"
            />
          </div>
        </section>

        <section
            className={`grid gap-4 ${
                stats.length === 4
                    ? "sm:grid-cols-2 xl:grid-cols-4"
                    : "sm:grid-cols-3"
            }`}
        >
          {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        {studentData ? (
            <StudentSections data={studentData} profile={profile} />
        ) : teacherData ? (
            <TeacherSections
                data={teacherData}
                profile={profile}
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                page={page}
                onPageChange={setPage}
            />
        ) : null}
      </div>
  );
}

function StudentSections({
                           data,
                           profile,
                         }: {
  data: StudentDashboardData;
  profile: Profile;
}) {
  return (
      <>
        <section id="classes" className="space-y-4">
          <SectionHeading
              title="My classes"
              description="Your current classroom community."
              actionLabel="Explore classes"
              actionHref="/classes"
          />

          {data.classes.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.classes.map((classItem) => (
                    <article
                        key={classItem.id}
                        className="group rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="size-5" />
                  </span>

                        <StatusBadge status={classItem.status} />
                      </div>

                      <h3 className="mt-4 text-lg font-semibold">
                        {classItem.name}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {classItem.subject.name} · {classItem.subject.code}
                      </p>

                      <p className="mt-3 text-sm text-muted-foreground">
                        {classItem.teacher?.name
                            ? `Teacher: ${classItem.teacher.name}`
                            : classItem.subject.department.name}
                      </p>

                      <Button asChild variant="outline" className="mt-5 w-full">
                        <Link to={`/classes/show/${classItem.id}`}>
                          View class
                          <ArrowUpRight className="ml-2 size-4" />
                        </Link>
                      </Button>
                    </article>
                ))}
              </div>
          ) : (
              <EmptyState
                  title="No classes yet"
                  detail="When you enroll in a class, it will appear here."
              />
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section
              id="subjects"
              className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6"
          >
            <SectionHeading
                title="My subjects"
                description="Subjects connected to your classes."
                actionLabel="Browse subjects"
                actionHref="/subjects"
            />

            {data.subjects.length ? (
                <div className="mt-5 divide-y">
                  {data.subjects.map((subject) => (
                      <div
                          key={subject.id}
                          className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                      >
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                    <BookOpen className="size-5" />
                  </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{subject.name}</p>
                            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                        {subject.code}
                      </span>
                          </div>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {subject.department.name}
                          </p>

                          <p className="mt-2 text-xs text-muted-foreground">
                            Related classes:
                          </p>

                          <div className="mt-1 flex flex-wrap gap-2">
                            {subject.classes.map((classItem) => (
                                <Link
                                    key={classItem.id}
                                    to={`/classes/show/${classItem.id}`}
                                    className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                                >
                                  {classItem.name}
                                </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <EmptyState
                    title="No subjects yet"
                    detail="Subjects appear here when you are enrolled in a class."
                />
            )}
          </section>

          <section
              id="activity"
              className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6"
          >
            <SectionHeading
                title="Recent enrollment activity"
                description="Your latest class enrollments."
            />

            {data.recentActivity.length ? (
                <div className="mt-5 space-y-4">
                  {data.recentActivity.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock3 className="size-4" />
                  </span>

                        <div className="min-w-0 flex-1">
                          <Link
                              to={`/classes/show/${item.classId}`}
                              className="font-medium text-primary underline-offset-4 hover:underline"
                          >
                            {item.className}
                          </Link>

                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {item.subjectName} · {item.subjectCode}
                          </p>

                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatDate(item.enrolledAt)}
                          </p>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <EmptyState
                    title="No recent activity"
                    detail="Your enrollment history will show here."
                />
            )}
          </section>
        </div>

        <ProfileAndActions profile={profile} role="student" />
      </>
  );
}

function TeacherSections({
                           data,
                           profile,
                           searchValue,
                           onSearchChange,
                           page,
                           onPageChange,
                         }: {
  data: TeacherDashboardData;
  profile: Profile;
  searchValue: string;
  onSearchChange: (value: string) => void;
  page: number;
  onPageChange: (value: number) => void;
}) {
  return (
      <>
        <section id="classes" className="space-y-4">
          <SectionHeading
              title="My classes"
              description="Assigned classrooms, subjects, and current enrollment."
              actionLabel="Browse classes"
              actionHref="/classes"
          />

          {data.classes.length ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {data.classes.map((classItem) => (
                    <article
                        key={classItem.id}
                        className="rounded-2xl border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                  <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <GraduationCap className="size-5" />
                  </span>

                        <StatusBadge status={classItem.status} />
                      </div>

                      <h3 className="mt-4 text-lg font-semibold">
                        {classItem.name}
                      </h3>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {classItem.subjectName} · {classItem.subjectCode}
                      </p>

                      <p className="mt-3 text-sm text-muted-foreground">
                        {classItem.departmentName}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t pt-4 text-sm">
                  <span className="inline-flex items-center gap-2 text-muted-foreground">
                    <Users className="size-4" />
                    Students
                  </span>

                        <span className="font-semibold">
                    {classItem.enrolledStudents}
                  </span>
                      </div>

                      <Button
                          asChild
                          variant="outline"
                          className="mt-4 w-full"
                      >
                        <Link to={`/classes/show/${classItem.id}`}>
                          View class
                          <ArrowUpRight className="ml-2 size-4" />
                        </Link>
                      </Button>
                    </article>
                ))}
              </div>
          ) : (
              <EmptyState
                  title="No assigned classes"
                  detail="Classes assigned to you will appear here."
              />
          )}
        </section>

        <section
            id="students"
            className="rounded-2xl border bg-card shadow-sm"
        >
          <div className="flex flex-col gap-4 border-b p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                My students
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Students enrolled in your classes.
              </p>
            </div>

            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                  value={searchValue}
                  onChange={(event) => onSearchChange(event.target.value)}
                  placeholder="Search students or classes"
                  className="pl-9"
                  aria-label="Search students or classes"
              />
            </div>
          </div>

          {data.students.data.length ? (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[700px] text-left text-sm">
                    <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-5 py-3 font-medium">Student</th>
                      <th className="px-5 py-3 font-medium">
                        Related classes and enrollment dates
                      </th>
                    </tr>
                    </thead>

                    <tbody className="divide-y">
                    {data.students.data.map((student) => (
                        <tr
                            key={student.studentId}
                            className="transition-colors hover:bg-muted/30"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium">
                              {student.studentName}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {student.studentEmail}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <div className="space-y-2">
                              {student.classes.map((classItem) => (
                                  <div
                                      key={classItem.id}
                                      className="flex flex-wrap items-center justify-between gap-2"
                                  >
                                    <Link
                                        to={`/classes/show/${classItem.id}`}
                                        className="font-medium text-primary underline-offset-4 hover:underline"
                                    >
                                      {classItem.name}
                                    </Link>

                                    <span className="text-xs text-muted-foreground">
                                {formatDate(classItem.enrolledAt)}
                              </span>
                                  </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-3 border-t px-5 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
              <span>
                {data.students.pagination.total} unique student
                {data.students.pagination.total === 1 ? "" : "s"}
              </span>

                  <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                    >
                      <ChevronLeft className="mr-1 size-4" />
                      Previous
                    </Button>

                    <span>
                  Page {page} of{" "}
                      {Math.max(
                          data.students.pagination.totalPages,
                          1
                      )}
                </span>

                    <Button
                        size="sm"
                        variant="outline"
                        disabled={
                            page >= data.students.pagination.totalPages
                        }
                        onClick={() => onPageChange(page + 1)}
                    >
                      Next
                      <ChevronRight className="ml-1 size-4" />
                    </Button>
                  </div>
                </div>
              </>
          ) : (
              <div className="p-6">
                <EmptyState
                    title={
                      searchValue
                          ? "No matching students"
                          : "No students enrolled"
                    }
                    detail={
                      searchValue
                          ? "Try a different search term."
                          : "Students enrolled in your classes will appear here."
                    }
                />
              </div>
          )}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <section
              id="subjects"
              className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6"
          >
            <SectionHeading
                title="My subjects"
                description="Subjects connected to your classes."
                actionLabel="Browse subjects"
                actionHref="/subjects"
            />

            {data.subjects.length ? (
                <div className="mt-5 divide-y">
                  {data.subjects.map((subject) => (
                      <div
                          key={subject.id}
                          className="flex items-start gap-3 py-4 first:pt-0 last:pb-0"
                      >
                  <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600">
                    <BookOpen className="size-5" />
                  </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-medium">{subject.name}</p>
                            <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium">
                        {subject.code}
                      </span>
                          </div>

                          <p className="mt-1 text-sm text-muted-foreground">
                            {subject.department.name}
                          </p>

                          <p className="mt-2 text-xs text-muted-foreground">
                            Related classes:
                          </p>

                          <div className="mt-1 flex flex-wrap gap-2">
                            {subject.classes.map((classItem) => (
                                <Link
                                    key={classItem.id}
                                    to={`/classes/show/${classItem.id}`}
                                    className="text-xs font-medium text-primary underline-offset-4 hover:underline"
                                >
                                  {classItem.name}
                                </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <EmptyState
                    title="No subjects assigned"
                    detail="Subjects linked to your classes will appear here."
                />
            )}
          </section>

          <section
              id="activity"
              className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6"
          >
            <SectionHeading
                title="Recent enrollment activity"
                description="Latest enrollments in your classrooms."
                actionLabel="View enrollments"
                actionHref="/enrollments"
            />

            {data.recentActivity.length ? (
                <div className="mt-5 space-y-4">
                  {data.recentActivity.map((item) => (
                      <div key={item.id} className="flex items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Clock3 className="size-4" />
                  </span>

                        <div className="min-w-0 flex-1">
                          <p className="font-medium">{item.studentName}</p>
                          <p className="mt-0.5 text-sm text-muted-foreground">
                            {item.className}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {formatDate(item.enrolledAt)}
                          </p>
                        </div>
                      </div>
                  ))}
                </div>
            ) : (
                <EmptyState
                    title="No recent activity"
                    detail="Enrollment activity for your classes will show here."
                />
            )}
          </section>
        </div>

        <ProfileAndActions profile={profile} role="teacher" />
      </>
  );
}

function ProfileAndActions({
                             profile,
                             role,
                           }: {
  profile: Profile;
  role: DashboardRole;
}) {
  const actions = [
    {
      label:
          role === "student" ? "Explore classes" : "View my classes",
      href: role === "student" ? "/classes" : "#classes",
      icon: GraduationCap,
    },
    {
      label:
          role === "student" ? "View my enrollments" : "View my students",
      href: role === "student" ? "/enrollments" : "#students",
      icon: Users,
    },
    {
      label: "View my subjects",
      href: "#subjects",
      icon: BookOpen,
    },
    ...(role === "teacher"
        ? [
          {
            label: "View enrollments",
            href: "/enrollments",
            icon: CheckCircle2,
          },
        ]
        : []),
    {
      label: "View profile",
      href: "#profile",
      icon: CircleUserRound,
    },
  ];

  return (
      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <section
            id="profile"
            className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6"
        >
          <h2 className="text-lg font-semibold tracking-tight">
            Profile summary
          </h2>

          <div className="mt-5 flex items-center gap-4">
            <ProfileAvatar
                name={profile.name}
                image={profile.image}
                className="size-14"
            />

            <div className="min-w-0">
              <p className="truncate font-semibold">{profile.name}</p>
              <p className="truncate text-sm text-muted-foreground">
                {profile.email}
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3 border-t pt-4 text-sm">
            <div className="flex justify-between gap-3">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium capitalize">
              {profile.role}
            </span>
            </div>

            <div className="flex justify-between gap-3">
            <span className="text-muted-foreground">
              Account created
            </span>
              <span className="font-medium">
              {formatDate(profile.createdAt)}
            </span>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-semibold tracking-tight">
            Quick actions
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Jump back into your academic workspace.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {actions.map(({ label, href, icon: Icon }) => (
                <Button
                    key={label}
                    asChild
                    variant="outline"
                    className="h-auto justify-between gap-3 py-3 text-left"
                >
                  <Link to={href}>
                <span className="flex items-center gap-3">
                  <Icon className="size-4 shrink-0 text-primary" />
                  <span>{label}</span>
                </span>

                    <ArrowUpRight className="size-4 shrink-0 text-muted-foreground" />
                  </Link>
                </Button>
            ))}
          </div>
        </section>
      </div>
  );
}

function SectionHeading({
                          title,
                          description,
                          actionLabel,
                          actionHref,
                        }: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            {title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        {actionLabel && actionHref && (
            <Button asChild variant="ghost" size="sm">
              <Link to={actionHref}>
                {actionLabel}
                <ArrowUpRight className="ml-1 size-4" />
              </Link>
            </Button>
        )}
      </div>
  );
}

function StatCard({
                    label,
                    value,
                    icon: Icon,
                    tone,
                  }: {
  label: string;
  value: number;
  icon: LucideIcon;
  tone: string;
}) {
  return (
      <article className="rounded-2xl border bg-card p-5 shadow-sm transition hover:shadow-md">
        <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>

          <span
              className={`flex size-10 items-center justify-center rounded-xl ${tone}`}
          >
          <Icon className="size-5" />
        </span>
        </div>

        <p className="mt-4 text-3xl font-semibold tracking-tight">
          {value.toLocaleString()}
        </p>
      </article>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isActive = status === "active";

  return (
      <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ${
              isActive
                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  : "bg-muted text-muted-foreground"
          }`}
      >
      {status}
    </span>
  );
}

function EmptyState({
                      title,
                      detail,
                    }: {
  title: string;
  detail: string;
}) {
  return (
      <div className="rounded-xl border border-dashed px-5 py-9 text-center">
      <span className="mx-auto flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <BookOpen className="size-5" />
      </span>

        <p className="mt-3 font-medium">{title}</p>

        <p className="mt-1 text-sm text-muted-foreground">
          {detail}
        </p>
      </div>
  );
}

function ProfileAvatar({
                         name,
                         image,
                         className,
                       }: {
  name: string;
  image?: string | null;
  className?: string;
}) {
  const initials = name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  return (
      <Avatar className={className}>
        <AvatarImage
            src={image ?? undefined}
            alt=""
            referrerPolicy="no-referrer"
        />
        <AvatarFallback>{initials || "U"}</AvatarFallback>
      </Avatar>
  );
}

function DashboardSkeleton() {
  return (
      <div
          className="mx-auto w-full max-w-6xl animate-pulse space-y-8 pb-12"
          aria-label="Loading dashboard"
      >
        <div className="h-52 rounded-3xl bg-muted" />

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="h-28 rounded-2xl bg-muted" />
          <div className="h-28 rounded-2xl bg-muted" />
          <div className="h-28 rounded-2xl bg-muted" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <div className="h-64 rounded-2xl bg-muted" />
          <div className="h-64 rounded-2xl bg-muted" />
          <div className="h-64 rounded-2xl bg-muted" />
        </div>

        <div className="sr-only">
          <LoaderCircle className="size-4" />
          Loading dashboard data
        </div>
      </div>
  );
}

function formatDate(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}
