import AdminDashboard from "./page.client";

import { getClients } from "@/data/clients";
import { getProjects } from "@/data/projects";
import { hasCloudinaryConfig, hasDatabaseConfig } from "@/lib/env";
import { requireAdminSession } from "@/server/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPage() {
  await requireAdminSession();

  const [clients, projects] = await Promise.all([getClients(), getProjects(true)]);

  return (
    <AdminDashboard
      clients={clients}
      projects={projects}
      databaseReady={hasDatabaseConfig()}
      cloudinaryReady={hasCloudinaryConfig()}
    />
  );
}
