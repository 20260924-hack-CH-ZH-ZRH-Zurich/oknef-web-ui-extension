"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  captureEvidence,
  decodePixels,
  type QrEvidence,
} from "@/lib/models/qr";

export function useQrCapture(
  onCapture: (content: string, evidence: QrEvidence) => void,
) {
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const generation = useRef(0);
  const onResult = useRef(onCapture);
  onResult.current = onCapture;
  const [active, setActive] = useState(false);
  const [error, setError] = useState(false);
  const stop = useCallback(() => {
    generation.current += 1;
    if (timer.current) clearTimeout(timer.current);
    stream.current?.getTracks().forEach((track) => {
      track.stop();
    });
    stream.current = null;
    if (video.current) video.current.srcObject = null;
    setActive(false);
  }, []);

  async function inspectFrame(
    source: CanvasImageSource,
    width: number,
    height: number,
    kind: QrEvidence["source"],
  ) {
    const ratio = Math.min(1, 1280 / Math.max(width, height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * ratio));
    canvas.height = Math.max(1, Math.round(height * ratio));
    const context = canvas.getContext("2d", { willReadFrequently: true });
    if (!context) throw new Error("invalid_image");
    context.drawImage(source, 0, 0, canvas.width, canvas.height);
    const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
    const content = decodePixels(pixels.data, pixels.width, pixels.height);
    return content
      ? { content, evidence: await captureEvidence(canvas, kind) }
      : null;
  }

  async function start() {
    stop();
    setError(false);
    const current = generation.current;
    try {
      const media = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });
      if (current !== generation.current || document.hidden) {
        media.getTracks().forEach((track) => {
          track.stop();
        });
        return;
      }
      stream.current = media;
      if (!video.current) throw new Error("camera_unavailable");
      video.current.srcObject = media;
      await video.current.play();
      setActive(true);
      const scan = async () => {
        if (current !== generation.current) return;
        try {
          const frame = video.current;
          const result = frame?.videoWidth
            ? await inspectFrame(
                frame,
                frame.videoWidth,
                frame.videoHeight,
                "qr-camera",
              )
            : null;
          if (current !== generation.current) return;
          if (result) {
            stop();
            onResult.current(result.content, result.evidence);
            return;
          }
          timer.current = setTimeout(scan, 350);
        } catch {
          stop();
          setError(true);
        }
      };
      await scan();
    } catch {
      stop();
      setError(true);
    }
  }

  async function upload(file?: File) {
    if (!file) return;
    stop();
    setError(false);
    const current = generation.current;
    try {
      if (
        !["image/png", "image/jpeg", "image/webp"].includes(file.type) ||
        file.size > 4 * 1024 * 1024
      )
        throw new Error("invalid_image");
      const bitmap = await createImageBitmap(file);
      try {
        if (bitmap.width * bitmap.height > 16_000_000)
          throw new Error("invalid_image");
        const result = await inspectFrame(
          bitmap,
          bitmap.width,
          bitmap.height,
          "qr-image",
        );
        if (!result) throw new Error("no_qr");
        if (current === generation.current)
          onResult.current(result.content, result.evidence);
      } finally {
        bitmap.close();
      }
    } catch {
      setError(true);
    }
  }

  useEffect(() => {
    const hide = () => {
      if (document.hidden) stop();
    };
    document.addEventListener("visibilitychange", hide);
    return () => {
      document.removeEventListener("visibilitychange", hide);
      stop();
    };
  }, [stop]);
  return { video, active, error, start, stop, upload };
}
