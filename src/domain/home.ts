import type { Project } from "@/domain/projects";

export type HomeProjectSlots = [string | null, string | null, (string | null)?];

export type HomeSettings = {
  featuredProjectSlugs: HomeProjectSlots;
  updatedAt?: string;
};

// Existing identifiers, also used by the project detail routes.
const INITIAL_PROJECT_SLUGS: HomeProjectSlots = ["otro_dia_otro_dolar", "luminico_urtext_2025"];

export const isHomeProjectEligible = (project: Project): boolean => {
  if (project.isPrivate || !project.cover?.src?.trim()) return false;
  const src = project.cover.src.trim();
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    return ["https:", "http:"].includes(new URL(src).protocol);
  } catch {
    return false;
  }
};

export const initialHomeSettings = (projects: Project[]): HomeSettings => ({
  featuredProjectSlugs: INITIAL_PROJECT_SLUGS.map((slug) =>
    projects.some((project) => project.slug === slug && isHomeProjectEligible(project)) ? slug : null,
  ) as HomeProjectSlots,
});

// Reserve explicit choices before filling gaps. An empty third slot stays hidden.
// The input order is the existing public archive order; never mutate it.
export const resolveHomeProjects = (projects: Project[], slots: HomeProjectSlots): Project[] => {
  const eligible = projects.filter(isHomeProjectEligible);
  const bySlug = new Map(eligible.map((project) => [project.slug, project]));
  const used = new Set<string>();
  const activeSlots = slots[2] ? slots : slots.slice(0, 2);
  const selected = activeSlots.map((slug) => {
    const project = slug ? bySlug.get(slug) : undefined;
    if (!project || used.has(project.slug)) return undefined;
    used.add(project.slug);
    return project;
  });

  return selected.map((project) => {
    if (project) return project;
    const fallback = eligible.find((candidate) => !used.has(candidate.slug));
    if (fallback) used.add(fallback.slug);
    return fallback;
  }).filter((project): project is Project => Boolean(project));
};

export const homeSelectionError = (projects: Project[], slots: HomeProjectSlots): string | null => {
  const selectedSlugs = slots.filter((slug) => Boolean(slug));
  if (new Set(selectedSlugs).size !== selectedSlugs.length) return "El mismo proyecto no puede ocupar más de una posición.";
  for (const [index, slug] of slots.entries()) {
    if (!slug) continue;
    const project = projects.find((candidate) => candidate.slug === slug);
    if (!project) return `Proyecto destacado ${index + 1}: la entrada ya no existe. ${index === 2 ? "Elige otra o selecciona «Sin tercer proyecto»." : "Elige otra o usa el orden automático."}`;
    if (project.isPrivate) return `Proyecto destacado ${index + 1}: la entrada es privada. Elige un proyecto público.`;
    if (!isHomeProjectEligible(project)) return `Proyecto destacado ${index + 1}: la entrada no tiene una imagen de portada válida.`;
  }
  return null;
};
