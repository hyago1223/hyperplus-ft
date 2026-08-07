'use client';
import { useState, useEffect } from "react";
import menu from "../../components/menu";
import style from "./style.module.css";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";

export default function Signup() {
    const router = useRouter();
    const [plansData, setPlansData] = useState([]);
    const [selectPlan, setSelectPlan] = useState([]);
    const [step, setStep] = useState("PLAN");
    const { login } = useAuth();

    useEffect(() => {
        async function loadPlans() {
            try {
                const res = await fetch(`${menu.Server_api}/plan`);
                const json = await res.json();
                setPlansData(json.data);
            } catch (err) {
                console.error("Erro ao carregar planos:", err);
            }
        }
        loadPlans();
    }, []);

    async function Sign(formData) {
        
        const userData = {
            plan: selectPlan.name,
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
            birthdate: formData.get("birthdate"),
        };

        const res = await fetch(`${menu.Server_api}/user/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        if (res.ok) {
            await login(userData.email, userData.password);
            router.refresh();
        } else {
            alert("Erro ao registrar");
        }
    }

    const HandleSelectPlan = (plan) => {
        setSelectPlan(plan);
        setStep("USER");
    };

    return (
        <div>
            {step === "PLAN" && (
                <div className={style.stepContainer}>
                    <h2 className={style.title}>Escolha seu plano</h2>

                    <div>
                        {plansData?.map((plan) => (
                            <div key={plan.id} className={style.planCard}>
                                <div>
                                    <h3>{plan.name}</h3>

                                    <span className={style.price}>
                                        {plan.monthly_price === "0.00"
                                            ? "Grátis"
                                            : `R$ ${plan.monthly_price}/mês`}
                                    </span>
                                </div>

                                <ul>
                                    <li>Qualidade: <strong>{plan.quality}</strong></li>
                                    <li>Resolução: <strong>{plan.resolution}</strong></li>
                                    <li>Dispositivos: <strong>{plan.devices}</strong></li>
                                </ul>

                                <button onClick={() => HandleSelectPlan(plan)}>
                                    Selecionar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {step === "USER" && (
                <form onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    Sign(formData);
                }}>
                    <h2>Coloque seus dados</h2>

                    <input name="name" type="text" placeholder="Nome" required />
                    <input name="email" type="email" placeholder="Email" required />
                    <input name="password" type="password" placeholder="Senha" required />
                    <input name="birthdate" type="date" required />

                    <button type="submit">Cadastrar</button>
                </form>
            )}
        </div>
    );
}
