"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { Project, ProjectCategory } from "@/domain/projects";
import { formatProjectTimeline, translateCategoryLabel } from "@/domain/projects";
import { translate, type LocaleText } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";
import type { SiteContent } from "@/domain/site";
import { getPlainText, RichText } from "@/components/site/rich-text";
import styles from "./projects.module.css";

type ProjectsPageClientProps = {
  projects: Project[];
  categoryLabels: Record<ProjectCategory, LocaleText>;
  copy: SiteContent["projectsPage"];
};

// Only the archive's presentation changes; stored dates and other pages keep their formatting.
const projectTimeline = (project: Project): string => {
  if (project.startYear && project.startYear === project.endYear) return String(project.startYear);
  return formatProjectTimeline(project).replace(/^(\d{4})\s*[–—-]\s*\1$/, "$1");
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
    <div className={styles.archive}>
      <header className={styles.intro}>
        <h1 className={styles.title}>{getPlainText(translate(locale, copy.title))}</h1>
        <RichText value={copy.copy} className={styles.introCopy} />
      </header>

      <div className={styles.filters} role="group" aria-label={locale === "es" ? "Filtrar proyectos por disciplina" : "Filter projects by discipline"}>
        <p className={styles.filterLabel}>{locale === "es" ? "Explorar por disciplina" : "Explore by discipline"}</p>
        <div className={styles.filterList}>
          <button
            type="button"
            onClick={() => setActiveCategory("all")}
            className={styles.filter}
            aria-pressed={activeCategory === "all"}
            aria-controls="project-results"
          >
            {translate(locale, copy.filterAllLabel)}
          </button>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={styles.filter}
              aria-pressed={activeCategory === category}
              aria-controls="project-results"
            >
              {translateCategoryLabel(locale, category, categoryLabels)}
            </button>
          ))}
        </div>
      </div>

      <p role="status" className="sr-only">{filteredProjects.length} {locale === "es" ? "proyectos" : "projects"}</p>
      <div id="project-results">
        {filteredProjects.length === 0 ? (
          <p className={styles.empty}>{translate(locale, copy.emptyState)}</p>
        ) : (
          <div className={styles.grid}>
            {filteredProjects.map((project, index) => (
              <Link key={project.slug} href={`/proyectos/${project.slug}`} className={styles.project}>
                <div className={styles.image}>
                  <Image
                    src={project.cover.src}
                    alt={translate(locale, project.cover.alt)}
                    fill
                    priority={index === 0}
                    sizes="(min-width: 1320px) 580px, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
                <h2>{getPlainText(translate(locale, project.name))}</h2>
                <div className={styles.meta}>
                  <span>{projectTimeline(project)}</span>
                  <span>{project.categories.map((category) => translateCategoryLabel(locale, category, categoryLabels)).join(" / ")}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
