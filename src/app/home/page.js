'use client';

import SeriesRow from "@/components/home/client/SeriesRow/index.js";
import Hero from "@/components/home/client/Hero/Hero.js";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth/AuthContext.js";
import { UFetch } from "@/service/fetch/index.js";
import { envs as env } from "@/lib/env/index.js";

export default function Home() {
    const router = useRouter();
    const { isLoggedIn } = useAuth();
    const [categories, setCategories] = useState([]);

    const handlerDetails = (serie) => {
        router.push(`/serie?id=${serie.id}`);
    };

    const handlerLike = async (serie) => {
        const idSerie = serie.id;
        const res = await fetch(`${env.serverApi}/like/${idSerie}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
        });

        if (!res.ok) {
            return false;
        }

        const data = await res.json();
        return data;
    };

    const handlerWatch = (serie) => {
        router.push(`/player?id=${serie.id}&source=serie`);
    };

    const Handler = {
        handlerDetails,
        handlerWatch,
        handlerLike,
    };

    useEffect(() => {
        async function loadCategories() {
            try {
                const data = await UFetch({ API_URL: env.serverApi, endPoint: '/serie/home/categories',options: { method: "GET",},type: "json",})
                setCategories(data.data || []);
            } catch (err) {
                console.error("Erro ao carregar categorias:", err);
            }
        }

        loadCategories();
    }, []);

    return (
        <div className="Home-Container">
            <Hero />
            <div className="rows-container">
                {isLoggedIn && (
                    <div>
                        <SeriesRow
                            title="Continuar Assistindo"
                            fetchUrl={`${env.serverApi}/serie/home/historico/serie`}
                            handlers={Handler}
                            isLargeRow
                        />

                        <SeriesRow
                            title="Recomendados para Você"
                            fetchUrl={`${env.serverApi}/serie/home/recommended`}
                            handlers={Handler}
                        />

                        <SeriesRow
                            title="Minha Lista"
                            fetchUrl={`${env.serverApi}/serie/home/watchlist`}
                            handlers={Handler}
                        />
                    </div>
                )}

                <SeriesRow
                    title="Em Alta (Trending)"
                    fetchUrl={`${env.serverApi}/serie/home/trending?limit=15`}
                    handlers={Handler}
                />

                <SeriesRow
                    title="Top 10 no Brasil Hoje"
                    fetchUrl={`${env.serverApi}/serie/home/top10`}
                    handlers={Handler}
                    isRanked
                />

                <SeriesRow
                    title="Novos Lançamentos"
                    fetchUrl={`${env.serverApi}/serie/home/newSeries`}
                    handlers={Handler}
                />

                <SeriesRow
                    title="Adicionados Recentemente"
                    fetchUrl={`${env.serverApi}/serie/home/latest/20`}
                    handlers={Handler}
                />

                {categories.map((cat) => (
                    <SeriesRow
                        key={cat.id}
                        title={cat.name}
                        fetchUrl={`${env.serverApi}/serie/home/series/${encodeURIComponent(cat.name)}`}
                        handlers={Handler}
                    />
                ))}
            </div>
        </div>
    );
}