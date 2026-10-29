import type { AuthProvider } from "@refinedev/core";
import { authClient } from "@/lib/auth-client";

export const authProvider: AuthProvider = {
    // Login
    login: async ({ email, password }) => {
        const { error } = await authClient.signIn.email({
            email,
            password,
        });

        if (error) {
            return {
                success: false,
                error: {
                    name: "LoginError",
                    message:
                        error.message ?? "Login failed. Please try again.",
                    statusCode: error.status,
                },
            };
        }

        return {
            success: true,
            redirectTo: "/",
        };
    },

    // Logout
    logout: async () => {
        const { error } = await authClient.signOut();

        if (error) {
            return {
                success: false,
                error: {
                    name: "LogoutError",
                    message:
                        error.message ?? "Logout failed. Please try again.",
                    statusCode: error.status,
                },
            };
        }

        return {
            success: true,
            redirectTo: "/sign-in",
        };
    },

    // Check whether the user is authenticated
    check: async () => {
        try {
            const { data, error } = await authClient.getSession();

            if (error || !data?.session) {
                return {
                    authenticated: false,
                    redirectTo: "/sign-in",
                    logout: true,
                };
            }

            return {
                authenticated: true,
            };
        } catch {
            return {
                authenticated: false,
                redirectTo: "/sign-in",
                logout: true,
            };
        }
    },

    // Get the current user's identity
    getIdentity: async () => {
        try {
            const { data, error } = await authClient.getSession();

            if (error || !data?.user) {
                return null;
            }

            return {
                id: data.user.id,
                name: data.user.name,
                email: data.user.email,
                avatar: data.user.image,
            };
        } catch {
            return null;
        }
    },

    // Handle authentication errors
    onError: async (error) => {
        return {
            error,
        };
    },
};