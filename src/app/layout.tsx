import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "MonkMonkeyKey · Product Strategy Studio",
  description:
    "MonkMonkeyKey impulsa productos digitales con estrategia, diseño y desarrollo centrados en resultados tangibles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
