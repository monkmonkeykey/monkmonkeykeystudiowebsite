"use client";

import Link from "next/link";

import type { SiteContent } from "@/domain/site";
import { translate } from "@/lib/i18n";
import { getPlainText } from "@/components/site/rich-text";
import { useLocale } from "./locale-context";

type FooterProps = {
  footer: SiteContent["footer"];
};

const socialIconStyles =
  "inline-flex items-center justify-center rounded-full border border-foreground/15 bg-background/70 p-2 text-foreground/60 transition hover:-translate-y-0.5 hover:border-foreground/30 hover:text-foreground";

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Footer({ footer }: FooterProps) {
  const { locale } = useLocale();

  return (
    <footer className="border-t border-foreground/10 bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-foreground/60 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} monkmonkeykey</p>
        <div className="flex flex-col gap-2 text-sm md:items-end">
          <p>{translate(locale, footer.tagline)}</p>
          <div className="flex flex-wrap items-center gap-2">
            {footer.instagramUrl ? (
              <a
                href={footer.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className={socialIconStyles}
                aria-label={getPlainText(translate(locale, footer.instagramLabel))}
              >
                <svg className="h-4 w-4" aria-hidden {...iconProps}>
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17" cy="7" r="1" />
                </svg>
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
                <svg className="h-4 w-4" aria-hidden {...iconProps}>
                  <path d="M15 3h-2.4c-2.5 0-4.1 1.6-4.1 4.1V9H6v3h2.5v8H12v-8h2.8l.7-3H12V7.6c0-1 .5-1.6 1.5-1.6H15V3z" />
                </svg>
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
                <svg className="h-4 w-4" aria-hidden {...iconProps}>
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M7 10v7" />
                  <circle cx="7" cy="7" r="1" />
                  <path d="M11 10v7" />
                  <path d="M11 13.5c0-2 3-2.5 3-0.5V17" />
                </svg>
              </a>
            ) : null}
          </div>
          <Link
            href="/admin/login"
            className="text-xs font-semibold text-foreground/50 transition hover:text-foreground/80"
          >
            {translate(locale, footer.adminLabel)}
          </Link>
        </div>
      </div>
    </footer>
  );
}
