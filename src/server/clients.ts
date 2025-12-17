import type { Client, ClientKind, ClientImage } from "@/content/clients";
import { env } from "@/lib/env";
import { buildCloudinaryImageUrl } from "@/server/cloudinary";
import { getMongoDatabase } from "@/server/mongodb";

export type ClientPayload = {
  slug: string;
  name: string;
  sector: { es: string; en: string };
  summary: { es: string; en: string };
  website?: string;
  image?: {
    alt: { es: string; en: string };
    src?: string;
    publicId?: string;
    footnote?: { es: string; en: string };
  } | null;
  kind?: ClientKind;
  order?: number | null;
};

type ClientDocument = {
  slug: string;
  name: string;
  sector: { es: string; en: string };
  summary: { es: string; en: string };
  website?: string;
  image?: (ClientImage & { publicId?: string; footnote?: { es: string; en: string } }) | null;
  kind?: ClientKind;
  order?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
};

const normalizeLocaleText = (value: { es: string; en: string }) => ({
  es: value.es.trim(),
  en: value.en.trim(),
});

const normalizeImage = (
  image:
    | (ClientImage & { publicId?: string; footnote?: { es: string; en: string } })
    | {
        alt: { es: string; en: string };
        src?: string;
        publicId?: string;
        footnote?: { es: string; en: string };
      }
    | undefined
    | null,
): (ClientImage & { publicId?: string; footnote?: { es: string; en: string } }) | undefined => {
  if (!image) {
    return undefined;
  }

  const srcCandidate = "src" in image ? image.src : undefined;
  const src = srcCandidate || (image.publicId ? buildCloudinaryImageUrl(image.publicId) ?? "" : "");

  return {
    ...image,
    alt: normalizeLocaleText(image.alt),
    footnote: image.footnote ? normalizeLocaleText(image.footnote) : undefined,
    src,
  };
};

const normalizeClient = (document: ClientDocument): Client => {
  const image = normalizeImage(document.image);

  return {
    slug: document.slug,
    name: document.name,
    sector: document.sector,
    summary: document.summary,
    website: document.website,
    image,
    kind: document.kind ?? "client",
  } satisfies Client;
};

const getClientsCollection = async () => {
  const db = await getMongoDatabase();

  if (!db) {
    return null;
  }

  return db.collection<ClientDocument>(env.mongodbClientsCollection);
};

export const fetchClientsFromDatabase = async (): Promise<Client[] | null> => {
  const collection = await getClientsCollection();

  if (!collection) {
    return null;
  }

  const documents = await collection
    .find({}, { projection: { _id: 0 } })
    .sort({ order: 1, name: 1 })
    .toArray();

  return documents.map(normalizeClient);
};

export const fetchClientBySlug = async (slug: string): Promise<Client | null> => {
  const collection = await getClientsCollection();

  if (!collection) {
    return null;
  }

  const document = await collection.findOne({ slug }, { projection: { _id: 0 } });

  if (!document) {
    return null;
  }

  return normalizeClient(document);
};

const prepareClientDocument = (payload: ClientPayload) => {
  const baseImage = normalizeImage(payload.image ?? undefined);

  return {
    slug: payload.slug,
    name: payload.name,
    sector: payload.sector,
    summary: payload.summary,
    website: payload.website,
    image: baseImage,
    kind: payload.kind ?? "client",
    order: payload.order ?? null,
    updatedAt: new Date(),
  };
};

export const upsertClient = async (payload: ClientPayload): Promise<Client | null> => {
  const collection = await getClientsCollection();

  if (!collection) {
    return null;
  }

  const document = prepareClientDocument(payload);

  await collection.updateOne(
    { slug: payload.slug },
    {
      $set: document,
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );

  const stored = await collection.findOne({ slug: payload.slug }, { projection: { _id: 0 } });

  return stored ? normalizeClient(stored) : null;
};

export const deleteClient = async (slug: string): Promise<boolean> => {
  const collection = await getClientsCollection();

  if (!collection) {
    return false;
  }

  const result = await collection.deleteOne({ slug });
  return (result.deletedCount ?? 0) > 0;
};

export const ensureClientIndexes = async (): Promise<void> => {
  const collection = await getClientsCollection();

  if (!collection) {
    return;
  }

  await collection.createIndex({ slug: 1 }, { unique: true });
  await collection.createIndex({ order: 1, name: 1 });
};

