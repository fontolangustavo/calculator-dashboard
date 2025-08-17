export type DateLike = string | number | Date;

function toDate(value?: DateLike): Date | null {
    if (!value && value !== 0) return null;
    const d = value instanceof Date ? value : new Date(value);
    return isNaN(d.getTime()) ? null : d;
}

export function formatRelativeTime(value?: DateLike, locale: string = "en") {
    const d = toDate(value);
    if (!d) return "-";

    const now = Date.now();
    const diffSeconds = Math.round((d.getTime() - now) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

    const units: [Intl.RelativeTimeFormatUnit, number][] = [
        ["year", 60 * 60 * 24 * 365],
        ["month", 60 * 60 * 24 * 30],
        ["week", 60 * 60 * 24 * 7],
        ["day", 60 * 60 * 24],
        ["hour", 60 * 60],
        ["minute", 60],
        ["second", 1],
    ];

    for (const [unit, seconds] of units) {
        const delta = Math.trunc(diffSeconds / seconds);
        if (Math.abs(delta) >= 1 || unit === "second") {
            return rtf.format(delta, unit);
        }
    }
    return "-";
}

export function formatFullDate(value?: DateLike, locale: string = "en-US") {
    const d = toDate(value);
    if (!d) return "-";
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    }).format(d);
}
