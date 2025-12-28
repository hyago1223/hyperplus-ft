'use client';
import Link from 'next/link';
import styles from './css/Footer/style.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>

        <div className={styles.socials}>
            <span>Instagram</span>
            <span>Twitter</span>
            <span>Facebook</span>
        </div>

        <div className={styles.linksGrid}>
          <ul>
            <li><Link href="/faq">Perguntas Frequentes</Link></li>
            <li><Link href="/relacoes">Relações com Investidores</Link></li>
            <li><Link href="/privacy">Privacidade</Link></li>
            <li><Link href="/connect-test">Teste de Conexão e velocidade</Link></li>
          </ul>
          <ul>
            <li><Link href="/help">Central de Ajuda</Link></li>
            <li><Link href="/jobs">Oportunidades de Carreiras na H+</Link></li>
            <li><Link href="/cookies">Preferências de Cookies</Link></li>
            <li><Link href="/avisos">Avisos Legais</Link></li>
          </ul>
          <ul>
            <li><Link href="/settings">Conta</Link></li>
            <li><Link href="/ways-to-watch">Formas de Assistir</Link></li>
            <li><Link href="/corp">Informações Corporativas</Link></li>
          </ul>
          <ul>
            <li><Link href="/media">Media Center</Link></li>
            <li><Link href="/terms">Termos de Uso</Link></li>
            <li><Link href="/contact">Entre em Contato</Link></li>
          </ul>
        </div>

        <div className={styles.supportText}>
          Precisa de ajuda? Fale com nosso time em{' '}
          <a href="mailto:suporte@hyperplus.com" className={styles.emailLink}>
            suporte@hyperplus.com
          </a>
        </div>

        <div className={styles.copyright}>
          <p>© {currentYear} HyperPlus Streaming. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}