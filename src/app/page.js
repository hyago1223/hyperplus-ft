'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import { envs as env } from "@/lib/env";

export default function Home() {
  const router = useRouter();
  const [series, setSeries] = useState([]);
  
  async function PickImageSeries() {
    try {
      const res = await fetch(`${env.serverApi}/serie/top10`);

      if (!res.ok) {
        throw new Error(`Erro ao buscar Top 10 séries: Status ${res.status}`);
      }

      const series = await res.json();
      const data = series.data || [];

      const serieComImagens = data.map((serie) => {
        const imageUrl = `${env.serverApi}/serie/image/${serie.id}`;

        return {
          ...serie,
          url_image: imageUrl,
        };
      });

      setSeries(serieComImagens);
    } catch (err) {
      console.error("Erro ao buscar as séries Top 10:", err);
    }
  }

  useEffect(() => {
    PickImageSeries();
  }, []);

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2>O melhor Streaming, com Séries, filmes e muito mais</h2>

          <p>
            subscribe for only{" "}
            <strong className={styles.price}>R$19.99/month</strong>
            <br />
            with one month free
          </p>

          <button
            type="button"
            id="btn-cadastro"
            onClick={() => {router.push("/signup")}}
            className={styles.btnCta}
          >
            log up
          </button>

          <div className={styles.loginInfo}>
            <p>
              already have an account, <Link href="/login">log in.</Link>
            </p>
          </div>
        </div>
      </section>

      <section className={styles.seriesSection}>
        <h2 className={styles.sectionTitle}>Nossas Séries Principais</h2>

        <div className={styles.grid}>
          {series.length > 0 ? (
            series.map((serie) => (
              <div key={serie.id} className={styles.card}>
                <img src={serie.url_image || null} alt={serie.title} />
                <h3>{serie.title}</h3>
              </div>
            ))
          ) : (
            <p>Carregando Séries</p>
          )}
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className={styles.aboutSection}>
          <h2
            className={styles.sectionTitle}
            style={{ textAlign: "center", border: "none" }}
          >
            reasons to subscribe
          </h2>

          <div className={styles.aboutGrid}>
            <div className={styles.reasonCard}>
              <h3>Conforto</h3>
              <p>
                Você pode assistir no conforto de sua casa, sem qualquer
                distração.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <h3>Preço</h3>
              <p>
                Um dos melhores preços para assistir streaming sem anúncio.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <h3>Acessibilidade</h3>
              <p>
                Assista em qualquer dispositivo: PC, tablet, celular e sua TV.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}