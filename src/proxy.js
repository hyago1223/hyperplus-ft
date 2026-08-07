import { NextResponse } from "next/server";
import { envs as env } from "./lib/env";
const apiUrl = env.serverApi || "http://localhost:3000";

export async function proxy(req) {
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    const publicRoutes = ["/login", "/signup", "/"];
    const restrictedRoutes = ["/admin"];

    const tokenIsValid = token ? await testToken(token) : false;

    if (publicRoutes.includes(pathname) && tokenIsValid) return redirect("/home", req);

    if (publicRoutes.includes(pathname)) return NextResponse.next();

    if (!tokenIsValid) return redirect("/login", req);
    
    if (restrictedRoutes.includes(pathname) && !(await testToken(token, { isAdminCheck: true }))) return redirect("/home", req);

    return NextResponse.next();
}

async function testToken(token, { isAdminCheck = false } = {}) {
    const endpoint = isAdminCheck ? "/admin/isAdmin" : "/user/auth";
    if (!token) return false;
    const res = await fetch(`${apiUrl}${endpoint}`, {
        method: "POST",
        headers: {
            Cookie: `token=${token}`,
        },
        cache: 'no-store',
    });
    if(!res.ok) {
        await fetch(`${apiUrl}/user/logout`, {
            method: "POST",
            headers: {
                Cookie: `token=${token}`,
            },
            cache: 'no-store',
        });
    }
    const isValid = res.ok || false;
    return isValid;
}


async function redirect(URLs, req) {
    return NextResponse.redirect(new URL(URLs, req.url));
}

export const config = {
    matcher: [
        "/login",
        "/signup",
        "/home/:path*",
        "/search/:path*",
        "/admin/:path*",
        "/player/:path*",
        "/settings/:path*",
    ],
};