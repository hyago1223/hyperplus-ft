'use client';

import { useEffect, useRef, useState } from "react";
import menu from "@/components/menu";
import styles from "./styles.module.css";

export default function VideoPlayer({ episodeId }) {
  const videoRef = useRef(null);

  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!episodeId) {
      setError("Episódio inválido");
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function loadEpisode() {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${menu.Server_api}/episode/${episodeId}`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Erro ao carregar episódio");
        }

        const data = await res.json();
        setVideo(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Erro ao carregar vídeo");
        }
      } finally {
        setLoading(false);
      }
    }

    loadEpisode();

    return () => controller.abort();
  }, [episodeId]);

  useEffect(() => {
    if (!video?.video_url || !videoRef.current) return;

    const videoElement = videoRef.current;

    const videoUrl = `${menu.Server_api}${video.video_url}`;

    videoElement.src = videoUrl;
    videoElement.load();

    return () => {
      videoElement.pause();
      videoElement.removeAttribute("src");
      videoElement.load();
    };
  }, [video]);

  if (loading) return <div className={styles.loading}>Carregando vídeo...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <video
      ref={videoRef}
      className={styles.video}
      controls
      autoPlay
      playsInline
    />
  );
}