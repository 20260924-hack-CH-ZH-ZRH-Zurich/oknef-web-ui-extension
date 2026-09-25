import type { WorkspaceView } from "./models/workspace";
import type { Locale } from "./translations";

type WorkspaceCopy = {
  title: string;
  hint: string;
  start: string;
  stop: string;
  upload: string;
  cameraHint: string;
  cameraError: string;
  expanded: string;
  evidence: string;
  export: string;
  retention: string;
  views: Record<WorkspaceView, string>;
};
export const workspaceCopy: Record<Locale, WorkspaceCopy> = {
  en: {
    title: "Your complete workspace",
    hint: "Open the same Oknef web workspace with your signed-in browser account. These buttons do not send inspected content.",
    start: "Scan with camera",
    stop: "Stop camera",
    upload: "Choose a QR image",
    expanded: "Open extension in a full tab",
    cameraHint:
      "The camera reads QR codes locally and stops after capture. Review the result before opening anything. PNG, JPEG or WebP up to 4 MB.",
    cameraError:
      "Camera or QR unavailable. Allow camera access or choose a clear QR image. A full extension tab can help with permission prompts.",
    evidence: "Captured QR evidence",
    export: "Download evidence JSON",
    retention:
      "Captured image, decoded content and findings remain in this window until cleared or closed. Download only when you intend to retain this sensitive evidence.",
    views: {
      drive: "Oknef Drive",
      connections: "Asset connections",
      miniapps: "All mini apps",
      integrations: "Integrations",
      identities: "Identity & passports",
      sessions: "Session graph",
      security: "Security",
      succession: "Legacy",
      approvals: "Approvals",
      assistant: "Chat & voice",
      admin: "Oknef admin",
    },
  },
  es: {
    title: "Tu espacio completo",
    hint: "Abre el mismo espacio web de Oknef con tu sesión del navegador. Estos botones no envían el contenido analizado.",
    start: "Escanear con cámara",
    stop: "Detener cámara",
    upload: "Elegir imagen QR",
    expanded: "Abrir extensión en una pestaña",
    cameraHint:
      "La cámara lee códigos QR localmente y se detiene tras capturarlos. Revisa el resultado antes de abrir enlaces. PNG, JPEG o WebP hasta 4 MB.",
    cameraError:
      "Cámara o QR no disponible. Permite la cámara o elige una imagen QR clara. Una pestaña completa facilita los permisos.",
    evidence: "Evidencia QR capturada",
    export: "Descargar evidencia JSON",
    retention:
      "La imagen, el contenido y los hallazgos permanecen en esta ventana hasta borrarla o cerrarla. Descarga solo si deseas conservar esta evidencia sensible.",
    views: {
      drive: "Oknef Drive",
      connections: "Conexiones de activos",
      miniapps: "Todas las miniapps",
      integrations: "Integraciones",
      identities: "Identidad y pasaportes",
      sessions: "Grafo de sesiones",
      security: "Seguridad",
      succession: "Legado",
      approvals: "Aprobaciones",
      assistant: "Chat y voz",
      admin: "Administración Oknef",
    },
  },
  de: {
    title: "Dein vollständiger Arbeitsbereich",
    hint: "Öffne denselben Oknef-Webbereich mit deinem Browserkonto. Diese Schaltflächen übertragen keine geprüften Inhalte.",
    start: "Mit Kamera scannen",
    stop: "Kamera stoppen",
    upload: "QR-Bild auswählen",
    expanded: "Erweiterung in einem Tab öffnen",
    cameraHint:
      "Die Kamera liest QR-Codes lokal und stoppt nach der Aufnahme. Prüfe das Ergebnis, bevor du Links öffnest. PNG, JPEG oder WebP bis 4 MB.",
    cameraError:
      "Kamera oder QR nicht verfügbar. Erlaube die Kamera oder wähle ein klares QR-Bild. Ein vollständiger Tab erleichtert Berechtigungen.",
    evidence: "Erfasster QR-Beleg",
    export: "Beleg als JSON herunterladen",
    retention:
      "Bild, Inhalt und Befunde bleiben bis zum Löschen oder Schließen in diesem Fenster. Lade sie nur herunter, wenn du diese sensiblen Belege speichern möchtest.",
    views: {
      drive: "Oknef Drive",
      connections: "Asset-Verbindungen",
      miniapps: "Alle Mini-Apps",
      integrations: "Integrationen",
      identities: "Identität und Pässe",
      sessions: "Sitzungsgraph",
      security: "Sicherheit",
      succession: "Nachlass",
      approvals: "Freigaben",
      assistant: "Chat und Sprache",
      admin: "Oknef-Verwaltung",
    },
  },
  fr: {
    title: "Votre espace complet",
    hint: "Ouvrez le même espace web Oknef avec votre compte du navigateur. Ces boutons ne transmettent aucun contenu analysé.",
    start: "Scanner avec la caméra",
    stop: "Arrêter la caméra",
    upload: "Choisir une image QR",
    expanded: "Ouvrir l’extension dans un onglet",
    cameraHint:
      "La caméra lit les QR localement et s’arrête après la capture. Vérifiez le résultat avant d’ouvrir un lien. PNG, JPEG ou WebP jusqu’à 4 Mo.",
    cameraError:
      "Caméra ou QR indisponible. Autorisez la caméra ou choisissez une image QR nette. Un onglet complet facilite les autorisations.",
    evidence: "Preuve QR capturée",
    export: "Télécharger la preuve JSON",
    retention:
      "L’image, le contenu et les résultats restent ici jusqu’à l’effacement ou la fermeture. Téléchargez uniquement si vous souhaitez conserver cette preuve sensible.",
    views: {
      drive: "Oknef Drive",
      connections: "Connexions des actifs",
      miniapps: "Toutes les mini-apps",
      integrations: "Intégrations",
      identities: "Identité et passeports",
      sessions: "Graphe des sessions",
      security: "Sécurité",
      succession: "Succession",
      approvals: "Approbations",
      assistant: "Chat et voix",
      admin: "Administration Oknef",
    },
  },
};
