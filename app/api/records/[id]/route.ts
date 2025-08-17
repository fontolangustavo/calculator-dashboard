import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { externalDelete } from "@/lib/api";
import { SESSION_COOKIE } from "@/lib/cookies";

type RouteParams = { params: { id: string } };

export async function DELETE(_req: Request, { params }: RouteParams) {
    const { id } = params;

    if (!id) {
        return NextResponse.json(
            { message: "Missing record id." },
            { status: 400 }
        );
    }

    try {
        const cookieStore: any = await cookies();
        const token = cookieStore.get(SESSION_COOKIE)?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Not authenticated." },
                { status: 401 }
            );
        }

        const data = await externalDelete(`/records/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        const status = error?.status || 500;
        const message =
            error?.message || "Request failed";

        return NextResponse.json(
            { message, ...(error?.errors ? { errors: error.errors } : {}) },
            { status }
        );
    }
}
