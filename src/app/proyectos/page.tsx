import ProjectsPageClient from "./page.client";

import { PROJECT_CATEGORY_LABELS } from "@/domain/projects";
import { getProjects } from "@/data/projects";

export default async function ProjectsPage() {
  const projects = await getProjects();
  return (
    <ProjectsPageClient
      projects={projects}
      categoryLabels={PROJECT_CATEGORY_LABELS}
    />
  );
}
