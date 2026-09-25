import { canExpandExtension, expandExtension } from "@/lib/browser";
import type { QrEvidence } from "@/lib/models/qr";
import type { Locale } from "@/lib/translations";
import { workspaceCopy } from "@/lib/workspaceCopy";
import styles from "./MiniAppsStyles.module.css";
import { useQrCapture } from "./useQrCapture";

export function QrCapture({
  locale,
  onCapture,
}: {
  locale: Locale;
  onCapture: (content: string, evidence: QrEvidence) => void;
}) {
  const copy = workspaceCopy[locale];
  const camera = useQrCapture(onCapture);
  return (
    <section className={styles.inspector}>
      <p className={styles.caption}>{copy.cameraHint}</p>
      <video
        className={camera.active ? styles.camera : styles.hiddenCamera}
        ref={camera.video}
        muted
        playsInline
        aria-label={copy.start}
      />
      <div className={styles.captureActions}>
        <button
          type="button"
          className={styles.primary}
          onClick={camera.active ? camera.stop : camera.start}
        >
          {camera.active ? copy.stop : copy.start}
        </button>
        <label className={styles.appLink}>
          {copy.upload}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={(event) => {
              void camera.upload(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
        {canExpandExtension() && (
          <button
            type="button"
            className={styles.textButton}
            onClick={() => expandExtension()}
          >
            {copy.expanded}
          </button>
        )}
      </div>
      {camera.error && (
        <p role="alert" className={styles.error}>
          {copy.cameraError}
        </p>
      )}
    </section>
  );
}
