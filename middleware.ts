import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/cookies";

const PROTECTED_PREFIX = "/dashboard";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    if (pathname.startsWith(PROTECTED_PREFIX)) {
        const token = req.cookies.get(SESSION_COOKIE)?.value;
        if (!token) {
            const url = req.nextUrl.clone();
            url.pathname = "/login";
            url.searchParams.set("next", pathname); // para redirecionar após login
            return NextResponse.redirect(url);
        }
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/dashboard/:path*"],
};
