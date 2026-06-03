'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { envs as env } from '@/lib/env/index.js';
import { UFetch } from '@/service/fetch';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const router = useRouter();

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [imageUser, setImageUser] = useState('/img/default.jpg');
    const [loading, setLoading] = useState(true);

    async function loadUser() {
        try {
            setLoading(true);

            const res = await fetch(`${env.serverApi}/user/image`, {
                method: 'GET',
                credentials: 'include',
            });

            if (res.status === 204) {
                setImageUser('/img/default.jpg');
                return;
            }

            if (!res.ok) {
                console.error('Erro ao buscar foto');
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
            const res = await UFetch({API_URL: env.serverApi,endPoint: env.routes.login,options: { method: "POST", body: { email, password, isContinueLogged},},});
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
            const res = fetch(`${env.serverApi}/user/auth`,{
                method: "GET",
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
                isTokenValid,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}