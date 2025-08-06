import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/cookies";
import { externalGet } from "@/lib/api";
import { MeResponse } from "@/lib/auth";

export async function GET() {
    const token = cookies().get(SESSION_COOKIE)?.value;
    if (!token) return NextResponse.json({ authenticated: false }, { status: 401 });

    const me = await externalGet<MeResponse>("/auth/me", { headers: { Authorization: `Bearer ${token}` } });

    return NextResponse.json({ authenticated: true, user: me.user });
}