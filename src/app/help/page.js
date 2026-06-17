"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthContext";
import { envs as env } from "@/lib/env";

export default function Help() {
  const { isLoggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [status, setStatus] = useState("");

  const handlerSubmit = async (e) => {
    e.preventDefault();

    setStatus("Enviando...");

    if (!isLoggedIn && !email) {
      setStatus("Você precisa colocar seu email!");
      return;
    }

    if (!mensagem) {
      setStatus("Você precisa colocar uma mensagem.");
      return;
    }

    try {
      let endpoint = "";
      let bodyData = {};

      if (isLoggedIn) {
        endpoint = `${env.serverApi}/help`;
        bodyData = { mensagem };
      } else {
        endpoint = `${env.serverApi}/help/email`;
        bodyData = { mensagem, email };
      }
    
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        setStatus("Mensagem enviada com sucesso! Em breve entraremos em contato.");
        setEmail("");
        setMensagem("");
      } else {
        const errorData = await res.json();

        setStatus(
          `Erro (${res.status}): ${errorData.message || "Falha ao processar."}`
        );
      }
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      setStatus("Erro ao enviar a mensagem.");
    }
  };

  return (
    <main>
      <h1>Help Center</h1>

      <div>
        <h3>Faça sua pergunta</h3>

        {status && <p>{status}</p>}

        <form onSubmit={handlerSubmit}>
          {!isLoggedIn && (
            <div>
              <label>Email:</label>
              <input
                placeholder="exemplo@dominio.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          )}

          <div>
            <label>Mensagem:</label>
            <textarea
              value={mensagem}
              onChange={(e) => setMensagem(e.target.value)}
            />
          </div>

          <button type="submit">Enviar</button>
        </form>
      </div>
    </main>
  );
}