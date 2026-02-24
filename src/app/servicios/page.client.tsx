"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { Service } from "@/content/services";
import type { SiteContent } from "@/domain/site";
import { translate } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";
import { getPlainText, RichText } from "@/components/site/rich-text";

type ServicesPageClientProps = {
  services: Service[];
  siteContent: SiteContent;
};

export default function ServicesPageClient({ services, siteContent }: ServicesPageClientProps) {
  const { locale } = useLocale();
  const chips = (siteContent.servicesPage.chips || []).filter(
    (chip) => getPlainText(translate(locale, chip)).length > 0,
  );
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);
  const [previousGalleryImage, setPreviousGalleryImage] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const activeService = services[activeServiceIndex] ?? services[0];
  const galleryImages = useMemo(() => {
    const fromService = (activeService?.gallery ?? []).filter((image) => image.src.trim().length > 0);

    if (fromService.length > 0) {
      return fromService;
    }

    return [
      {
        src: siteContent.servicesPage.imageSrc || "/images/services-visual.svg",
        alt: siteContent.servicesPage.imageAlt,
      },
    ];
  }, [activeService?.gallery, siteContent.servicesPage.imageAlt, siteContent.servicesPage.imageSrc]);

  useEffect(() => {
    if (galleryImages.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveGalleryIndex((previousIndex) => {
        const nextIndex = (previousIndex + 1) % galleryImages.length;
        setPreviousGalleryImage(galleryImages[previousIndex]?.src ?? null);
        setIsTransitioning(true);
        return nextIndex;
      });
    }, 3000);

    return () => window.clearInterval(timer);
  }, [galleryImages]);

  const activeGalleryImage = galleryImages[activeGalleryIndex % galleryImages.length] ?? galleryImages[0];

  return (
    <div className="space-y-12" id="top">
      <header className="relative overflow-hidden rounded-4xl border border-foreground/10 bg-gradient-to-br from-primary/10 via-background to-accent/10 p-8 shadow-sm sm:p-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.06),transparent_35%)]" aria-hidden />
        <div className="relative z-10">
          <div className="max-w-3xl space-y-4">
            <h1 className="text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
              <RichText as="span" value={siteContent.servicesPage.title} />
            </h1>
            <RichText
              value={siteContent.servicesPage.copy}
              className="prose prose-sm max-w-none text-foreground/70 sm:prose-base"
            />
            <div className="flex flex-wrap gap-3 pt-2 text-sm text-foreground/70">
              {chips.map((chip, index) => (
                <div
                  key={`${chip.es}-${index}`}
                  className="inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-2 ring-1 ring-foreground/10"
                >
                  <span className="size-2 rounded-full" />
                  <RichText as="span" value={chip} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-foreground/50">
                <RichText as="span" value={siteContent.servicesPage.outcomesLabel} />
              </p>
              <a
                href="#top"
                className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60 transition hover:text-foreground"
              >
                <RichText as="span" value={siteContent.servicesPage.backToTopLabel} />
              </a>
            </div>

            <div className="space-y-3">
              {services.map((service, index) => (
                <button
                  key={service.slug}
                  type="button"
                  onClick={() => { setActiveServiceIndex(index); setActiveGalleryIndex(0); setPreviousGalleryImage(null); setIsTransitioning(false); }}
                  className={`w-full rounded-2xl border px-4 py-4 text-left transition ${
                    index === activeServiceIndex
                      ? "border-primary/50 bg-primary/10"
                      : "border-foreground/10 bg-foreground/5 hover:border-foreground/25"
                  }`}
                >
                  <p className="text-lg font-semibold tracking-tight text-foreground/90">
                    <RichText as="span" value={service.title} />
                  </p>
                  <p className="mt-2 text-sm text-foreground/70">
                    <RichText as="span" value={service.summary} />
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
              {previousGalleryImage && isTransitioning && previousGalleryImage !== activeGalleryImage.src && (
                <Image src={previousGalleryImage} alt="" fill className="object-cover" />
              )}
              <Image
                src={activeGalleryImage.src}
                alt={getPlainText(translate(locale, activeGalleryImage.alt))}
                fill
                className={`object-cover transition-opacity duration-700 ${isTransitioning ? "opacity-0" : "opacity-100"}`}
                onLoad={() => {
                  if (isTransitioning) {
                    setIsTransitioning(false);
                    setPreviousGalleryImage(null);
                  }
                }}
              />
            </div>

            {activeService && (
              <div className="space-y-4 rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-4">
                <div className="flex flex-wrap gap-3 text-sm text-foreground/70">
                  <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-primary ring-1 ring-primary/20">
                    <RichText as="span" value={siteContent.servicesPage.highlightPrimaryLabel} />
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1.5 ring-1 ring-foreground/10">
                    <RichText as="span" value={siteContent.servicesPage.highlightSecondaryLabel} />
                  </div>
                </div>

                <div className="space-y-2 text-sm text-foreground/70">
                  <RichText
                    as="p"
                    value={siteContent.servicesPage.sessionTitle}
                    className="font-semibold text-foreground"
                  />
                  <RichText as="p" value={siteContent.servicesPage.sessionCopy} />
                  <Link href="/contacto" className="inline-flex items-center gap-2 text-primary hover:text-primary/80">
                    <RichText as="span" value={siteContent.servicesPage.talkCtaLabel} />
                  </Link>
                </div>

                <div className="space-y-2">
                  {(activeService.outcomes || []).map((outcome, outcomeIndex) => (
                    <div
                      key={`${activeService.slug}-outcome-${outcomeIndex}`}
                      className="rounded-xl bg-background px-3 py-2 text-sm text-foreground/70 ring-1 ring-foreground/10"
                    >
                      {translate(locale, outcome)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
