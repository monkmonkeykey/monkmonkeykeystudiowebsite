"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

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
  const projectCovers = useMemo(
    () => projects.map((project) => ({ src: project.cover.src, alt: project.cover.alt })),
    [projects],
  );
  const seededCoverIndex = useMemo(() => {
    if (projectCovers.length === 0) return 0;

    const seedString = projects.map((project) => project.slug).join("|");
    let hash = 0;

    for (let i = 0; i < seedString.length; i += 1) {
      hash = (hash * 31 + seedString.charCodeAt(i)) >>> 0;
    }

    return hash % projectCovers.length;
  }, [projectCovers.length, projects]);
  const [activeCoverIndex, setActiveCoverIndex] = useState(() => seededCoverIndex);
  const [previousCover, setPreviousCover] = useState(() => projectCovers[seededCoverIndex] ?? null);
  const [fadePreviousOut, setFadePreviousOut] = useState(false);
  const [loadedCoverSrc, setLoadedCoverSrc] = useState<string | null>(null);

  const safeActiveCoverIndex = useMemo(() => {
    if (projectCovers.length === 0) return 0;

    return ((activeCoverIndex % projectCovers.length) + projectCovers.length) % projectCovers.length;
  }, [activeCoverIndex, projectCovers.length]);
  const activeCover = projectCovers[safeActiveCoverIndex];

  useEffect(() => {
    if (projectCovers.length === 0) return undefined;

    const interval = setInterval(() => {
      setPreviousCover(projectCovers[safeActiveCoverIndex] ?? null);
      setLoadedCoverSrc(null);
      setFadePreviousOut(false);
      setActiveCoverIndex((current) =>
        projectCovers.length ? (current + 1) % projectCovers.length : current,
      );
    }, 5200);

    return () => clearInterval(interval);
  }, [projectCovers, safeActiveCoverIndex]);

  useEffect(() => {
    if (!fadePreviousOut && loadedCoverSrc) {
      const timeout = setTimeout(() => setFadePreviousOut(true), 200);

      return () => clearTimeout(timeout);
    }

    return undefined;
  }, [fadePreviousOut, loadedCoverSrc]);

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
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start lg:gap-12">
          <div className="max-w-3xl space-y-2">
            <div className="space-y-2">
              <RichText
                as="h1"
                value={copy.title}
                className="text-3xl font-semibold tracking-tight sm:text-4xl"
              />
              <RichText value={copy.copy} className="prose prose-sm max-w-none text-foreground/70 sm:prose-base" />
            </div>
          </div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
            {projectCovers.length > 0 ? (
              <>
                {previousCover && previousCover.src !== activeCover?.src ? (
                  <Image
                    key={`${previousCover.src}-previous`}
                    src={previousCover.src}
                    alt={translate(locale, previousCover.alt ?? copy.title)}
                    fill
                    sizes="(min-width: 1024px) 420px, 100vw"
                    className={`absolute inset-0 object-cover transition-opacity duration-1000 ease-in-out ${
                      fadePreviousOut ? "opacity-0" : "opacity-100"
                    }`}
                    priority
                  />
                ) : null}
                <Image
                  key={activeCover?.src}
                  src={activeCover?.src ?? "/images/projects-visual.svg"}
                  alt={translate(locale, activeCover?.alt ?? copy.title)}
                  fill
                  sizes="(min-width: 1024px) 420px, 100vw"
                  className={`object-cover transition-opacity duration-1000 ease-in-out ${
                    loadedCoverSrc === activeCover?.src ? "opacity-100" : "opacity-0"
                  }`}
                  priority
                  onLoad={() => setLoadedCoverSrc(activeCover?.src ?? null)}
                />
              </>
            ) : (
              <Image
                src="/images/projects-visual.svg"
                alt={translate(locale, copy.title)}
                fill
                sizes="(min-width: 1024px) 420px, 100vw"
                className="object-cover"
                priority
              />
            )}
          </div>
        </div>
      </header>

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
          {translate(locale, copy.filterAllLabel)}
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

      <div className="space-y-8">
        {filteredProjects.length === 0 ? (
          <p className="rounded-3xl border border-dashed border-foreground/10 bg-foreground/5 p-6 text-sm text-foreground/60">
            {translate(locale, copy.emptyState)}
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
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
                    {formatProjectTimeline(project)}
                  </span>
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
                    <RichText as="span" value={copy.cardCta} />
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
              <RichText as="span" value={copy.ctaTitle} />
            </p>
            <RichText
              value={copy.ctaDescription}
              className="prose prose-sm max-w-2xl text-foreground/80 sm:prose-base"
            />
          </div>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background shadow transition hover:-translate-y-0.5 hover:bg-foreground/90"
          >
            <RichText as="span" value={copy.ctaAction} />
          </Link>
        </div>
      </section>
    </div>
  );
}
