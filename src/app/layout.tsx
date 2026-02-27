import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { getSiteContent } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  title: "monkmonkeykey estudio",
  description:
    "monkmonkeykey estudio es un estudio de producción artística y técnica enfocado en nuevos medios, sistemas interactivos y proyectos culturales, especialmente en el ámbito de la música experimental, con especialización en audio multicanal.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
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
