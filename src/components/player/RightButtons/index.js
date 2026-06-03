
import styles from '../styles.module.css'

export default function RightButtons({ videoRef }){
    const HandlerFullScreen = (e) => {
        e.preventDefault();
    };
    return (
        <button 
            type="button" 
            className={styles.controlButton}
            onClick={HandlerFullScreen}
            title="Tela Cheia"
        >
            <i>⛶</i>
        </button>
    );
}