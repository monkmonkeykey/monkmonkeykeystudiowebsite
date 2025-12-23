"use client";

import Image from "next/image";

import type {
  LocalizedValue,
  Project,
  ProjectCategory,
} from "@/domain/projects";
import { translate, type Locale, type LocaleText } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";

const DETAILS_TITLE = {
  es: "Ficha del proyecto",
  en: "Project details",
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

  const detailItems = [
    { label: YEAR_LABEL, value: project.year },
    { label: CLIENT_LABEL, value: project.client },
    { label: LOCATION_LABEL, value: project.location },
    ...project.meta,
  ];

  return (
    <article className="space-y-8 rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm lg:p-10">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)] lg:items-start">
        <div className="space-y-6">
          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
            <Image
              src={project.cover.src}
              alt={translate(locale, project.cover.alt)}
              fill
              sizes="(min-width: 1024px) 60vw, 100vw"
              className="object-cover"
            />
          </div>

          {hasLocaleContent(project.cover.footnote) && (
            <p className="text-xs text-foreground/50">
              {translate(locale, project.cover.footnote!)}
            </p>
          )}

          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-semibold tracking-tight">
                  {translate(locale, project.name)}
                </h1>
                <span className="inline-flex items-center rounded-full border border-foreground/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {project.year}
                </span>
              </div>
              <p className="text-lg text-foreground/70">
                {translate(locale, project.subtitle)}
              </p>
              <div className="flex flex-wrap gap-2">
                {project.categories.map((category) => (
                  <span
                    key={`${project.slug}-${category}`}
                    className="rounded-full border border-foreground/10 px-3 py-1 text-xs font-medium text-foreground/70"
                  >
                    {translate(locale, categoryLabels[category])}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4 text-sm leading-relaxed text-foreground/80 sm:text-base">
              {project.description.map((paragraph, index) => (
                <p key={`${project.slug}-paragraph-${index}`}>
                  {translate(locale, paragraph)}
                </p>
              ))}
            </div>

            {project.video && (
              <div className="space-y-3">
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

            {project.entities.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
                  {translate(locale, ENTITIES_TITLE)}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {project.entities.map((entity) => (
                    <div
                      key={`${project.slug}-${entity.slug}`}
                      className="flex flex-col gap-3 rounded-2xl border border-foreground/10 bg-foreground/5 p-4"
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
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-foreground/80">{entity.name}</p>
                        <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                          {translate(locale, entity.sector)}
                        </p>
                      </div>
                      <p className="text-sm text-foreground/70">
                        {translate(locale, entity.summary)}
                      </p>
                      {entity.website && (
                        <a
                          href={entity.website}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-auto inline-flex w-fit items-center gap-2 text-xs font-semibold text-foreground/70 transition hover:text-foreground"
                        >
                          <span>{translate(locale, ENTITY_WEBSITE)}</span>
                          <span aria-hidden>↗</span>
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
                {translate(locale, GALLERY_TITLE)}
              </h2>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {project.gallery.map((image, index) => (
                  <div
                    key={`${project.slug}-gallery-${index}`}
                    className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5"
                  >
                    <Image
                      src={image.src}
                      alt={translate(locale, image.alt)}
                      fill
                      sizes="(min-width: 1024px) 20vw, 100vw"
                      className="object-cover"
                    />
                    {hasLocaleContent(image.footnote) && (
                      <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/80 to-transparent px-3 py-2 text-xs text-foreground/70 backdrop-blur-sm">
                        {translate(locale, image.footnote!)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <aside className="space-y-6 rounded-3xl border border-foreground/10 bg-foreground/5 p-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
            {translate(locale, DETAILS_TITLE)}
          </h2>
          <dl className="space-y-4 text-sm text-foreground/80">
            {detailItems.map((detail) => (
              <div key={`${project.slug}-${detail.label.es}`} className="space-y-1">
                <dt className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {translate(locale, detail.label)}
                </dt>
                <dd className="text-base text-foreground/80">
                  {translateLocalizedValue(locale, detail.value)}
                </dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </article>
  );
}
