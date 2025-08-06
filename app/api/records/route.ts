import { externalGet } from "@/lib/api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("__session")?.value;

        const url = new URL(req.url);
        const qs = url.searchParams.toString();

        const data = await externalGet(`/records?${qs}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return NextResponse.json(data);
    } catch (error) {
        console.error("ERROR in /api/records:", error);
        return NextResponse.json(
            { message: "Erro interno ao buscar os registros." },
            { status: 500 }
        );
    }
}
