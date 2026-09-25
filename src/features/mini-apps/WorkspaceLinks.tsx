import { config } from "@/lib/config";
import { WORKSPACE_VIEWS, workspaceUrl } from "@/lib/models/workspace";
import type { Locale } from "@/lib/translations";
import { workspaceCopy } from "@/lib/workspaceCopy";
import styles from "./MiniAppsStyles.module.css";

export function WorkspaceLinks({ locale }: { locale: Locale }) {
  if (!config.appOrigin) return null;
  const copy = workspaceCopy[locale];
  return (
    <section className={styles.inspector}>
      <h2>{copy.title}</h2>
      <p className={styles.caption}>{copy.hint}</p>
      <nav className={styles.workspaceLinks} aria-label={copy.title}>
        {WORKSPACE_VIEWS.map((view) => (
          <a
            key={view}
            href={workspaceUrl(config.appOrigin ?? "", locale, view)}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.views[view]} ↗
          </a>
        ))}
      </nav>
    </section>
  );
}
