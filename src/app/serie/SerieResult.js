'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import style from "@/components/css/Serie/style.module.css";
import { useAuth } from "@/components/auth/AuthContext";
import { UFetch,BFetch } from "@/service/fetch/index.js";
import { envs as env } from '@/lib/env/index.js'

function SeriesButtons({ serieId }) {
    const [like, setLike] = useState(false);

    const router = useRouter();
    const { isLoggedIn } = useAuth();

    const handlerLike = async () => {
        if (!isLoggedIn) {
            alert("Você precisa estar logado para curtir");
            return;
        }

        try {
            const res = await UFetch({API_URL: env.serverApi,endPoint: `/user/like/${serieId}`,type: "json",options: {method: "PUT",},});

            if (res.success) {
                setLike(res.status);
            } else {
                console.log("Erro ao curtir a série.");
            }
        } catch (err) {
            console.log("Erro de Rede:", err);
        }
    };

    const handlerWatch = () => {
        router.push(`/player?source=serie&id=${serieId}`);
    };

    useEffect(() =>{
        async function loadlike() {
            try {
                if (!isLoggedIn) {
                    setLike(false);
                    return;
                }
                const data = await UFetch({API_URL: env.serverApi,endPoint: `/user/like/${serieId}`,type:"json", options: { method: "GET",},});
                if(data.success){
                    setLike(data.status);
                }
            } catch (err) {
                console.log("Erro de Rede:", err);
            }
        }
        loadlike();
    },[serieId, isLoggedIn]);

    return (
        <div className={style.buttonsContainer}>
            <button onClick={handlerWatch}>
                Assistir
            </button>

            <button type="button" onClick={handlerLike}>
                {like? (<>curtido</>) : (<>Curtir</>)}
            </button>
        </div>
    );
}

export default function Serie() {
    const router = useRouter();
    const params = useSearchParams();
    const id = params.get("id");
    const { isLoggedIn } = useAuth();

    const [serie, setSerie] = useState(null);
    const [seriePhoto, setSeriePhoto] = useState(env.images.defaultSerie);
    const [episode, setEpisode] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [serieId, setSerieId] = useState(id);

    const HandlerWatchSubmit = (episodeId) => {
        router.push(`/player?source=episode&id=${episodeId}`);
    };

    useEffect(() => {
        if (!serieId) return;

        let ignore = false;

        async function GetDataSerie(id) {
            try {
                const res = await fetch(`${env.serverApi}/serie/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!res.ok) {
                    throw new Error(`Erro HTTP: ${res.status}`);
                }

                const data = await res.json();
                if (!ignore) setSerie(data.data);
            } catch (err) {
                if (!ignore) setError(err.message);
            }
        }

        async function GetDataEpisodes(id) {
            try {
                const res = await fetch(`${env.serverApi}/serie/${id}/episodes`, {
                    method: "GET",
                });

                if (!res.ok) {
                    throw new Error(`Erro ao buscar episódios: ${res.status}`);
                }

                const data = await res.json();
                if (!ignore) setEpisode(data.data || []);
            } catch (err) {
                if (!ignore) setError(err.message);
            }
        }

        async function getBlobSerieCard(id) {
            try {
                const resquest = await BFetch(id, "image");
                if (!ignore) setSeriePhoto(resquest);
            } catch (err) {
                return;
            }
        }

        Promise.all([
            GetDataSerie(serieId),
            GetDataEpisodes(serieId),
            getBlobSerieCard(serieId),
        ]).finally(() => {
            if (!ignore) setLoading(false);
        });

        return () => { ignore = true; };
    }, [serieId]);

    if (loading) {
        return (
            <div>
                <div className={style.fullPageCenter}>
                    <p>Carregando...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <div className={style.fullPageCenter}>
                    <p className={style.errorMessage}>Erro: {error}</p>
                </div>
            </div>
        );
    }

    if (!serie) {
        return (
            <div>
                <div className={style.fullPageCenter}>
                    <p>Série não encontrada.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className={style.serieContainer}>
                <div className={style.serieImageWrapper}>
                    <img src={seriePhoto} alt={serie.title} />
                </div>

                <div className={style.serieDetails}>
                    <h2 className={style.serieTitle}>{serie.title}</h2>
                    <h3 className={style.serieGenre}>{serie.genre}</h3>
                    <h3 className={style.serieYear}>{serie.year}</h3>

                    {(<SeriesButtons serieId={serieId} />)}

                    <p className={style.serieDescription}>
                        {serie.description}
                    </p>
                </div>
            </div>

            <div className={style.episodesContainer}>
                <h3 className={style.episodesTitle}>Episódios</h3>

                <div className={style.episodeList}>
                    {episode.length > 0 ? (
                        episode.map((ep, index) => (
                            <div key={ep.id || index} className={style.episodeCard}>
                                <span>
                                    {ep.numero || index + 1}. {ep.title}
                                </span>

                                {isLoggedIn &&(
                                    <button
                                        onClick={() => HandlerWatchSubmit(ep.id)}
                                        className={style.episodeWatchButton}
                                    >
                                    Assistir
                                    </button>
                                )}
                            </div>
                        ))
                    ) : (
                        <p>Nenhum episódio encontrado.</p>
                    )}
                </div>
            </div>
        </>
    );
}