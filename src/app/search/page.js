'use client';
import { useSearchParams,useRouter } from "next/navigation";
import menu from "../../components/menu";
import { useEffect, useState } from "react";
import styles from './styles.module.css'

// Padrao de cada resultado
function ResultCard({serie}){
    const router = useRouter()
    const imageURL = `${menu.Server_api}/serie/image/${serie.id}`;
    return (
        <div onClick={(e)=>{e.preventDefault(); router.push(`/serie?id=${serie.id}`)}} className={styles.resultCard}>
            <div className={styles.imageWrapper}>
                <img src={imageURL} alt={serie.title} onError={(e) => e.target.src = 'img/placeholder.png'}/>
            </div>
            <h3>{serie.title}</h3>
        </div>
    );
}
export default function SearchPage(){
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const Params = useSearchParams();
    const query = Params.get('query');

    async function HandlerSearch(){
        if(!query) return;
        setLoading(true);
        try{
            const res = await fetch(`${menu.Server_api}/search?query=${encodeURIComponent(query)}`,{
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        }
            })
            if(!res.ok) throw new Error("Erro na requisição");
            const data = await res.json();
            const list = Array.isArray(data)? data : (data.data || []);
            setResults(list)
        }catch(err){
            console.error("Erro ao buscar series",err);
            setResults([])
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        HandlerSearch()
    },[query])
    
    return (
        <main className={styles.mainContainer}>
                <div hidden className="container-search-category">
                    
                </div>
                <div className={styles.headerResult}>
                    <h1>Resultados para: <span>"{query}"</span></h1>
                </div>
                {loading ? ( <div className={styles.loading}>Pesquisando...</div>) : (
                    <div className={styles.searchResultsGrid}>
                        {results.length > 0 ? (results.map((serie) => (<ResultCard key={serie.id} serie={serie}/>))):(
                            <p className={styles.noResults}>Nenhum resultado Encontrado</p>
                        )}
                    </div>
                )}
        </main>
    );
}