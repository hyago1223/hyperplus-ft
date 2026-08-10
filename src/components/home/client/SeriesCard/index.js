import styles from './style.module.css'
import { envs as env } from '@/lib/env/index.js';
import { useState, useEffect } from 'react';

export default function SeriesCard({serie, handlerDetails, handlerLike, handlerWatch, isLargeRow}){
    const [photo ,setPhoto] = useState('/img/placeholder.png');
    async function GetImageUrl(serieId){
        const res = await fetch(`${env.serverApi}/serie/image/${serieId}`);
        if(res.ok){
            let blob = await res.blob();
            setPhoto(URL.createObjectURL(blob));
            URL.revokeObjectURL(photo);
            blob = null;
        }
    }
    useEffect(() => {
        let ignore = false;
        async function GetImageUrl(serieId){
            const res = await fetch(`${env.serverApi}/serie/image/${serieId}`);
            if(res.ok){
                const blob = await res.blob();
                if(!ignore) setPhoto(URL.createObjectURL(blob));
            }
        }
        GetImageUrl(serie.id);
        return () => { ignore = true; };
    },[serie.id]);

    return (
        <div className={styles.card} onClick={() => handlerDetails(serie)}>
            <img className={`${styles.rowPoster} ${isLargeRow ? styles.rowPosterLarge : ''}`} src={photo} alt={serie.title} />
            <h3>{serie.title}</h3>
            <div className={styles.overlay} onClick={(e) => e.stopPropagation()}>
                <button onClick={() =>handlerDetails(serie)}>Detalhes</button>
                <button onClick={() =>handlerLike(serie)}>Curtir</button>
                <button onClick={() =>handlerWatch(serie)}>Assistir</button>
            </div>
        </div>
    );
}