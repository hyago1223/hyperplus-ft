import { Suspense } from "react";
import styles from "@/components/css/Serie/style.module.css";
import SerieResult from "./SerieResult.js";

export default function SearchPage(){
    return (
        <main className={styles.mainContainer}>
            <Suspense fallback={<div className={styles.loading}>Carregando...</div>}>
                <SerieResult />
            </Suspense>
        </main>
    );
}
