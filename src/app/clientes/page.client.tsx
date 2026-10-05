"use client";

import Image from "next/image";

import type { Client } from "@/content/clients";
import { translate } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";
import type { SiteContent } from "@/domain/site";
import { RichText } from "@/components/site/rich-text";

type ClientsPageClientProps = {
  clients: Client[];
  copy: SiteContent["clientsPage"];
};

const hasLocaleContent = (value: { es: string; en: string } | undefined): boolean => {
  if (!value) {
    return false;
  }

  return value.es.trim().length > 0 || value.en.trim().length > 0;
};

export default function ClientsPageClient({ clients, copy }: ClientsPageClientProps) {
  const { locale } = useLocale();

  return (
    <div className="space-y-16 sm:space-y-24">
      <header className="grid gap-8 border-t border-line pt-5 lg:grid-cols-12">
        <div className="lg:col-span-10">
        <RichText
          as="h1"
          value={copy.title}
          className="studio-display text-[clamp(3.2rem,7vw,7.2rem)] leading-[0.9] tracking-[-0.05em]"
        />
        <RichText
          value={copy.copy}
          className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        />
        </div>
      </header>

      <div className="grid border-l border-t border-line md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <article
            key={client.slug}
            className="group flex min-h-80 flex-col border-b border-r border-line p-5 transition-colors hover:bg-surface sm:p-6"
          >
            <div className="mb-8 flex items-start justify-end text-xs text-muted">
              <span>{translate(locale, client.sector)}</span>
            </div>
            {client.image && (
              <div className="relative h-16 w-36 opacity-70 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0">
                <Image
                  src={client.image.src}
                  alt={translate(locale, client.image.alt)}
                  fill
                  sizes="144px"
                  className="object-contain object-left"
                />
              </div>
            )}

            {client.image?.footnote && hasLocaleContent(client.image.footnote) && (
              <p className="mt-2 text-xs text-muted">
                {translate(locale, client.image.footnote)}
              </p>
            )}

            <div className="mt-auto space-y-3 pt-10">
              <div>
                <h2 className="studio-display text-2xl tracking-[-0.025em] text-foreground transition-colors group-hover:text-signal">
                  {client.name}
                </h2>
              </div>
              <p className="text-sm leading-relaxed text-muted">
                {translate(locale, client.summary)}
              </p>
            </div>

            {client.website && (
              <a
                href={client.website}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex w-fit items-center gap-3 border-b border-line pb-1 text-xs text-muted transition hover:border-foreground hover:text-foreground"
              >
                <span>{translate(locale, copy.websiteLabel)}</span>
                <span aria-hidden>↗</span>
              </a>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
