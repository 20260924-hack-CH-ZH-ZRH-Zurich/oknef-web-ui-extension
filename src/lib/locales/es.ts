import type { Copy } from "../translations";

export const es: Copy = {
  language: "Idioma",
  eyebrow: "TU KIT DE SEGURIDAD DIARIA",
  title: "Pausa. Revisa. Decide.",
  intro:
    "Una segunda mirada antes de hacer clic. Elige una mini app para revisar lo que te han enviado.",
  local: "Revisado en este dispositivo",
  apps: {
    url: "Revisar enlace",
    qr: "Destino del QR",
    email: "Revisar correo",
    call: "Transcripción",
  },
  descriptions: {
    url: "Inspecciona una dirección antes de abrirla.",
    qr: "Escanea con cámara o elige una imagen QR.",
    email: "Busca señales de alerta en el texto de un correo.",
    call: "Revisa una transcripción para detectar ingeniería social.",
  },
  placeholders: {
    url: "Pega una dirección web completa",
    qr: "Pega la URL decodificada de la imagen QR",
    email:
      "Pega el texto del correo. Elimina contraseñas y datos personales primero.",
    call: "Pega la transcripción de una llamada. Elimina los datos privados primero.",
  },
  input: "Contenido que quieres revisar",
  inspect: "Revisar ahora",
  tab: "Usar URL de la página actual",
  preview: "Vista previa de la extensión",
  download: "Descargar ZIP de la extensión",
  openApp: "Abrir Oknef",
  appHint: "Abre tu espacio de Oknef. Tu texto y los resultados no se envían.",
  clear: "Borrar todo",
  history: "Revisiones de esta ventana",
  empty: "Tus revisiones aparecerán aquí.",
  result: "¿Por qué este resultado?",
  status: {
    blocked: "No lo abras todavía",
    caution: "Revisa las señales de alerta",
    unverified: "Sin verificar",
  },
  findings: {
    invalid_url: "No es una dirección web completa y válida.",
    unsafe_scheme:
      "Esta dirección utiliza un esquema no web. No la ejecutes ni la abras.",
    credentials:
      "La dirección incluye datos de acceso antes del servidor, lo que puede ocultar el destino.",
    private_host:
      "La dirección apunta a un servidor local, reservado, una IP literal o un servidor no admitido. Verifícala de forma independiente.",
    unencrypted: "La dirección utiliza HTTP sin cifrado de transporte.",
    international_domain:
      "El dominio contiene caracteres internacionales. Confirma su escritura exacta por otra vía.",
    nested_destination:
      "La dirección incluye otro destino en sus parámetros. Podría ser una redirección.",
    sensitive_parameters:
      "La dirección incluye un parámetro que podría contener datos privados. Evita compartirla.",
    hidden_characters:
      "Hay caracteres invisibles o que cambian la dirección de lectura y pueden ocultar texto.",
    prompt_injection:
      "El texto contiene instrucciones que podrían intentar desviar una IA. Se trataron como datos.",
    urgency:
      "El lenguaje urgente puede presionarte para omitir la verificación.",
    secret_request:
      "El texto menciona contraseñas, códigos o secretos de recuperación. Nunca los compartas ante una solicitud.",
    payment:
      "El texto menciona una transferencia, criptomonedas o una tarjeta regalo. Confirma las solicitudes de pago por otra vía.",
    remote_access:
      "El texto menciona acceso remoto o instalar software. Verifica la solicitud antes de dar acceso.",
  },
  noSignals:
    "No coincidió ningún patrón de alerta configurado. Esto no demuestra seguridad ni autenticidad.",
  next: "Contacta con la persona o el proveedor mediante un número o sitio web que ya conozcas.",
  disclaimer:
    "Solo patrones locales. Sin consulta de reputación, autenticación del remitente, interceptación de llamadas ni detección de voz o deepfakes. Las señales invitan a revisar; no prueban un fraude.",
  retention:
    "El texto y la evidencia QR permanecen aquí hasta borrarlos, cerrar o recargar. Los archivos descargados permanecen en tu dispositivo.",
  invalidInput: "Introduce entre 1 y 12.000 caracteres.",
  tabError:
    "La URL de esta página no está disponible. Copia una dirección web en el campo.",
  links: "Enlaces revisados",
  check: "Revisión",
  view: "Ver",
  appUnavailable: "El enlace al espacio no está configurado en esta versión.",
};
