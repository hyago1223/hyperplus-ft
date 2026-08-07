'use client';
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from './styles.module.css';
import { envs as env } from "../../lib/env/index.js";

// Padrao de cada resultado
function ResultCard({ serie }) {
    const router = useRouter();
    const imageURL = `${env.serverApi}/serie/image/${serie.id}`;

    const handleNavigate = () => {
        router.push(`/serie?id=${serie.id}`);
    };

    return (
        <button
            onClick={handleNavigate}
            className={styles.resultCard}
            style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
        >
            <div className={styles.imageWrapper}>
                <img
                    src={imageURL}
                    alt={serie.title}
                    onError={(e) => e.target.src = '/img/placeholder.png'}
                />
            </div>
            <h3>{serie.title}</h3>
        </button>
    );
}

export default function ResultSearch() {
    const params = useSearchParams();
    const query = params.get('query');

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    async function handlerSearch() {
        if (!query) return;
        setLoading(true);
        try {
            const res = await fetch(`${env.serverApi}/search?query=${encodeURIComponent(query)}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if (!res.ok) throw new Error("Erro na requisição");
            const data = await res.json();
            const list = Array.isArray(data) ? data : (data.data || []);
            setResults(list);
        } catch (err) {
            console.error("Erro ao buscar series", err);
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        handlerSearch();
    }, [query]);

    return (
        <>
            <div className={styles.headerResult}>
                <h1>Resultados para: <span>"{query}"</span></h1>
            </div>
            {loading ? (
                <div className={styles.loading}>Pesquisando...</div>
            ) : (
                <div className={styles.searchResultGrid}>
                    {results.length > 0 ? (
                        results.map((serie) => (
                            <ResultCard key={serie.id} serie={serie} />
                        ))
                    ) : (
                        <p className={styles.noResults}>Nenhum resultado Encontrado</p>
                    )}
                </div>
            )}
        </>
    );
}
