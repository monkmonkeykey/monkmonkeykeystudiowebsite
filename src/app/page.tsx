import HomePageClient from "./page.client";

import { PROJECT_CATEGORY_LABELS } from "@/domain/projects";
import { SERVICES } from "@/content/services";
import { getClients } from "@/data/clients";
import { getProjects } from "@/data/projects";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const [projects, clients] = await Promise.all([getProjects(), getClients()]);

  return (
    <HomePageClient
      projects={projects}
      clients={clients}
      services={SERVICES}
      categoryLabels={PROJECT_CATEGORY_LABELS}
    />
  );
}
