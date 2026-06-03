'use client';
import styles from '@/components/css/admin/styles.module.css';
import { useState } from 'react';
import User from "@/components/admin/sections/User.js";
import Status from '@/components/admin/sections/Status.js';
import Serie from '@/components/admin/sections/Serie.js';
import Episode from "@/components/admin/sections/Episode.js";

export default function AdminUploadPage() {
  const [windows, setWindows] = useState("");

  return (
    <div className={styles.mainContainer}>
      <h1>Painel <strong>Admin</strong> (Raw Mode)</h1>
      <nav style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button className={styles.button} onClick={() => setWindows("status")}>
          Status
        </button>
        <button className={styles.button} onClick={() => setWindows("users")}>
          Usuários
        </button>
        <button className={styles.button} onClick={() => setWindows("series")} >
          Séries
        </button>
        <button className={styles.button} onClick={() => setWindows("episodios")}>
          Episódios
        </button>
      </nav>
      <hr />
      {windows === "status" && <Status/>}
      {windows === "users" && <User/>}
      {windows === "series" && <Serie/>}
      {windows === "episodios" && <Episode/>}
    </div>
  );
}