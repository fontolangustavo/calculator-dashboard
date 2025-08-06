export const SESSION_COOKIE = process.env.SESSION_COOKIE_NAME ?? "__session";
export const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
};
