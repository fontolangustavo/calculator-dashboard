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


export async function externalDelete<T>(path: string, init?: RequestInit) {
    const res = await fetch(`${API_BASE}${path}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            ...(init?.headers ?? {}),
        },
        ...init,
    });

    let data: any = null;
    try {
        data = await res.json();
    } catch (_) { }

    if (!res.ok) {
        const msg =
            data?.message ||
            `HTTP ${res.status} while deleting resource`;
        const error: any = new Error(msg);
        error.status = res.status;
        if (data?.errors) error.errors = data.errors;
        throw error;
    }

    return (data as T) ?? (undefined as unknown as T);
}