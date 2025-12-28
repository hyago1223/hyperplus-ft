'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import menu from "../../components/menu.js";
import { useState } from "react";
import styles from './style.module.css'
import { setAuthCookieToken } from "@/components/auth/Cookies.js"

export default function Login() {
    const [showPassword,setShowPassword] = useState(false);
    const [showboxError,setShowBoxError] = useState(false);
    let databoxError = '';
    const router = useRouter();

    async function HandleSubmit(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const email = formData.get("email");
        const password = formData.get("password");
        
        try{
            const res = await fetch(`${menu.Server_api}/user/login`,{
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({email,password}),
            });
        
            const data = await res.json();

            if(res.ok){
                await setAuthCookieToken(data.token);
                router.push("/home");
            }else{
                databoxError = data.message
            }
        }catch(err){
            console.error("Erro ao logar:",err);
        }

    }

    const HandlerCode = () =>{
        router.push("/login/EmailCode");
    }
    return (
        <main className={styles.container}>
            <div className={styles.containerError}>
                <p>{databoxError}</p>
            </div>
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
                            <Link href={'/login/forgot'} className={styles.link}>Esqueceu Senha/email</Link>
                        </div>
                    </div>

                    <div className={styles.passwordWrapper}>
                        <input
                        className={styles.input}
                        type={showPassword ? "text" : "password"} 
                        name='password' 
                        placeholder="Your password"
                        required
                        />
                        <button type="button" className={styles.toggleBtn} onClick={() => setShowPassword(!showPassword)}>MostrarSenha</button>
                    </div>
                    
                    
                    <button type="submit" className={styles.btnSubmit}>Login</button>
                </form>
                <h3 hidden> OR </h3>
                <div hidden>
                    <button onClick={HandlerCode}>Login with code</button>
                </div>

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
