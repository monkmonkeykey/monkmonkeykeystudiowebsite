import type { Client } from "@/content/clients";
import { CLIENTS } from "@/content/clients";
import { hasDatabaseConfig } from "@/lib/env";
import { fetchClientBySlug, fetchClientsFromDatabase } from "@/server/clients";

let cachedClients: Client[] | null = null;

export const getClients = async (): Promise<Client[]> => {
  if (!hasDatabaseConfig()) {
    return CLIENTS;
  }

  if (cachedClients) {
    return cachedClients;
  }

  const clients = await fetchClientsFromDatabase();

  if (!clients || clients.length === 0) {
    cachedClients = CLIENTS;
  } else {
    cachedClients = clients;
  }

  return cachedClients;
};

export const getClientBySlug = async (slug: string): Promise<Client | null> => {
  if (!hasDatabaseConfig()) {
    return CLIENTS.find((client) => client.slug === slug) ?? null;
  }

  const client = await fetchClientBySlug(slug);

  if (client) {
    return client;
  }

  if (!cachedClients) {
    await getClients();
  }

  return cachedClients?.find((item) => item.slug === slug) ?? null;
};

export const refreshClientsCache = async (): Promise<void> => {
  if (!hasDatabaseConfig()) {
    cachedClients = CLIENTS;
    return;
  }

  const clients = await fetchClientsFromDatabase();
  cachedClients = clients && clients.length > 0 ? clients : CLIENTS;
};
