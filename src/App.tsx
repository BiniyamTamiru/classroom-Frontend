import { Refine } from "@refinedev/core";

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
} from "@refinedev/react-router";

import Dashboard from "./pages/Dashboard";
import { Layout } from "./components/refine-ui/layout/layout";

import SubjectList from "./pages/Subjects/list";
import SubjectCreate from "./pages/Subjects/create";

import ClassList from "./pages/classes/list";
import ClassCreate from "./pages/classes/create";

import dataProvider from "./providers/data";

import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";

import {
    BookOpen,
    GraduationCap,
    Home,
} from "lucide-react";

import "./App.css";

function App() {
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ThemeProvider>
                    <DevtoolsProvider>
                        <Refine
                            dataProvider={dataProvider}
                            notificationProvider={useNotificationProvider()}
                            routerProvider={routerProvider}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                                projectId: "Yq9tLZ-lgLIR5-DYD5i",
                            }}
                            resources={[
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
                                    meta: {
                                        label: "Classes",
                                        icon: <GraduationCap />,
                                    },
                                },
                            ]}
                        >
                            <Routes>
                                <Route
                                    element={
                                        <Layout>
                                            <Outlet />
                                        </Layout>
                                    }
                                >
                                    {/* Dashboard */}
                                    <Route
                                        path="/"
                                        element={<Dashboard />}
                                    />

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