"use client";

import Image from "next/image";
import type { LocalizedValue, Project, ProjectCategory } from "@/domain/projects";
import { formatProjectTimeline, translateCategoryLabel } from "@/domain/projects";
import { translate, type Locale, type LocaleText } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";
import { useState } from "react";

const YEAR_LABEL = {
  es: "Año",
  en: "Year",
} as const;

const LOCATION_LABEL = {
  es: "Lugar",
  en: "Location",
} as const;

const GALLERY_TITLE = {
  es: "Galería",
  en: "Gallery",
} as const;

const VIDEO_TITLE = {
  es: "Video",
  en: "Video",
} as const;

const VIDEO_LINK_PREFIX = {
  es: "Ver en",
  en: "Watch on",
} as const;

const ENTITIES_TITLE = {
  es: "Cliente",
  en: "Client",
} as const;

const ENTITY_WEBSITE = {
  es: "Visitar sitio",
  en: "Visit site",
} as const;

const hasLocaleContent = (value: LocaleText | undefined): boolean => {
  if (!value) {
    return false;
  }

  return value.es.trim().length > 0 || value.en.trim().length > 0;
};

const translateLocalizedValue = (locale: Locale, value: LocalizedValue): string =>
  typeof value === "string" ? value : value[locale];

type ProjectDetailProps = {
  project: Project;
  categoryLabels: Record<ProjectCategory, LocaleText>;
};

export function ProjectDetail({ project, categoryLabels }: ProjectDetailProps) {
  const { locale } = useLocale();
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);

  const detailItems = [
    { label: YEAR_LABEL, value: formatProjectTimeline(project) },
    { label: LOCATION_LABEL, value: project.location },
    ...project.meta,
  ];

  const closeLightbox = () => setActiveImageIndex(null);
  const goTo = (direction: -1 | 1) => {
    setActiveImageIndex((current) => {
      if (current === null) return 0;
      const next = current + direction;
      if (next < 0) return project.gallery.length - 1;
      if (next >= project.gallery.length) return 0;
      return next;
    });
  };

  return (
    <article className="space-y-16">
      <div className="border-y border-line">
        <div className="grid gap-10 py-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:py-10">
          <div className="space-y-10">
            <div className="relative overflow-hidden border border-line bg-surface">
              <div className="relative aspect-[16/9] w-full">
                <Image
                  src={project.cover.src}
                  alt={translate(locale, project.cover.alt)}
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              {hasLocaleContent(project.cover.footnote) && (
                <p className="border-t border-line bg-background/90 px-4 py-2 text-xs text-muted backdrop-blur">
                  {translate(locale, project.cover.footnote!)}
                </p>
              )}
            </div>

            <div className="space-y-5 border-t border-line pt-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <h1 className="studio-display max-w-3xl text-[clamp(3.2rem,7vw,7.2rem)] leading-[0.9] tracking-[-0.05em]">
                  {translate(locale, project.name)}
                </h1>
                <span className="text-xs text-muted">
                  {formatProjectTimeline(project)}
                </span>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
                {translate(locale, project.subtitle)}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.categories.map((category) => (
                  <span
                    key={`${project.slug}-${category}`}
                  className="border-b border-line pb-1 text-xs text-muted"
                  >
                    {translateCategoryLabel(locale, category, categoryLabels)}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-6 border-t border-line pt-6 text-sm leading-relaxed text-foreground/75 sm:text-base">
              {project.description.map((paragraph, index) => (
                <p key={`${project.slug}-paragraph-${index}`} className="max-w-3xl">
                  {translate(locale, paragraph)}
                </p>
              ))}
            </div>

            {project.video && (
              <div className="space-y-4 border-t border-line pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xs text-muted">
                    {translate(locale, VIDEO_TITLE)}
                  </h2>
                  <a
                    href={project.video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 border-b border-line pb-1 text-xs text-muted transition hover:border-foreground hover:text-foreground"
                  >
                    <span>
                      {`${translate(locale, VIDEO_LINK_PREFIX)} ${
                        project.video.provider === "youtube" ? "YouTube" : "Vimeo"
                      }`}
                    </span>
                  </a>
                </div>
                <div className="relative aspect-video overflow-hidden border border-line bg-surface">
                  <iframe
                    src={project.video.embedUrl}
                    title={translate(locale, project.video.title)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            )}

            <div className="space-y-5 border-t border-line pt-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xs text-muted">
                  {translate(locale, GALLERY_TITLE)}
                </h2>
                <div className="h-px flex-1 bg-foreground/10" />
              </div>
              <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [column-fill:_balance]">
                {project.gallery.map((image, index) => (
                  <button
                    key={`${project.slug}-gallery-${index}`}
                    type="button"
                    onClick={() => setActiveImageIndex(index)}
                    className="group relative mb-4 block w-full overflow-hidden border border-line bg-surface text-left transition hover:border-foreground"
                    style={{ breakInside: "avoid" }}
                    aria-label={`${translate(locale, image.alt)} (abrir en galería)`}
                  >
                    <div className="relative w-full overflow-hidden">
                      <Image
                        src={image.src}
                        alt={translate(locale, image.alt)}
                        width={1200}
                        height={800}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/65 via-background/5 to-transparent opacity-0 transition duration-300 group-hover:opacity-100" />
                      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-3 text-xs text-background opacity-0 transition duration-300 group-hover:opacity-100">
                        <p className="line-clamp-2 font-semibold drop-shadow">{translate(locale, image.alt)}</p>
                        <span className="inline-flex items-center gap-1 bg-foreground px-3 py-1 text-xs text-background">
                          {locale === "es" ? "Ver" : "View"}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            </div>

            <aside className="space-y-8 border border-line bg-surface p-5 lg:sticky lg:top-24 lg:self-start lg:p-6">
              <dl className="space-y-4 text-sm text-foreground/80">
                {detailItems.map((detail) => (
                  <div
                    key={`${project.slug}-${detail.label.es}`}
                    className="grid grid-cols-[0.8fr_1.2fr] gap-4 border-t border-line py-3"
                  >
                    <dt className="text-xs text-muted">
                      {translate(locale, detail.label)}
                    </dt>
                    <dd className="text-sm text-foreground/80">
                      {translateLocalizedValue(locale, detail.value)}
                    </dd>
                  </div>
                ))}
              </dl>

              {project.entities.length > 0 && (
                <div className="space-y-4 border-t border-line pt-5">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs text-muted">
                      {translate(locale, ENTITIES_TITLE)}
                    </h2>
                    <div className="h-px flex-1 bg-foreground/10" />
                  </div>
                  <div className="grid gap-3">
                    {project.entities.map((entity) => (
                      <div
                        key={`${project.slug}-${entity.slug}`}
                        className="flex gap-3 border-t border-line py-3"
                      >
                        {entity.image && (
                          <div className="relative h-14 w-14 overflow-hidden border border-line bg-background">
                            <Image
                              src={entity.image.src}
                              alt={translate(locale, entity.image.alt)}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex flex-1 flex-col gap-1">
                          <p className="text-sm font-semibold text-foreground/80">{entity.name}</p>
                          <p className="text-xs text-muted">
                            {translate(locale, entity.sector)}
                          </p>
                          <p className="text-sm text-foreground/70">{translate(locale, entity.summary)}</p>
                          {entity.website && (
                            <a
                              href={entity.website}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex w-fit items-center gap-2 border-b border-line pb-1 text-xs text-muted transition hover:border-foreground hover:text-foreground"
                            >
                              <span>{translate(locale, ENTITY_WEBSITE)}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>

      {activeImageIndex !== null && project.gallery[activeImageIndex] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-5xl space-y-4 border border-line bg-background/95 p-4 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col text-sm text-foreground/70">
                <span className="text-xs text-muted">
                  {translate(locale, GALLERY_TITLE)}
                </span>
                <span className="font-semibold text-foreground">
                  {translate(locale, project.gallery[activeImageIndex].alt)}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => goTo(-1)}
                  className="studio-action studio-action--secondary studio-action--small"
                >
                  <span>{locale === "es" ? "Anterior" : "Previous"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => goTo(1)}
                  className="studio-action studio-action--secondary studio-action--small"
                >
                  <span>{locale === "es" ? "Siguiente" : "Next"}</span>
                </button>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="studio-action studio-action--primary studio-action--small"
                >
                  <span>{locale === "es" ? "Cerrar" : "Close"}</span>
                  <span aria-hidden>✕</span>
                </button>
              </div>
            </div>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5">
              <Image
                src={project.gallery[activeImageIndex].src}
                alt={translate(locale, project.gallery[activeImageIndex].alt)}
                fill
                sizes="(min-width: 1280px) 70vw, 100vw"
                className="object-contain"
                priority
              />
            </div>

            {hasLocaleContent(project.gallery[activeImageIndex].footnote) && (
              <p className="text-sm text-foreground/70">
                {translate(locale, project.gallery[activeImageIndex].footnote!)}
              </p>
            )}
          </div>
        </div>
      )}
    </article>
  );
}
