import type { Locale } from "@/lib/translations";
import { workspaceCopy } from "@/lib/workspaceCopy";
import styles from "./MiniAppsStyles.module.css";
import type { Session } from "./useInspection";

export function QrEvidenceView({
  session,
  locale,
}: {
  session: Session;
  locale: Locale;
}) {
  if (!session.evidence) return null;
  const copy = workspaceCopy[locale];
  const evidence = session.evidence;
  function download() {
    const { preview, ...metadata } = evidence;
    const document = {
      schema: "oknef.local-qr-evidence.v1",
      captured_at: metadata.captured_at,
      content: session.content,
      evidence: metadata,
      image_data_url: preview,
      assessment: {
        status: session.status,
        findings: session.findings,
        authenticity_verified: false,
        method: "local-pattern-rules",
      },
    };
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(document, null, 2)], {
        type: "application/json",
      }),
    );
    const link = window.document.createElement("a");
    link.href = url;
    link.download = `oknef-qr-evidence-${session.id}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className={styles.inspector}>
      <h2>{copy.evidence}</h2>
      {/* biome-ignore lint/performance/noImgElement: Packaged extension displays a bounded local PNG without a Next image server. */}
      <img
        className={styles.camera}
        src={evidence.preview}
        alt={copy.evidence}
      />
      <p className={styles.evidenceText}>{session.content}</p>
      <p className={styles.evidenceText}>SHA-256: {evidence.sha256}</p>
      <p className={styles.caption}>{copy.retention}</p>
      <button type="button" className={styles.primary} onClick={download}>
        {copy.export}
      </button>
    </section>
  );
}
