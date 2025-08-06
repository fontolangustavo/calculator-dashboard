const API_BASE = process.env.NEXT_PUBLIC_API_BASE!;

export async function externalPost<T>(path: string, body: unknown, init?: RequestInit) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
        body: JSON.stringify(body),
        ...init,
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || `Erro ${res.status}`);
    }
    return data as T;
}

export async function externalGet<T>(path: string, init?: RequestInit) {
    const res = await fetch(`${API_BASE}${path}`, {
        ...init,
        headers: {
            ...(init?.headers || {}),
            "Content-Type": "application/json",
        },
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
        throw new Error(data?.message || `Erro ${res.status}`);
    }
    return data as T;
}
