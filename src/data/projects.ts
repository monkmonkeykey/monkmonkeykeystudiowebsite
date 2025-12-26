import type { Project } from "@/domain/projects";
import { PROJECTS } from "@/content/projects";
import { hasDatabaseConfig } from "@/lib/env";
import { fetchProjectBySlug, fetchProjectsFromDatabase } from "@/server/projects";

let warnedProjectFallback = false;

const logProjectFallback = (reason: string) => {
  if (!warnedProjectFallback) {
    console.warn(`[projects] Usando contenido local: ${reason}`);
    warnedProjectFallback = true;
  }
};

const sortProjectsByTimeline = (projects: Project[]): Project[] => {
  const score = (project: Project) => {
    if (project.endYear) {
      return project.endYear;
    }

    if (project.startYear) {
      return project.startYear;
    }

    const parsed = Number.parseInt(project.year, 10);
    return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed;
  };

  return [...projects].sort((a, b) => {
    const scoreB = score(b);
    const scoreA = score(a);

    if (scoreB !== scoreA) {
      return scoreB - scoreA;
    }

    return a.slug.localeCompare(b.slug);
  });
};

const filterPrivate = (projects: Project[], includePrivate: boolean) =>
  includePrivate ? projects : projects.filter((project) => !project.isPrivate);

export const getProjects = async (includePrivate = false): Promise<Project[]> => {
  const fallback = () => sortProjectsByTimeline(filterPrivate(PROJECTS, includePrivate));

  if (!hasDatabaseConfig()) {
    return fallback();
  }

  const projects = await fetchProjectsFromDatabase();

  if (!projects) {
    logProjectFallback("no se pudo contactar la base de datos");
    return fallback();
  }

  return sortProjectsByTimeline(filterPrivate(projects.length > 0 ? projects : PROJECTS, includePrivate));
};

export const getProjectBySlug = async (
  slug: string,
  includePrivate = false,
): Promise<Project | null> => {
  const fallbackLookup = () => {
    const project = PROJECTS.find((item) => item.slug === slug);
    return project && (includePrivate || !project.isPrivate) ? project : null;
  };

  if (!hasDatabaseConfig()) {
    return fallbackLookup();
  }

  const project = await fetchProjectBySlug(slug);

  if (project && (includePrivate || !project.isPrivate)) {
    return project;
  }

  const hydratedProjects = await getProjects(true);
  const fallback = hydratedProjects.find((item) => item.slug === slug) ?? null;
  return fallback && (includePrivate || !fallback.isPrivate) ? fallback : null;
};

export const refreshProjectsCache = async (): Promise<void> => {
  if (!hasDatabaseConfig()) {
    return;
  }

  const projects = await fetchProjectsFromDatabase();
  if (!projects) {
    logProjectFallback("no se pudo contactar la base de datos");
  }
};
