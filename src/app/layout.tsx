import type { Metadata } from "next";
import { SiteShell } from "@/components/site/SiteShell";
import { getSiteContent } from "@/data/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://monkmonkeykey.com"),
  title: "monkmonkeykey estudio",
  description:
    "monkmonkeykey estudio es un estudio de producción artística y técnica enfocado en nuevos medios, sistemas interactivos y proyectos culturales, especialmente en el ámbito de la música experimental, con especialización en audio multicanal.",
  openGraph: {
    title: "monkmonkeykey estudio",
    description:
      "monkmonkeykey estudio es un estudio de producción artística y técnica enfocado en nuevos medios, sistemas interactivos y proyectos culturales, especialmente en el ámbito de la música experimental, con especialización en audio multicanal.",
    type: "website",
    siteName: "monkmonkeykey estudio",
    images: [
      {
        url: "/favicon.png",
        width: 500,
        height: 500,
        alt: "Logo de monkmonkeykey estudio",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "monkmonkeykey estudio",
    description:
      "monkmonkeykey estudio es un estudio de producción artística y técnica enfocado en nuevos medios, sistemas interactivos y proyectos culturales, especialmente en el ámbito de la música experimental, con especialización en audio multicanal.",
    images: ["/favicon.png"],
  },
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
