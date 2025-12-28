'use client';
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import menu from "@/components/menu";
import styles from './styles.module.css';
import VideoPlayer from "@/components/player";

export default function PlayerPage() {
    const params = useSearchParams();
    const source = params.get('source');
    const id = params.get('id');

    const [videoData, setVideoData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadPlayerData = useCallback(async () => {
        if (!source || !id) {
            setError("Parâmetros inválidos");
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            if (source === 'serie') {
                const res = await fetch(
                    `${menu.Server_api}/user/historico/lastepisode?id_serie=${id}`
                );

                if (!res.ok) throw new Error("Erro ao buscar episódio");

                const data = await res.json();
                setVideoData(data);
            }

            if (source === 'episode') {
                const res = await fetch(
                    `${menu.Server_api}/episode/${id}`
                );

                if (!res.ok) throw new Error("Erro ao carregar episódio");

                const data = await res.json();
                setVideoData(data);
            }
        } catch (err) {
            console.error(err);
            setError("Erro ao carregar o player");
        } finally {
            setLoading(false);
        }
    }, [source, id]);

    useEffect(() => {
        loadPlayerData();
    }, [loadPlayerData]);

    if (loading) return <div className={styles.loading}>Carregando player...</div>;
    if (error) return <div className={styles.errorContainer}>{error}</div>;

    return (
        <div className={styles.playerContainer}>
            <VideoPlayer episodeId={videoData?.id} />
        </div>
    );
}
