import { useState } from "react";
import { Link } from "react-router";
import { useGetIdentity, useLogout } from "@refinedev/core";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import {
  ArrowUpRight,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
} from "lucide-react";

import { ThemeToggle } from "@/components/refine-ui/theme/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export type ClassroomRole = "admin" | "teacher" | "student";

export type HomeIdentity = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: ClassroomRole;
};

export const getDashboardPath = (role?: ClassroomRole) =>
    role ? `/dashboard/${role}` : "/dashboard";

type HomeNavigationProps = {
  identity: HomeIdentity | undefined;
};

const publicLinks = [
  { label: "Home", href: "/" },
  { label: "Classes", href: "#classes", authenticatedHref: "/classes" },
  { label: "Subjects", href: "#subjects", authenticatedHref: "/subjects" },
  {
    label: "Departments",
    href: "#departments",
    authenticatedHref: "/departments",
  },
  { label: "About", href: "#about" },
  { label: "Contact", href: "#contact" },
];

export function HomeNavigation({ identity }: HomeNavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const isAuthenticated = Boolean(identity);

  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 12));

  const links = publicLinks.map((item) => ({
    ...item,
    href:
        isAuthenticated && item.authenticatedHref
            ? item.authenticatedHref
            : item.href,
  }));

  return (
      <motion.header
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
              "sticky top-0 z-50 border-b backdrop-blur-xl transition-all duration-300",
              scrolled
                  ? "border-border/70 bg-background/85 shadow-sm"
                  : "border-transparent bg-background/40",
          )}
      >
        <div
            className={cn(
                "mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-300 sm:px-6 lg:px-8",
                scrolled ? "h-14" : "h-16",
            )}
        >
          <Link
              to="/"
              className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Classroom home"
          >
            <motion.span
                whileHover={{ rotate: -8, scale: 1.08 }}
                className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-primary-foreground shadow-md shadow-primary/30"
            >
              <GraduationCap className="size-5" aria-hidden="true" />
            </motion.span>
            <span className="text-lg font-bold tracking-tight">Classroom</span>
          </Link>

          <nav
              className="hidden items-center gap-1 lg:flex"
              aria-label="Main navigation"
          >
            {links.map((item) => {
              const className =
                  "group relative rounded-full px-3.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";
              const underline = (
                  <span className="absolute inset-x-3.5 bottom-1 h-0.5 origin-left scale-x-0 rounded-full bg-gradient-to-r from-primary to-violet-500 transition-transform duration-300 group-hover:scale-x-100" />
              );
              return item.href.startsWith("/") ? (
                  <Link key={item.label} to={item.href} className={className}>
                    {item.label}
                    {underline}
                  </Link>
              ) : (
                  <a key={item.label} href={item.href} className={className}>
                    {item.label}
                    {underline}
                  </a>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle className="size-9 rounded-lg border-transparent" />
            {identity ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        className="gap-2 rounded-full pl-1.5 pr-3"
                        aria-label={`Open ${identity.name}'s account menu`}
                    >
                      <IdentityAvatar identity={identity} />
                      <span className="max-w-28 truncate text-sm font-medium">
                    {identity.name}
                  </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="truncate text-sm font-medium">{identity.name}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {identity.email}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to={getDashboardPath(identity.role)}>
                        <LayoutDashboard aria-hidden="true" />
                        {identity.role
                            ? `${capitalize(identity.role)} dashboard`
                            : "Dashboard"}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        disabled={isLoggingOut}
                        onClick={() => logout()}
                        className="text-destructive focus:text-destructive"
                    >
                      <LogOut aria-hidden="true" />
                      {isLoggingOut ? "Signing out..." : "Sign out"}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <>
                  <Button variant="ghost" asChild className="rounded-full">
                    <Link to="/sign-in">Sign in</Link>
                  </Button>
                  <Button
                      asChild
                      className="group rounded-full px-5 shadow-md shadow-primary/25"
                  >
                    <Link to="/signUp">
                      Get started{" "}
                      <ArrowUpRight
                          className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                          aria-hidden="true"
                      />
                    </Link>
                  </Button>
                </>
            )}
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <ThemeToggle className="size-9 rounded-lg border-transparent" />
            <Button
                variant="outline"
                size="icon"
                className="size-9"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-navigation"
                onClick={() => setMobileMenuOpen((open) => !open)}
            >
              {mobileMenuOpen ? (
                  <X aria-hidden="true" />
              ) : (
                  <Menu aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
              <motion.nav
                  id="mobile-navigation"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden border-t border-border/70 bg-background lg:hidden"
                  aria-label="Mobile navigation"
              >
                <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 pb-5 pt-3">
                  {links.map((item, i) => {
                    const className =
                        "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-muted";
                    return (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -16 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                        >
                          {item.href.startsWith("/") ? (
                              <Link
                                  to={item.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={cn("block", className)}
                              >
                                {item.label}
                              </Link>
                          ) : (
                              <a
                                  href={item.href}
                                  onClick={() => setMobileMenuOpen(false)}
                                  className={cn("block", className)}
                              >
                                {item.label}
                              </a>
                          )}
                        </motion.div>
                    );
                  })}
                  {identity ? (
                      <>
                        <Link
                            to={getDashboardPath(identity.role)}
                            onClick={() => setMobileMenuOpen(false)}
                            className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-muted"
                        >
                          <LayoutDashboard className="size-4" aria-hidden="true" />
                          Go to dashboard
                        </Link>
                        <button
                            type="button"
                            disabled={isLoggingOut}
                            onClick={() => logout()}
                            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-muted disabled:opacity-60"
                        >
                          <LogOut className="size-4" aria-hidden="true" />
                          {isLoggingOut ? "Signing out..." : "Sign out"}
                        </button>
                      </>
                  ) : (
                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Button variant="outline" asChild>
                          <Link to="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                            Sign in
                          </Link>
                        </Button>
                        <Button asChild>
                          <Link to="/signUp" onClick={() => setMobileMenuOpen(false)}>
                            Get started
                          </Link>
                        </Button>
                      </div>
                  )}
                </div>
              </motion.nav>
          )}
        </AnimatePresence>
      </motion.header>
  );
}

function IdentityAvatar({ identity }: { identity: HomeIdentity }) {
  const initials = identity.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");

  return (
      <Avatar className="size-8">
        {identity.avatar && (
            <AvatarImage src={identity.avatar} alt="" referrerPolicy="no-referrer" />
        )}
        <AvatarFallback>{initials || "U"}</AvatarFallback>
      </Avatar>
  );
}

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}