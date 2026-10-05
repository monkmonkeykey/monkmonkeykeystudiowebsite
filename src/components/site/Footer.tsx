"use client";

import Link from "next/link";

import type { SiteContent } from "@/domain/site";
import { translate } from "@/lib/i18n";
import { getPlainText } from "@/components/site/rich-text";
import { useLocale } from "./locale-context";

type FooterProps = {
  footer: SiteContent["footer"];
  contactEmail: string;
};

const socialIconStyles =
  "inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-xs text-foreground/55 transition hover:border-signal hover:text-signal";

export function Footer({ footer, contactEmail }: FooterProps) {
  const { locale } = useLocale();

  return (
    <footer className="border-t border-line bg-ink text-foreground">
      <div className="mx-auto max-w-[1520px] px-4 py-12 sm:px-7 sm:py-16 lg:px-12 lg:py-20">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-6">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/55 lg:col-span-3">
            MONKMONKEYKEY · CDMX
          </p>
          <div className="lg:col-span-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/55">
              {locale === "es" ? "Nuevas colaboraciones" : "New collaborations"}
            </p>
            <p className="studio-display mt-8 max-w-4xl text-[clamp(3rem,6vw,6.5rem)] leading-[0.86] tracking-[-0.05em] text-foreground">
              {locale === "es" ? "Hagamos que la idea funcione." : "Let’s make the idea work."}
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="mt-10 inline-flex items-center gap-4 border-b border-foreground/55 pb-2 text-sm text-foreground transition hover:border-signal hover:text-signal sm:text-base"
            >
              {contactEmail}
              <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="flex flex-col justify-between gap-10 border-l border-foreground/20 pl-5 lg:col-span-3">
            <p className="max-w-xs text-sm leading-relaxed text-foreground/55">
              {translate(locale, footer.tagline)}
            </p>
            <div className="flex flex-wrap items-center gap-5">
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
            {footer.facebookUrl ? (
              <a
                href={footer.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className={socialIconStyles}
                aria-label={getPlainText(translate(locale, footer.facebookLabel))}
              >
                Facebook <span aria-hidden>↗</span>
              </a>
            ) : null}
            {footer.linkedinUrl ? (
              <a
                href={footer.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className={socialIconStyles}
                aria-label={getPlainText(translate(locale, footer.linkedinLabel))}
              >
                LinkedIn <span aria-hidden>↗</span>
              </a>
            ) : null}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-foreground/20 pt-5 font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/45 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} monkmonkeykey.studio · CDMX</p>
          <Link href="/admin/login" className="transition hover:text-foreground">
            {translate(locale, footer.adminLabel)}
          </Link>
        </div>
      </div>
    </footer>
  );
}
