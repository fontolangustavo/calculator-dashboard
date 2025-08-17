"use client";
import { createContext, useContext, useEffect, useState } from "react";

type UUID = `${string}-${string}-${string}-${string}-${string}`;

type AccountStatus = "ACTIVE" | "INACTIVE";

export interface Account {
    id: UUID;
    username: string;
    balance: number;
    status: AccountStatus;
}

type AuthCtx = {
    loading: boolean;
    authenticated: boolean;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    user: Account | null;
};

const Ctx = createContext<AuthCtx>({
    loading: true,
    authenticated: false,
    logout: async () => { },
    refreshUser: async () => { },
    user: null
});

const safeParseJson = (text: string) => {
    if (!text) return undefined;
    try {
        return JSON.parse(text);
    } catch {
        return undefined;
    }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);
    const [user, setUser] = useState<Account | null>(null);

    const refreshUser = async () => {
        try {
            const res = await fetch("/api/auth/me");

            setAuthenticated(res.ok);

            const text = await res.text();
            const data = safeParseJson(text);

            setUser(data.user);
        } catch {
            setAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const logout = async () => {
        await fetch("/api/auth/logout", { method: "POST" });
        window.location.href = "/login";
    };

    return <Ctx.Provider
        value={{
            loading,
            authenticated,
            logout,
            refreshUser,
            user
        }}
    >
        {children}
    </Ctx.Provider>;
}

export const useAuth = () => useContext(Ctx);
