import { Suspense } from "react";
import styles from './styles.module.css'
import SearchResults from "./searchResults.js";

export default function SearchPage(){
    return (
        <main className={styles.mainContainer}>
            <Suspense fallback={<div className={styles.loading}>Carregando...</div>}>
                <SearchResults />
            </Suspense>
        </main>
    );
}
