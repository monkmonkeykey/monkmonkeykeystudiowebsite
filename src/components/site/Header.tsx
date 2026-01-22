"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteContent } from "@/domain/site";
import { AVAILABLE_LOCALES, translate } from "@/lib/i18n";
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
    <header className="border-b border-foreground/10 bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 lg:px-6 lg:py-4">
        <Link href="/" className="font-semibold tracking-tight">
          {translate(locale, navigation.brand)}
        </Link>

        <nav className="hidden items-center gap-6 text-sm lg:flex">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`transition hover:text-foreground/80 ${
                  isActive ? "font-semibold text-foreground" : "text-foreground/60"
                }`}
              >
                {translate(locale, item.label)}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 text-xs lg:flex">
          {AVAILABLE_LOCALES.map((option) => {
            const isSelected = option.code === locale;

            return (
              <button
                key={option.code}
                type="button"
                onClick={() => setLocale(option.code)}
                className={`rounded-full px-3 py-1 font-semibold transition ${
                  isSelected
                    ? "bg-foreground text-background"
                    : "text-foreground/60 hover:text-foreground"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full border border-foreground/20 p-2 text-foreground transition hover:bg-foreground/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/40 lg:hidden"
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
          className="border-t border-foreground/10 bg-background/95 px-4 pb-4 pt-2 backdrop-blur lg:hidden"
        >
          <nav className="flex flex-col gap-3 text-sm">
            {navItems.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`rounded-full px-4 py-2 transition hover:bg-foreground/5 ${
                    isActive
                      ? "font-semibold text-foreground"
                      : "text-foreground/70"
                  }`}
                >
                  {translate(locale, item.label)}
                </Link>
              );
            })}
          </nav>

          <div className="mt-4 flex items-center gap-2 text-xs">
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
                  className={`flex-1 rounded-full px-3 py-2 font-semibold transition ${
                    isSelected
                      ? "bg-foreground text-background"
                      : "border border-foreground/20 text-foreground/70 hover:text-foreground"
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
