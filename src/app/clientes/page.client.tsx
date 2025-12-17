"use client";

import Image from "next/image";

import type { Client } from "@/content/clients";
import { translate } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";

type ClientsPageClientProps = {
  clients: Client[];
};

const hasLocaleContent = (value: { es: string; en: string } | undefined): boolean => {
  if (!value) {
    return false;
  }

  return value.es.trim().length > 0 || value.en.trim().length > 0;
};

const PAGE_TITLE = {
  es: "Clientes y aliados",
  en: "Clients and partners",
} as const;

const PAGE_COPY = {
  es: "Co-diseñamos soluciones junto a startups, scaleups y corporativos que buscan acelerar la entrega de valor.",
  en: "We co-design solutions with startups, scaleups, and enterprises that need to accelerate value delivery.",
} as const;

const WEBSITE_LABEL = {
  es: "Visitar sitio",
  en: "Visit site",
} as const;

export default function ClientsPageClient({ clients }: ClientsPageClientProps) {
  const { locale } = useLocale();

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {translate(locale, PAGE_TITLE)}
          </h1>
          <p className="text-base text-foreground/70 sm:text-lg">
            {translate(locale, PAGE_COPY)}
          </p>
        </div>
        <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
          <Image
            src="/images/clients-visual.svg"
            alt={
              locale === "es"
                ? "Ilustración abstracta de conexiones con clientes"
                : "Abstract illustration of client connections"
            }
            fill
            className="object-cover"
          />
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {clients.map((client) => (
          <article
            key={client.slug}
            className="flex flex-col gap-5 rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm"
          >
            {client.image && (
              <div className="relative h-20 w-20 overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5">
                <Image
                  src={client.image.src}
                  alt={translate(locale, client.image.alt)}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
            )}

            {client.image?.footnote && hasLocaleContent(client.image.footnote) && (
              <p className="text-xs text-foreground/50">
                {translate(locale, client.image.footnote)}
              </p>
            )}

            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-xl font-semibold text-foreground/90">
                  {client.name}
                </h2>
                <span className="inline-flex items-center rounded-full border border-foreground/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {translate(locale, client.sector)}
                </span>
              </div>
              <p className="text-sm text-foreground/70">
                {translate(locale, client.summary)}
              </p>
            </div>

            {client.website && (
              <a
                href={client.website}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-fit items-center gap-2 rounded-full border border-foreground/10 px-4 py-2 text-xs font-semibold text-foreground/70 transition hover:border-foreground/30 hover:text-foreground"
              >
                <span>{translate(locale, WEBSITE_LABEL)}</span>
                <span aria-hidden>↗</span>
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
