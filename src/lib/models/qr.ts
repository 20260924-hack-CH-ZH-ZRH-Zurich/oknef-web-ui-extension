import jsQR from "jsqr";

export type QrEvidence = {
  name: string;
  mime_type: "image/png";
  size_bytes: number;
  sha256: string;
  source: "qr-camera" | "qr-image";
  captured_at: string;
  preview: string;
};

export function decodePixels(
  data: Uint8ClampedArray,
  width: number,
  height: number,
): string | null {
  if (
    !Number.isInteger(width) ||
    !Number.isInteger(height) ||
    width < 1 ||
    height < 1 ||
    width * height > 4_000_000 ||
    data.length !== width * height * 4
  )
    throw new Error("invalid_image");
  const result = jsQR(data, width, height, {
    inversionAttempts: "attemptBoth",
  });
  if (!result?.data) return null;
  if (result.data.length > 12_000) throw new Error("invalid_content");
  return result.data;
}

export async function captureEvidence(
  canvas: HTMLCanvasElement,
  source: QrEvidence["source"],
): Promise<QrEvidence> {
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (value) => (value ? resolve(value) : reject(new Error("invalid_image"))),
      "image/png",
    ),
  );
  const digest = await crypto.subtle.digest(
    "SHA-256",
    await blob.arrayBuffer(),
  );
  return {
    name: "qr-evidence.png",
    mime_type: "image/png",
    size_bytes: blob.size,
    sha256: Array.from(new Uint8Array(digest), (byte) =>
      byte.toString(16).padStart(2, "0"),
    ).join(""),
    source,
    captured_at: new Date().toISOString(),
    preview: canvas.toDataURL("image/png"),
  };
}
