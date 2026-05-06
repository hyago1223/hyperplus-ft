'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import menu from '../menu.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [imageUser, setImageUser] = useState('/img/default.jpg');
    const [loading, setLoading] = useState(true);

    async function loadUser() {
        try {
            setLoading(true);

            const res = await fetch(`${menu.Server_api}/user/image`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!res.ok) {
                setIsLoggedIn(false);
                setImageUser('/img/default.jpg');
                return;
            }

            const blob = await res.blob();
            const url = URL.createObjectURL(blob);

            setIsLoggedIn(true);
            setImageUser(url);
        } catch (err) {
            setIsLoggedIn(false);
            setImageUser('/img/default.jpg');
        } finally {
            setLoading(false);
        }
    }

    async function login({ email, password, isContinueLogged }) {
        try {
            const res = await fetch(`${menu.Server_api}/user/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    email,
                    password,
                    isContinueLogged,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                setIsLoggedIn(true);
                await loadUser();
                router.push("/home");

                return {
                    success: true,
                };
            }

            return {
                success: false,
                message: data.message || "Email ou senha inválidos.",
            };
        } catch (err) {
            console.error("Erro ao logar:", err);

            return {
                success: false,
                message: "Erro de conexão com o servidor.",
            };
        }
    }
    async function logout() {
        try {
            await fetch(`${menu.Server_api}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } finally {
            setIsLoggedIn(false);
            setImageUser('/img/default.jpg');
            router.push("/login");
        }
    }

    useEffect(() => {
        loadUser();
    }, []);

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                imageUser,
                loading,
                loadUser,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}