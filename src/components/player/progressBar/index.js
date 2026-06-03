import { useEffect, useState } from "react";
import styles from '../styles.module.css'

export default function ProgressBar({ videoRef }){
    const [progress, setProgress] = useState(0.0);
    const [isDragging, setIsDragging] = useState(false);

    const editProgressBar = (e) => {
        if(videoRef.current){
            const newTime = (e.target.value / 100) * videoRef.current.duration;
            videoRef.current.currentTime = newTime;
            setProgress(e.target.value);
        }
    };

    const handleMouseDown = () => {
        setIsDragging(true);
        if(videoRef.current){
            videoRef.current.pause();
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        if(videoRef.current){
            videoRef.current.play();
        }
    };

    useEffect(() =>{
        const video = videoRef.current;
        if(!video) return;

        const updateProgress = () => {
            if(!isDragging){
                const percent = (video.currentTime / video.duration) * 100;
                setProgress(percent || 0);
            }
        };

        video.addEventListener('timeupdate', updateProgress);
        return () => {
            if(video && video.removeEventListener){
                video.removeEventListener('timeupdate', updateProgress);
            }
        };
    },[isDragging]);

    return (
        <input 
            type="range" 
            className={styles.progressBar}
            value={progress} 
            onChange={editProgressBar}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            min="0"
            max="100"
        />
    );
}