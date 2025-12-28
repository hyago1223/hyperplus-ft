'use client';
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import menu from "../../components/menu.js";
import style from '@/components/css/Serie/style.module.css'; 
import { getCookie } from "@/components/auth/Cookies.js";

function SeriesButtons({ serieId }){
    const router = useRouter();
    const [token, setToken] = useState(null);

    useEffect(() => {
        async function StoreToken() {
            const token = await getCookie('token')
            if(token){
                setToken(token);
            }
        }
        StoreToken()
    },[]);

    const handlerLike = async () => {
        if(!token){
            alert("Você precisa estar logado para curtir");
            return;
        }

        try{
            const res = await fetch(`${menu.Server_api}/user/like/${serieId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });

            if(res.ok){
                alert("Série curtida!");
            } else{
                alert("Erro ao curtir a série.");
            }

        }catch(err){
            console.log("Erro de Rede: ",err);
            alert("Erro de Rede ao tentar curtir.");
        }
    }
    const handlerWatch = () =>{
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
    const Params = useSearchParams();
    const id = Params.get('id');
    const [serie, setSerie] = useState(null);
    const [episode, setEpisode] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const HandlerWatchSubmit = (episodeId) =>{
        router.push(`/player?source=episode&id=${episodeId}`);
    }

    async function GetDataSerie(SerieId){
        if (!SerieId) return;
        try{
            const res = await fetch(`${menu.Server_api}/serie/${SerieId}`,{
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            if(!res.ok) throw new Error(`Erro Http: ${res.status}`);
            const data = await res.json();
            setSerie(data.data);
        }catch(err){
            setError(err.message);
        }
    }

    async function GetDataEpisodes(serieId) {
        if(!serieId) return;
        try{
            const res = await fetch(`${menu.Server_api}/serie/${serieId}/episodes`);
            if (!res.ok) throw new Error(`Erro ao buscar episodios: ${res.status}`);
            const data = await res.json();
            setEpisode(data.data);
        }catch(err){
            console.log(err);
            setError(err.message); 
        }
    }

    useEffect(() =>{
        if(id){
            setLoading(true);
            setError(null);

            const DataPromises = [
                GetDataSerie(id),
                GetDataEpisodes(id)
            ];

            Promise.all(DataPromises).finally(() => {
                setLoading(false);
            })
        }
    },[id]);

    if(loading){
        return (
            <main>
                <div className={style.fullPageCenter}>
                    <p>Carregando...</p>
                </div>
            </main>
        );
    }

    if(error){
        return (
            <main>
                <div className={style.fullPageCenter}>
                    <p className={style.errorMessage}>Erro: {error}</p>
                </div>
            </main>
        )
    }

    if(!serie){
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
                    {serie && <img src={serie.url_image} alt={serie.title}/>}
                </div>
                <div className={style.serieDetails}>
                    <h2 className={style.serieTitle}>{serie?.title}</h2>
                    <h3 className={style.serieGenre}>{serie?.genre}</h3>
                    <h3 className={style.serieYear}>{serie?.year}</h3>
                    <SeriesButtons serieId={id}/>
                    <p className={style.serieDescription}>{serie.description}</p>
                </div>
            </div>
            <div className={style.episodesContainer}>
                <h3 className={style.episodesTitle}>Episódios</h3>
                <div className={style.episodeList}>
                    {episode.length > 0 ? (episode.map((ep, index) => (
                            <div key={ep.id || index} className={style.episodeCard}>
                                <span>{ep.numero || (index + 1)}. {ep.title}</span>
                                <button 
                                    onClick={() => HandlerWatchSubmit(ep.id)} 
                                    className={style.episodeWatchButton}
                                >
                                    Assistir
                                </button>
                            </div>
                        ))) : (<p>Nenhum Episodio encontrado.</p>)}
                </div>
            </div>
        </main>
    );
}