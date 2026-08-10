'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import Link from "next/link";
import { envs as env } from "@/lib/env";

export default function Home() {
  const router = useRouter();
  const [series, setSeries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    async function PickImageSeries() {
      try {
        const res = await fetch(`${env.serverApi}/serie/top10`);

        if (!res.ok) {
          throw new Error(`Erro ao buscar Top 10 séries: Status ${res.status}`);
        }

        const response = await res.json();
        const data = Array.isArray(response.data) ? response.data : [];

        const serieComImagens = data.map((serie) => ({
          ...serie,
          url_image: `${env.serverApi}/serie/image/${serie.id}`,
        }));

        if (!ignore) setSeries(serieComImagens);
      } catch (err) {
        console.error("Erro ao buscar as séries Top 10:", err);
        if (!ignore) setSeries([]);
      } finally {
        if (!ignore) setIsLoading(false);
      }
    }

    PickImageSeries();
    return () => {
      ignore = true;
    };
  }, []);

  function handleImageError(event) {
    event.currentTarget.src = "/img/placeholder.png";
    event.currentTarget.onerror = null;
  }

  return (
    <main>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <p className={styles.eyebrow}>Novidades toda semana</p>
          <h2>O melhor streaming com séries, filmes e muito mais</h2>

          <p className={styles.heroDescription}>
            Assine por apenas
            <strong className={styles.price}> R$19,99/mês</strong>
            <br />
            com o primeiro mês grátis.
          </p>

          <button
            type="button"
            id="btn-cadastro"
            onClick={() => router.push("/signup")}
            className={styles.btnCta}
          >
            Criar conta
          </button>

          <div className={styles.loginInfo}>
            <p>
              Já tem uma conta?{' '}
              <Link href="/login" className={styles.link}>
                Faça login
              </Link>
            </p>
          </div>
        </div>
      </section>

      <section className={styles.seriesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Nossas séries principais</h2>
          <p className={styles.sectionSubtitle}>
            Explore títulos em destaque e descubra o próximo favorito.
          </p>
        </div>

        <div className={styles.grid}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={`skeleton-${index}`} className={`${styles.card} ${styles.cardSkeleton}`} aria-hidden="true">
                <div className={styles.skeletonImage} />
                <div className={styles.skeletonText} />
              </div>
            ))
          ) : series.length > 0 ? (
            series.map((serie) => (
              <article key={serie.id} className={styles.card}>
                <img
                  src={serie.url_image || "/img/placeholder.png"}
                  alt={serie.title}
                  loading="lazy"
                  onError={handleImageError}
                />
                <h3>{serie.title}</h3>
              </article>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>Não foi possível carregar as séries no momento.</p>
            </div>
          )}
        </div>
      </section>

      <section className={styles.aboutSection}>
        <div className={styles.aboutSectionContent}>
          <h2 className={styles.sectionTitle}>Por que assinar?</h2>
          <div className={styles.aboutGrid}>
            <div className={styles.reasonCard}>
              <h3>Conforto</h3>
              <p>
                Você pode assistir no conforto de sua casa, sem qualquer distração.
              </p>
            </div>

            <div className={styles.reasonCard}>
              <h3>Preço</h3>
              <p>
                Um dos melhores preços para assistir streaming sem anúncios.
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