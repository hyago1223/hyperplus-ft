import { useEffect, useState } from "react";
import styles from '../styles.module.css'

const formatTime = (sec) =>{
    const h = Math.floor(sec / 3600).toString().padStart(2, '0');
    const m = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(sec % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
}

export default function LeftButtons( { videoRef } ){
    const [isPaused, setIsPaused] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isDraggingVolume, setIsDraggingVolume] = useState(false);
    
    
    const HandlerPausePlay = () =>{
        if(videoRef.current && videoRef.current.paused){
            setIsPaused(false);
            videoRef.current.play();
        }else if(videoRef.current){
            setIsPaused(true);
            videoRef.current.pause();
        }
    };

    const HandlerMuted = () =>{
        if(videoRef.current){
            videoRef.current.muted = !videoRef.current.muted;
            setIsMuted(videoRef.current.muted);
        }
    };

    const changeVolume = (volume) => {
        if(videoRef.current && !isDraggingVolume){
            videoRef.current.volume = volume;
        }
    };

    const handleVolumeMouseDown = () => {
        setIsDraggingVolume(true);
    };

    const handleVolumeMouseUp = (e) => {
        setIsDraggingVolume(false);
        if(videoRef.current){
            videoRef.current.volume = e.target.value;
        }
    };

    useEffect(() =>{
        if(videoRef.current){
            setIsMuted(videoRef.current.muted);
        }
    },[]);
    return (
        <>
            <button 
            type="button" 
            className={styles.controlButton}
            onClick={HandlerPausePlay}
            >
                {isPaused? (<i>⏸</i>) : (<i>▶</i>)}
            </button>
            <div className={styles.volumeControl}>
                <button 
                    className={styles.volumeMuteButton}
                    onClick={HandlerMuted}
                    type="button"
                >
                    {isMuted? (<i>🔇</i>) : (<i>🔊</i>)}
                </button>
                <input 
                    type="range" 
                    className={styles.volumeSlider}
                    onChange={(e) => changeVolume(e.target.value)}
                    onMouseDown={handleVolumeMouseDown}
                    onMouseUp={handleVolumeMouseUp}
                    onTouchStart={handleVolumeMouseDown}
                    onTouchEnd={handleVolumeMouseUp}
                    min="0"
                    max="1"
                    step="0.1"
                />
            </div>
            <p className={styles.timeDisplay}>{videoRef && videoRef.current ? formatTime(videoRef.current.currentTime)+" / "+formatTime(videoRef.current.duration) : "0:00:00 / 0:00:00"}</p>
        </>
    );
}