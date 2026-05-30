import { envs as env } from "@/lib/env";
import { UFetch } from "../fetch";

/**
 * Ele faz uma validação no email. Para verificar se e valido.
 * @param {string} email 
 * @returns {Promise<boolean>}
 */
export function isValidEmail( email ) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Ele verifica no banco de dados se o email é unico.
 * @param {string} email 
 * @returns {Promise<boolean>}
 */
export async function isNewEmailBD( email ) {
    if(!isValidEmail(email)) return;

    try{
        const res = await UFetch({ API_URL: env.serverApi, endPoint: ``, options: { method: "GET", body: email,},});

    }catch(err){
        return false;
    }
}

/**
 * Ele faz uma verificação da força de sua senha de 1 - 5.
 *
 * Níveis:
 * 1 = Muito fraca
 * 2 = Fraca
 * 3 = Média
 * 4 = Forte
 * 5 = Muito forte
 *
 * @param {string} password
 * @returns {Promise<number>}
 */
export function levelPassword(password) {
  if (!password || typeof password !== "string") return 1;
  
  let score = 0;

  const hasMinLength = password.length >= 8;
  const hasGoodLength = password.length >= 12;
  const hasLowercase = /[a-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (hasMinLength) score++;
  if (hasGoodLength) score++;
  if (hasLowercase && hasUppercase) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  const commonPasswords = ["123456", "12345678", "password", "senha", "admin","qwerty",];

  if (commonPasswords.includes(password.toLowerCase())) return 1;
  
  const hasRepeatedChars = /(.)\1{2,}/.test(password);

  if (hasRepeatedChars) score--;
  

  if (score < 1) return 1;
  if (score > 5) return 5;
  return score;
}