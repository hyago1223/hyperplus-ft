import styles from '../styles.module.css'
import { useEffect, useState } from 'react';
import {envs as env} from '../../../lib/env/index.js'

export default function RightButtons({ videoRef, playerRef }){
    const [nextEpisode, setNextEpisode] = useState(null);
    const [configOpen, setConfigOpen] = useState(false);

    const searchNextEpisode = async (episodeId) => {
        try {
            const res = await fetch(`${env.serverApi}/serie/episodes/${episodeId}/next`);
            if (!res.ok) throw new Error("Erro ao buscar próximo episódio");

            const data = await res.json();
            setNextEpisode(data);
        } catch (err) {
            console.error(err);
            setNextEpisode(null);
        }
    };
    const HandlerFullScreen = async () => {
        try {
            if (document.fullscreenElement) {
                await document.exitFullscreen();
            } else {
                await playerRef.current.requestFullscreen();
            }
        } catch (err) {
            console.error(err);
        }
    };
    useEffect(() => {
        if (videoRef.current) {
            const videoElement = videoRef.current;
            const handleEnded = () => {
                if (nextEpisode) {
                    videoElement.src = `${env.serverApi}${nextEpisode.video_url}`;
                    videoElement.load();
                    videoElement.play();
                }
            };
            videoElement.addEventListener("ended", handleEnded);
            return () => {
                videoElement.removeEventListener("ended", handleEnded);
            };
        }
    }, [nextEpisode]);

    useEffect(() => {
        if (videoRef.current && videoRef.current.src) {
            const urlParts = videoRef.current.src.split('/');
            const episodeId = urlParts[urlParts.length - 2];
            searchNextEpisode(episodeId);
        }   
    }, [videoRef.current?.src]);
    return (
        <>
            {nextEpisode && (
                <button 
                    type="button"
                    className={styles.controlButton}
                    onClick={() => {
                        videoRef.current.src = `${env.serverApi}${nextEpisode.video_url}`;
                        videoRef.current.load();
                        videoRef.current.play();
                    }
                    }
                    title="Próximo Episódio"
                >
                    <i>Próximo</i>
                </button>
            )}
            <button 
                type="button" 
                className={styles.controlButton}
                title="Configurações"
                onClick={() => setConfigOpen(!configOpen)}
            >
                 <i>⚙️</i>
            </button>
            {configOpen && (
                <div className={styles.configMenu}>
                    <p>Configurações de vídeo (em breve)</p>
                </div>
            )}
            <button 
                type="button" 
                className={styles.controlButton}
                onClick={HandlerFullScreen}
                title="Tela Cheia"
            >
                <i>⛶</i>
            </button>
        </>
    );
}