import { useState } from "react";
import ProgressBar from "../progressBar";
import styles from '../styles.module.css'
import LeftButtons from "../LeftButtons";
import RightButtons from "../RightButtons";

export default function VideoControler({ videoRef }) {
    return (
        <div>
            <div className={styles.progressBarWrapper}>
                <ProgressBar videoRef={videoRef}/>
            </div>
            <div className={styles.buttonsWrapper}>
                <div className={styles.leftControls}>
                    <LeftButtons videoRef={videoRef}/>
                </div>
                <div className={styles.rightControls}>
                    <RightButtons videoRef={videoRef}/>
                </div>
            </div>
        </div>
    )
}