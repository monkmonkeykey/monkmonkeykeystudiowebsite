"use client";

import Image from "next/image";
import Link from "next/link";

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

const CTA_LABEL = {
  es: "Agenda una llamada",
  en: "Book a call",
} as const;

const OUTCOMES_LABEL = {
  es: "Entregables principales",
  en: "Key deliverables",
} as const;

export default function ServicesPage() {
  const { locale } = useLocale();

  return (
    <div className="space-y-12" id="top">
      <header className="relative overflow-hidden rounded-4xl border border-foreground/10 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 shadow-sm sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_35%)]" aria-hidden />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1 text-xs font-medium text-foreground/70 ring-1 ring-foreground/10">
              <span className="size-2 rounded-full bg-primary shadow-[0_0_0_4px_rgba(56,189,248,0.12)]" />
              {translate(locale, PAGE_TITLE)}
            </div>
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              {translate(locale, PAGE_TITLE)}
            </h1>
            <p className="text-base text-foreground/70 sm:text-lg">
              {translate(locale, PAGE_COPY)}
            </p>
            <div className="flex flex-wrap gap-3 pt-2 text-sm text-foreground/70">
              <div className="inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-2 ring-1 ring-foreground/10">
                <span className="size-2 rounded-full bg-emerald-400" />
                {locale === "es" ? "Discovery a ejecución" : "Discovery to delivery"}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-2 ring-1 ring-foreground/10">
                <span className="size-2 rounded-full bg-sky-400" />
                {locale === "es" ? "Equipos extendidos" : "Extended squads"}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-2 ring-1 ring-foreground/10">
                <span className="size-2 rounded-full bg-fuchsia-400" />
                {locale === "es" ? "Pruebas rápidas" : "Rapid experiments"}
              </div>
            </div>
          </div>

          <div className="relative h-full min-h-[240px] overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/[0.04] p-6">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_30%),radial-gradient(circle_at_80%_30%,rgba(192,132,252,0.12),transparent_26%)]" aria-hidden />
            <div className="relative z-10 flex h-full flex-col justify-between gap-4">
              <div className="space-y-2">
                <p className="text-sm uppercase tracking-[0.16em] text-foreground/60">
                  {locale === "es" ? "Mapa rápido" : "Quick map"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {SERVICES.map((service, index) => (
                    <a
                      key={service.slug}
                      href={`#${service.slug}`}
                      className="group inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background/70 px-3 py-2 text-sm text-foreground/80 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/10 hover:text-foreground"
                    >
                      <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary group-hover:bg-primary/20">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {translate(locale, service.title)}
                    </a>
                  ))}
                </div>
              </div>

              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 hover:shadow-primary/40"
              >
                {translate(locale, CTA_LABEL)}
                <span aria-hidden className="text-lg">
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {SERVICES.map((service, serviceIndex) => (
          <section
            key={service.slug}
            id={service.slug}
            className="scroll-mt-32 rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl/40 sm:p-8"
          >
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground/70 ring-1 ring-foreground/10">
                  <span className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-[0.7rem] font-semibold text-primary">
                    {String(serviceIndex + 1).padStart(2, "0")}
                  </span>
                  {locale === "es" ? "Servicio" : "Service"}
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                    {translate(locale, service.title)}
                  </h2>
                  <p className="text-base text-foreground/70 sm:text-lg">
                    {translate(locale, service.summary)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-foreground/70">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-primary ring-1 ring-primary/20">
                    {locale === "es" ? "Inicio en 2-3 semanas" : "Kick off in 2-3 weeks"}
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1.5 ring-1 ring-foreground/10">
                    {locale === "es" ? "Equipo dedicado" : "Dedicated squad"}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4 ring-1 ring-foreground/10">
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-background ring-1 ring-foreground/10">
                  <Image
                    src="/images/services-visual.svg"
                    alt={locale === "es" ? "Ilustración de servicio" : "Service illustration"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-1 text-sm text-foreground/70">
                  <p className="font-semibold text-foreground">
                    {locale === "es" ? "Sesión inicial" : "Kick-off session"}
                  </p>
                  <p>{locale === "es" ? "Alineamos objetivos, métricas y responsables" : "Align on goals, metrics, and owners"}</p>
                  <Link href="/contacto" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
                    {locale === "es" ? "Hablar con el equipo" : "Talk with the team"}
                    <span aria-hidden>→</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/50">
                  {translate(locale, OUTCOMES_LABEL)}
                </p>
                <a
                  className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80"
                  href="#top"
                >
                  {locale === "es" ? "Volver arriba" : "Back to top"}
                  <span aria-hidden>↑</span>
                </a>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {service.outcomes.map((outcome, index) => (
                  <article
                    key={index}
                    className="flex items-start gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4 transition hover:-translate-y-0.5 hover:border-primary/40 hover:bg-primary/5"
                  >
                    <div className="mt-1 flex size-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary ring-1 ring-primary/20">
                      {locale === "es" ? `0${index + 1}` : `0${index + 1}`}
                    </div>
                    <div className="space-y-1 text-sm text-foreground/70">
                      <p className="font-semibold text-foreground">
                        {locale === "es" ? `Entrega ${index + 1}` : `Deliverable ${index + 1}`}
                      </p>
                      <p>{translate(locale, outcome)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
