import ProjectsPageClient from "./page.client";

import { PROJECT_CATEGORY_LABELS } from "@/domain/projects";
import { getProjects } from "@/data/projects";
import { getSiteContent } from "@/data/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await getProjects();
  const siteContent = await getSiteContent();
  return (
    <ProjectsPageClient
      projects={projects}
      categoryLabels={PROJECT_CATEGORY_LABELS}
      copy={siteContent.projectsPage}
    />
  );
}
