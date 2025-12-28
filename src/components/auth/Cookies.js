'use server';
import { cookies } from "next/headers";

export async function setAuthCookieToken(token) {
    const cookieStore = await cookies(); 

    cookieStore.set({
        name: "token",
        value: token,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/"
    });
}

export async function RemoveCookie(id) {
    const cookieStore = await cookies();
    cookieStore.delete(id);
}

export async function setAuthCookieTokenRefresh(token_r) {
    const cookieStore = await cookies(); 
    cookieStore.set({
        name: "refresh_token",
        value: token_r,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/"
    });
}

export async function getCookie(name) {
    const cookieStore = await cookies();
    const cookie = cookieStore.get(`${name}`);
    return cookie?.value || null;
}