"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import type { SiteContent } from "@/domain/site";
import type { Locale } from "@/lib/i18n";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { LocaleProvider } from "./locale-context";

type SiteShellProps = {
  siteContent: SiteContent;
  children: React.ReactNode;
};

export function SiteShell({ children, siteContent }: SiteShellProps) {
  const [locale, setLocale] = useState<Locale>("es");
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");
  const isHomeRoute = pathname === "/";

  return (
    <LocaleProvider value={{ locale, setLocale }}>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        {isAdminRoute ? (
          <main className="flex-1">
            <div className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16">{children}</div>
          </main>
        ) : (
          <>
            <Header navigation={siteContent.navigation} />
            <main className="flex-1">
              <div className={`mx-auto w-full max-w-[1520px] px-4 sm:px-7 lg:px-12 ${isHomeRoute ? "" : "pb-12 sm:pb-16 lg:pb-24"}`}>
                {children}
              </div>
            </main>
            <Footer footer={siteContent.footer} contactEmail={siteContent.contact.email} />
          </>
        )}
      </div>
    </LocaleProvider>
  );
}
