import HomePageClient from "./page.client";

import { PROJECT_CATEGORY_LABELS } from "@/domain/projects";
import { getClients } from "@/data/clients";
import { getProjects } from "@/data/projects";
import { getSiteContent } from "@/data/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [projects, clients, siteContent] = await Promise.all([
    getProjects(),
    getClients(),
    getSiteContent(),
  ]);

  return (
    <HomePageClient
      projects={projects}
      clients={clients}
      services={siteContent.services}
      siteContent={siteContent}
      categoryLabels={PROJECT_CATEGORY_LABELS}
    />
  );
}
