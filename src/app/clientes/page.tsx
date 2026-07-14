import ClientsPageClient from "./page.client";

import { getClients } from "@/data/clients";
import { getSiteContent } from "@/data/site";

export default async function ClientsPage() {
  const [clients, siteContent] = await Promise.all([getClients(), getSiteContent()]);
  return <ClientsPageClient clients={clients} copy={siteContent.clientsPage} />;
}
