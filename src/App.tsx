import { Authenticated, Refine, useGetIdentity } from "@refinedev/core";
import {
    DevtoolsPanel,
    DevtoolsProvider,
} from "@refinedev/devtools";
import {
    RefineKbar,
    RefineKbarProvider,
} from "@refinedev/kbar";
import {
    BrowserRouter,
    Route,
    Routes,
    Outlet,
    Navigate,
} from "react-router";

import routerProvider, {
    UnsavedChangesNotifier,
    DocumentTitleHandler,
    CatchAllNavigate,
} from "@refinedev/react-router";

import Dashboard from "./pages/Dashboard";
import StudentDashboard from "./pages/dashboard/student";
import TeacherDashboard from "./pages/dashboard/teacher";
import Home from "./pages/Home";
import { Layout } from "./components/refine-ui/layout/layout";

import SubjectList from "./pages/Subjects/list";
import SubjectCreate from "./pages/Subjects/create";
import SubjectEdit from "./pages/Subjects/edit";
import SubjectShow from "./pages/Subjects/show";

import ClassList from "./pages/classes/list";
import ClassCreate from "./pages/classes/create";
import ClassShow from "./pages/classes/show";

import SignIn from "./pages/authentication/signIn";
import SignUp from "@/pages/authentication/signUp.tsx";

import UserList from "./pages/users/list.tsx";
import UserCreate from "./pages/users/create.tsx";
import UserEdit from "./pages/users/edit.tsx";
import UserShow from "./pages/users/show.tsx";
import DepartmentsList from "./pages/departments/list";
import DepartmentCreate from "./pages/departments/create";
import DepartmentEdit from "./pages/departments/edit";
import DepartmentShow from "./pages/departments/show";

import dataProvider from "./providers/data";
import { authProvider } from "./providers/auth";

import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";

import {
    BookOpen,
    GraduationCap,
    Home as HomeIcon,
    Building2,
    Users,
    ClipboardList,
} from "lucide-react";
import EnrollmentList from "./pages/enrollments/list";
import EnrollmentCreate from "./pages/enrollments/create";
import EnrollmentEdit from "./pages/enrollments/edit";
import EnrollmentShow from "./pages/enrollments/show";

import TeacherClassesList from "./pages/teacher/classes/list";
import TeacherClassesShow from "./pages/teacher/classes/show";
import TeacherStudentsList from "./pages/teacher/students/list";
import TeacherStudentsShow from "./pages/teacher/students/show";
import TeacherSubjectsList from "./pages/teacher/subjects/list";
import TeacherSubjectsShow from "./pages/teacher/subjects/show";
import TeacherEnrollmentsList from "./pages/teacher/enrollments/list";
import TeacherEnrollmentsShow from "./pages/teacher/enrollments/show";
import TeacherProfilePage from "./pages/teacher/profile";

import StudentClassesPage from "./pages/student/classes";
import StudentClassDetailPage from "./pages/student/class-detail";
import StudentBrowseClassesPage from "./pages/student/browse-classes";
import StudentSubjectsPage from "./pages/student/subjects";
import StudentEnrollmentsPage from "./pages/student/enrollments";
import StudentProfilePage from "./pages/student/profile";
import {
    getDashboardPath,
    type ClassroomRole,
    type HomeIdentity,
} from "./components/home/home-navigation";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ThemeProvider>
                    <DevtoolsProvider>
                        <Refine
                            dataProvider={dataProvider}
                            authProvider={authProvider}
                            notificationProvider={useNotificationProvider()}
                            routerProvider={routerProvider}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                                projectId: "Yq9tLZ-lgLIR5-DYD5i",
                            }}
                            resources={[
                                {
                                    name: "users",
                                    list: "/users",
                                    create: "/users/create",
                                    edit: "/users/edit/:id",
                                    show: "/users/show/:id",
                                    meta: {
                                        label: "Users",
                                        icon: <Users />,
                                    },
                                },
                                {
                                    name: "dashboard",
                                    list: "/dashboard",
                                    meta: {
                                        label: "Dashboard",
                                        icon: <HomeIcon />,
                                    },
                                },
                                {
                                    name: "subjects",
                                    list: "/subjects",
                                    create: "/subjects/create",
                                    edit: "/subjects/edit/:id",
                                    show: "/subjects/show/:id",
                                    meta: {
                                        label: "Subjects",
                                        icon: <BookOpen />,
                                    },
                                },
                                {
                                    name: "departments",
                                    list: "/departments",
                                    create: "/departments/create",
                                    edit: "/departments/edit/:id",
                                    show: "/departments/show/:id",
                                    meta: {
                                        label: "Departments",
                                        icon: <Building2 />,
                                    },
                                },
                                {
                                    name: "classes",
                                    list: "/classes",
                                    create: "/classes/create",
                                    show: "/classes/show/:id",
                                    meta: {
                                        label: "Classes",
                                        icon: <GraduationCap />,
                                    },
                                },
                                {
                                    name: "enrollments",
                                    list: "/enrollments",
                                    create: "/enrollments/create",
                                    edit: "/enrollments/edit/:id",
                                    show: "/enrollments/show/:id",
                                    meta: {
                                        label: "Enrollments",
                                        icon: <ClipboardList />,
                                    },
                                },
                                {
                                    name: "teacher-classes",
                                    list: "/teacher/classes",
                                    show: "/teacher/classes/show/:id",
                                    meta: { label: "My Classes", icon: <GraduationCap /> },
                                },
                                {
                                    name: "teacher-students",
                                    list: "/teacher/students",
                                    show: "/teacher/students/show/:id",
                                    meta: { label: "My Students", icon: <Users /> },
                                },
                                {
                                    name: "teacher-subjects",
                                    list: "/teacher/subjects",
                                    show: "/teacher/subjects/show/:id",
                                    meta: { label: "My Subjects", icon: <BookOpen /> },
                                },
                                {
                                    name: "teacher-enrollments",
                                    list: "/teacher/enrollments",
                                    show: "/teacher/enrollments/show/:id",
                                    meta: { label: "Enrollments", icon: <ClipboardList /> },
                                },
                                {
                                    name: "teacher-profile",
                                    list: "/teacher/profile",
                                    meta: { label: "My Profile", icon: <Users /> },
                                },
                            ]}
                            accessControlProvider={{
                                can: async ({ resource }) => {
                                    if (resource === "users") {
                                        const identity = await authProvider.getIdentity?.();
                                        return {
                                            can:
                                                identity !== null &&
                                                identity !== undefined &&
                                                typeof identity === "object" &&
                                                "role" in identity &&
                                                identity.role === "admin",
                                        };
                                    }

                                    return { can: true };
                                },
                                options: {
                                    buttons: {
                                        hideIfUnauthorized: true,
                                    },
                                },
                            }}
                        >
                            <Routes>
                                <Route path="/" element={<Home />} />

                                {/* Public routes */}
                                <Route
                                    path="/sign-in"
                                    element={<SignIn />}
                                />

                                <Route
                                    path="/signUp"
                                    element={<SignUp />}
                                />

                                {/* Protected routes */}
                                <Route
                                    element={
                                        <Authenticated
                                            key="protected-routes"
                                            fallback={
                                                <CatchAllNavigate to="/sign-in" />
                                            }
                                        >
                                            <Layout>
                                                <Outlet />
                                            </Layout>
                                        </Authenticated>
                                    }
                                >
                                    <Route
                                        path="/dashboard"
                                        element={<DashboardRedirect />}
                                    />
                                    <Route
                                        path="/dashboard/admin"
                                        element={<RoleDashboard requiredRole="admin" />}
                                    />
                                    <Route
                                        path="/dashboard/teacher"
                                        element={<RoleDashboard requiredRole="teacher" />}
                                    />
                                    <Route
                                        path="/dashboard/student"
                                        element={<RoleDashboard requiredRole="student" />}
                                    />

                                    {/* Users */}
                                    <Route element={<RequireRole role="admin" />}>
                                        <Route path="/users">
                                            <Route
                                                index
                                                element={<UserList />}
                                            />

                                            <Route
                                                path="create"
                                                element={<UserCreate />}
                                            />

                                            <Route
                                                path="edit/:id"
                                                element={<UserEdit />}
                                            />

                                            <Route
                                                path="show/:id"
                                                element={<UserShow />}
                                            />
                                        </Route>
                                    </Route>

                                    {/* Subjects */}
                                    <Route path="/subjects">
                                        <Route
                                            index
                                            element={<SubjectList />}
                                        />

                                        <Route
                                            path="create"
                                            element={<SubjectCreate />}
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={<SubjectEdit />}
                                        />
                                        <Route
                                            path="show/:id"
                                            element={<SubjectShow />}
                                        />
                                    </Route>

                                    {/* Departments */}
                                    <Route path="/departments">
                                        <Route
                                            index
                                            element={<DepartmentsList />}
                                        />
                                        <Route
                                            path="create"
                                            element={<DepartmentCreate />}
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={<DepartmentEdit />}
                                        />
                                        <Route
                                            path="show/:id"
                                            element={<DepartmentShow />}
                                        />
                                    </Route>

                                    {/* Classes */}
                                    <Route path="/classes">
                                        <Route
                                            index
                                            element={<ClassList />}
                                        />

                                        <Route
                                            path="create"
                                            element={<ClassCreate />}
                                        />

                                        <Route
                                            path="show/:id"
                                            element={<ClassShow />}
                                        />
                                    </Route>

                                    {/* Enrollments */}
                                    <Route path="/enrollments">
                                        <Route
                                            index
                                            element={<EnrollmentList />}
                                        />
                                        <Route
                                            path="create"
                                            element={<EnrollmentCreate />}
                                        />
                                        <Route
                                            path="edit/:id"
                                            element={<EnrollmentEdit />}
                                        />
                                        <Route
                                            path="show/:id"
                                            element={<EnrollmentShow />}
                                        />
                                    </Route>

                                    {/* Teacher Workspace */}
                                    <Route element={<RequireRole role="teacher" />}>
                                        <Route path="/teacher/classes" element={<TeacherClassesList />} />
                                        <Route path="/teacher/classes/show/:id" element={<TeacherClassesShow />} />

                                        <Route path="/teacher/students" element={<TeacherStudentsList />} />
                                        <Route path="/teacher/students/show/:id" element={<TeacherStudentsShow />} />

                                        <Route path="/teacher/subjects" element={<TeacherSubjectsList />} />
                                        <Route path="/teacher/subjects/show/:id" element={<TeacherSubjectsShow />} />

                                        <Route path="/teacher/enrollments" element={<TeacherEnrollmentsList />} />
                                        <Route path="/teacher/enrollments/show/:id" element={<TeacherEnrollmentsShow />} />

                                        <Route path="/teacher/profile" element={<TeacherProfilePage />} />
                                    </Route>

                                    {/* Student Workspace */}
                                    <Route element={<RequireRole role="student" />}>
                                        <Route path="/student/classes" element={<StudentClassesPage />} />
                                        <Route path="/student/classes/:id" element={<StudentClassDetailPage />} />
                                        <Route path="/student/browse-classes" element={<StudentBrowseClassesPage />} />
                                        <Route path="/student/subjects" element={<StudentSubjectsPage />} />
                                        <Route path="/student/enrollments" element={<StudentEnrollmentsPage />} />
                                        <Route path="/student/profile" element={<StudentProfilePage />} />
                                    </Route>
                                </Route>
                            </Routes>

                            <Toaster />
                            <RefineKbar />
                            <UnsavedChangesNotifier />
                            <DocumentTitleHandler />
                            <DevtoolsPanel />
                        </Refine>
                    </DevtoolsProvider>
                </ThemeProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

function DashboardRedirect() {
    const { data: identity, isLoading } = useGetIdentity<HomeIdentity>();

    if (isLoading) {
        return <div className="p-8 text-sm text-muted-foreground">Loading your dashboard...</div>;
    }

    if (!identity) {
        return <Navigate to="/sign-in" replace />;
    }

    return <Navigate to={getDashboardPath(identity.role)} replace />;
}

type RoleDashboardProps = {
    requiredRole: ClassroomRole;
};

function RoleDashboard({ requiredRole }: RoleDashboardProps) {
    const { data: identity, isLoading } = useGetIdentity<HomeIdentity>();

    if (isLoading) {
        return <div className="p-8 text-sm text-muted-foreground">Loading your dashboard...</div>;
    }

    if (!identity) {
        return <Navigate to="/sign-in" replace />;
    }

    if (!identity.role) {
        return <Navigate to="/" replace />;
    }

    if (identity.role !== requiredRole) {
        return <Navigate to={getDashboardPath(identity.role)} replace />;
    }

    if (identity.role === "admin") {
        return <Dashboard />;
    }

    return identity.role === "student"
        ? <StudentDashboard />
        : <TeacherDashboard />;
}

type RequireRoleProps = {
    role: ClassroomRole;
};

function RequireRole({ role }: RequireRoleProps) {
    const { data: identity, isLoading } = useGetIdentity<HomeIdentity>();

    if (isLoading) {
        return <div className="p-8 text-sm text-muted-foreground">Checking access...</div>;
    }

    if (identity?.role !== role) {
        return <Navigate to={identity ? getDashboardPath(identity.role) : "/sign-in"} replace />;
    }

    return <Outlet />;
}

export default App;