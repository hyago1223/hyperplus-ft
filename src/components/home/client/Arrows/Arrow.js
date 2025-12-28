import style from "./style.module.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"

export default function ArrowsPage({ onMoveLeft, onMoveRight }){
    return (
        <div className={style.arrowsContainer}>
            <button className={style.arrowButton} onClick={onMoveLeft} aria-label="Mover Para a esquerda"><FaChevronLeft size={24}/></button>
            <button className={style.arrowButton} onClick={onMoveRight} aria-label="Mover Para a esquerda"><FaChevronRight size={24}/></button>
        </div>
    );
}