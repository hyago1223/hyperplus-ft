import { Suspense } from "react";
import styles from './styles.module.css';
import Player from "./player.js";

export default function Page() {
    return (
        <main className={styles.mainContainer}>
            <Suspense fallback={<div>Carregando...</div>}>
                <Player />
            </Suspense>
        </main>
    );
}