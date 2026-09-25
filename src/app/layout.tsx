import type { Metadata, Viewport } from "next";
import { OfflineRegistration } from "@/features/mini-apps/OfflineRegistration";
import "@/styles/globals.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Oknef mini apps — check before you click",
  description:
    "Private, local checks for links, QR destinations, email text and call transcripts.",
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#146950",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>
        {children}
        <OfflineRegistration />
      </body>
    </html>
  );
}
