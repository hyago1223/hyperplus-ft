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

    const [videoData, setVideoData] = useState([]);
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
                const res = await fetch(`${menu.Server_api}/user/historico/lastepisode?id_serie=${id}`,{credentials: "include"});

                if(!res.status === 404){
                    res = await fetch(`${menu.Server_api}/serie/${id}/episodes?number=1`);

                    if(!res.ok){
                        throw new Error("Error ao busca episodio Serie");
                    }
                }else  if(!res.ok){
                    throw new Error("Error ao busca episodio Serie");
                }

                const data = await res.json();
                setVideoData(data);
            }

            if (source === 'episode') {
                const res = await fetch(`${menu.Server_api}/serie/episodes/${id}`);

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
    }, [id]);

    if (loading) return <div className={styles.loading}>Carregando player...</div>;
    if (error) return <div className={styles.errorContainer}>{error}</div>;

    return (
        <div className={styles.playerContainer}>
            <VideoPlayer videoData={videoData.data} />
        </div>
    );
}
