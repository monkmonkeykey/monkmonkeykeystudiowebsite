"use client";

import Image from "next/image";
import type { LocalizedValue, Project, ProjectCategory } from "@/domain/projects";
import { formatProjectTimeline, translateCategoryLabel } from "@/domain/projects";
import { translate, type Locale, type LocaleText } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";
import { useState } from "react";

const DETAILS_TITLE = {
  es: "Datos clave",
  en: "Key facts",
} as const;

const YEAR_LABEL = {
  es: "Año",
  en: "Year",
} as const;

const CLIENT_LABEL = {
  es: "Cliente",
  en: "Client",
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
  es: "Organizaciones",
  en: "Organizations",
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

  const clientLabel =
    project.entities.length > 0
      ? project.entities.map((entity) => entity.name).join(", ")
      : translateLocalizedValue(locale, project.client);

  const detailItems = [
    { label: YEAR_LABEL, value: formatProjectTimeline(project) },
    { label: CLIENT_LABEL, value: clientLabel },
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
    <article className="space-y-8">
      <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-gradient-to-br from-primary/5 via-background to-accent/5 shadow-sm">
        <div className="grid gap-10 p-6 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:p-10">
          <div className="space-y-7">
            <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5 shadow-sm">
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
                <p className="border-t border-foreground/10 bg-background/80 px-4 py-2 text-xs text-foreground/60 backdrop-blur">
                  {translate(locale, project.cover.footnote!)}
                </p>
              )}
            </div>

            <div className="space-y-4 rounded-3xl bg-background/80 p-5 shadow-sm backdrop-blur">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {translate(locale, project.name)}
                </h1>
                <span className="inline-flex items-center rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-foreground/60">
                  {formatProjectTimeline(project)}
                </span>
              </div>
              <p className="text-lg text-foreground/70">
                {translate(locale, project.subtitle)}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.categories.map((category) => (
                  <span
                    key={`${project.slug}-${category}`}
                    className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs font-medium text-foreground/70"
                  >
                    {translateCategoryLabel(locale, category, categoryLabels)}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
              {project.description.map((paragraph, index) => (
                <p key={`${project.slug}-paragraph-${index}`} className="rounded-2xl bg-background/70 p-4 shadow-sm">
                  {translate(locale, paragraph)}
                </p>
              ))}
            </div>

            {project.video && (
              <div className="space-y-3 rounded-3xl bg-background/80 p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
                    {translate(locale, VIDEO_TITLE)}
                  </h2>
                  <a
                    href={project.video.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-foreground/70 transition hover:text-foreground"
                  >
                    <span>
                      {`${translate(locale, VIDEO_LINK_PREFIX)} ${
                        project.video.provider === "youtube" ? "YouTube" : "Vimeo"
                      }`}
                    </span>
                    <span aria-hidden>↗</span>
                  </a>
                </div>
                <div className="relative aspect-video overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5">
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

            <div className="space-y-3 rounded-3xl bg-background/80 p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
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
                    className="group relative mb-4 block w-full overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-primary/30"
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
                        <span className="inline-flex items-center gap-1 rounded-full bg-background/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground">
                          {locale === "es" ? "Ver" : "View"}
                          <span aria-hidden>↗</span>
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            </div>

            <aside className="space-y-6 rounded-3xl border border-foreground/10 bg-background/80 p-6 shadow-sm lg:sticky lg:top-6">
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
                  {translate(locale, DETAILS_TITLE)}
                </p>
              </div>
              <dl className="space-y-4 text-sm text-foreground/80">
                {detailItems.map((detail) => (
                  <div
                    key={`${project.slug}-${detail.label.es}`}
                    className="space-y-1 rounded-2xl border border-foreground/10 bg-foreground/5 px-4 py-3"
                  >
                    <dt className="text-[11px] uppercase tracking-[0.2em] text-foreground/50">
                      {translate(locale, detail.label)}
                    </dt>
                    <dd className="text-base text-foreground/80">
                      {translateLocalizedValue(locale, detail.value)}
                    </dd>
                  </div>
                ))}
              </dl>

              {project.entities.length > 0 && (
                <div className="space-y-4 rounded-2xl border border-foreground/10 bg-foreground/5 p-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
                      {translate(locale, ENTITIES_TITLE)}
                    </h2>
                    <div className="h-px flex-1 bg-foreground/10" />
                  </div>
                  <div className="grid gap-3">
                    {project.entities.map((entity) => (
                      <div
                        key={`${project.slug}-${entity.slug}`}
                        className="flex gap-3 rounded-2xl border border-foreground/10 bg-background/70 p-3"
                      >
                        {entity.image && (
                          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-foreground/10 bg-background">
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
                          <p className="text-[11px] uppercase tracking-[0.2em] text-foreground/50">
                            {translate(locale, entity.sector)}
                          </p>
                          <p className="text-sm text-foreground/70">{translate(locale, entity.summary)}</p>
                          {entity.website && (
                            <a
                              href={entity.website}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex w-fit items-center gap-2 text-xs font-semibold text-foreground/70 transition hover:text-foreground"
                            >
                              <span>{translate(locale, ENTITY_WEBSITE)}</span>
                              <span aria-hidden>↗</span>
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
          <div className="relative w-full max-w-5xl space-y-4 rounded-3xl border border-foreground/10 bg-background/95 p-4 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-col text-sm text-foreground/70">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/50">
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
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/5 px-3 py-1.5 text-xs font-semibold text-foreground/80 transition hover:border-foreground/30 hover:text-foreground"
                >
                  <span aria-hidden>←</span>
                  <span>{locale === "es" ? "Anterior" : "Previous"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => goTo(1)}
                  className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/5 px-3 py-1.5 text-xs font-semibold text-foreground/80 transition hover:border-foreground/30 hover:text-foreground"
                >
                  <span>{locale === "es" ? "Siguiente" : "Next"}</span>
                  <span aria-hidden>→</span>
                </button>
                <button
                  type="button"
                  onClick={closeLightbox}
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-3 py-1.5 text-xs font-semibold text-background transition hover:bg-foreground/90"
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
