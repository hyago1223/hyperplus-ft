import { NextResponse } from "next/server";
import { envs as env } from "./lib/env";
const apiUrl = env.serverApi || "http://localhost:3000";

export async function proxy(req) {
    console.log("Middleware ativou:", req.nextUrl.pathname);
    const token = req.cookies.get("token")?.value;
    const pathname = req.nextUrl.pathname;

    const publicRoutes = ["/login", "/signup", "/"];
    const restrictedRoutes = ["/admin"];

    if (publicRoutes.includes(pathname) && token) {
        return NextResponse.redirect(new URL("/home", req.url));
    }

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    if(token && !(publicRoutes.includes(pathname))){
         const res = await fetch(`${apiUrl}/user/auth`, {
                method: "GET",
                headers:{
                    Cookie: `token=${token}`,
                },
                cache: 'no-store',
            });
        if(!res.ok)
            await fetch(`${env.serverApi}/user/logout`, {method: 'POST',headers:{Cookie: `token=${token}`,},cache: 'no-store',});
    }

    if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (restrictedRoutes.includes(pathname)) {
        try {
            const res = await fetch(`${apiUrl}/admin/isAdmin`, {
                method: "GET",
                headers:{
                    Cookie: `token=${token}`,
                },
                cache: 'no-store',
            });

            if (!res.ok) {
                return NextResponse.redirect(new URL("/home", req.url));
            }
        } catch (err) {
            console.error("Erro ao verificar admin:", err);
            return NextResponse.redirect(new URL("/home", req.url));
        }
    }

    return NextResponse.next();
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