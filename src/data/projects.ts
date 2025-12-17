import type { Project } from "@/domain/projects";
import { PROJECTS } from "@/content/projects";
import { hasDatabaseConfig } from "@/lib/env";
import { fetchProjectBySlug, fetchProjectsFromDatabase } from "@/server/projects";

let cachedProjects: Project[] | null = null;

export const getProjects = async (): Promise<Project[]> => {
  if (!hasDatabaseConfig()) {
    return PROJECTS;
  }

  if (cachedProjects) {
    return cachedProjects;
  }

  const projects = await fetchProjectsFromDatabase();

  if (!projects || projects.length === 0) {
    cachedProjects = PROJECTS;
  } else {
    cachedProjects = projects;
  }

  return cachedProjects;
};

export const getProjectBySlug = async (slug: string): Promise<Project | null> => {
  if (!hasDatabaseConfig()) {
    return PROJECTS.find((project) => project.slug === slug) ?? null;
  }

  const project = await fetchProjectBySlug(slug);

  if (project) {
    return project;
  }

  if (!cachedProjects) {
    await getProjects();
  }

  return cachedProjects?.find((item) => item.slug === slug) ?? null;
};

export const refreshProjectsCache = async (): Promise<void> => {
  if (!hasDatabaseConfig()) {
    cachedProjects = PROJECTS;
    return;
  }

  const projects = await fetchProjectsFromDatabase();
  cachedProjects = projects && projects.length > 0 ? projects : PROJECTS;
};
