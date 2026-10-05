"use client";

import { useState, type FormEvent } from "react";

import type { SiteContent } from "@/domain/site";
import { useLocale } from "@/components/site/locale-context";
import { RichText } from "@/components/site/rich-text";

type ContactPageClientProps = {
  siteContent: SiteContent;
};

const fieldStyles =
  "w-full border border-line bg-background px-3 py-3 text-sm text-foreground outline-none transition placeholder:text-muted focus:border-primary focus:bg-surface";

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
    <div className="space-y-16 sm:space-y-24">
      <header className="grid gap-8 border-t border-line pt-5 lg:grid-cols-12">
        <div className="lg:col-span-10">
        <RichText
          as="h1"
          value={siteContent.contact.title}
          className="studio-display text-[clamp(3.2rem,7vw,7.2rem)] leading-[0.9] tracking-[-0.05em]"
        />
        <RichText
          value={siteContent.contact.copy}
          className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        />
        </div>
      </header>

      <section className="grid gap-12 border-t border-line pt-5 lg:grid-cols-12 lg:gap-6">
        <aside className="space-y-10 lg:col-span-3">
          <div>
            <p className="text-xs text-muted">
              {locale === "es" ? "Correo directo" : "Direct email"}
            </p>
            <a
              href={`mailto:${siteContent.contact.email}`}
              className="mt-3 inline-flex border-b border-foreground pb-1 text-sm text-foreground transition hover:opacity-70"
            >
              {siteContent.contact.email}
            </a>
          </div>
          <div>
            <RichText
              as="p"
              value={siteContent.contact.preparationTitle}
              className="text-xs text-muted"
            />
            <div className="mt-3 border-t border-line">
              {siteContent.contact.preparation.map((item, index) => (
                <div key={`${item.es}-${index}`} className="border-b border-line py-3 text-xs leading-relaxed text-foreground/70">
                  <RichText as="span" value={item} />
                </div>
              ))}
            </div>
          </div>
        </aside>

        <div className="lg:col-span-8 lg:col-start-5">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 border border-line bg-surface p-5 sm:p-8"
          >
            <div className="flex items-center justify-between">
            <div>
                <RichText
                  as="p"
                  value={siteContent.contact.formTitle}
                  className="text-lg font-medium text-foreground"
                />
                <RichText
                  as="p"
                  value={siteContent.contact.formSubtitle}
                  className="mt-1 text-xs text-muted"
                />
              </div>
              {status === "success" && (
                <span className="bg-foreground px-3 py-2 text-xs text-background">
                  <RichText as="span" value={siteContent.contact.successLabel} />
                </span>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-xs text-muted">
                <RichText as="span" value={siteContent.contact.nameLabel} />
                <input
                  required
                  value={formData.name}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, name: event.target.value }))
                  }
                  className={fieldStyles}
                  name="name"
                />
              </label>
              <label className="space-y-2 text-xs text-muted">
                <RichText as="span" value={siteContent.contact.emailLabel} />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, email: event.target.value }))
                  }
                  className={fieldStyles}
                  name="email"
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 text-xs text-muted">
                <RichText as="span" value={siteContent.contact.organizationLabel} />
                <input
                  value={formData.organization}
                  onChange={(event) =>
                    setFormData((prev) => ({
                      ...prev,
                      organization: event.target.value,
                    }))
                  }
                  className={fieldStyles}
                  name="organization"
                />
              </label>
              <label className="space-y-2 text-xs text-muted">
                <RichText as="span" value={siteContent.contact.phoneLabel} />
                <input
                  value={formData.phone}
                  onChange={(event) =>
                    setFormData((prev) => ({ ...prev, phone: event.target.value }))
                  }
                  className={fieldStyles}
                  name="phone"
                />
              </label>
            </div>

            <label className="space-y-2 text-xs text-muted">
              <RichText as="span" value={siteContent.contact.subjectLabel} />
              <input
                value={formData.subject}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, subject: event.target.value }))
                }
                className={fieldStyles}
                name="subject"
              />
            </label>

            <label className="space-y-2 text-xs text-muted">
              <RichText as="span" value={siteContent.contact.messageLabel} />
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(event) =>
                  setFormData((prev) => ({ ...prev, message: event.target.value }))
                }
                className={fieldStyles}
                name="message"
              />
            </label>

            {error ? (
              <p className="text-sm text-red-600">{error}</p>
            ) : (
              <p className="text-xs text-muted">
                {locale === "es"
                  ? ""
                  : ""}
              </p>
            )}

            <button
              type="submit"
              className="studio-action studio-action--primary w-full disabled:cursor-not-allowed disabled:border-muted disabled:bg-muted"
              disabled={status === "sending"}
            >
              {status === "sending" ? (
                <RichText as="span" value={siteContent.contact.sendingLabel} />
              ) : (
                <><RichText as="span" value={siteContent.contact.submitLabel} /><span aria-hidden>↗</span></>
              )}
            </button>
          </form>
        </div>

      </section>
    </div>
  );
}
