import type { Client } from "@/content/clients";
import { CLIENTS } from "@/content/clients";
import { hasDatabaseConfig } from "@/lib/env";
import { fetchClientBySlug, fetchClientsFromDatabase } from "@/server/clients";

let cachedClients: Client[] | null = null;
let warnedClientFallback = false;

const logClientFallback = (reason: string) => {
  if (!warnedClientFallback) {
    console.warn(`[clients] Usando contenido local: ${reason}`);
    warnedClientFallback = true;
  }
};

export const getClients = async (): Promise<Client[]> => {
  if (!hasDatabaseConfig()) {
    return CLIENTS;
  }

  if (!cachedClients) {
    const clients = await fetchClientsFromDatabase();

    if (!clients) {
      logClientFallback("no se pudo contactar la base de datos");
      return CLIENTS;
    }

    cachedClients = clients.length > 0 ? clients : CLIENTS;
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

  const clients = await getClients();
  return clients.find((item) => item.slug === slug) ?? null;
};

export const refreshClientsCache = async (): Promise<void> => {
  if (!hasDatabaseConfig()) {
    cachedClients = CLIENTS;
    return;
  }

  const clients = await fetchClientsFromDatabase();
  if (!clients) {
    logClientFallback("no se pudo contactar la base de datos");
    return;
  }

  cachedClients = clients.length > 0 ? clients : CLIENTS;
};
