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

  const activeService = services[activeServiceIndex] ?? services[0];
  const deliverablesLabel = locale === "es" ? "Nuestros servicios" : "Deliverables";
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
      setActiveGalleryIndex((previousIndex) => (previousIndex + 1) % galleryImages.length);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [galleryImages.length]);

  const normalizedGalleryIndex = galleryImages.length > 0 ? activeGalleryIndex % galleryImages.length : 0;

  return (
    <div className="space-y-16 sm:space-y-24" id="top">
      <header className="grid gap-8 border-t border-line pt-5 lg:grid-cols-12">
        <div className="lg:col-span-10">
        <h1 className="studio-display max-w-5xl text-[clamp(3.2rem,7vw,7.2rem)] leading-[0.9] tracking-[-0.05em]">
          <RichText as="span" value={siteContent.servicesPage.title} />
        </h1>
        <RichText
          value={siteContent.servicesPage.copy}
          className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        />
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted">
          {chips.map((chip, index) => (
            <div
              key={`${chip.es}-${index}`}
              className="inline-flex items-center border-b border-line pb-1"
            >
              <RichText as="span" value={chip} />
            </div>
          ))}
        </div>
        </div>
      </header>

      <section className="border-t border-line pt-5">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div className="order-1 space-y-4">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs text-muted">
                <RichText as="span" value={siteContent.servicesPage.outcomesLabel} />
              </p>
              <a
                href="#top"
                className="hidden text-xs text-muted transition hover:text-foreground sm:inline-flex sm:items-center sm:gap-2"
              >
                <RichText as="span" value={siteContent.servicesPage.backToTopLabel} />
              </a>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {services.map((service, index) => (
                <button
                  key={service.slug}
                  type="button"
                  onClick={() => {
                    setActiveServiceIndex(index);
                    setActiveGalleryIndex(0);
                  }}
                    className={`group w-full border-l px-4 py-4 text-left transition sm:px-5 sm:py-5 ${
                    index === activeServiceIndex
                      ? "border-foreground bg-surface"
                      : "border-line hover:border-muted hover:bg-surface"
                  }`}
                >
                  <div>
                  <p className="studio-display text-2xl tracking-[-0.025em] text-foreground sm:text-3xl">
                    <RichText as="span" value={service.title} />
                  </p>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                    <RichText as="span" value={service.summary} />
                  </p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="order-2 space-y-4 lg:sticky lg:top-24 lg:self-start">
            {activeService && (
              <div className="space-y-6 border border-line bg-surface p-5 sm:p-6">
                <div className="space-y-2 text-sm text-foreground/70">
                  <div className="flex items-start justify-between gap-3">
                    <RichText
                      as="p"
                      value={siteContent.servicesPage.sessionTitle}
                      className="font-semibold text-foreground"
                    />
                    <Link
                      href="/contacto"
                    className="studio-action studio-action--primary studio-action--small shrink-0"
                  >
                    <RichText as="span" value={siteContent.servicesPage.talkCtaLabel} />
                    <span aria-hidden>↗</span>
                  </Link>
                  </div>
                  <RichText as="p" value={siteContent.servicesPage.sessionCopy} />
                  <a
                    href="#top"
                    className="inline-flex items-center gap-2 text-xs text-muted transition hover:text-foreground sm:hidden"
                  >
                    <RichText as="span" value={siteContent.servicesPage.backToTopLabel} />
                  </a>
                </div>

                <div className="space-y-2.5">
                  <p className="text-xs text-muted">
                    {deliverablesLabel}
                  </p>

                  {(activeService.outcomes || []).map((outcome, outcomeIndex) => (
                    <div
                      key={`${activeService.slug}-outcome-${outcomeIndex}`}
                      className="border-t border-line px-1 py-3 text-sm leading-relaxed text-foreground/75"
                    >
                      <span className="leading-relaxed">{translate(locale, outcome)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="relative aspect-[16/10] overflow-hidden border border-line bg-surface">
              {galleryImages.map((image, index) => (
                <Image
                  key={`${activeService?.slug ?? "service"}-${image.src}-${index}`}
                  src={image.src}
                  alt={getPlainText(translate(locale, image.alt))}
                  fill
                  className={`object-cover transition-opacity duration-700 ${
                    index === normalizedGalleryIndex ? "opacity-100" : "opacity-0"
                  }`}
                  priority={index === normalizedGalleryIndex}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
