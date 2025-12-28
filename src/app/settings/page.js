"use client";
import { useEffect, useState, useRef,useContext } from "react";
import menu from "../../components/menu";
import styles from "./styles.module.css";
import {getCookie,RemoveCookie} from '@/components/auth/Cookies.js';
import { ThemeSwitcher } from '@/components/css/ThemeSwitch.js';
import { useRouter } from "next/navigation";

export default function Settings() {
    const [user, setUser] = useState(null);
    const [userImage, setUserImage] = useState("/img/default.jpg");
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [passwordData, setPasswordData] = useState({ current: "", new: "", confirm: "" });
    const router = useRouter();
    const [message, setMessage] = useState({ type: "", text: "" });

    const fileInputRef = useRef(null);

    async function loadUserData() {
        try {
            const token = await getCookie('token');
            if (!token) return;
            const res = await fetch(`${menu.Server_api}/user/config`, {
                headers: { 
                    "Authorization": `Bearer ${token}` 
                },
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data.data);
                setName(data.name || "");
            }
            const resImage = await fetch(`${menu.Server_api}/user/image`, {
                headers: { "Authorization": `Bearer ${token}` },
            });

            if (resImage.ok) {
                const blob = await resImage.blob();
                setUserImage(URL.createObjectURL(blob));
            }

        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            setMessage({ type: "error", text: "Erro de conexão com o servidor." });
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file || !user?.id) return;

        const token = await getCookie("token");
        const formData = new FormData();
        formData.append("UserPhoto", file);

        try {
            setUserImage(URL.createObjectURL(file));
            const res = await fetch(`${menu.Server_api}/user/upload/photo/${user.id}`, {
                method: "POST",
                headers: { "Authorization": `Bearer ${token}` },
                body: formData,
            });

            if (!res.ok) throw new Error("Falha no upload");
            
            setMessage({ type: "success", text: "Foto de perfil atualizada!" });
        } catch (err) {
            setMessage({ type: "error", text: "Erro ao enviar imagem." });
        }
    };
    const HandlerLogout = async (e) =>{
        e.preventDefault();
        await RemoveCookie('token');
        router.push('/');
    };

    const handleChangeName = async (e) => {
        e.preventDefault();
        const token = await getCookie("token");

        try {
            const res = await fetch(`${menu.Server_api}/user/${user.id}`, { 
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ name: name }),
            });

            if (!res.ok) throw new Error("Erro ao atualizar");

            setMessage({ type: "success", text: "Nome atualizado com sucesso!" });
            setUser({ ...user, name: name });

        } catch (err) {
            setMessage({ type: "error", text: "Não foi possível alterar o nome." });
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    if (loading) {
        return <div className={styles.container}>Carregando perfil...</div>;
    }

    return (
        <main className={styles.container}>
            <div className={styles.wrapper}>
                
                <h1 className={styles.title}>Minha Conta</h1>
                {message.text && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}
                <section className={styles.profileCard}>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        className={styles.hiddenInput}
                    />

                    <div 
                        className={styles.avatarWrapper} 
                        onClick={() => fileInputRef.current.click()}
                        title="Alterar foto"
                    >
                        <img 
                            src={userImage} 
                            alt="Avatar" 
                            className={styles.avatar} 
                        />
                        <div className={styles.editOverlay}>
                            <span className={styles.iconCamera}>📷</span>
                        </div>
                    </div>

                    <div className={styles.userInfo}>
                        <div className={styles.nameWrapper}>
                            <h2>{user?.name || "Usuário"}</h2>
                            {user?.role === true && (
                                <span className={styles.adminBadge}>administrador</span>
                            )}
                        </div>
                        {user?.subscriptions && (
                            <span className={`${styles.planBadge} ${styles[user.subscriptions.toLowerCase()]}`}>
                                {user.subscriptions.toUpperCase()}
                            </span>
                        )}
                        <p>{user?.email || "email@exemplo.com"}</p>
                        <p style={{fontSize: '0.8rem', opacity: 0.6}}>Membro desde {new Date(user?.createdAt).toLocaleDateString("pt-BR", {month: "long",year: "numeric"})}</p>
                    </div>
                </section>
                <div className={styles.gridSection}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>Dados Pessoais</div>
                        <form onSubmit={handleChangeName}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nome de Exibição</label>
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={styles.input}
                                />
                            </div>
                            <button type="submit" className={styles.btnAction}>
                                Salvar Alterações
                            </button>
                        </form>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>Segurança</div>
                        <form>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nova Senha</label>
                                <input 
                                    type="password" 
                                    placeholder="********" 
                                    className={styles.input} 
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Confirmar Senha</label>
                                <input 
                                    type="password" 
                                    placeholder="********" 
                                    className={styles.input} 
                                />
                            </div>
                            <button type="button" className={styles.btnAction}>
                                Alterar Senha
                            </button>
                        </form>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>Tema</div>
                        <ThemeSwitcher/>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>Conta</div>
                        <button onClick={HandlerLogout} className={styles.btnLogout}>Deslogar</button>
                    </div>
                </div>
            </div>
        </main>
    );
}