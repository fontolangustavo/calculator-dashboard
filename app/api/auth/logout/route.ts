import { NextResponse } from "next/server";
import { SESSION_COOKIE } from "@/lib/cookies";

export async function POST() {
    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, "", { path: "/", httpOnly: true, maxAge: 0 });
    return res;
}
