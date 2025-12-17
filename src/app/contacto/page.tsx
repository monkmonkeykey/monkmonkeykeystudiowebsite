"use client";

import Image from "next/image";
import Link from "next/link";

import { translate } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";

const PAGE_TITLE = {
  es: "Construyamos juntos",
  en: "Let’s build together",
} as const;

const PAGE_COPY = {
  es: "Cuéntanos sobre tu reto de producto y coordinemos una sesión exploratoria de 30 minutos.",
  en: "Tell us about your product challenge and we will schedule a 30-minute exploratory session.",
} as const;

const CONTACT_EMAIL = "hola@monkmonkeykey.com";

export default function ContactPage() {
  const { locale } = useLocale();

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {translate(locale, PAGE_TITLE)}
          </h1>
          <p className="text-base text-foreground/70 sm:text-lg">
            {translate(locale, PAGE_COPY)}
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
            href={`mailto:${CONTACT_EMAIL}`}
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
            <li>
              {locale === "es"
                ? "Contexto del producto y objetivos de negocio."
                : "Product context and business goals."}
            </li>
            <li>
              {locale === "es"
                ? "Estado actual del equipo y métricas disponibles."
                : "Current team setup and available metrics."}
            </li>
            <li>
              {locale === "es"
                ? "Hipótesis a validar y próximos hitos."
                : "Hypotheses to validate and upcoming milestones."}
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
