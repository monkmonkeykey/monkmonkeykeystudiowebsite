import AdminDashboard from "./page.client";

import { getClients } from "@/data/clients";
import { getProjects } from "@/data/projects";
import { getSiteContent } from "@/data/site";
import { hasCloudinaryConfig, hasDatabaseConfig } from "@/lib/env";
import { requireAdminSession } from "@/server/auth";
import { getHomeSettings } from "@/server/home";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  await requireAdminSession();

  const [clients, projects, siteContent] = await Promise.all([
    getClients(true),
    getProjects(true),
    getSiteContent(),
  ]);
  const homeSettings = await getHomeSettings(projects);

  return (
    <AdminDashboard
      clients={clients}
      projects={projects}
      siteContent={siteContent}
      homeSettings={homeSettings}
      databaseReady={hasDatabaseConfig()}
      cloudinaryReady={hasCloudinaryConfig()}
    />
  );
}
