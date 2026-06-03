'use client';
import { useEffect, useRef, useState } from "react";
import VideoControler from "./VideoController";
import menu from "@/components/menu";
import styles from "./styles.module.css";

export default function VideoPlayer({ videoData }) {
  const [VideoControllerShow, setVideoControllerShow] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const videoElement = videoRef.current;
    const videoUrl = `${menu.Server_api}${videoData.video_url}`;

    videoElement.src = videoUrl;
    videoElement.load();

    return () => {
      if(videoElement){
        videoElement.pause();
        videoElement.removeAttribute("src");
        videoElement.load();
      }
    };
  }, [videoData]);

  useEffect(() =>{
    const timeout = setTimeout(() => {
      setVideoControllerShow(false);
    }, 3000);
    return () => clearTimeout(timeout);
  },[VideoControllerShow])

  return (
    <div className={styles.playerContainer} onMouseEnter={() => setVideoControllerShow(true)}>
      <div className={styles.playerWrapper}>
        <video
        ref={videoRef}
        className={styles.video}
        controls = {false}
        unselectable="off"
        autoPlay
        playsInline
        crossOrigin="use-credentials"
      />
      </div>
      <div className={`${styles.controlsContainer} ${VideoControllerShow ? styles.visible : ''}`}>
        <VideoControler videoRef={videoRef}/>
      </div>
    </div>
  );
}