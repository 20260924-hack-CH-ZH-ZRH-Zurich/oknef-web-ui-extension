import type { Copy } from "../translations";

export const de: Copy = {
  openWorkspace: "Vollständigen Arbeitsbereich öffnen",
  workspaceError:
    "Der Arbeitsbereich konnte nicht geöffnet werden. Lade die Erweiterung neu und versuche es erneut.",
  language: "Sprache",
  eyebrow: "DEIN SICHERHEITSKIT FÜR DEN ALLTAG",
  title: "Innehalten. Prüfen. Entscheiden.",
  intro:
    "Ein zweiter Blick vor dem nächsten Klick. Wähle eine Mini-App und prüfe zugesendete Inhalte.",
  local: "Auf diesem Gerät geprüft",
  apps: {
    url: "Link prüfen",
    qr: "QR-Ziel",
    email: "E-Mail prüfen",
    call: "Anruftranskript",
  },
  descriptions: {
    url: "Prüfe eine Adresse vor dem Öffnen.",
    qr: "Mit Kamera scannen oder QR-Bild auswählen.",
    email: "Suche nach Warnsignalen in eingefügten E-Mail-Texten.",
    call: "Prüfe ein Transkript auf soziale Manipulation.",
  },
  placeholders: {
    url: "Vollständige Webadresse einfügen",
    qr: "Die aus dem QR-Bild gelesene URL einfügen",
    email:
      "E-Mail-Text einfügen. Zuerst Passwörter und persönliche Angaben entfernen.",
    call: "Anruftranskript einfügen. Zuerst private Angaben entfernen.",
  },
  input: "Zu prüfender Inhalt",
  inspect: "Jetzt prüfen",
  tab: "URL der aktuellen Seite nutzen",
  preview: "Erweiterungsvorschau",
  download: "Erweiterung als ZIP herunterladen",
  openApp: "Oknef öffnen",
  appHint:
    "Öffnet deinen Oknef-Arbeitsbereich. Text und Ergebnisse werden nicht übertragen.",
  clear: "Alles löschen",
  history: "Prüfungen in diesem Fenster",
  empty: "Hier erscheinen deine Prüfungen.",
  result: "Warum dieses Ergebnis?",
  status: {
    blocked: "Noch nicht öffnen",
    caution: "Warnsignale prüfen",
    unverified: "Nicht verifiziert",
  },
  findings: {
    invalid_url: "Dies ist keine vollständige, gültige Webadresse.",
    unsafe_scheme:
      "Diese Adresse verwendet kein Web-Protokoll. Nicht ausführen oder öffnen.",
    credentials:
      "Die Adresse enthält Anmeldedaten vor dem Host und kann so das Ziel verschleiern.",
    private_host:
      "Die Adresse verweist auf einen lokalen, reservierten, direkten IP- oder nicht unterstützten Host. Unabhängig prüfen.",
    unencrypted: "Die Adresse verwendet HTTP ohne Transportverschlüsselung.",
    international_domain:
      "Die Domain verwendet internationale Zeichen. Die genaue Schreibweise unabhängig bestätigen.",
    nested_destination:
      "Die Adresse enthält ein weiteres Ziel in den Parametern. Das kann eine Weiterleitung sein.",
    sensitive_parameters:
      "Ein Parameter der Adresse könnte private Daten enthalten. Nicht weitergeben.",
    hidden_characters:
      "Unsichtbare Zeichen oder Änderungen der Leserichtung können den Text verschleiern.",
    prompt_injection:
      "Der Text enthält ein Anweisungsmuster, das eine KI umlenken könnte. Es wurde als Daten behandelt.",
    urgency:
      "Dringliche Sprache kann dazu drängen, eine Prüfung zu überspringen.",
    secret_request:
      "Der Text erwähnt Passwörter, Bestätigungscodes oder Wiederherstellungsgeheimnisse. Auf Anfrage niemals weitergeben.",
    payment:
      "Der Text erwähnt eine Überweisung, Kryptowährung oder einen Gutschein. Zahlungsanfragen unabhängig bestätigen.",
    remote_access:
      "Der Text erwähnt Fernzugriff oder Softwareinstallation. Vor der Freigabe die Anfrage prüfen.",
  },
  noSignals:
    "Kein konfiguriertes Warnmuster gefunden. Das belegt weder Sicherheit noch Echtheit.",
  next: "Kontaktiere die Person oder den Anbieter über eine bereits bekannte Nummer oder Website.",
  disclaimer:
    "Nur lokale Musterprüfung. Keine Reputationsabfrage, Absenderauthentifizierung, Anrufüberwachung oder Stimm- bzw. Deepfake-Erkennung. Hinweise sind ein Anlass zur Prüfung und kein Betrugsnachweis.",
  retention:
    "Text und QR-Belege bleiben hier bis zum Löschen, Schließen oder Neuladen. Heruntergeladene Belege bleiben auf deinem Gerät.",
  invalidInput: "Zwischen 1 und 12.000 Zeichen eingeben.",
  tabError:
    "Diese Seiten-URL ist nicht verfügbar. Kopiere eine Webadresse in das Feld.",
  links: "Geprüfte Links",
  check: "Prüfung",
  view: "Ansehen",
  appUnavailable:
    "Der Link zum Arbeitsbereich ist in diesem Build nicht konfiguriert.",
};
