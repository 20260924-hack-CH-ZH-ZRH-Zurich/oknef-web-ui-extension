import { Auth } from "@workspace/features/auth/Auth";
import { PitchDeck } from "@workspace/features/deck/PitchDeck";
import { Preferences } from "@workspace/features/preferences/Preferences";
import { Workspace } from "@workspace/features/workspace/Workspace";
import { createRoot } from "react-dom/client";
import { usePathname } from "./router";

function Application() {
  const path = usePathname();
  const locale = path.split("/")[1];
  const language =
    locale === "de" || locale === "es" || locale === "fr" ? locale : "en";
  return (
    <Preferences initialLocale={language}>
      {path.includes("/login") ? (
        <Auth />
      ) : path.includes("/deck/") ? (
        <PitchDeck />
      ) : (
        <Workspace />
      )}
    </Preferences>
  );
}
const target = document.getElementById("root");
if (!target) throw new Error("Missing extension workspace mount");
createRoot(target).render(<Application />);
