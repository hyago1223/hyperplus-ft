'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { envs as env } from '@/lib/env/index.js';

async function fetchUserImageUrl() {
    const res = await fetch(`${env.serverApi}/user/image`, {
        method: 'GET',
        credentials: 'include',
    });

    if (res.status === 204) return null;
    if (!res.ok) return undefined;

    const blob = await res.blob();
    return URL.createObjectURL(blob);
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [imageUser, setImageUser] = useState('/img/default.jpg');
    const [loading, setLoading] = useState(true);

    async function loadUser() {
        try {
            const url = await fetchUserImageUrl();

            if (url === null) {
                setIsLoggedIn(false);
                setImageUser('/img/default.jpg');
                return;
            }

            if (url === undefined) {
                console.error('Erro ao buscar foto');
                return;
            }

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
            const res = await fetch(`${env.serverApi}${env.routes.login}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password, isContinueLogged }),
            });
            const data = await res.json().catch(() => null);

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
                message: data?.message || "Email ou senha inválidos.",
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
            await fetch(`${env.serverApi}/user/logout`, {
                method: 'POST',
                credentials: 'include',
            });
        } finally {
            setIsLoggedIn(false);
            setImageUser('/img/default.jpg');
            router.push("/login");
        }
    }

    async function isTokenValid() {
        try{
            const res = await fetch(`${env.serverApi}/user/auth`,{
                method: "POST",
                credentials: "include",
            });

            if(!res.ok)
                return false;
            return true;
        }catch(err){
            console.error("Error ao autenticar");
        }
    }

    useEffect(() => {
        let ignore = false;
        async function loadInitialUser() {
            try {
                const url = await fetchUserImageUrl();

                if (ignore || url === null || url === undefined) {
                    if (url === null) {
                        setIsLoggedIn(false);
                        setImageUser('/img/default.jpg');
                    }
                    return;
                }

                setIsLoggedIn(true);
                setImageUser(url);
            } catch (err) {
                if (ignore) return;
                setIsLoggedIn(false);
                setImageUser('/img/default.jpg');
            } finally {
                if (!ignore) setLoading(false);
            }
        }

        loadInitialUser();
        return () => { ignore = true; };
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
                isTokenValid
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}