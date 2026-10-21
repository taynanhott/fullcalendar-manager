import * as jose from "jose";
import { cookies } from "next/headers";

async function openSessionToken(token: string) {
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_AUTH_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);

    return payload;
}

async function createSessionToken(payload = {}) {
    const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_AUTH_SECRET);
    const session = await new jose.SignJWT(payload)
        .setProtectedHeader({
            alg: "HS256",
        })
        .setExpirationTime("1d")
        .sign(secret);
    const { exp } = await openSessionToken(session);

    const cookieStore = await cookies();
    cookieStore.set("session", session, {
        expires: new Date((exp as number) * 1000),
        path: "/",
        httpOnly: true,
    });
}

export async function getSession() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;
    return await openSessionToken(session);
}

async function isSessionValid() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie) return false;

    try {
        const { exp } = await openSessionToken(sessionCookie.value);
        return (exp as number) * 1000 > Date.now();
    } catch {
        return false;
    }
}

async function destroySession() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
}

const AuthService = {
    openSessionToken,
    createSessionToken,
    isSessionValid,
    destroySession,
};

export default AuthService;
