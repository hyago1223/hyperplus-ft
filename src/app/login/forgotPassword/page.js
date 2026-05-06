import { useState } from "react";

export default function ForgotPassoword() {
    const [count,setCount] = useState(0);

    async function HandlerEmail(event) {
        event.preventDefault();
        
        setCount(1);
    }
    return (
        <main>
            <div>
                {count === 0 ? (
                    <form onSubmit={HandlerEmail}>
                        <h3> Coloque seu email, e enviaremos um link para mudar a senha</h3>
                        <input name="email" placeholder="Your Email" required/>
                        <button type="submit">Enviar</button>
                    </form>
                ) : (
                    <h2><span> Email Enviado </span></h2>
                )}
            </div>
        </main>
    );
}
