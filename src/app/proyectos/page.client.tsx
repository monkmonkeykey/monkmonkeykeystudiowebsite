"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Project, ProjectCategory } from "@/domain/projects";
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
      <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {translate(locale, PAGE_TITLE)}
          </h1>
          <p className="text-base text-foreground/70 sm:text-lg">
            {translate(locale, PAGE_COPY)}
          </p>
        </div>
        <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
          <Image
            src="/images/projects-visual.svg"
            alt={
              locale === "es"
                ? "Ilustración abstracta de tableros de proyecto"
                : "Abstract illustration of project boards"
            }
            fill
            sizes="(min-width: 1024px) 384px, 100vw"
            className="object-cover"
          />
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
                ? "border-foreground/20 bg-foreground/10 text-foreground"
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
                  ? "border-foreground/20 bg-foreground/10 text-foreground"
                  : "border-foreground/10 text-foreground/60 hover:border-foreground/20 hover:text-foreground"
              }`}
            >
              {translate(locale, categoryLabels[category])}
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
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-background shadow-sm transition hover:-translate-y-1 hover:border-foreground/20"
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
                    <span className="inline-flex items-center rounded-full border border-foreground/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-foreground/50">
                      {project.year}
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
                        className="rounded-full border border-foreground/10 px-3 py-1"
                      >
                        {translate(locale, categoryLabels[category])}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between text-sm font-semibold text-foreground/70">
                    <span>{translate(locale, CARD_CTA)}</span>
                    <span aria-hidden className="transition group-hover:translate-x-1">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
