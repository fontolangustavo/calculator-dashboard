"use client";
import { createContext, useContext, useEffect, useState } from "react";

type AuthCtx = {
    loading: boolean;
    authenticated: boolean;
    logout: () => Promise<void>;
};
const Ctx = createContext<AuthCtx>({ loading: true, authenticated: false, logout: async () => { } });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/auth/me");
                setAuthenticated(res.ok);
            } catch {
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    };

    return <Ctx.Provider value={{ loading, authenticated, logout }}>{children}</Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
