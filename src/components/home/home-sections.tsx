import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router";
import {
  AnimatePresence,
  animate,
  motion,
  useInView,
} from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  BookOpen,
  Building2,
  Check,
  ClipboardCheck,
  Code2,
  GraduationCap,
  Heart,
  Layers3,
  LockKeyhole,
  School,
  Sparkles,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { getDashboardPath, type ClassroomRole } from "./home-navigation";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export type ClassPreview = {
  id: number;
  name: string;
  description: string | null;
  status: "active";
  bannerUrl: string | null;
  subject: { name: string; code: string };
  teacher: { name: string } | null;
};

export type SubjectPreview = {
  id: number;
  name: string;
  code: string;
  department: { name: string };
};

export type DepartmentPreview = {
  id: number;
  name: string;
  code: string;
  subjectCount: number;
};

export type PlatformStats = {
  students: number;
  teachers: number;
  classes: number;
  subjects: number;
  departments: number;
};

/* ------------------------------------------------------------------ */
/* Motion helpers                                                      */
/* ------------------------------------------------------------------ */

const ease = [0.22, 1, 0.36, 1] as const;

function Reveal({
                  children,
                  delay = 0,
                  className,
                }: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
      <motion.div
          className={className}
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-70px" }}
          transition={{ duration: 0.6, delay, ease }}
      >
        {children}
      </motion.div>
  );
}

function CountUp({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => {
        if (ref.current) {
          ref.current.textContent = Math.round(v).toLocaleString();
        }
      },
    });
    return () => controls.stop();
  }, [inView, to]);

  return <span ref={ref}>0</span>;
}

const gradientText =
    "bg-gradient-to-r from-primary via-violet-500 to-emerald-500 bg-clip-text text-transparent";

/* ------------------------------------------------------------------ */
/* Hero                                                                */
/* ------------------------------------------------------------------ */

const ROTATING_WORDS = ["learn", "teach", "manage"];

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(
        () => setIndex((i) => (i + 1) % ROTATING_WORDS.length),
        2400,
    );
    return () => clearInterval(timer);
  }, []);

  return (
      <span className="inline-block">
      <AnimatePresence mode="wait">
        <motion.span
            key={ROTATING_WORDS[index]}
            initial={{ y: "55%", opacity: 0, filter: "blur(6px)" }}
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: "-55%", opacity: 0, filter: "blur(6px)" }}
            transition={{ duration: 0.38 }}
            className={cn("inline-block", gradientText)}
        >
          {ROTATING_WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export function HeroSection({
                              isAuthenticated,
                              role,
                            }: {
  isAuthenticated: boolean;
  role?: ClassroomRole;
}) {
  return (
      <section className="relative isolate overflow-hidden bg-background">
        {/* animated aurora background */}
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.35)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.35)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />
          <motion.div
              className="absolute -left-24 top-0 size-[26rem] rounded-full bg-primary/25 blur-3xl"
              animate={{ x: [0, 80, 0], y: [0, 50, 0] }}
              transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
              className="absolute -right-24 top-10 size-[24rem] rounded-full bg-violet-500/25 blur-3xl"
              animate={{ x: [0, -70, 0], y: [0, 70, 0] }}
              transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
              className="absolute -bottom-24 left-1/3 size-[22rem] rounded-full bg-emerald-500/20 blur-3xl"
              animate={{ x: [0, 60, 0], y: [0, -40, 0] }}
              transition={{ duration: 19, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-card/70 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-primary backdrop-blur"
            >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
              {isAuthenticated && role
                  ? `Welcome back, ${role}`
                  : "A connected learning community"}
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease }}
                className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl"
            >
              A smarter way to <RotatingWord /> together.
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease }}
                className="mt-6 max-w-lg text-pretty text-base leading-7 text-muted-foreground sm:text-lg"
            >
              Classrooms, subjects and people — organized in one beautiful place.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease }}
                className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <Button
                  asChild
                  size="lg"
                  className="group h-12 rounded-full px-6 shadow-lg shadow-primary/30"
              >
                <Link to={isAuthenticated ? getDashboardPath(role) : "/signUp"}>
                  {isAuthenticated ? "Go to your dashboard" : "Get started"}
                  <ArrowRight
                      className="size-4 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                  />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-12 rounded-full px-6">
                <a href="#classes">
                  Explore classes
                  <ArrowDown className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.55 }}
                className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground"
            >
              {["Role-based access", "Secure sign in", "One workspace"].map((label) => (
                  <span key={label} className="inline-flex items-center gap-2">
                <span className="flex size-5 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                    {label}
              </span>
              ))}
            </motion.div>
          </div>

          <WorkspaceIllustration />
        </div>
      </section>
  );
}

const tiles = [
  {
    icon: School,
    title: "Classrooms",
    tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    icon: BookOpen,
    title: "Subjects",
    tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    icon: Building2,
    title: "Departments",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: UsersRound,
    title: "Community",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
];

function WorkspaceIllustration() {
  return (
      <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease }}
          className="relative mx-auto w-full max-w-xl"
      >
        {/* floating chips */}
        <motion.div
            className="absolute -right-3 top-[18%] z-10 hidden items-center gap-3 rounded-2xl border border-border/70 bg-card/90 p-3.5 shadow-xl backdrop-blur sm:flex"
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
        <span className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <UsersRound className="size-5" aria-hidden="true" />
        </span>
          <p className="text-xs font-semibold">People, connected</p>
        </motion.div>
        <motion.div
            className="absolute -left-4 bottom-[14%] z-10 hidden items-center gap-3 rounded-2xl border border-border/70 bg-card/90 p-3.5 shadow-xl backdrop-blur sm:flex"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        >
        <span className="flex size-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
          <Sparkles className="size-5" aria-hidden="true" />
        </span>
          <p className="text-xs font-semibold">Always organized</p>
        </motion.div>

        <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-card p-3 shadow-2xl shadow-primary/15 sm:p-5">
          <div className="rounded-[1.4rem] bg-gradient-to-br from-primary/10 via-background to-emerald-500/10 p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-border/60 pb-5">
              <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-primary-foreground">
                <GraduationCap className="size-5" aria-hidden="true" />
              </span>
                <p className="text-sm font-bold tracking-tight">Your learning space</p>
              </div>
              <span
                  className="size-2.5 animate-pulse rounded-full bg-emerald-500 ring-4 ring-emerald-500/15"
                  aria-label="Workspace ready"
              />
            </div>

            <div className="grid grid-cols-2 gap-3 pt-5">
              {tiles.map(({ icon: Icon, title, tone }, i) => (
                  <motion.div
                      key={title}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
                      whileHover={{ y: -6, scale: 1.03 }}
                      className="rounded-2xl border border-border/60 bg-card/80 p-4 shadow-sm"
                  >
                <span className={cn("mb-4 flex size-9 items-center justify-center rounded-xl", tone)}>
                  <Icon className="size-4.5" aria-hidden="true" />
                </span>
                    <p className="text-sm font-semibold">{title}</p>
                    <div className="mt-3 h-1.5 w-full rounded-full bg-muted">
                      <motion.div
                          className="h-1.5 rounded-full bg-gradient-to-r from-primary to-emerald-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${55 + i * 12}%` }}
                          transition={{ delay: 1 + i * 0.12, duration: 1.1, ease }}
                      />
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Features                                                            */
/* ------------------------------------------------------------------ */

const features = [
  {
    icon: School,
    title: "Classrooms",
    description: "Every class, neatly organized.",
    tone: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  },
  {
    icon: UsersRound,
    title: "Enrollment",
    description: "Students connected to classes.",
    tone: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
  },
  {
    icon: BookOpen,
    title: "Subjects",
    description: "Names, codes, departments.",
    tone: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  {
    icon: Building2,
    title: "Departments",
    description: "A clear academic structure.",
    tone: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  {
    icon: UserRoundCheck,
    title: "Accounts",
    description: "Teachers and students, role-aware.",
    tone: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  },
  {
    icon: LockKeyhole,
    title: "Secure sign in",
    description: "Protected with Better Auth.",
    tone: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
  },
  {
    icon: Layers3,
    title: "Dashboards",
    description: "A workspace for every role.",
    tone: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    icon: ClipboardCheck,
    title: "Progress tracking",
    description: "Coming soon.",
    tone: "bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400",
    planned: true,
  },
];

export function FeaturesSection() {
  return (
      <section id="about" className="scroll-mt-24 bg-muted/35 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
              eyebrow="Features"
              title="Everything in sync."
              description="Simple tools for every role."
              centered
          />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, description, tone, planned }, i) => (
                <Reveal key={title} delay={(i % 4) * 0.08}>
                  <motion.div whileHover={{ y: -8 }} className="h-full">
                    <Card className="group relative h-full overflow-hidden rounded-2xl border-border/70 bg-card/80 shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-primary/10">
                      <div className="absolute -right-10 -top-10 size-28 rounded-full bg-primary/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
                      <CardContent className="relative p-5 sm:p-6">
                    <span
                        className={cn(
                            "mb-5 flex size-11 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110",
                            tone,
                        )}
                    >
                      <Icon className="size-5" aria-hidden="true" />
                    </span>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold tracking-tight">{title}</h3>
                          {planned && (
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                          Planned
                        </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Reveal>
            ))}
          </div>
        </div>
      </section>
  );
}

/* ------------------------------------------------------------------ */
/* How it works                                                        */
/* ------------------------------------------------------------------ */

export function HowItWorksSection() {
  const steps = [
    { number: "01", title: "Sign up", description: "Create your account in seconds." },
    { number: "02", title: "Join or manage", description: "Find a class or organize your own." },
    { number: "03", title: "Learn together", description: "Everything is easy to find." },
  ];

  return (
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
              eyebrow="How it works"
              title="Three simple steps."
              description="From sign up to classroom in minutes."
              centered
          />
          <div className="relative mt-14 grid gap-10 md:grid-cols-3 md:gap-5">
            <motion.div
                className="absolute left-[16%] right-[16%] top-7 hidden h-px origin-left bg-gradient-to-r from-primary/60 via-violet-500/50 to-emerald-500/60 md:block"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease }}
            />
            {steps.map((step, index) => (
                <Reveal key={step.number} delay={index * 0.15} className="relative text-center">
                  <motion.span
                      whileHover={{ scale: 1.1, rotate: 6 }}
                      className="relative mx-auto flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-violet-500 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/30"
                  >
                    {step.number}
                  </motion.span>
                  <h3 className="mt-5 text-lg font-semibold tracking-tight">{step.title}</h3>
                  <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-muted-foreground">
                    {step.description}
                  </p>
                </Reveal>
            ))}
          </div>
        </div>
      </section>
  );
}

/* ------------------------------------------------------------------ */
/* Stats                                                               */
/* ------------------------------------------------------------------ */

export function StatsSection({
                               isAuthenticated,
                               isLoading,
                               isError,
                               stats,
                               onRetry,
                             }: {
  isAuthenticated: boolean;
  isLoading: boolean;
  isError: boolean;
  stats?: PlatformStats;
  onRetry: () => void;
}) {
  const metrics = [
    ["Students", stats?.students, UsersRound],
    ["Teachers", stats?.teachers, UserRoundCheck],
    ["Classes", stats?.classes, School],
    ["Subjects", stats?.subjects, BookOpen],
    ["Departments", stats?.departments, Building2],
  ] as const;

  return (
      <section className="border-y border-border/60 bg-primary/[0.035] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                At a glance
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                A growing community.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                Live totals. No personal student data is shown.
              </p>
            </Reveal>

            {!isAuthenticated ? (
                <Reveal delay={0.1}>
                  <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6">
                    <p className="font-medium">Totals are for signed-in members.</p>
                    <Button asChild variant="link" className="mt-2 h-auto p-0">
                      <Link to="/sign-in">
                        Sign in to view <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                  </div>
                </Reveal>
            ) : isLoading ? (
                <div
                    className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
                    aria-label="Loading platform statistics"
                >
                  {metrics.map(([label]) => (
                      <div key={label} className="h-24 animate-pulse rounded-2xl bg-muted" />
                  ))}
                </div>
            ) : isError || !stats ? (
                <div className="rounded-2xl border border-border/70 bg-card p-5">
                  <p className="font-medium">Statistics are temporarily unavailable.</p>
                  <Button variant="link" className="mt-2 h-auto p-0" onClick={onRetry}>
                    Try again
                  </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                  {metrics.map(([label, value, Icon], i) => (
                      <Reveal key={label} delay={i * 0.07}>
                        <motion.div
                            whileHover={{ y: -6 }}
                            className="rounded-2xl border border-border/70 bg-card px-4 py-5 shadow-sm transition-shadow hover:shadow-lg"
                        >
                          <Icon className="mb-3 size-4 text-primary" aria-hidden="true" />
                          <p className={cn("text-2xl font-bold tracking-tight tabular-nums sm:text-3xl", gradientText)}>
                            <CountUp to={value ?? 0} />
                          </p>
                          <p className="mt-1 text-xs font-medium text-muted-foreground sm:text-sm">
                            {label}
                          </p>
                        </motion.div>
                      </Reveal>
                  ))}
                </div>
            )}
          </div>
        </div>
      </section>
  );
}

/* ------------------------------------------------------------------ */
/* Classes                                                             */
/* ------------------------------------------------------------------ */

export function ClassesSection({
                                 classes,
                                 isLoading,
                                 isError,
                                 onRetry,
                                 isAuthenticated,
                               }: {
  classes: ClassPreview[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  isAuthenticated: boolean;
}) {
  return (
      <section id="classes" className="scroll-mt-24 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
              eyebrow="Classes"
              title="Find a place to learn."
              description="A few active classrooms to explore."
              action={
                isAuthenticated ? (
                    <Button variant="outline" asChild className="hidden rounded-full sm:inline-flex">
                      <Link to="/classes">
                        View all classes <ArrowRight aria-hidden="true" />
                      </Link>
                    </Button>
                ) : undefined
              }
          />
          <div className="mt-10">
            {isLoading ? (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="Loading classes">
                  {[0, 1, 2].map((item) => (
                      <div key={item} className="h-72 animate-pulse rounded-3xl bg-muted" />
                  ))}
                </div>
            ) : isError ? (
                <DataMessage
                    title="Classes could not be loaded."
                    description="Please try again in a moment."
                    onRetry={onRetry}
                />
            ) : classes.length === 0 ? (
                <DataMessage
                    title="No active classes yet."
                    description="Check back soon."
                />
            ) : (
                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {classes.map((classroom, index) => (
                      <Reveal key={classroom.id} delay={index * 0.1}>
                        <motion.div whileHover={{ y: -8 }} className="h-full">
                          <Card className="group h-full overflow-hidden rounded-3xl border-border/70 bg-card shadow-sm transition-shadow duration-300 hover:shadow-2xl hover:shadow-primary/10">
                            <div className="relative h-40 overflow-hidden bg-gradient-to-br from-primary/20 via-violet-500/15 to-emerald-500/20">
                              {classroom.bannerUrl && (
                                  <img
                                      src={classroom.bannerUrl}
                                      alt=""
                                      loading="lazy"
                                      className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                                  />
                              )}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                              <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold capitalize shadow-sm backdrop-blur">
                                <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" aria-hidden="true" />
                                {classroom.status}
                              </div>
                              <div className="absolute bottom-4 left-4 flex size-11 items-center justify-center rounded-2xl border border-white/40 bg-white/90 text-primary shadow-md backdrop-blur transition-transform duration-300 group-hover:rotate-6">
                                <BookOpen className="size-5" aria-hidden="true" />
                              </div>
                              <span className="absolute bottom-4 right-4 rounded-lg bg-background/85 px-2.5 py-1 text-xs font-semibold shadow-sm backdrop-blur">
                          {classroom.subject.code}
                        </span>
                            </div>
                            <CardContent className="p-5">
                              <p className="text-xs font-semibold uppercase tracking-wider text-primary">
                                {classroom.subject.name}
                              </p>
                              <h3 className="mt-2 line-clamp-1 text-lg font-semibold tracking-tight">
                                {classroom.name}
                              </h3>
                              <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">
                                {classroom.description?.trim() ||
                                    "A classroom space for learning and collaboration."}
                              </p>
                              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                                <div className="min-w-0">
                                  <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                                    Teacher
                                  </p>
                                  <p className="mt-0.5 truncate text-sm font-medium">
                                    {classroom.teacher?.name || "Teacher"}
                                  </p>
                                </div>
                                <Button variant="ghost" size="sm" asChild className="shrink-0 rounded-full">
                                  <Link
                                      to={
                                        isAuthenticated
                                            ? `/classes/show/${classroom.id}`
                                            : "/sign-in"
                                      }
                                  >
                                    {isAuthenticated ? "View class" : "Sign in to view"}
                                    <ArrowRight aria-hidden="true" />
                                  </Link>
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Reveal>
                  ))}
                </div>
            )}
          </div>
          {isAuthenticated && (
              <Button variant="outline" asChild className="mt-6 w-full rounded-full sm:hidden">
                <Link to="/classes">
                  View all classes <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
          )}
        </div>
      </section>
  );
}

/* ------------------------------------------------------------------ */
/* Catalog (subjects + departments)                                    */
/* ------------------------------------------------------------------ */

export function CatalogSection({
                                 subjects,
                                 departments,
                                 subjectsLoading,
                                 departmentsLoading,
                                 subjectsError,
                                 departmentsError,
                                 retrySubjects,
                                 retryDepartments,
                                 isAuthenticated,
                               }: {
  subjects: SubjectPreview[];
  departments: DepartmentPreview[];
  subjectsLoading: boolean;
  departmentsLoading: boolean;
  subjectsError: boolean;
  departmentsError: boolean;
  retrySubjects: () => void;
  retryDepartments: () => void;
  isAuthenticated: boolean;
}) {
  return (
      <section className="border-y border-border/60 bg-muted/30 py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8">
          <div id="subjects" className="scroll-mt-24">
            <SectionHeading
                eyebrow="Subjects"
                title="A curriculum with structure."
                description="Subjects and their codes."
            />
            <div className="mt-8 space-y-3">
              {subjectsLoading ? (
                  [0, 1, 2].map((item) => (
                      <div key={item} className="h-20 animate-pulse rounded-2xl bg-muted" />
                  ))
              ) : subjectsError ? (
                  <DataMessage title="Subjects could not be loaded." onRetry={retrySubjects} />
              ) : subjects.length === 0 ? (
                  <DataMessage title="No subjects available yet." />
              ) : (
                  subjects.map((subject, i) => (
                      <Reveal key={subject.id} delay={i * 0.08}>
                        <motion.div
                            whileHover={{ x: 8 }}
                            className="flex items-center justify-between gap-4 rounded-2xl border border-border/70 bg-card p-4 shadow-sm transition-colors hover:border-primary/40"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 dark:text-violet-400">
                        <BookOpen className="size-4.5" aria-hidden="true" />
                      </span>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-semibold">{subject.name}</p>
                              <p className="mt-1 truncate text-xs text-muted-foreground">
                                {subject.department.name}
                              </p>
                            </div>
                          </div>
                          <span className="shrink-0 rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold tracking-wide">
                      {subject.code}
                    </span>
                        </motion.div>
                      </Reveal>
                  ))
              )}
            </div>
            {isAuthenticated && (
                <Button variant="link" asChild className="mt-4 h-auto px-0">
                  <Link to="/subjects">
                    Explore subjects <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
            )}
          </div>

          <div id="departments" className="scroll-mt-24">
            <SectionHeading
                eyebrow="Departments"
                title="Clearly grouped."
                description="Departments and their subjects."
            />
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {departmentsLoading ? (
                  [0, 1, 2, 3].map((item) => (
                      <div key={item} className="h-32 animate-pulse rounded-2xl bg-muted" />
                  ))
              ) : departmentsError ? (
                  <div className="sm:col-span-2">
                    <DataMessage title="Departments could not be loaded." onRetry={retryDepartments} />
                  </div>
              ) : departments.length === 0 ? (
                  <div className="sm:col-span-2">
                    <DataMessage title="No departments available yet." />
                  </div>
              ) : (
                  departments.map((department, index) => (
                      <Reveal key={department.id} delay={index * 0.08}>
                        <motion.div
                            whileHover={{ y: -6, scale: 1.02 }}
                            className="group h-full rounded-2xl border border-border/70 bg-card p-5 shadow-sm transition-shadow hover:shadow-lg"
                        >
                          <div className="flex items-start justify-between gap-3">
                      <span
                          className={cn(
                              "flex size-10 items-center justify-center rounded-xl transition-transform duration-300 group-hover:rotate-6",
                              index % 2 === 0
                                  ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                                  : "bg-sky-500/10 text-sky-600 dark:text-sky-400",
                          )}
                      >
                        <Building2 className="size-4.5" aria-hidden="true" />
                      </span>
                            <span className="rounded-lg bg-muted px-2 py-1 text-[11px] font-semibold tracking-wide">
                        {department.code}
                      </span>
                          </div>
                          <h3 className="mt-4 line-clamp-1 text-sm font-semibold">{department.name}</h3>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {department.subjectCount}{" "}
                            {department.subjectCount === 1 ? "subject" : "subjects"}
                          </p>
                        </motion.div>
                      </Reveal>
                  ))
              )}
            </div>
            {isAuthenticated && (
                <Button variant="link" asChild className="mt-4 h-auto px-0">
                  <Link to="/departments">
                    Explore departments <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
            )}
          </div>
        </div>
      </section>
  );
}

/* ------------------------------------------------------------------ */
/* Community                                                           */
/* ------------------------------------------------------------------ */

const marqueeWords = [
  "Students",
  "Teachers",
  "Classrooms",
  "Subjects",
  "Departments",
  "Community",
];

export function CommunitySection() {
  const row = [...marqueeWords, ...marqueeWords];

  return (
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-primary via-violet-700 to-indigo-950 px-6 py-12 text-white shadow-2xl shadow-primary/20 sm:px-10 sm:py-16 lg:px-14">
              <motion.div
                  className="pointer-events-none absolute -right-24 -top-40 size-[26rem] rounded-full border border-white/15"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                  aria-hidden="true"
              />
              <motion.div
                  className="pointer-events-none absolute -right-10 -top-28 size-[18rem] rounded-full border border-dashed border-white/20"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                  aria-hidden="true"
              />
              <motion.div
                  className="pointer-events-none absolute -bottom-20 -left-16 size-64 rounded-full bg-emerald-400/20 blur-3xl"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 8, repeat: Infinity }}
                  aria-hidden="true"
              />

              <div className="relative max-w-2xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                  For the whole community
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                  Make room for better learning.
                </h2>
                <p className="mt-4 max-w-xl text-sm leading-7 text-white/75 sm:text-base">
                  Less searching. More teaching and learning.
                </p>
              </div>

              <div className="relative mt-10 overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
                <motion.div
                    className="flex w-max gap-3"
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
                >
                  {row.map((word, i) => (
                      <span
                          key={i}
                          className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur"
                      >
                    <Sparkles className="size-3.5" aria-hidden="true" />
                        {word}
                  </span>
                  ))}
                </motion.div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
  );
}

/* ------------------------------------------------------------------ */
/* Final CTA                                                           */
/* ------------------------------------------------------------------ */

export function FinalCtaSection({ isAuthenticated }: { isAuthenticated: boolean }) {
  return (
      <section
          id="contact"
          className="scroll-mt-24 border-t border-border/60 bg-muted/30 py-16 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="flex flex-col items-start justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Bring your classroom{" "}
                <span className={gradientText}>together.</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                Create an account and find your workspace.
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              {isAuthenticated ? (
                  <Button asChild size="lg" className="group rounded-full px-6 shadow-lg shadow-primary/30">
                    <Link to="/dashboard">
                      Open dashboard{" "}
                      <ArrowRight
                          className="transition-transform group-hover:translate-x-1"
                          aria-hidden="true"
                      />
                    </Link>
                  </Button>
              ) : (
                  <>
                    <Button asChild size="lg" className="group rounded-full px-6 shadow-lg shadow-primary/30">
                      <Link to="/signUp">
                        Create account{" "}
                        <ArrowRight
                            className="transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                        />
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="rounded-full px-6">
                      <Link to="/sign-in">Sign in</Link>
                    </Button>
                  </>
              )}
            </div>
          </Reveal>
        </div>
      </section>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function HomeFooter() {
  return (
      <footer className="relative overflow-hidden border-t border-border/70 bg-background">
        <div
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent"
            aria-hidden="true"
        />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5 font-bold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-violet-500 text-primary-foreground shadow-md shadow-primary/30">
              <GraduationCap className="size-5" aria-hidden="true" />
            </span>
              Classroom
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              A connected home for classrooms, subjects, teachers and students.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Explore</h3>
            <div className="mt-4 flex flex-col items-start gap-3 text-sm text-muted-foreground">
              <FooterLink to="/#classes">Classes</FooterLink>
              <FooterLink to="/#subjects">Subjects</FooterLink>
              <FooterLink to="/#departments">Departments</FooterLink>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold">Your account</h3>
            <div className="mt-4 flex flex-col items-start gap-3 text-sm text-muted-foreground">
              <FooterLink to="/sign-in">Sign in</FooterLink>
              <FooterLink to="/signUp">Create account</FooterLink>
              <FooterLink to="/#about">About Classroom</FooterLink>
            </div>
          </div>
        </div>

        <div className="border-t border-border/60">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 text-xs text-muted-foreground sm:px-6 md:flex-row md:justify-between lg:px-8">
            <p>© {new Date().getFullYear()} Classroom. All rights reserved.</p>
            <motion.p
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card px-4 py-2 text-sm shadow-sm"
            >
              <Code2 className="size-4 text-primary" aria-hidden="true" />
              <span>Developed with</span>
              <motion.span
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="inline-flex"
              >
                <Heart className="size-4 fill-rose-500 text-rose-500" aria-hidden="true" />
              </motion.span>
              <span>by</span>
              <span className={cn("font-bold", gradientText)}>Biniyam T Dinagde</span>
            </motion.p>
          </div>
        </div>
      </footer>
  );
}

function FooterLink({ to, children }: { to: string; children: ReactNode }) {
  return (
      <Link
          to={to}
          className="transition-all hover:translate-x-1 hover:text-foreground"
      >
        {children}
      </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function SectionHeading({
                          eyebrow,
                          title,
                          description,
                          action,
                          centered,
                        }: {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
  centered?: boolean;
}) {
  return (
      <Reveal
          className={cn(
              "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
              centered && "items-center text-center sm:flex-col sm:items-center sm:justify-center",
          )}
      >
        <div className={cn("max-w-2xl", centered && "mx-auto")}>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
            {description}
          </p>
        </div>
        {action}
      </Reveal>
  );
}

function DataMessage({
                       title,
                       description,
                       onRetry,
                     }: {
  title: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
      <div className="rounded-2xl border border-dashed border-border bg-card/70 px-5 py-8 text-center">
        <p className="font-medium">{title}</p>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
        {onRetry && (
            <Button variant="link" onClick={onRetry} className="mt-1 h-auto p-0">
              Try again
            </Button>
        )}
      </div>
  );
}