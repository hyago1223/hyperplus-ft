import styles from './style.module.css'
import menu from '@/components/menu.js';
export default function SeriesCard({serie, handlerDetails, handlerLike, handlerWatch, isLargeRow}){
    return (
        <div className={styles.card}>
            <img className={`${styles.rowPoster} ${isLargeRow ? styles.sa : ''}`} src={`${menu.Server_api}/serie/image/${data.id}`} alt={serie.title} />
            <h3>{serie.nome}</h3>
            <div className={styles.overlay}>
                <button onClick={() =>handlerDetails(serie)}>Detalhes</button>
                <button onClick={() =>handlerLike(serie)}>Curtir</button>
                <button onClick={() =>handlerWatch(serie)}>Assistir</button>
            </div>
        </div>
    );
}