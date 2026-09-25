import type { Inspection } from "@/lib/models/inspection";
import type { Copy } from "@/lib/translations";
import styles from "./MiniAppsStyles.module.css";

export function InspectionResult({
  result,
  copy,
}: {
  result: Inspection;
  copy: Copy;
}) {
  return (
    <section className={styles.result} aria-live="polite" aria-atomic="true">
      <span className={styles[result.status]}>
        {copy.status[result.status]}
      </span>
      <h2>{copy.result}</h2>
      {result.findings.length ? (
        <ul>
          {result.findings.map((finding) => (
            <li key={finding.code}>{copy.findings[finding.code]}</li>
          ))}
        </ul>
      ) : (
        <p>{copy.noSignals}</p>
      )}
      <p className={styles.caption}>
        {copy.links}: {result.linkCount}
      </p>
      <p className={styles.nextStep}>{copy.next}</p>
    </section>
  );
}
