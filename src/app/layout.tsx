import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { getSiteContent } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: "MonkMonkeyKey · Product Strategy Studio",
  description:
    "MonkMonkeyKey impulsa productos digitales con estrategia, diseño y desarrollo centrados en resultados tangibles.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteContent = await getSiteContent();

  return (
    <html lang="es">
      <body className="antialiased">
        <SiteShell siteContent={siteContent}>{children}</SiteShell>
      </body>
    </html>
  );
}
