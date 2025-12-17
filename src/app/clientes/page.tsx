import ClientsPageClient from "./page.client";

import { getClients } from "@/data/clients";

export default async function ClientsPage() {
  const clients = await getClients();
  return <ClientsPageClient clients={clients} />;
}
