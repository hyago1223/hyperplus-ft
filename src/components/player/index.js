'use client';

import { useEffect, useRef, useState } from "react";
import menu from "@/components/menu";
import styles from "./styles.module.css";
import Hls from "hls.js";

export default function VideoPlayer({ episodeId }) {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);


    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!episodeId) {
            setError("Episódio inválido");
            setLoading(false);
            return;
        }

        const controller = new AbortController();

        async function loadEpisode() {
            try {
                setLoading(true);

                const res = await fetch(
                    `${menu.Server_api}/episode/${episodeId}`,
                    { signal: controller.signal }
                );

                if (!res.ok) {
                    throw new Error("Erro ao carregar episódio");
                }

                const data = await res.json();
                setVideo(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError("Erro ao carregar vídeo");
                }
            } finally {
                setLoading(false);
            }
        }

        loadEpisode();

        return () => controller.abort();
    }, [episodeId]);

    useEffect(() => {
        if (video && video.video_url && videoRef.current) return;

        const videoElement = videoRef.current;

        if(videoElement.canPlayType('application/vnd.apple.mpegurl')) {
            videoElement.src = video.video_url;
        } else if (Hls.isSupported()) {
            hlsRef.current = new Hls();
            hlsRef.current.loadSource(video.video_url);
            hlsRef.current.attachMedia(videoElement);
        } else {
            setError("Seu navegador não suporta reprodução de vídeo.");
        }

        return () => {
            if (hlsRef.current) {
                hlsRef.current.destroy();
                hlsRef.current = null;
            }
        };
    }, [video]);

    if (loading) return <div className={styles.loading}>Carregando vídeo...</div>;
    if (error) return <div className={styles.error}>{error}</div>;

    return (
        <video
            ref={videoRef}
            className={styles.video}
            controls
            autoPlay
            playsInline
        />
    );
}
