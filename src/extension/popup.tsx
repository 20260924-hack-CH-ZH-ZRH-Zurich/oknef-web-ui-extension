import { createRoot } from "react-dom/client";
import { MiniApps } from "@/features/mini-apps/MiniApps";
import { isLocale } from "@/lib/translations";
import "@/styles/globals.css";
import "./popup.css";

const root = document.getElementById("root");
const browserLanguage = navigator.language.split("-")[0];
if (!root) throw new Error("Extension mount point is missing.");
createRoot(root).render(
  <MiniApps
    initialLocale={isLocale(browserLanguage) ? browserLanguage : "en"}
  />,
);
