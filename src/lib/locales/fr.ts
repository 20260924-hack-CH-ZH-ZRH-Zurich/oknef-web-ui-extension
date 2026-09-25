import type { Copy } from "../translations";

export const fr: Copy = {
  language: "Langue",
  eyebrow: "VOTRE KIT DE SÉCURITÉ AU QUOTIDIEN",
  title: "Pause. Vérifiez. Décidez.",
  intro:
    "Un second regard avant de cliquer. Choisissez une mini-app pour examiner ce que vous avez reçu.",
  local: "Vérifié sur cet appareil",
  apps: {
    url: "Vérifier un lien",
    qr: "Destination QR",
    email: "Vérifier un e-mail",
    call: "Transcription",
  },
  descriptions: {
    url: "Examinez une adresse avant de l’ouvrir.",
    qr: "Scannez avec la caméra ou choisissez une image QR.",
    email: "Cherchez les signaux d’alerte dans le texte d’un e-mail.",
    call: "Examinez une transcription pour repérer la manipulation.",
  },
  placeholders: {
    url: "Collez une adresse web complète",
    qr: "Collez l’URL décodée de l’image QR",
    email:
      "Collez le texte de l’e-mail. Retirez d’abord les mots de passe et données personnelles.",
    call: "Collez une transcription d’appel. Retirez d’abord les données privées.",
  },
  input: "Contenu à vérifier",
  inspect: "Vérifier",
  tab: "Utiliser l’URL de la page actuelle",
  preview: "Aperçu de l’extension",
  download: "Télécharger le ZIP de l’extension",
  openApp: "Ouvrir Oknef",
  appHint:
    "Ouvre votre espace Oknef. Votre texte et vos résultats ne sont pas transmis.",
  clear: "Tout effacer",
  history: "Vérifications de cette fenêtre",
  empty: "Vos vérifications apparaîtront ici.",
  result: "Pourquoi ce résultat ?",
  status: {
    blocked: "N’ouvrez pas encore",
    caution: "Examinez les alertes",
    unverified: "Non vérifié",
  },
  findings: {
    invalid_url: "Cette adresse web n’est pas complète ou valide.",
    unsafe_scheme:
      "Cette adresse utilise un protocole non web. Ne l’exécutez pas et ne l’ouvrez pas.",
    credentials:
      "L’adresse contient des identifiants avant l’hôte, ce qui peut masquer la destination.",
    private_host:
      "L’adresse pointe vers un hôte local, réservé, une IP littérale ou un hôte non pris en charge. Vérifiez par une autre voie.",
    unencrypted: "L’adresse utilise HTTP sans chiffrement du transport.",
    international_domain:
      "Le domaine utilise des caractères internationaux. Confirmez son orthographe exacte par une source indépendante.",
    nested_destination:
      "L’adresse contient une autre destination dans ses paramètres. Il peut s’agir d’une redirection.",
    sensitive_parameters:
      "Un paramètre de l’adresse peut contenir des données privées. Évitez de la partager.",
    hidden_characters:
      "Des caractères invisibles ou modifiant le sens de lecture peuvent masquer le texte.",
    prompt_injection:
      "Le texte contient des instructions qui pourraient détourner une IA. Elles ont été traitées comme des données.",
    urgency: "Un ton urgent peut vous pousser à éviter les vérifications.",
    secret_request:
      "Le texte mentionne des mots de passe, codes de vérification ou secrets de récupération. Ne les communiquez jamais sur demande.",
    payment:
      "Le texte mentionne un virement, une cryptomonnaie ou une carte cadeau. Confirmez les demandes de paiement par une autre voie.",
    remote_access:
      "Le texte mentionne un accès à distance ou l’installation d’un logiciel. Vérifiez avant d’autoriser l’accès.",
  },
  noSignals:
    "Aucun motif d’alerte configuré n’a été trouvé. Cela ne prouve ni la sécurité ni l’authenticité.",
  next: "Contactez la personne ou le prestataire par un numéro ou un site web que vous connaissez déjà.",
  disclaimer:
    "Analyse locale de motifs uniquement. Sans recherche de réputation, authentification de l’expéditeur, interception d’appels ni détection de voix ou de deepfakes. Les alertes invitent à vérifier et ne prouvent pas une fraude.",
  retention:
    "Le texte et les preuves QR restent ici jusqu’à l’effacement, la fermeture ou le rechargement. Les fichiers téléchargés restent sur votre appareil.",
  invalidInput: "Saisissez entre 1 et 12 000 caractères.",
  tabError:
    "L’URL de cette page n’est pas disponible. Copiez une adresse web dans le champ.",
  links: "Liens examinés",
  check: "Vérification",
  view: "Voir",
  appUnavailable:
    "Le lien vers l’espace n’est pas configuré dans cette version.",
};
