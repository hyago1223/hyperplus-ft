import { NextResponse } from "next/server";

export function middleware(req) {
    const token = req.cookies.get("token")?.value;

    const publicRoutes = ["/login", "/signup", "/"];

    if (publicRoutes.includes(req.nextUrl.pathname)) {
        return NextResponse.next();
    }

    if (!token) {
        const url = new URL("/login", req.url);
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/home/:path*",   
        "/search/:path*",     
        "/admin/:path*",      
        "/player/:path*",
        "/",
    ],
};