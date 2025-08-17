"use client";

import { useEffect, useState } from "react";

export function useUserTimeZone() {
    const [tz, setTz] = useState<string | undefined>(undefined);

    useEffect(() => {
        try {
            const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            setTz(zone);
        } catch { }
    }, []);

    return tz;
}
