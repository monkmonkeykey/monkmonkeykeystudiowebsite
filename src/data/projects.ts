import type { Project } from "@/domain/projects";
import { PROJECTS } from "@/content/projects";
import { hasDatabaseConfig } from "@/lib/env";
import { fetchProjectBySlug, fetchProjectsFromDatabase } from "@/server/projects";

let cachedProjects: Project[] | null = null;

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
  if (!hasDatabaseConfig()) {
    return sortProjectsByTimeline(filterPrivate(PROJECTS, includePrivate));
  }

  if (!cachedProjects) {
    const projects = await fetchProjectsFromDatabase();

    if (!projects || projects.length === 0) {
      cachedProjects = PROJECTS;
    } else {
      cachedProjects = projects;
    }
  }

  return sortProjectsByTimeline(filterPrivate(cachedProjects, includePrivate));
};

export const getProjectBySlug = async (
  slug: string,
  includePrivate = false,
): Promise<Project | null> => {
  if (!hasDatabaseConfig()) {
    const project = PROJECTS.find((item) => item.slug === slug);
    return project && (includePrivate || !project.isPrivate) ? project : null;
  }

  const project = await fetchProjectBySlug(slug);

  if (project && (includePrivate || !project.isPrivate)) {
    return project;
  }

  if (!cachedProjects) {
    await getProjects(true);
  }

  const cached = cachedProjects?.find((item) => item.slug === slug) ?? null;
  if (!cached) {
    return null;
  }

  return includePrivate || !cached.isPrivate ? cached : null;
};

export const refreshProjectsCache = async (): Promise<void> => {
  if (!hasDatabaseConfig()) {
    cachedProjects = PROJECTS;
    return;
  }

  const projects = await fetchProjectsFromDatabase();
  cachedProjects = projects && projects.length > 0 ? projects : PROJECTS;
};
