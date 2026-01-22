"use client";

import Link from "next/link";

import type { SiteContent } from "@/domain/site";
import { translate } from "@/lib/i18n";
import { useLocale } from "./locale-context";

type FooterProps = {
  footer: SiteContent["footer"];
};

export function Footer({ footer }: FooterProps) {
  const { locale } = useLocale();

  return (
    <footer className="border-t border-foreground/10 bg-background/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-8 text-sm text-foreground/60 md:flex-row md:items-center md:justify-between">
        <p>&copy; {new Date().getFullYear()} MonkMonkeyKey</p>
        <div className="flex flex-col gap-2 text-sm md:items-end">
          <p>{translate(locale, footer.tagline)}</p>
          <a
            href="https://www.instagram.com/monkmokeykey_studio/"
            target="_blank"
            rel="noreferrer"
            className="text-xs font-semibold text-foreground/50 transition hover:text-foreground/80"
          >
            {translate(locale, footer.instagramLabel)}
          </a>
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
