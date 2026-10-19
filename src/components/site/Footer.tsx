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
      <div className="mx-auto max-w-[1320px] px-6 py-16 sm:px-12 sm:py-24 lg:px-16 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-12 lg:gap-10">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/55 lg:col-span-2">
            MONKMONKEYKEY · CDMX
          </p>
          <div className="lg:col-span-7">
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-foreground/55">
              {locale === "es" ? "Nuevas colaboraciones" : "New collaborations"}
            </p>
            <p className="studio-display mt-10 max-w-4xl text-[clamp(3.25rem,5.2vw,5.8rem)] leading-[0.92] tracking-[-0.055em] text-foreground">
              {locale === "es" ? "Hagamos que la idea funcione." : "Let’s make the idea work."}
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="mt-12 inline-flex min-h-11 items-center gap-4 border-b border-foreground/55 pb-2 text-sm text-foreground transition hover:border-signal hover:text-signal sm:text-base"
            >
              {contactEmail}
              <span aria-hidden>↗</span>
            </a>
          </div>

          <div className="flex flex-col gap-12 border-l border-foreground/20 pl-6 lg:col-span-3">
            <p className="max-w-xs text-sm leading-7 text-foreground/55">
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

        <div className="mt-24 flex flex-col gap-4 border-t border-foreground/20 pt-6 font-mono text-[9px] uppercase tracking-[0.12em] text-foreground/45 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} monkmonkeykey.studio · CDMX</p>
          <Link href="/admin/login" className="transition hover:text-foreground">
            {translate(locale, footer.adminLabel)}
          </Link>
        </div>
      </div>
    </footer>
  );
}
