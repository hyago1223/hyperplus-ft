'use client';

import { useRef, useState, useEffect } from 'react';
import styles from './ImageCropModal.module.css';

const HANDLE_SIZE = 16;
const MIN_RADIUS = 20;

export default function ImageCropModal({ imageSrc, onConfirm, onCancel }) {
  const containerRef = useRef(null);
  const imgRef = useRef(null);

  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [circle, setCircle] = useState(null);
  const [mode, setMode] = useState(null);
  const [sending, setSending] = useState(false);

  const dragOffset = useRef({ dx: 0, dy: 0 });

  function initCircleFromImage() {
    const img = imgRef.current;
    if (!img) return;
    const w = img.clientWidth;
    const h = img.clientHeight;
    if (w === 0 || h === 0) return; // ainda não tem layout, espera o próximo tick

    setNaturalSize({ width: img.naturalWidth, height: img.naturalHeight });
    setDisplaySize({ width: w, height: h });

    const radius = Math.min(w, h) * 0.35;
    setCircle({ x: w / 2, y: h / 2, radius });
  }

  function handleImageLoad() {
    initCircleFromImage();
  }

  // Fallback: se a imagem já estava em cache, o onLoad pode nunca disparar.
  useEffect(() => {
    const img = imgRef.current;
    if (img && img.complete) {
      initCircleFromImage();
    }
  }, [imageSrc]);

  function getContainerPos(e) {
    const rect = containerRef.current.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top, rect };
  }

  // ---- arrastar o círculo (mover posição) ----
  function handleCirclePointerDown(e) {
    if (!circle) return;
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    const { x, y } = getContainerPos(e);
    dragOffset.current = { dx: x - circle.x, dy: y - circle.y };
    setMode('move');
  }

  function handleCirclePointerMove(e) {
    if (!circle || mode !== 'move') return;
    const { x, y, rect } = getContainerPos(e);
    const r = circle.radius;
    let nx = x - dragOffset.current.dx;
    let ny = y - dragOffset.current.dy;
    nx = Math.min(Math.max(nx, r), rect.width - r);
    ny = Math.min(Math.max(ny, r), rect.height - r);
    setCircle((c) => (c ? { ...c, x: nx, y: ny } : c));
  }

  function handlePointerUp() {
    setMode(null);
  }

  // ---- alça de redimensionar (arrastar borda) ----
  function handleHandlePointerDown(e) {
    if (!circle) return;
    e.stopPropagation();
    e.target.setPointerCapture(e.pointerId);
    setMode('resize');
  }

  function handleHandlePointerMove(e) {
    if (!circle || mode !== 'resize') return;
    const { x, y, rect } = getContainerPos(e);
    const dx = x - circle.x;
    const dy = y - circle.y;
    let newRadius = Math.sqrt(dx * dx + dy * dy);

    const maxRadius = Math.min(circle.x, circle.y, rect.width - circle.x, rect.height - circle.y);
    newRadius = Math.min(Math.max(newRadius, MIN_RADIUS), maxRadius);
    setCircle((c) => (c ? { ...c, radius: newRadius } : c));
  }

  async function handleConfirm() {
    if (!circle || !imgRef.current || displaySize.width === 0) return;
    setSending(true);

    const scale = naturalSize.width / displaySize.width;
    const realRadius = circle.radius * scale;
    const realCx = circle.x * scale;
    const realCy = circle.y * scale;
    const size = realRadius * 2;

    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.save();
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, realRadius, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      imgRef.current,
      realCx - realRadius, realCy - realRadius, size, size,
      0, 0, size, size
    );
    ctx.restore();

    canvas.toBlob(
      (blob) => {
        setSending(false);
        if (blob) onConfirm(blob);
      },
      'image/png'
    );
  }

  const handlePos = circle
    ? {
        left: circle.x + circle.radius * Math.cos(Math.PI / 4) - HANDLE_SIZE / 2,
        top: circle.y + circle.radius * Math.sin(Math.PI / 4) - HANDLE_SIZE / 2,
      }
    : null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>Ajuste sua foto</h3>

        <div ref={containerRef} className={styles.cropStage}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            ref={imgRef}
            src={imageSrc}
            alt="Foto para recorte"
            onLoad={handleImageLoad}
            draggable={false}
            className={styles.cropImage}
          />

          {circle && handlePos && (
            <>
              <div
                className={styles.circleBox}
                style={{
                  left: circle.x - circle.radius,
                  top: circle.y - circle.radius,
                  width: circle.radius * 2,
                  height: circle.radius * 2,
                  cursor: mode === 'move' ? 'grabbing' : 'grab',
                }}
                onPointerDown={handleCirclePointerDown}
                onPointerMove={handleCirclePointerMove}
                onPointerUp={handlePointerUp}
              />
              <div
                className={styles.resizeHandle}
                style={{ left: handlePos.left, top: handlePos.top }}
                onPointerDown={handleHandlePointerDown}
                onPointerMove={handleHandlePointerMove}
                onPointerUp={handlePointerUp}
              />
            </>
          )}
        </div>

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onCancel} disabled={sending}>
            Cancelar
          </button>
          <button className={styles.confirmBtn} onClick={handleConfirm} disabled={!circle || sending}>
            {sending ? 'Processando...' : 'Usar esta área'}
          </button>
        </div>
      </div>
    </div>
  );
}