import menu from "@/components/menu.js";
import { useEffect, useState } from "react";
import styles from './style.module.css';
import { useRouter } from "next/navigation";
export default function Hero() {
    const [highlight, setHighlight] = useState(null);
    const router = useRouter();

    async function loadHero(){
        try{
            const res = await fetch(`${menu.Server_api}/serie/home/hero`);
            if(!res.ok) throw new Error("Erro ao busca Hero");
            const responseJson = await res.json();
            if (responseJson.success && responseJson.data && responseJson.data.length > 0) {
                const serieData = responseJson.data[0];
                    if(serieData.url_image){
                        serieData.url_image = `${menu.Server_api}/serie/image/${data.id}`;
                    }else{
                        serieData.url_image = '/img/placeholder.png';
                    }
                    setHighlight(serieData);
            }else{
                setHighlight(null);
            }
            
            
        }catch(err){
            console.error(err);
        }
    };

    useEffect(()=>{
        loadHero()
    },[]);

    if (!highlight) {
        return (
            <section className={styles.heroEmpty}>
                <div className={styles.heroContent}>
                    <span className={styles.tag}>EM DESTAQUE</span>
                    <h1>Nenhuma série em destaque</h1>
                    <p>O administrador ainda não escolheu uma série para o destaque.</p>
                </div>
            </section>
        );
    }

    return (
        <section
            className={styles.hero}
            style={{
                backgroundImage: `url(${highlight?.url_image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}>
            <div className={styles.heroContent}>
            <span className={styles.tag}>EM DESTAQUE</span>
            <h1>{highlight?.title}</h1>
            <p>{highlight?.description?.substring(0, 150)}...</p>

            <div className={styles.buttons}>
                <button onClick={() => router.push(`/player?source=serie&id=${highlight?.id}`)}>
                Assistir agora
                </button>
                <button onClick={() => router.push(`/serie?id=${highlight?.id}`)}>
                Detalhes
                </button>
            </div>
        </div>
    </section>
    )};