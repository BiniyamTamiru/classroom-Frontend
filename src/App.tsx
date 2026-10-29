import { Authenticated, Refine } from "@refinedev/core";
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
} from "react-router";

import routerProvider, {
    UnsavedChangesNotifier,
    DocumentTitleHandler,
    CatchAllNavigate,
} from "@refinedev/react-router";
import Dashboard from "./pages/Dashboard";

import { Layout } from "./components/refine-ui/layout/layout";

import SubjectList from "./pages/Subjects/list";
import SubjectCreate from "./pages/Subjects/create";

import ClassList from "./pages/classes/list";
import ClassCreate from "./pages/classes/create";
import ClassShow from "./pages/classes/show";
import SignIn from "./pages/authentication/signIn";

import dataProvider from "./providers/data";


import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";

import {
    BookOpen,
    GraduationCap,
    Home, User, Users,
} from "lucide-react";

import "./App.css";


import SignUp from "@/pages/authentication/signUp.tsx";
import { authProvider } from "./providers/auth";
import UserList from "./pages/users/list.tsx";

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
                                  name:"users",
                                  list:"/users",
                                  meta :{
                                      label:"Users",
                                      icon:<Users />
                                  }
                                },

                                {
                                    name: "dashboard",
                                    list: "/",
                                    meta: {
                                        label: "Home",
                                        icon: <Home />,
                                    },
                                },
                                {
                                    name: "subjects",
                                    list: "/subjects",
                                    create: "/subjects/create",
                                    meta: {
                                        label: "Subjects",
                                        icon: <BookOpen />,
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
                            ]}
                        >
                            <Routes>
                                {/* 1. PUBLIC ROUTE (Unprotected) */}
                                <Route path="/sign-in" element={<SignIn />} />
                                <Route path="/signUp" element={<SignUp />} />

                                {/* 2. PROTECTED ROUTES */}
                                <Route
                                    element={
                                        <Authenticated
                                            key="protected-routes"

                                            fallback={<CatchAllNavigate to="/sign-in" />}
                                        >
                                            <Layout>
                                                <Outlet />
                                            </Layout>
                                        </Authenticated>
                                    }
                                >
                                    {/* Dashboard */}
                                    <Route path="/users" element={<UserList />}/>
                                    <Route path="/" element={<Dashboard />} />

                                    {/* Subjects */}
                                    <Route path="/subjects">
                                        <Route index element={<SubjectList />} />
                                        <Route path="create" element={<SubjectCreate />} />
                                    </Route>

                                    {/* Classes */}
                                    <Route path="/classes">
                                        <Route index element={<ClassList />} />
                                        <Route path="create" element={<ClassCreate />} />
                                        <Route path="show/:id" element={<ClassShow />} />
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

export default App;