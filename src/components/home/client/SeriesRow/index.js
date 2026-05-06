'use client';

import { useState, useEffect } from 'react';
import SeriesCard from '../SeriesCard';
import styles from './style.module.css';

export default function SeriesRow({ title, fetchUrl, handlers, isRanked, isLargeRow }) {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);

    const { handlerDetails, handlerLike, handlerWatch } = handlers;

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);

                const res = await fetch(fetchUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                });

                if (res.ok) {
                    const data = await res.json();
                    setSeries(data.data || []);
                } else {
                    console.error(
                        "Erro ao buscar série:",
                        title,
                        `Status ${res.status}`
                    );

                    setSeries([]);
                }
            } catch (error) {
                console.error("Erro ao buscar fila:", title, error);
                setSeries([]);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [fetchUrl, title]);

    if (loading || series.length === 0) return null;

    return (
        <div className={styles.rowContainer}>
            <h2 className={styles.rowTitle}>{title}</h2>

            <div className={styles.rowPosters}>
                {Array.isArray(series) && series.map((serie, index) => (
                    <SeriesCard
                        key={serie.id}
                        serie={serie}
                        rank={isRanked ? index + 1 : null}
                        handlerDetails={handlerDetails}
                        handlerLike={handlerLike}
                        handlerWatch={handlerWatch}
                        isLargeRow={isLargeRow}
                    />
                ))}
            </div>
        </div>
    );
}