"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Project, ProjectCategory } from "@/domain/projects";
import { formatProjectTimeline, translateCategoryLabel } from "@/domain/projects";
import { translate, type LocaleText } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";
import type { SiteContent } from "@/domain/site";
import { RichText } from "@/components/site/rich-text";

type ProjectsPageClientProps = {
  projects: Project[];
  categoryLabels: Record<ProjectCategory, LocaleText>;
  copy: SiteContent["projectsPage"];
};
export default function ProjectsPageClient({
  projects,
  categoryLabels,
  copy,
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
    <div className="space-y-16 sm:space-y-24">
      <header className="grid gap-8 border-t border-line pt-5 lg:grid-cols-12">
        <div className="lg:col-span-10">
        <RichText
          as="h1"
          value={copy.title}
          className="studio-display text-[clamp(3.2rem,7vw,7.2rem)] leading-[0.9] tracking-[-0.05em]"
        />
        <RichText
          value={copy.copy}
          className="mt-8 max-w-2xl text-base leading-relaxed text-muted sm:text-lg"
        />
        </div>
      </header>

      <div className="flex flex-wrap gap-2 border-y border-line py-4 text-xs">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`studio-filter ${
            activeCategory === "all"
              ? "studio-filter--active"
              : "studio-filter--idle"
          }`}
        >
          {translate(locale, copy.filterAllLabel)}
        </button>
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`studio-filter ${
              activeCategory === category
                ? "studio-filter--active"
                : "studio-filter--idle"
            }`}
          >
            {translateCategoryLabel(locale, category, categoryLabels)}
          </button>
        ))}
      </div>

      <div>
        {filteredProjects.length === 0 ? (
          <p className="border border-dashed border-line bg-surface p-6 text-sm text-muted">
            {translate(locale, copy.emptyState)}
          </p>
        ) : (
          <div className="grid gap-x-6 gap-y-16 lg:grid-cols-2 lg:gap-y-24">
            {filteredProjects.map((project, index) => (
              <Link
                key={project.slug}
                href={`/proyectos/${project.slug}`}
                className={`group flex h-full flex-col ${index % 2 === 1 ? "lg:mt-24" : ""}`}
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface">
                  <Image
                    src={project.cover.src}
                    alt={translate(locale, project.cover.alt)}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover grayscale-[0.2] transition duration-700 group-hover:scale-[1.025] group-hover:grayscale-0"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-4 border-t border-line pt-4">
                  <span className="text-xs text-muted">
                    {formatProjectTimeline(project)}
                  </span>
                  <div className="space-y-2">
                    <h2 className="studio-display text-3xl tracking-[-0.035em] text-foreground transition-opacity group-hover:text-signal sm:text-4xl">
                      {translate(locale, project.name)}
                    </h2>
                    <p className="text-sm text-muted">
                      {translate(locale, project.subtitle)}
                    </p>
                  </div>
                  <p className="max-w-xl text-sm leading-relaxed text-foreground/65 line-clamp-3">
                    {translate(locale, project.description[0])}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
                    {project.categories.map((category) => (
                      <span
                        key={`${project.slug}-cat-${category}`}
                        className="border-b border-line pb-1"
                      >
                        {translateCategoryLabel(locale, category, categoryLabels)}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-xs text-muted">
                    <RichText as="span" value={copy.cardCta} /> <span aria-hidden>↗</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <section className="overflow-hidden border-y border-line bg-surface p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <p className="studio-kicker">
              <RichText as="span" value={copy.ctaTitle} />
            </p>
            <RichText
              value={copy.ctaDescription}
              className="max-w-2xl text-lg leading-relaxed text-foreground/75"
            />
          </div>
          <Link
            href="/contacto"
            className="studio-action studio-action--primary"
          >
            <RichText as="span" value={copy.ctaAction} />
            <span aria-hidden>↗</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
