import styles from './style.module.css'
import menu from '@/components/menu.js';
import { useState, useEffect } from 'react';
export default function SeriesCard({serie, handlerDetails, handlerLike, handlerWatch, isLargeRow}){
    const [photo ,setPhoto] = useState('/img/placeholder.png');
    async function GetImageUrl(serieId){
        const res = await fetch(`${menu.Server_api}/serie/image/${serieId}`);
        if(res.ok){
            const blob = await res.blob();
            setPhoto(URL.createObjectURL(blob));
        }
    }
    useEffect(()=>{
        GetImageUrl(serie.id);
    },[serie.id]);

    return (
        <div className={styles.card} onClick={() => handlerDetails(serie)}>
            <img className={`${styles.rowPoster} ${isLargeRow ? 'Large' : ''}`} src={photo} alt={serie.title} />
            <h3>{serie.title}</h3>
            <div className={styles.overlay}>
                <button onClick={() =>handlerDetails(serie)}>Detalhes</button>
                <button onClick={() =>handlerLike(serie)}>Curtir</button>
                <button onClick={() =>handlerWatch(serie)}>Assistir</button>
            </div>
        </div>
    );
}