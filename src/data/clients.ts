import type { Client } from "@/content/clients";
import { CLIENTS } from "@/content/clients";
import { hasDatabaseConfig } from "@/lib/env";
import { fetchClientBySlug, fetchClientsFromDatabase } from "@/server/clients";

let warnedClientFallback = false;

const logClientFallback = (reason: string) => {
  if (!warnedClientFallback) {
    console.warn(`[clients] Usando contenido local: ${reason}`);
    warnedClientFallback = true;
  }
};

const filterPrivate = (clients: Client[], includePrivate: boolean) =>
  includePrivate ? clients : clients.filter((client) => !client.isPrivate);

export const getClients = async (includePrivate = false): Promise<Client[]> => {
  if (!hasDatabaseConfig()) {
    return filterPrivate(CLIENTS, includePrivate);
  }

  const clients = await fetchClientsFromDatabase();

  if (!clients) {
    logClientFallback("no se pudo contactar la base de datos");
    return filterPrivate(CLIENTS, includePrivate);
  }

  return filterPrivate(clients.length > 0 ? clients : CLIENTS, includePrivate);
};

export const getClientBySlug = async (
  slug: string,
  includePrivate = false,
): Promise<Client | null> => {
  if (!hasDatabaseConfig()) {
    const client = CLIENTS.find((item) => item.slug === slug);
    return client && (includePrivate || !client.isPrivate) ? client : null;
  }

  const client = await fetchClientBySlug(slug);

  if (client && (includePrivate || !client.isPrivate)) {
    return client;
  }

  const clients = await getClients(includePrivate);
  return clients.find((item) => item.slug === slug) ?? null;
};

export const refreshClientsCache = async (): Promise<void> => {
  if (!hasDatabaseConfig()) {
    return;
  }

  const clients = await fetchClientsFromDatabase();
  if (!clients) {
    logClientFallback("no se pudo contactar la base de datos");
  }
};
