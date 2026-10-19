"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteContent } from "@/domain/site";
import { AVAILABLE_LOCALES, translate } from "@/lib/i18n";
import { RichText } from "@/components/site/rich-text";
import { useLocale } from "./locale-context";

type HeaderProps = {
  navigation: SiteContent["navigation"];
};

export function Header({ navigation }: HeaderProps) {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleLabel = isMobileMenuOpen
    ? translate(locale, navigation.closeMenuLabel)
    : translate(locale, navigation.openMenuLabel);

  const navItems = [
    { href: "/", label: navigation.homeLabel },
    { href: "/servicios", label: navigation.servicesLabel },
    { href: "/clientes", label: navigation.clientsLabel },
    { href: "/proyectos", label: navigation.projectsLabel },
    { href: "/contacto", label: navigation.contactLabel },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background/92 backdrop-blur-md">
      <div className="mx-auto grid h-[76px] max-w-[1320px] grid-cols-[1fr_auto] items-center px-6 sm:px-12 lg:h-[92px] lg:grid-cols-[minmax(15rem,1fr)_auto_minmax(15rem,1fr)] lg:px-16">
        <Link href="/" className="group flex w-fit items-center gap-3" aria-label="monkmonkeykey.studio">
          <span className="flex flex-col leading-none">
            <RichText
              as="span"
              value={navigation.brand}
              className="text-[13px] font-semibold tracking-[-0.025em] text-foreground"
            />
          </span>
        </Link>

        <nav aria-label={locale === "es" ? "Navegación principal" : "Main navigation"} className="hidden h-full items-center gap-8 lg:flex">
          {navItems.map((item) => {
            const isActive =
              item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex h-full items-center text-xs tracking-[0.02em] transition-colors hover:text-signal ${
                  isActive ? "text-foreground" : "text-muted"
                }`}
              >
                {translate(locale, item.label)}
                {isActive ? (
                  <span className="absolute inset-x-0 bottom-0 h-px bg-signal" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center justify-end gap-3 font-mono text-[9px] uppercase tracking-[0.12em] lg:flex">
          {AVAILABLE_LOCALES.map((option) => {
            const isSelected = option.code === locale;

            return (
              <button
                key={option.code}
                type="button"
                onClick={() => setLocale(option.code)}
                className={`py-2 transition ${
                  isSelected
                    ? "text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center border border-line text-foreground transition hover:border-signal hover:text-signal lg:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-expanded={isMobileMenuOpen}
          aria-controls="mobile-navigation"
          aria-label={toggleLabel}
        >
          <span className="sr-only">{toggleLabel}</span>
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {isMobileMenuOpen ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M6 18L18 6" />
              </>
            ) : (
              <>
                <path d="M4 7h16" />
                <path d="M4 12h16" />
                <path d="M4 17h16" />
              </>
            )}
          </svg>
        </button>
      </div>

      {isMobileMenuOpen ? (
        <div
          id="mobile-navigation"
          className="border-t border-line bg-background px-5 pb-8 pt-5 sm:px-10 lg:hidden"
        >
          <nav aria-label={locale === "es" ? "Navegación principal" : "Main navigation"} className="flex flex-col text-sm">
            {navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`studio-display flex items-center justify-between border-b border-line py-4 text-2xl transition ${
                    isActive
                      ? "text-foreground"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {translate(locale, item.label)}
                </Link>
              );
            })}
          </nav>

          <div className="mt-6 flex items-center gap-5 text-xs">
            {AVAILABLE_LOCALES.map((option) => {
              const isSelected = option.code === locale;

              return (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => {
                    setLocale(option.code);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`min-h-11 min-w-11 py-2 transition ${
                    isSelected
                      ? "text-foreground"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </header>
  );
}
