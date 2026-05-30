"use client";
import { useEffect, useState, useRef } from "react";
import menu from "../../components/menu";
import styles from "./styles.module.css";
import { ThemeSwitcher } from "@/components/css/ThemeSwitch.js";
import { useAuth } from "@/components/auth/AuthContext";

const object = {
    passwordChange: {
    current: "",
    new: "",
    confirm: "",
    },
    message: {
    type: "",
    text: "",
    }
}

export default function Settings() {
    const { logout } = useAuth();
    const [user, setUser] = useState(null);
    const [userImage, setUserImage] = useState("/img/default.jpg");
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState("");
    const [passwordData, setPasswordData] = useState(object.passwordChange);
    const [message, setMessage] = useState(object.message);

    const fileInputRef = useRef(null);

    async function loadUserData() {
        try {
            setLoading(true);

            const res = await fetch(`${menu.Server_api}/user/config`, {
                method: "GET",
                credentials: "include",
            });

            if (!res.ok) {
                setMessage({
                    type: "error",
                    text: "Você precisa estar logado para acessar essa página.",
                });
                return;
            }

            const data = await res.json();

            setUser(data.data);
            setName(data.data?.name || "");

            const resImage = await fetch(`${menu.Server_api}/user/image`, {
                method: "GET",
                credentials: "include",
            });

            if (resImage.ok) {
                const blob = await resImage.blob();
                const imageUrl = URL.createObjectURL(blob);
                setUserImage(imageUrl);
            } else {
                setUserImage("/img/default.jpg");
            }
        } catch (error) {
            console.error("Erro ao carregar perfil:", error);
            setMessage({
                type: "error",
                text: "Erro de conexão com o servidor.",
            });
        } finally {
            setLoading(false);
        }
    }

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];

        if (!file || !user?.id) return;

        const formData = new FormData();
        formData.append("UserPhoto", file);

        try {
            const previewUrl = URL.createObjectURL(file);
            setUserImage(previewUrl);

            const res = await fetch(`${menu.Server_api}/user/upload/photo/${user.id}`, {
                method: "POST",
                credentials: "include",
                body: formData,
            });

            if (!res.ok) {
                throw new Error("Falha no upload");
            }

            setMessage({
                type: "success",
                text: "Foto de perfil atualizada!",
            });
        } catch (err) {
            console.error("Erro ao enviar imagem:", err);

            setMessage({
                type: "error",
                text: "Erro ao enviar imagem.",
            });
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        await logout();
    };

    const handleChangeName = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`${menu.Server_api}/user/name`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ name }),
            });

            if (!res.ok) {
                throw new Error("Erro ao atualizar");
            }

            setMessage({
                type: "success",
                text: "Nome atualizado com sucesso!",
            });

            setUser((prev) => ({
                ...prev,
                name,
            }));
        } catch (err) {
            console.error("Erro ao alterar nome:", err);

            setMessage({
                type: "error",
                text: "Não foi possível alterar o nome.",
            });
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.new !== passwordData.confirm) {
            setMessage({
                type: "error",
                text: "As senhas não coincidem.",
            });
            return;
        }

        try {
            const res = await fetch(`${menu.Server_api}/user/password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    currentPassword: passwordData.current,
                    newPassword: passwordData.new,
                }),
            });

            if (!res.ok) {
                throw new Error("Erro ao alterar senha");
            }

            setPasswordData({
                current: "",
                new: "",
                confirm: "",
            });

            setMessage({
                type: "success",
                text: "Senha alterada com sucesso!",
            });
        } catch (err) {
            console.error("Erro ao alterar senha:", err);

            setMessage({
                type: "error",
                text: "Não foi possível alterar a senha.",
            });
        }
    };

    useEffect(() => {
        loadUserData();
    }, []);

    if (loading) {
        return <div className={styles.container}>Carregando perfil...</div>;
    }

    return (
        <div className={styles.container}>
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
                        onClick={() => fileInputRef.current?.click()}
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
                                <span className={styles.adminBadge}>
                                    administrador
                                </span>
                            )}
                        </div>

                        {user?.subscriptions && (
                            <span
                                className={`${styles.planBadge} ${
                                    styles[user.subscriptions.toLowerCase()]
                                }`}
                            >
                                {user.subscriptions.toUpperCase()}
                            </span>
                        )}

                        <p>{user?.email || "email@exemplo.com"}</p>

                        {user?.createdAt && (
                            <p style={{ fontSize: "0.8rem", opacity: 0.6 }}>
                                Membro desde{" "}
                                {new Date(user.createdAt).toLocaleDateString("pt-BR", {
                                    month: "long",
                                    year: "numeric",
                                })}
                            </p>
                        )}
                    </div>
                </section>

                <div className={styles.gridSection}>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>Dados Pessoais</div>

                        <form onSubmit={handleChangeName}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Nome de Exibição
                                </label>

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

                        <form onSubmit={handleChangePassword}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Senha Atual</label>

                                <input
                                    type="password"
                                    value={passwordData.current}
                                    onChange={(e) =>
                                        setPasswordData((prev) => ({
                                            ...prev,
                                            current: e.target.value,
                                        }))
                                    }
                                    placeholder="********"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Nova Senha</label>

                                <input
                                    type="password"
                                    value={passwordData.new}
                                    onChange={(e) =>
                                        setPasswordData((prev) => ({
                                            ...prev,
                                            new: e.target.value,
                                        }))
                                    }
                                    placeholder="********"
                                    className={styles.input}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>
                                    Confirmar Senha
                                </label>

                                <input
                                    type="password"
                                    value={passwordData.confirm}
                                    onChange={(e) =>
                                        setPasswordData((prev) => ({
                                            ...prev,
                                            confirm: e.target.value,
                                        }))
                                    }
                                    placeholder="********"
                                    className={styles.input}
                                />
                            </div>

                            <button type="submit" className={styles.btnAction}>
                                Alterar Senha
                            </button>
                        </form>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>Tema</div>
                        <ThemeSwitcher />
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>Conta</div>

                        <button onClick={handleLogout} className={styles.btnLogout}>
                            Deslogar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}