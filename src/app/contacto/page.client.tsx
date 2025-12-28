"use client";

import Image from "next/image";
import Link from "next/link";

import type { SiteContent } from "@/domain/site";
import { translate } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";

type ContactPageClientProps = {
  siteContent: SiteContent;
};

export default function ContactPageClient({ siteContent }: ContactPageClientProps) {
  const { locale } = useLocale();

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {translate(locale, siteContent.contact.title)}
          </h1>
          <p className="text-base text-foreground/70 sm:text-lg">
            {translate(locale, siteContent.contact.copy)}
          </p>
        </div>
        <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
          <Image
            src="/images/contact-visual.svg"
            alt={
              locale === "es"
                ? "Ilustración abstracta de una reunión de trabajo"
                : "Abstract illustration of a working session"
            }
            fill
            className="object-cover"
          />
        </div>
      </header>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-foreground/90">
            {locale === "es" ? "Agenda una llamada" : "Book a call"}
          </h2>
          <p className="mt-3 text-sm text-foreground/70">
            {locale === "es"
              ? "Compartiremos disponibilidad en menos de 24 horas hábiles."
              : "We will share our availability within 24 business hours."}
          </p>
          <Link
            href={`mailto:${siteContent.contact.email}`}
            className="mt-4 inline-flex w-fit items-center justify-center rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90"
          >
            {locale === "es" ? "Escríbenos" : "Write to us"}
          </Link>
        </div>

        <div className="space-y-4 rounded-3xl border border-foreground/10 bg-foreground/5 p-6">
          <h2 className="text-lg font-semibold text-foreground/90">
            {locale === "es" ? "Qué preparamos" : "What we prepare"}
          </h2>
          <ul className="space-y-3 text-sm text-foreground/70">
            {siteContent.contact.preparation.map((item, index) => (
              <li key={`${item.es}-${index}`}>{translate(locale, item)}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
