"use client";
import { useState } from "react";
import menu from "../../components/menu";
import { getCookie } from "@/components/auth/Cookies";

export default function Help() {
  const token = getCookie("token") || null;
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handlerSubmit = async (e) => {
    e.preventDefault()
    setStatus("Enviando");
    if(!token || !email){
      return setStatus("Voce precisa colocar seu email!");
    }

    if(!mensagem){
      return setStatus("Voce precisa colocar uma messagem");
    }

    try{
      let endpoint = '';
      let bodyData = {};
      let headersData = {
        'Content-Type': 'application/json',
      };

      if (token) {
        endpoint = `${menu.Server_api}/help`;
        bodyData = { mensagem };
        headersData.Authorization = `Bearer ${token}`; 
      } else {
        endpoint = `${menu.Server_api}/help/email`;
        bodyData = { mensagem, email };
      }

      const res = await fetch(endpoint, {
        method: "POST",
        headers: headersData,
        body: JSON.stringify(bodyData),
      });

      if (res.ok) {
        setStatus("Mensagem enviada com sucesso! Em breve entraremos em contato.");
        setEmail('');
        setMensagem('');
      } else {
        const errorData = await res.json();
        setStatus(`Erro (${res.status}): ${errorData.message || 'Falha ao processar.'}`);
      }
    }catch(err){
      setStatus("Erro ao enviar a messagem")
    }
  }

  return (
    <main>
      <h1>Help Center</h1>
      <div>
        <h3> Faça sua pergunta </h3>
        <form onSubmit={handlerSubmit}>
          <div>
            <label>Email:</label>
            <input placeholder="exemplo@dominio.tipo" type="email" value={email} onChange={(e) => {setEmail(e.target.value)}}/>
          </div>
          <div>
            <label>Messagem: </label>
            <textarea value={mensagem} onChange={ (e) => {setMensagem(e.target.value)} }/>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </main>
  );
}