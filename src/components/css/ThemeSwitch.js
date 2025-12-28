"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import styles from '@/components/css/themeSwitch/styles.module.css'

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);


  useEffect(() => {
    setMounted(true);
  }, []);

  // Se não estiver montado, não renderiza nada (ou renderiza um placeholder)
  if (!mounted) {
    return null;
  }

  return (
    <button className={styles.button}
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
    </button>
  );
}