/* eslint-disable @typescript-eslint/no-explicit-any */
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

    (cookies() as any).set("session", session, {
        expires: (exp as number) * 1000,
        path: "/",
        httpOnly: true,
    });
}


export async function getSession() {
    const session = (cookies() as any).get("session")?.value;
    if (!session) return null;
    return await openSessionToken(session);
}

async function isSessionValid() {
    const sessionCookie = (cookies() as any).get("session");

    if (sessionCookie) {
        const { value } = sessionCookie;
        const { exp } = await openSessionToken(value);
        const currentDate = new Date().getTime();

        return (exp as number) * 1000 > currentDate;
    }

    return false;
}

function destroySession() {
    (cookies() as any).delete("session");
}

const AuthService = {
    openSessionToken,
    createSessionToken,
    isSessionValid,
    destroySession,
};

export default AuthService;