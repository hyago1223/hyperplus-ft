'use client';
import { useEffect, useState } from "react";
import { fetchEmail } from "@/service/fetch";
import { isValidEmail } from "@/service/middleware";
import styles from './styles.module.css'
import Link from "next/link";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [boxMessage, setBoxMessage] = useState("");
    const [messageType, setMessageType] = useState("");
    const [loading, setLoading] = useState(false);

    async function HandlerEmail(event) {
        event.preventDefault();

        if (!email.trim()) {
            setBoxMessage("Por favor, digite seu email");
            setMessageType("error");
            return;
        }

        if (!isValidEmail(email)) {
            setBoxMessage("Email inválido. Por favor, verifique");
            setMessageType("error");
            return;
        }

        setLoading(true);
        setBoxMessage("");
        setMessageType("");

        try {
            const result = await fetchEmail(email);
            
            if (!result) {
                throw new Error("Email de recuperação não enviado");
            }

            setBoxMessage("Email enviado com sucesso! Verifique sua caixa de entrada");
            setMessageType("success");
            setEmail("");
            
        } catch (err) {
            setBoxMessage("Erro ao enviar email. Tente novamente mais tarde");
            setMessageType("error");
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (messageType === "error") {
            const timer = setTimeout(() => {
                setBoxMessage("");
                setMessageType("");
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [messageType]);

    return (
        <main className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>Recuperar Senha</h1>
                <p className={styles.subtitle}>
                    Coloque seu email e enviaremos um link para resetar sua senha
                </p>

                {boxMessage && (
                    <div className={`${styles.messageBox} ${messageType === "success" ? styles.messageSuccess : styles.messageError}`}>
                        <span className={styles.messageIcon}>
                            {messageType === "success" ? "✓" : "✕"}
                        </span>
                        <span>{boxMessage}</span>
                    </div>
                )}

                <form onSubmit={HandlerEmail} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label htmlFor="email" className={styles.label}>Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="seu@email.com"
                            className={styles.input}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        className={styles.button}
                        disabled={loading}
                    >
                        <span className={styles.buttonContent}>
                            {loading && <span className={styles.spinner}></span>}
                            {loading ? "Enviando..." : "Enviar Email"}
                        </span>
                    </button>
                </form>

                <div className={styles.backLink}>
                    <Link href="/login">
                        Voltar para Login
                    </Link>
                </div>
            </div>
        </main>
    );
}
