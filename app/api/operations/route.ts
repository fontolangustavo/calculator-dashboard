import { externalPost } from "@/lib/api";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("__session")?.value;

        const body = await req.json();
        console.log("hereee", body)
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
    } catch (error) {
        console.error("ERROR in /api/operations/types:", error);
        return NextResponse.json(
            { message: "Erro interno ao buscar os registros." },
            { status: 500 }
        );
    }
}
