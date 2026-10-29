import React, { useState } from "react";
import { useRegister } from "@refinedev/core";
import {
    Eye,
    EyeOff,
    GraduationCap,
    Mail,
    Lock,
    User,
    BookOpen,
    Users,
    BarChart3,
    AlertCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { authClient } from "@/lib/auth-client.ts";

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [role, setRole] = useState("student");
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [name, setName] = useState("");
    const [isSubmitting, setisSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorMessage("Passwords do not match!");
            return;
        }

        setErrorMessage("");
        setisSubmitting(true);

        try {
            const { error } = await authClient.signUp.email({
                name,
                email,
                password,
            });

            if (error) {
                setErrorMessage(error.message ?? "Registration failed.");
                return;
            }

            window.location.href = "/";
        } catch {
            setErrorMessage(
                "Unable to create your account. Please check your connection and try again."
            );
        } finally {
            setisSubmitting(false);
        }
    };

    const fieldClass =
        "h-11 rounded-xl border-stone-200 bg-white text-stone-900 pl-10 transition focus:border-indigo-400 focus-visible:ring-2 focus-visible:ring-indigo-200";
    const iconClass =
        "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400";

    return (
        <div className="grid min-h-screen bg-[#f7f5f2] lg:grid-cols-2">
            {/* Brand panel */}
            <aside className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-950 via-indigo-900 to-emerald-900 p-12 text-white lg:flex lg:flex-col lg:justify-between">
                <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-16 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />
                <div className="pointer-events-none absolute right-12 top-1/2 h-56 w-56 rounded-full border border-white/10" />
                <div className="pointer-events-none absolute right-24 top-1/2 h-56 w-56 rounded-full border border-white/10" />

                <div className="relative flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
                        <GraduationCap className="h-6 w-6" />
                    </div>
                    <span className="text-lg font-semibold tracking-tight">
                        Classroom
                    </span>
                </div>

                <div className="relative max-w-md space-y-8">
                    <h2 className="text-4xl font-semibold leading-tight tracking-tight">
                        Join your classroom in under a minute.
                    </h2>
                    <ul className="space-y-4 text-indigo-100/90">
                        <li className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                                <BookOpen className="h-4 w-4" />
                            </span>
                            Organize courses and lessons
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                                <Users className="h-4 w-4" />
                            </span>
                            Connect students and teachers
                        </li>
                        <li className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                                <BarChart3 className="h-4 w-4" />
                            </span>
                            Track progress at a glance
                        </li>
                    </ul>
                </div>

                <p className="relative text-sm text-indigo-200/70">
                    Learning, organized.
                </p>
            </aside>

            {/* Form panel */}
            <main className="flex items-center justify-center p-6 sm:p-10">
                <div className="w-full max-w-md space-y-8">
                    {/* Mobile logo */}
                    <div className="flex justify-center lg:hidden">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-950 text-white shadow-lg shadow-indigo-950/20">
                            <GraduationCap className="h-6 w-6" />
                        </div>
                    </div>

                    <div className="space-y-2 text-left">
                        <h1 className="text-3xl font-semibold tracking-tight text-indigo-950">
                            Create an account
                        </h1>
                        <p className="text-sm text-stone-500">
                            Enter your details to register as a new user.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-stone-200/70 bg-white p-7 shadow-xl shadow-stone-900/5">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Error Alert Message */}
                            {errorMessage && (
                                <div
                                    role="alert"
                                    className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700"
                                >
                                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                                    <span>{errorMessage}</span>
                                </div>
                            )}

                            {/* Full Name */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-medium text-stone-700">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <User className={iconClass} />
                                    <Input
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className={fieldClass}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-medium text-stone-700">
                                    Email
                                </label>
                                <div className="relative">
                                    <Mail className={iconClass} />
                                    <Input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className={fieldClass}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-medium text-stone-700">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className={iconClass} />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className={`${fieldClass} pr-11`}
                                        required
                                    />
                                    <button
                                        type="button"
                                        aria-label={
                                            showPassword ? "Hide password" : "Show password"
                                        }
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-stone-400 transition hover:bg-stone-100 hover:text-stone-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-200"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-medium text-stone-700">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <Lock className={iconClass} />
                                    <Input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="••••••••"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={fieldClass}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Role Select Dropdown */}
                            <div className="space-y-1.5 text-left">
                                <label className="text-xs font-medium text-stone-700">
                                    Role
                                </label>
                                <Select value={role} onValueChange={setRole}>
                                    <SelectTrigger className="h-11 w-full rounded-xl border-stone-200 bg-white text-stone-900 transition focus:ring-2 focus:ring-indigo-200">
                                        <SelectValue placeholder="Select role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="student">Student</SelectItem>
                                        <SelectItem value="teacher">Teacher</SelectItem>
                                        <SelectItem value="admin">Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center space-x-2 pt-1 text-xs text-stone-600">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(!!checked)}
                                />
                                <label
                                    htmlFor="remember"
                                    className="cursor-pointer select-none font-medium leading-none"
                                >
                                    Remember me
                                </label>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="h-11 w-full rounded-xl bg-indigo-950 text-sm font-semibold text-white shadow-lg shadow-indigo-950/20 transition hover:bg-indigo-900 disabled:opacity-70"
                            >
                                {isSubmitting ? "Creating account..." : "Sign up"}
                            </Button>
                        </form>
                    </div>

                    {/* Footer Sign In Link */}
                    <p className="text-center text-sm text-stone-500">
                        Already have an account?{" "}
                        <a
                            href="/sign-in"
                            className="font-semibold text-emerald-700 hover:underline"
                        >
                            Sign in
                        </a>
                    </p>
                </div>
            </main>
        </div>
    );
}