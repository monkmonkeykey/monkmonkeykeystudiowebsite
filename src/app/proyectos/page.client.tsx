"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Project, ProjectCategory } from "@/domain/projects";
import { formatProjectTimeline, translateCategoryLabel } from "@/domain/projects";
import { translate, type LocaleText } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";

type ProjectsPageClientProps = {
  projects: Project[];
  categoryLabels: Record<ProjectCategory, LocaleText>;
};

const PAGE_TITLE = {
  es: "Algunos proyectos",
  en: "Featured work",
} as const;

const PAGE_COPY = {
  es: "Casos en los que acompañamos a equipos de producto, museografía y marcas para desplegar experiencias memorables.",
  en: "Projects where we partner with product, museography, and brand teams to deploy memorable experiences.",
} as const;

const FILTER_LABEL = {
  es: "Filtrar por",
  en: "Filter by",
} as const;

const FILTER_ALL = {
  es: "Todos",
  en: "All",
} as const;

const DETAILS_TITLE = {
  es: "Ficha del proyecto",
  en: "Project details",
} as const;

const EMPTY_STATE = {
  es: "No hay proyectos para esta categoría todavía.",
  en: "There are no projects for this category yet.",
} as const;

const CARD_CTA = {
  es: "Ver caso completo",
  en: "Read full case",
} as const;

const CTA_TITLE = {
  es: "¿Listo para crear algo memorable?",
  en: "Ready to create something memorable?",
} as const;

const CTA_DESCRIPTION = {
  es: "Agendemos una llamada para entender tus objetivos y armar un plan a medida.",
  en: "Let’s schedule a call to learn about your goals and craft a tailored plan together.",
} as const;

const CTA_ACTION = {
  es: "Agenda una llamada",
  en: "Book a call",
} as const;

export default function ProjectsPageClient({
  projects,
  categoryLabels,
}: ProjectsPageClientProps) {
  const { locale } = useLocale();
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "all">("all");

  const categories = useMemo(() => {
    const unique = new Set<ProjectCategory>();

    projects.forEach((project) => {
      project.categories.forEach((category) => unique.add(category));
    });

    return Array.from(unique);
  }, [projects]);

  const filteredProjects =
    activeCategory === "all"
      ? projects
      : projects.filter((project) => project.categories.includes(activeCategory));

  return (
    <div className="space-y-12">
      <header className="overflow-hidden rounded-4xl border border-foreground/10 bg-gradient-to-br from-primary/5 via-background to-accent/5 p-6 shadow-sm sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-center">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70 ring-1 ring-foreground/10">
              <span className="size-2 rounded-full bg-primary" />
              {translate(locale, FILTER_LABEL)}
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                {translate(locale, PAGE_TITLE)}
              </h1>
              <p className="text-base text-foreground/70 sm:text-lg">
                {translate(locale, PAGE_COPY)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs text-foreground/60">
              <span className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1.5 ring-1 ring-foreground/10">
                <span className="size-2 rounded-full bg-emerald-400" />
                {locale === "es" ? "Experiencias inmersivas" : "Immersive experiences"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1.5 ring-1 ring-foreground/10">
                <span className="size-2 rounded-full bg-sky-400" />
                {locale === "es" ? "Producción técnica" : "Technical production"}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full bg-background/70 px-3 py-1.5 ring-1 ring-foreground/10">
                <span className="size-2 rounded-full bg-fuchsia-400" />
                {locale === "es" ? "Arte + nuevos medios" : "Art + new media"}
              </span>
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
            <Image
              src="/images/projects-visual.svg"
              alt={
                locale === "es"
                  ? "Ilustración abstracta de tableros de proyecto"
                  : "Abstract illustration of project boards"
              }
              fill
              sizes="(min-width: 1024px) 420px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-4">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
          {translate(locale, FILTER_LABEL)}
        </span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              activeCategory === "all"
                ? "border-primary/30 bg-primary/10 text-primary"
                : "border-foreground/10 text-foreground/60 hover:border-foreground/20 hover:text-foreground"
            }`}
          >
            {translate(locale, FILTER_ALL)}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-1.5 text-sm transition ${
                activeCategory === category
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-foreground/10 text-foreground/60 hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              {translateCategoryLabel(locale, category, categoryLabels)}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {filteredProjects.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-foreground/10 bg-foreground/5 p-6 text-sm text-foreground/60">
            {translate(locale, EMPTY_STATE)}
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {filteredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/proyectos/${project.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-background/80 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-foreground/10 bg-foreground/5">
                  <Image
                    src={project.cover.src}
                    alt={translate(locale, project.cover.alt)}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                      {translate(locale, DETAILS_TITLE)}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-foreground/50">
                      {formatProjectTimeline(project)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold text-foreground">
                      {translate(locale, project.name)}
                    </h2>
                    <p className="text-sm text-foreground/70">
                      {translate(locale, project.subtitle)}
                    </p>
                  </div>
                  <p className="text-sm text-foreground/70 line-clamp-3">
                    {translate(locale, project.description[0])}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-foreground/60">
                    {project.categories.map((category) => (
                      <span
                        key={`${project.slug}-cat-${category}`}
                        className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1"
                      >
                        {translateCategoryLabel(locale, category, categoryLabels)}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm font-semibold text-foreground/70">
                    <span>{translate(locale, CARD_CTA)}</span>
                    <span aria-hidden className="transition group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <section className="overflow-hidden rounded-3xl border border-foreground/10 bg-gradient-to-r from-primary/10 via-background to-accent/10 p-6 shadow-sm sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/60">
              {translate(locale, CTA_TITLE)}
            </p>
            <p className="max-w-2xl text-base text-foreground/80 sm:text-lg">
              {translate(locale, CTA_DESCRIPTION)}
            </p>
          </div>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background shadow transition hover:-translate-y-0.5 hover:bg-foreground/90"
          >
            <span>{translate(locale, CTA_ACTION)}</span>
            <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
