"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SiteContent } from "@/domain/site";
import { AVAILABLE_LOCALES, translate } from "@/lib/i18n";
import { Wordmark } from "@/components/site/Wordmark";
import { useLocale } from "./locale-context";

type HeaderProps = {
  navigation: SiteContent["navigation"];
};

export function Header({ navigation }: HeaderProps) {
  const pathname = usePathname();
  const { locale, setLocale } = useLocale();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const wasMobileMenuOpen = useRef(false);

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

  useEffect(() => {
    if (!isMobileMenuOpen) {
      if (wasMobileMenuOpen.current) {
        menuButtonRef.current?.focus();
      }
      wasMobileMenuOpen.current = false;
      return;
    }

    wasMobileMenuOpen.current = true;
    const menu = mobileMenuRef.current;
    const focusableElements = menu?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    const firstFocusableElement = focusableElements?.[0];
    const lastFocusableElement = focusableElements?.[focusableElements.length - 1];
    const previousBodyOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";
    firstFocusableElement?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !focusableElements?.length) {
        return;
      }

      if (event.shiftKey && document.activeElement === firstFocusableElement) {
        event.preventDefault();
        lastFocusableElement?.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusableElement) {
        event.preventDefault();
        firstFocusableElement?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [isMobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-background">
      <div className="mx-auto flex h-[72px] max-w-[1320px] items-center justify-between px-6 sm:px-12 lg:h-[80px] lg:px-16">
        <Link href="/" className="group flex w-fit items-center gap-3" aria-label="monkmonkeykey">
          <Wordmark className="text-[13px] sm:text-sm" />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <nav aria-label={locale === "es" ? "Navegación principal" : "Main navigation"} className="flex h-full items-center gap-7">
            {navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative py-2 text-sm transition-colors hover:text-signal ${
                    isActive ? "text-foreground" : "text-muted"
                  }`}
                >
                  {translate(locale, item.label)}
                  {isActive ? (
                    <span className="absolute inset-x-0 -bottom-1 h-px bg-signal" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 text-xs">
            {AVAILABLE_LOCALES.map((option) => {
              const isSelected = option.code === locale;

              return (
                <button
                  key={option.code}
                  type="button"
                  onClick={() => setLocale(option.code)}
                  className={`min-h-11 min-w-8 py-2 transition ${
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

        <button
          ref={menuButtonRef}
          type="button"
          className="inline-flex size-10 items-center justify-center border border-line text-foreground transition-colors hover:border-signal hover:text-signal lg:hidden"
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
          ref={mobileMenuRef}
          id="mobile-navigation"
          className="flex min-h-[calc(100svh-73px)] flex-col border-t border-line bg-background px-6 pb-10 pt-5 sm:px-12 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label={toggleLabel}
        >
          <nav aria-label={locale === "es" ? "Navegación principal" : "Main navigation"} className="flex flex-1 flex-col text-sm">
            {navItems.map((item) => {
              const isActive =
                item.href === "/" ? pathname === "/" : pathname?.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`studio-display flex items-center justify-between border-b border-line py-5 text-[clamp(2rem,8vw,3rem)] transition-colors ${
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

          <div className="mt-auto flex items-center gap-5 pt-10 text-xs">
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
