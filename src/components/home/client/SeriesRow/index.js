'use client';
import { useState, useEffect } from 'react';
import SeriesCard from '../SeriesCard';
import styles from './style.module.css';
import { getCookie } from '@/components/auth/Cookies';

export default function SeriesRow({ title, fetchUrl, handlers, isRanked, isLargeRow }) {
    const [series, setSeries] = useState([]);
    const [loading, setLoading] = useState(true);
    
    const { handlerDetails, handlerLike, handlerWatch } = handlers;

    useEffect(() => {
        async function fetchData() {
            try {
                const headers = { "Content-Type": "application/json" };
                const token = await getCookie("token");
                if(token) headers["Authorization"] = `Bearer ${token}`;

                const res = await fetch(fetchUrl, { headers });
                
                if (res.ok) {
                    const data = await res.json();
                    if(data){
                        setSeries(data.data || []);
                    }
                } else {
                    console.error("Erro ao buscar série:", title, `Status ${res.status}`);
                }
            } catch (error) {
                console.error("Erro ao buscar fila:", title, error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [fetchUrl]);

    if (loading || series.length == 0) return null;

    return (
        <div className={styles.rowContainer}>
            <h2 className={styles.rowTitle}>{title}</h2>
            <div className={styles.rowPosters}>
                {Array.isArray(series) && series.map((serie) => (
                    <SeriesCard 
                        key={serie.id} 
                        serie={serie} 
                        handlerDetails={handlerDetails}
                        handlerLike={handlerLike}
                        handlerWatch={handlerWatch}
                        isLargeRow
                    />
                ))}
            </div>
        </div>
    );
}