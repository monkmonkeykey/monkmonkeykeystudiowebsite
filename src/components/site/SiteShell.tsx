"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { Locale } from "@/lib/i18n";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { LocaleProvider } from "./locale-context";

type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  const [locale, setLocale] = useState<Locale>("es");
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  return (
    <LocaleProvider value={{ locale, setLocale }}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        {isAdminRoute ? (
          <main className="flex-1">
            <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">{children}</div>
          </main>
        ) : (
          <>
            <Header />
            <main className="flex-1">
              <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">{children}</div>
            </main>
            <Footer />
          </>
        )}
      </div>
    </LocaleProvider>
  );
}
