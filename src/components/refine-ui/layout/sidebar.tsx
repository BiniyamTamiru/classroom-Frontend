"use client";

import React from "react";
import {
    useGetIdentity,
    useMenu,
    useLink,
    useRefineOptions,
    type TreeMenuItem,
} from "@refinedev/core";
import {
    SidebarRail as ShadcnSidebarRail,
    Sidebar as ShadcnSidebar,
    SidebarContent as ShadcnSidebarContent,
    SidebarHeader as ShadcnSidebarHeader,
    useSidebar as useShadcnSidebar,
    SidebarTrigger as ShadcnSidebarTrigger,
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    ChevronRight,
    ClipboardList,
    GraduationCap,
    LayoutDashboard,
    ListIcon,
    UserRound,
    Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router";

export function Sidebar() {
    const { open } = useShadcnSidebar();
    const { menuItems, selectedKey } = useMenu();
    const location = useLocation();
    const { data: identity } = useGetIdentity<{ role?: string }>();
    const role = identity?.role;

    const roleMenu: TreeMenuItem[] =
        role === "student"
            ? [
                {
                    key: "student-dashboard",
                    name: "Dashboard",
                    route: "/dashboard/student",
                    children: [],
                    meta: { label: "Dashboard", icon: <LayoutDashboard /> },
                },
                {
                    key: "student-classes",
                    name: "My Classes",
                    route: "/student/classes",
                    children: [],
                    meta: { label: "My Classes", icon: <GraduationCap /> },
                },
                {
                    key: "student-browse-classes",
                    name: "Browse Classes",
                    route: "/student/browse-classes",
                    children: [],
                    meta: { label: "Browse Classes", icon: <ListIcon /> },
                },
                {
                    key: "student-subjects",
                    name: "My Subjects",
                    route: "/student/subjects",
                    children: [],
                    meta: { label: "My Subjects", icon: <BookOpen /> },
                },
                {
                    key: "student-enrollments",
                    name: "My Enrollments",
                    route: "/student/enrollments",
                    children: [],
                    meta: { label: "My Enrollments", icon: <ClipboardList /> },
                },
                {
                    key: "student-profile",
                    name: "My Profile",
                    route: "/student/profile",
                    children: [],
                    meta: { label: "My Profile", icon: <UserRound /> },
                },
            ]
            : role === "teacher"
                ? [
                    {
                        key: "teacher-dashboard",
                        name: "Dashboard",
                        route: "/dashboard/teacher",
                        children: [],
                        meta: { label: "Dashboard", icon: <LayoutDashboard /> },
                    },
                    {
                        key: "teacher-classes",
                        name: "My Classes",
                        route: "/teacher/classes",
                        children: [],
                        meta: { label: "My Classes", icon: <GraduationCap /> },
                    },
                    {
                        key: "teacher-students",
                        name: "My Students",
                        route: "/teacher/students",
                        children: [],
                        meta: { label: "My Students", icon: <Users /> },
                    },
                    {
                        key: "teacher-subjects",
                        name: "My Subjects",
                        route: "/teacher/subjects",
                        children: [],
                        meta: { label: "My Subjects", icon: <BookOpen /> },
                    },
                    {
                        key: "teacher-enrollments",
                        name: "Enrollments",
                        route: "/teacher/enrollments",
                        children: [],
                        meta: { label: "Enrollments", icon: <ClipboardList /> },
                    },
                    {
                        key: "teacher-profile",
                        name: "My Profile",
                        route: "/teacher/profile",
                        children: [],
                        meta: { label: "My Profile", icon: <UserRound /> },
                    },
                ]
                : [];

    const visibleItems =
        role === "student" || role === "teacher"
            ? roleMenu
            : role === "admin"
                ? menuItems.filter((item) => {
                    const key = String(item.key ?? "");
                    const route = String(item.route ?? "");
                    return !key.startsWith("teacher-") && !route.startsWith("/teacher/");
                })
                : [];

    // Robust matching for parent and exact routes
    const activeRoleItem = roleMenu.find((item) => {
        if (!item.route) return false;
        if (location.pathname === item.route) return true;
        if (location.pathname.startsWith(`${item.route}/`)) return true;
        return false;
    });

    const activeKey = roleMenu.length ? activeRoleItem?.key : selectedKey;

    return (
        <ShadcnSidebar collapsible="icon" className={cn("border-none")}>
            <ShadcnSidebarRail />
            <SidebarHeader />
            <ShadcnSidebarContent
                className={cn(
                    "transition-discrete",
                    "duration-200",
                    "flex",
                    "flex-col",
                    "gap-2",
                    "pt-2",
                    "pb-2",
                    "border-r",
                    "border-border",
                    {
                        "px-3": open,
                        "px-1": !open,
                    }
                )}
            >
                {visibleItems.map((item: TreeMenuItem) => (
                    <SidebarItem
                        key={item.key || item.name}
                        item={item}
                        selectedKey={activeKey}
                    />
                ))}
            </ShadcnSidebarContent>
        </ShadcnSidebar>
    );
}

type MenuItemProps = {
    item: TreeMenuItem;
    selectedKey?: string;
};

function SidebarItem({ item, selectedKey }: MenuItemProps) {
    const { open } = useShadcnSidebar();

    if (item.meta?.group) {
        return <SidebarItemGroup item={item} selectedKey={selectedKey} />;
    }

    if (item.children && item.children.length > 0) {
        if (open) {
            return <SidebarItemCollapsible item={item} selectedKey={selectedKey} />;
        }
        return <SidebarItemDropdown item={item} selectedKey={selectedKey} />;
    }

    return <SidebarItemLink item={item} selectedKey={selectedKey} />;
}

function SidebarItemGroup({ item, selectedKey }: MenuItemProps) {
    const { children } = item;
    const { open } = useShadcnSidebar();

    return (
        <div className={cn("border-t", "border-sidebar-border", "pt-4")}>
            <span
                className={cn(
                    "ml-3",
                    "block",
                    "text-xs",
                    "font-semibold",
                    "uppercase",
                    "text-muted-foreground",
                    "transition-all",
                    "duration-200",
                    {
                        "h-8": open,
                        "h-0": !open,
                        "opacity-0": !open,
                        "opacity-100": open,
                        "pointer-events-none": !open,
                        "pointer-events-auto": open,
                    }
                )}
            >
                {getDisplayName(item)}
            </span>
            {children && children.length > 0 && (
                <div className={cn("flex", "flex-col")}>
                    {children.map((child: TreeMenuItem) => (
                        <SidebarItem
                            key={child.key || child.name}
                            item={child}
                            selectedKey={selectedKey}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function SidebarItemCollapsible({ item, selectedKey }: MenuItemProps) {
    const { name, children } = item;

    const chevronIcon = (
        <ChevronRight
            className={cn(
                "h-4",
                "w-4",
                "shrink-0",
                "text-muted-foreground",
                "transition-transform",
                "duration-200",
                "group-data-[state=open]:rotate-90"
            )}
        />
    );

    return (
        <Collapsible key={`collapsible-${name}`} className={cn("w-full", "group")}>
            <CollapsibleTrigger asChild>
                <SidebarButton item={item} rightIcon={chevronIcon} />
            </CollapsibleTrigger>
            <CollapsibleContent className={cn("ml-6", "flex", "flex-col", "gap-2")}>
                {children?.map((child: TreeMenuItem) => (
                    <SidebarItem
                        key={child.key || child.name}
                        item={child}
                        selectedKey={selectedKey}
                    />
                ))}
            </CollapsibleContent>
        </Collapsible>
    );
}

function SidebarItemDropdown({ item, selectedKey }: MenuItemProps) {
    const { children } = item;
    const Link = useLink();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <SidebarButton item={item} />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="start">
                {children?.map((child: TreeMenuItem) => {
                    const { key: childKey } = child;
                    const isSelected = childKey === selectedKey;

                    return (
                        <DropdownMenuItem key={childKey || child.name} asChild>
                            <Link
                                to={child.route || ""}
                                className={cn("flex w-full items-center gap-2", {
                                    "bg-accent text-accent-foreground": isSelected,
                                })}
                            >
                                <ItemIcon
                                    icon={child.meta?.icon ?? child.icon}
                                    isSelected={isSelected}
                                />
                                <span>{getDisplayName(child)}</span>
                            </Link>
                        </DropdownMenuItem>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

function SidebarItemLink({ item, selectedKey }: MenuItemProps) {
    const location = useLocation();
    const currentPath = location.pathname;
    const routePath = item.route || "";

    // Bulletproof router match: checks if URL matches exactly or is a sub-page (e.g. /student/classes/1)
    const isSelected =
        item.key === selectedKey ||
        (routePath !== "" && (currentPath === routePath || currentPath.startsWith(`${routePath}/`)));

    return <SidebarButton item={item} isSelected={isSelected} asLink={true} />;
}

function SidebarHeader() {
    const { title } = useRefineOptions();
    const { open, isMobile } = useShadcnSidebar();

    return (
        <ShadcnSidebarHeader
            className={cn(
                "p-0",
                "h-16",
                "border-b",
                "border-border",
                "flex-row",
                "items-center",
                "justify-between",
                "overflow-hidden"
            )}
        >
            <div
                className={cn(
                    "whitespace-nowrap",
                    "flex",
                    "flex-row",
                    "h-full",
                    "items-center",
                    "justify-start",
                    "gap-2",
                    "transition-discrete",
                    "duration-200",
                    {
                        "pl-3": !open,
                        "pl-5": open,
                    }
                )}
            >
                <div>{title.icon}</div>
                <h2
                    className={cn(
                        "text-sm",
                        "font-bold",
                        "transition-opacity",
                        "duration-200",
                        {
                            "opacity-0": !open,
                            "opacity-100": open,
                        }
                    )}
                >
                    {title.text}
                </h2>
            </div>

            <ShadcnSidebarTrigger
                className={cn("text-muted-foreground", "mr-1.5", {
                    "opacity-0": !open,
                    "opacity-100": open || isMobile,
                    "pointer-events-auto": open || isMobile,
                    "pointer-events-none": !open && !isMobile,
                })}
            />
        </ShadcnSidebarHeader>
    );
}

function getDisplayName(item: TreeMenuItem) {
    return item.meta?.label ?? item.label ?? item.name;
}

type IconProps = {
    icon: React.ReactNode;
    isSelected?: boolean;
};

function ItemIcon({ icon, isSelected }: IconProps) {
    return (
        <div
            className={cn("w-4", {
                "text-muted-foreground": !isSelected,
                "text-inherit": isSelected, // Inherits white color automatically from the default variant
            })}
        >
            {icon ?? <ListIcon />}
        </div>
    );
}

type SidebarButtonProps = React.ComponentProps<typeof Button> & {
    item: TreeMenuItem;
    isSelected?: boolean;
    rightIcon?: React.ReactNode;
    asLink?: boolean;
    onClick?: () => void;
};

function SidebarButton({
                           item,
                           isSelected = false,
                           rightIcon,
                           asLink = false,
                           className,
                           onClick,
                           ...props
                       }: SidebarButtonProps) {
    const Link = useLink();

    const buttonContent = (
        <>
            <ItemIcon icon={item.meta?.icon ?? item.icon} isSelected={isSelected} />
            <span
                className={cn("tracking-[-0.00875rem]", {
                    "flex-1": rightIcon,
                    "text-left": rightIcon,
                    "line-clamp-1": !rightIcon,
                    truncate: !rightIcon,
                    "font-normal": !isSelected,
                    "font-semibold": isSelected,
                })}
            >
                {getDisplayName(item)}
            </span>
            {rightIcon}
        </>
    );

    return (
        <Button
            asChild={!!(asLink && item.route)}
            // DYNAMIC VARIANT: Switches to "default" (Solid Theme Primary) when selected!
            variant={isSelected ? "default" : "ghost"}
            size="lg"
            className={cn(
                "flex w-full items-center justify-start gap-2 py-2 !px-3 text-sm",
                className
            )}
            onClick={onClick}
            {...props}
        >
            {asLink && item.route ? (
                <Link to={item.route} className={cn("flex w-full items-center gap-2")}>
                    {buttonContent}
                </Link>
            ) : (
                buttonContent
            )}
        </Button>
    );
}

Sidebar.displayName = "Sidebar";