import { NextRequest, NextResponse } from "next/server";
import AuthService from "./modules/auth/services/auth-services";

export const config = {
    matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};

const publicRoutes = ["/not-found", "/portal/sign-in"];

async function hasValidSession(token: string | undefined) {
    if (!token) return false;

    try {
        const { exp } = await AuthService.openSessionToken(token);
        return typeof exp === "number" && exp * 1000 > Date.now();
    } catch {
        return false;
    }
}

export async function proxy(req: NextRequest) {
    const pathname = req.nextUrl.pathname;

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    const session = await hasValidSession(req.cookies.get("session")?.value);
    if (!session) {
        const isAPIRoute = pathname.startsWith("/api");

        if (isAPIRoute) {
            return NextResponse.json({ message: "Não autorizado" }, { status: 401 });
        }

        return NextResponse.redirect(new URL("/portal/sign-in", req.url));
    }

    return NextResponse.next();
}
