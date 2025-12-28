'use client';
import menu from "../../components/menu.js";
import SeriesRow from "@/components/home/client/SeriesRow/index.js";
import Hero from "@/components/home/client/Hero/Hero.js";
import { useRouter } from "next/navigation";
import { getCookie } from "@/components/auth/Cookies.js";
import { useEffect, useState } from "react";

export default function Home() {
    const router = useRouter();
    const [isLoged, setIsLoged]  = useState(false);
    const [categories, setCategories] = useState([]);
    const handlerDetails = (serie) => {
        router.push(`/serie?id=${serie.id}`);
    };
    const handlerLike = async (serie) => {
        const token = await getCookie("token");
        const id_serie = serie.id;

        const res = await fetch(`${menu.Server_api}/like/${id_serie}`,{
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            }
        });
        if(!res.ok){
            return false;
        }
        const data = await res.json();

        return data;
    };
    const handlerWatch = (serie) => {
        router.push(`/player?id=${serie.id}&source=serie`)
    };
    const Handler = {handlerDetails,handlerWatch,handlerLike}

    useEffect(() => {
        async function loadCategories() {
            const res = await fetch(`${menu.Server_api}/serie/home/categories`);
            const data = await res.json();
            setCategories(data.data || []);
        }
        async function loadLogin() {
            const token = await getCookie('token');
            if(token){
                const res = await fetch(`${menu.Server_api}/user/auth`,{
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                })
                if(res.ok){
                    setIsLoged(true);
                }
            }
        }
        loadCategories();
        loadLogin();
    }, []);


    return (
        <div className="Home-Container">
            <Hero/>
            <div className="rows-container">
                {isLoged &&(
                    <div>
                        <SeriesRow 
                            title="Continuar Assistindo"
                            fetchUrl={`${menu.Server_api}/serie/home/historico/serie`}
                            handlers={Handler}
                            isLargeRow
                        />
                        <SeriesRow 
                            title="Recomendados para Você"
                            fetchUrl={`${menu.Server_api}/serie/home/recommended`}
                            handlers={Handler}
                        />
                    <SeriesRow 
                        title="Minha Lista"
                        fetchUrl={`${menu.Server_api}/serie/home/watchlist`}
                        handlers={Handler}
                    />
                    </div>
                )}
                <SeriesRow 
                    title="Em Alta (Trending)"
                    fetchUrl={`${menu.Server_api}/serie/home/trending?limit=15`}
                    handlers={Handler}
                />

                <SeriesRow 
                    title="Top 10 no Brasil Hoje"
                    fetchUrl={`${menu.Server_api}/serie/home/top10`}
                    handlers={Handler}
                    isRanked // Se você tiver um estilo especial para números 1, 2, 3...
                />

                <SeriesRow 
                    title="Aclamados pela Crítica"
                    fetchUrl={`${menu.Server_api}/serie/home/high-rated`}
                    handlers={Handler}
                />

                <SeriesRow 
                    title="Novos Lançamentos"
                    fetchUrl={`${menu.Server_api}/serie/home/newSeries`}
                    handlers={Handler}
                />
            
                <SeriesRow 
                    title="Adicionados Recentemente"
                    fetchUrl={`${menu.Server_api}/serie/home/latest/20`}
                    handlers={Handler}
                />
                {categories.map((cat) => (
                    <SeriesRow 
                        key={cat.id} 
                        title={cat.name}
                        fetchUrl={`${menu.Server_api}/serie/home/series/${encodeURIComponent(cat.name)}`}
                        handlers={Handler}
                    />
                ))}
            </div>
        </div>
    );
}