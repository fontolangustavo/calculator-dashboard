export type LoginResponse = { token: string; user?: { id: string; name?: string; username?: string } };
export type RegisterResponse = { token: string; user?: { id: string; name?: string; username?: string } };
export type MeResponse = { user: { id: string; name?: string; username?: string } };

export function parseAuthToken(res: LoginResponse | RegisterResponse) {
    if (!res?.token) throw new Error("Token não encontrado na resposta.");

    return res.token;
}
