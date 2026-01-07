"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";

import type { SiteContent } from "@/domain/site";
import { translate } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";
import { RichText } from "@/components/site/rich-text";

type ContactPageClientProps = {
  siteContent: SiteContent;
};

export default function ContactPageClient({ siteContent }: ContactPageClientProps) {
  const { locale } = useLocale();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        const message =
          errorBody && typeof errorBody.error === "string"
            ? errorBody.error
            : "Failed to send message";
        throw new Error(message);
      }

      setStatus("success");
      setFormData({
        name: "",
        email: "",
        organization: "",
        phone: "",
        subject: "",
        message: "",
      });
    } catch (submissionError) {
      console.error(submissionError);
      const message =
        submissionError instanceof Error ? submissionError.message : null;
      setError(
        message && message !== "Failed to send message"
          ? message
          : locale === "es"
            ? "No pudimos enviar tu mensaje. Intenta de nuevo."
            : "We couldn't send your message. Please try again.",
      );
      setStatus("error");
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl space-y-4">
          <RichText
            as="h1"
            value={siteContent.contact.title}
            className="text-3xl font-semibold tracking-tight sm:text-4xl"
          />
          <RichText
            value={siteContent.contact.copy}
            className="prose prose-sm max-w-none text-foreground/70 sm:prose-base"
          />
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

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground/80">
                  {locale === "es" ? "Escríbenos" : "Send a message"}
                </p>
                <p className="text-xs text-foreground/60">
                  {locale === "es"
                    ? "Te responderemos en menos de un día hábil."
                    : "We’ll reply within one business day."}
                </p>
              </div>
              {status === "success" && (
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                  {locale === "es" ? "Enviado" : "Sent"}
                </span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-foreground/80">
                <span>{locale === "es" ? "Nombre" : "Name"}</span>
                <input
                  required
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm text-foreground outline-none transition focus:border-foreground/30 focus:bg-background"
                  name="name"
                />
              </label>
              <label className="space-y-2 text-sm text-foreground/80">
                <span>Email</span>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm text-foreground outline-none transition focus:border-foreground/30 focus:bg-background"
                  name="email"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-sm text-foreground/80">
                <span>{locale === "es" ? "Organización" : "Organization"}</span>
                <input
                  value={formData.organization}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      organization: event.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm text-foreground outline-none transition focus:border-foreground/30 focus:bg-background"
                  name="organization"
                />
              </label>
              <label className="space-y-2 text-sm text-foreground/80">
                <span>{locale === "es" ? "Teléfono" : "Phone"}</span>
                <input
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm text-foreground outline-none transition focus:border-foreground/30 focus:bg-background"
                  name="phone"
                />
              </label>
            </div>

            <label className="space-y-2 text-sm text-foreground/80">
              <span>{locale === "es" ? "Asunto" : "Subject"}</span>
              <input
                value={formData.subject}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, subject: event.target.value }))
                }
                className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm text-foreground outline-none transition focus:border-foreground/30 focus:bg-background"
                name="subject"
              />
            </label>

            <label className="space-y-2 text-sm text-foreground/80">
              <span>{locale === "es" ? "Mensaje" : "Message"}</span>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, message: event.target.value }))
                }
                className="w-full rounded-xl border border-foreground/10 bg-foreground/5 px-3 py-2 text-sm text-foreground outline-none transition focus:border-foreground/30 focus:bg-background"
                name="message"
              />
            </label>

            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : (
              <p className="text-xs text-foreground/60">
                {locale === "es"
                  ? "Compartiremos disponibilidad y próximos pasos por correo."
                  : "We’ll reply with availability and next steps via email."}
              </p>
            )}

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90 disabled:cursor-not-allowed disabled:bg-foreground/40"
              disabled={status === "sending"}
            >
              {status === "sending"
                ? locale === "es"
                  ? "Enviando..."
                  : "Sending..."
                : locale === "es"
                  ? "Enviar mensaje"
                  : "Send message"}
            </button>
          </form>
        </div>

        <div className="space-y-4 rounded-3xl border border-foreground/10 bg-foreground/5 p-6">
          <h2 className="text-lg font-semibold text-foreground/90">
            {locale === "es" ? "Más formas de contacto" : "More ways to reach us"}
          </h2>
          <ul className="space-y-3 text-sm text-foreground/70">
            <li>
              <span className="block text-xs uppercase tracking-wide text-foreground/50">
                {locale === "es" ? "Correo" : "Email"}
              </span>
              <Link
                href={`mailto:${siteContent.contact.email}`}
                className="font-semibold text-foreground underline underline-offset-2"
              >
                {siteContent.contact.email}
              </Link>
            </li>
            <li className="text-xs text-foreground/60">
              {locale === "es"
                ? "Prefieres agendar? También puedes escribirnos para compartir detalles y coordinar una llamada."
                : "Prefer to schedule? Share details here and we’ll coordinate a call."}
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
