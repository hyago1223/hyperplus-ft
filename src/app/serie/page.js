'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import menu from "../../components/menu.js";
import style from "@/components/css/Serie/style.module.css";
import { useAuth } from "@/components/auth/AuthContext";

function SeriesButtons({ serieId }) {
    const router = useRouter();
    const { isLoggedIn } = useAuth();

    const handlerLike = async () => {
        if (!isLoggedIn) {
            alert("Você precisa estar logado para curtir");
            return;
        }

        try {
            const res = await fetch(`${menu.Server_api}/user/like/${serieId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
            });

            if (res.ok) {
                alert("Série curtida!");
            } else if (res.status === 401) {
                alert("Você precisa estar logado para curtir.");
            } else {
                alert("Erro ao curtir a série.");
            }
        } catch (err) {
            console.log("Erro de Rede:", err);
            alert("Erro de Rede ao tentar curtir.");
        }
    };

    const handlerWatch = () => {
        router.push(`/player?source=serie&id=${serieId}`);
    };

    return (
        <div className={style.buttonsContainer}>
            <button onClick={handlerWatch}>
                Assistir
            </button>

            <button onClick={handlerLike}>
                Curtir
            </button>
        </div>
    );
}

export default function Serie() {
    const router = useRouter();
    const params = useSearchParams();
    const id = params.get("id");

    const [serie, setSerie] = useState(null);
    const [episode, setEpisode] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const HandlerWatchSubmit = (episodeId) => {
        router.push(`/player?source=episode&id=${episodeId}`);
    };

    async function GetDataSerie(serieId) {
        if (!serieId) return;

        try {
            const res = await fetch(`${menu.Server_api}/serie/${serieId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                throw new Error(`Erro HTTP: ${res.status}`);
            }

            const data = await res.json();
            setSerie(data.data);
        } catch (err) {
            setError(err.message);
        }
    }

    async function GetDataEpisodes(serieId) {
        if (!serieId) return;

        try {
            const res = await fetch(`${menu.Server_api}/serie/${serieId}/episodes`, {
                method: "GET",
            });

            if (!res.ok) {
                throw new Error(`Erro ao buscar episódios: ${res.status}`);
            }

            const data = await res.json();
            setEpisode(data.data || []);
        } catch (err) {
            console.log(err);
            setError(err.message);
        }
    }

    useEffect(() => {
        if (!id) return;

        setLoading(true);
        setError(null);

        Promise.all([
            GetDataSerie(id),
            GetDataEpisodes(id),
        ]).finally(() => {
            setLoading(false);
        });
    }, [id]);

    if (loading) {
        return (
            <main>
                <div className={style.fullPageCenter}>
                    <p>Carregando...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main>
                <div className={style.fullPageCenter}>
                    <p className={style.errorMessage}>Erro: {error}</p>
                </div>
            </main>
        );
    }

    if (!serie) {
        return (
            <main>
                <div className={style.fullPageCenter}>
                    <p>Série não encontrada.</p>
                </div>
            </main>
        );
    }

    return (
        <main>
            <div className={style.serieContainer}>
                <div className={style.serieImageWrapper}>
                    <img src={serie.url_image} alt={serie.title} />
                </div>

                <div className={style.serieDetails}>
                    <h2 className={style.serieTitle}>{serie.title}</h2>
                    <h3 className={style.serieGenre}>{serie.genre}</h3>
                    <h3 className={style.serieYear}>{serie.year}</h3>

                    <SeriesButtons serieId={id} />

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

                                <button
                                    onClick={() => HandlerWatchSubmit(ep.id)}
                                    className={style.episodeWatchButton}
                                >
                                    Assistir
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>Nenhum episódio encontrado.</p>
                    )}
                </div>
            </div>
        </main>
    );
}