import { NextResponse } from "next/server";
import { externalPost } from "@/lib/api";
import { parseAuthToken } from "@/lib/auth";
import { SESSION_COOKIE, cookieOptions } from "@/lib/cookies";

export async function POST(req: Request) {
    const body = await req.json();

    const data = await externalPost("/auth/register", body);

    const token = parseAuthToken(data);

    const res = NextResponse.json({ ok: true, user: data.user ?? null });

    res.cookies.set(SESSION_COOKIE, token, cookieOptions);
    
    return res;
}
