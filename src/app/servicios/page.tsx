"use client";

import Image from "next/image";

import { SERVICES } from "@/content/services";
import { translate } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";

const PAGE_TITLE = {
  es: "Servicios y formatos de trabajo",
  en: "Services and collaboration formats",
} as const;

const PAGE_COPY = {
  es: "Cada engagement se adapta al momento de tu producto. Podemos sumarnos como task force temporal, equipo extendido o líderes de práctica.",
  en: "Each engagement adapts to your product stage. We can join as a temporary task force, extended team, or practice leads.",
} as const;

export default function ServicesPage() {
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
            src="/images/services-visual.svg"
            alt={
              locale === "es"
                ? "Ilustración abstracta de servicios colaborativos"
                : "Abstract illustration of collaborative services"
            }
            fill
            className="object-cover"
          />
        </div>
      </header>

      <div className="space-y-12">
        {SERVICES.map((service) => (
          <section
            key={service.slug}
            id={service.slug}
            className="scroll-mt-28 rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm"
          >
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {locale === "es" ? "Servicio" : "Service"}
                </p>
                <h2 className="text-2xl font-semibold tracking-tight">
                  {translate(locale, service.title)}
                </h2>
              </div>
              <p className="text-base text-foreground/70">
                {translate(locale, service.summary)}
              </p>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {service.outcomes.map((outcome, index) => (
                <article
                  key={index}
                  className="rounded-2xl border border-foreground/10 bg-foreground/5 p-4 text-sm text-foreground/80"
                >
                  <p className="font-semibold">
                    {locale === "es" ? `Entregable ${index + 1}` : `Deliverable ${index + 1}`}
                  </p>
                  <p className="mt-2 text-foreground/70">
                    {translate(locale, outcome)}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
