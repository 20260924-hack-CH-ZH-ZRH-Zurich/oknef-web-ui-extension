import { notFound } from "next/navigation";
import { MiniApps } from "@/features/mini-apps/MiniApps";
import { isLocale } from "@/lib/translations";

export default async function LocalizedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <MiniApps preview initialLocale={locale} />;
}
