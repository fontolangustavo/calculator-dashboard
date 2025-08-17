import { externalPost } from "@/lib/api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function standardError(status: number, message: string, extra?: Record<string, unknown>) {
    return NextResponse.json(
        { status, message, errors: extra },
        { status }
    );
}

export async function POST(req: Request) {
    try {
        const cookieStore: any = cookies();
        const token = cookieStore.get("__session")?.value;

        const body = await req.json();
        const data = await externalPost(`/operations`,
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        return NextResponse.json(data);
    } catch (err: any) {
        console.error("ERROR in /api/operations:", err);

        return standardError(500, err.message ?? "Request failed", err.errors);
    }
}
