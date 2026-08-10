'use client';
import { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import VideoControler from "./VideoController";
import { envs as env } from "@/lib/env/index.js";
import styles from "./styles.module.css";

export default function VideoPlayer({ videoData }) {
  const [VideoControllerShow, setVideoControllerShow] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    if (!videoRef.current || !videoData?.video_url) return;

    const videoElement = videoRef.current;
    const videoUrl = `${env.serverApi}${videoData.video_url}`;
    let hls;

    if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
      videoElement.src = videoUrl;
    } else if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(videoUrl);
      hls.attachMedia(videoElement);
    } else {
      videoElement.src = videoUrl;
    }

    videoElement.load();

    return () => {
      if (hls) {
        hls.destroy();
      }

      if (videoElement) {
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener(
      "fullscreenchange",
      handleFullscreenChange
    );

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <div ref={playerRef} className={styles.playerContainer} onMouseEnter={() => setVideoControllerShow(true)}>
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
      <div onMouseEnter={() => setVideoControllerShow(true)} className={`${styles.controlsContainer} ${VideoControllerShow ? styles.visible : ''}`}>
        <VideoControler videoRef={videoRef} playerRef={playerRef}/>
      </div>
    </div>
  );
}