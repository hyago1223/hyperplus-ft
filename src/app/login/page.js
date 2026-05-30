'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./style.module.css";
import { useAuth } from "@/components/auth/AuthContext.js";

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const router = useRouter();

    async function HandleSubmit(event) {
        event.preventDefault();

        setErrorMessage("");
        setLoading(true);

        const formData = new FormData(event.target);

        const email = formData.get("email");
        const password = formData.get("password");
        const isContinueLogged = formData.get("isContinueLogged") === "on";

        try {
            const result = await login({
                email,
                password,
                isContinueLogged,
            });

            if (!result?.success) {
                setErrorMessage(result?.message || "Erro ao fazer login.");
            }
        } catch (err) {
            console.error("Erro ao fazer login:", err);
            setErrorMessage("Erro de conexão com o servidor.");
        } finally {
            setLoading(false);
        }
    }

    const HandlerCode = () => {
        router.push("/login/EmailCode");
    };

    return (
        <main className={styles.container}>
            {errorMessage && (
                <div className={styles.containerError}>
                    <p>{errorMessage}</p>
                </div>
            )}

            <div className={styles.card}>
                <div className={styles.header}>
                    <h2>Welcome Back</h2>
                    <p>Entre em sua conta Hyperplus</p>
                </div>

                <form onSubmit={HandleSubmit} className="login-form">
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email</label>

                        <input
                            className={styles.input}
                            type="email"
                            name="email"
                            placeholder="Email"
                            required
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.labelRow}>
                            <label htmlFor="password">Senha</label>

                            <Link href="/login/forgotPassword" className={styles.link}>
                                Esqueceu Senha/email
                            </Link>
                        </div>
                    </div>

                    <div className={styles.passwordWrapper}>
                        <input
                            className={styles.input}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Your password"
                            required
                        />

                        <button
                            type="button"
                            className={styles.toggleBtn}
                            onClick={() => setShowPassword((prev) => !prev)}
                        >
                            {showPassword ? "Ocultar" : "Mostrar"}
                        </button>
                    </div>

                    <div className={styles.continueLogged}>
                        <label htmlFor="isContinueLogged">
                            <input
                                className={styles.input}
                                type="checkbox"
                                name="isContinueLogged"
                            />
                            Continuar logado
                        </label>
                    </div>

                    <button
                        type="submit"
                        className={styles.btnSubmit}
                        disabled={loading}
                    >
                        {loading ? "Entrando..." : "Login"}
                    </button>
                </form>

                <h3 hidden>OR</h3>
                <div hidden><button onClick={HandlerCode}>Login with code</button></div>

                <div className={styles.footer}>
                    <span>Não tem uma conta? </span>

                    <Link href="/signup" className={styles.link}>
                        Assine agora
                    </Link>
                </div>
            </div>
        </main>
    );
}