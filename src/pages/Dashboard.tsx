import type { MouseEvent } from "react";
import { Link } from "react-router";
import {
  ArrowUpRight,
  BookOpen,
  Building2,
  GraduationCap,
  Home,
  Sparkles,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";

const adminLinks = [
  {
    label: "Users",
    href: "/users",
    icon: Users,
    gradient: "from-violet-500 to-fuchsia-600",
    glow: "rgba(217,70,239,0.45)",
  },
  {
    label: "Classes",
    href: "/classes",
    icon: GraduationCap,
    gradient: "from-sky-500 to-indigo-600",
    glow: "rgba(56,189,248,0.45)",
  },
  {
    label: "Subjects",
    href: "/subjects",
    icon: BookOpen,
    gradient: "from-amber-400 to-orange-600",
    glow: "rgba(251,191,36,0.45)",
  },
  {
    label: "Departments",
    href: "/departments",
    icon: Building2,
    gradient: "from-emerald-400 to-teal-600",
    glow: "rgba(52,211,153,0.45)",
  },
];

// Moves a soft light under the cursor inside each tile.
function trackPointer(e: MouseEvent<HTMLAnchorElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export default function Dashboard() {
  return (
      <div className="mx-auto w-full max-w-6xl pb-12">
        <style>{`
        @keyframes dash-drift-a {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(60px, 40px, 0) scale(1.15); }
        }
        @keyframes dash-drift-b {
          0%, 100% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(-70px, -30px, 0) scale(1.2); }
        }
        @keyframes dash-float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-12px) rotate(6deg); }
        }
        @keyframes dash-rise {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes dash-shine {
          from { background-position: 0% 50%; }
          to { background-position: 200% 50%; }
        }
        .dash-drift-a { animation: dash-drift-a 14s ease-in-out infinite; }
        .dash-drift-b { animation: dash-drift-b 18s ease-in-out infinite; }
        .dash-float { animation: dash-float 6s ease-in-out infinite; }
        .dash-rise { opacity: 0; animation: dash-rise 700ms cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .dash-title {
          background-image: linear-gradient(90deg, #fff 0%, #c4b5fd 35%, #fff 70%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          animation: dash-shine 6s linear infinite;
        }
        .dash-tile::before {
          content: "";
          position: absolute;
          inset: 0;
          background: radial-gradient(260px circle at var(--mx, 50%) var(--my, 0%), rgba(255,255,255,0.35), transparent 60%);
          opacity: 0;
          transition: opacity 250ms ease;
        }
        .dash-tile:hover::before { opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          .dash-drift-a, .dash-drift-b, .dash-float, .dash-title { animation: none; }
          .dash-rise { animation: none; opacity: 1; }
        }
      `}</style>

        {/* Hero */}
        <section className="relative isolate overflow-hidden rounded-[2rem] bg-indigo-950 px-6 py-14 text-white shadow-2xl sm:px-12 sm:py-20">
          <div
              className="dash-drift-a pointer-events-none absolute -left-24 -top-24 -z-10 size-96 rounded-full bg-violet-600/60 blur-3xl"
              aria-hidden="true"
          />
          <div
              className="dash-drift-b pointer-events-none absolute -bottom-32 -right-16 -z-10 size-[28rem] rounded-full bg-fuchsia-500/40 blur-3xl"
              aria-hidden="true"
          />
          <div
              className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:radial-gradient(#fff_1px,transparent_1px)] [background-size:22px_22px]"
              aria-hidden="true"
          />

          <div
              className="dash-float absolute right-8 top-8 hidden size-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur sm:flex"
              aria-hidden="true"
          >
            <Sparkles className="size-6 text-violet-200" />
          </div>

          <div className="relative max-w-2xl">
            <h1 className="dash-title dash-rise text-4xl font-bold tracking-tight sm:text-6xl">
              Welcome back
            </h1>

            <p
                className="dash-rise mt-4 text-base text-white/70 sm:text-lg"
                style={{ animationDelay: "120ms" }}
            >
              Pick where to go.
            </p>

            <Button
                asChild
                variant="secondary"
                className="dash-rise mt-8 rounded-full px-6 transition-transform hover:scale-105"
                style={{ animationDelay: "240ms" }}
            >
              <Link to="/">
                <Home aria-hidden="true" /> Home
              </Link>
            </Button>
          </div>
        </section>

        {/* Quick access */}
        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {adminLinks.map(({ label, href, icon: Icon, gradient, glow }, i) => (
              <Link
                  key={href}
                  to={href}
                  onMouseMove={trackPointer}
                  style={
                    {
                      animationDelay: `${300 + i * 90}ms`,
                      "--glow": glow,
                    } as React.CSSProperties
                  }
                  className={`dash-tile dash-rise group relative flex h-44 flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg outline-none transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_var(--glow)] focus-visible:ring-4 focus-visible:ring-primary/40`}
              >
            <span className="flex size-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
              <Icon className="size-6" aria-hidden="true" />
            </span>

                <span className="relative flex items-end justify-between text-xl font-semibold tracking-tight">
              {label}
                  <ArrowUpRight
                      className="size-6 opacity-70 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:opacity-100"
                      aria-hidden="true"
                  />
            </span>

                <Icon
                    className="pointer-events-none absolute -bottom-6 -right-6 size-32 text-white/10 transition-transform duration-500 group-hover:scale-125 group-hover:-rotate-12"
                    aria-hidden="true"
                />
              </Link>
          ))}
        </section>
      </div>
  );
}