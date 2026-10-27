"use client";

import type { SiteContent } from "@/domain/site";
import { translate } from "@/lib/i18n";
import { getPlainText } from "@/components/site/rich-text";
import { useLocale } from "./locale-context";

type FooterProps = {
  footer: SiteContent["footer"];
  contactEmail: string;
};

const socialIconStyles =
  "inline-flex min-h-11 items-center gap-2 text-sm underline decoration-current/40 underline-offset-4 transition-colors hover:text-[var(--mmk-bg-light)] focus-visible:outline-[var(--mmk-bg-light)]";

export function Footer({ footer, contactEmail }: FooterProps) {
  const { locale } = useLocale();

  return (
    <footer className="bg-[var(--mmk-green-forest)] text-[var(--mmk-bg-light)]">
      <div className="mx-auto max-w-[1320px] px-6 py-9 sm:px-12 sm:py-10 lg:px-16 lg:py-16">
        <div className="min-w-0">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-[var(--mmk-green-soft)]">
            {locale === "es" ? "Nuevas colaboraciones" : "New collaborations"}
          </p>
          <h2 className="studio-display mt-4 max-w-[1060px] text-[clamp(2.25rem,4.2vw,3.5rem)] leading-[1.08] [overflow-wrap:anywhere]">
            {locale === "es" ? "Hablemos de lo que tienes en mente." : "Let’s talk about what you have in mind."}
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--mmk-green-soft)] sm:text-lg sm:leading-8">
            {locale === "es"
              ? "Nos interesa escuchar tus ideas y explorar cómo desarrollarlas juntos."
              : "We’d love to hear your ideas and explore how to develop them together."}
          </p>
          <a
            href={`mailto:${contactEmail}`}
            className="mt-4 inline-block max-w-full min-h-11 py-2 text-[clamp(1.125rem,2.8vw,2.25rem)] leading-relaxed tracking-[-0.025em] underline decoration-current/50 underline-offset-8 [overflow-wrap:anywhere] transition-colors hover:text-[var(--mmk-green-soft)] focus-visible:outline-[var(--mmk-bg-light)]"
          >
            {contactEmail}
          </a>
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-[var(--mmk-green-soft)]/30 pt-3 text-sm text-[var(--mmk-green-soft)] sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-x-8 sm:gap-y-2 lg:mt-8">
          <p className="text-base font-semibold tracking-[-0.045em] text-[var(--mmk-bg-light)]">monkmonkeykey</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {footer.instagramUrl ? (
              <a
                href={footer.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className={socialIconStyles}
                aria-label={getPlainText(translate(locale, footer.instagramLabel))}
              >
                Instagram <span aria-hidden>↗</span>
              </a>
            ) : null}
          </div>
          <p>&copy; {new Date().getFullYear()} monkmonkeykey</p>
          <p>Ciudad de México</p>
        </div>
      </div>
    </footer>
  );
}
