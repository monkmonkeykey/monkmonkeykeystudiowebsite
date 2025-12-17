import type {
  LocalizedValue,
  Project,
  ProjectCategory,
  ProjectEntity,
  ProjectGalleryImage,
  ProjectVideo,
} from "@/domain/projects";
import type { Client } from "@/content/clients";
import type { LocaleText } from "@/lib/i18n";
import { CLIENTS } from "@/content/clients";
import { buildCloudinaryImageUrl } from "@/server/cloudinary";
import { fetchClientsFromDatabase } from "@/server/clients";
import { getMongoDatabase } from "@/server/mongodb";

type ProjectImagePayload = {
  src?: string | null;
  alt: LocaleText;
  publicId?: string | null;
  footnote?: LocaleText | null;
};

export type ProjectPayload = {
  slug: string;
  name: LocaleText;
  subtitle: LocaleText;
  categories: ProjectCategory[];
  year: string;
  client: LocalizedValue;
  location: LocalizedValue;
  cover: ProjectImagePayload;
  gallery?: ProjectImagePayload[];
  video?: { url: string; title: LocaleText } | null;
  description: LocaleText[];
  meta?: { label: LocaleText; value: LocalizedValue }[];
  entities?: string[];
  order?: number | null;
};

type ProjectDocument = {
  slug: string;
  name: LocaleText;
  subtitle: LocaleText;
  categories: ProjectCategory[];
  year: string;
  client: LocalizedValue;
  location: LocalizedValue;
  cover: ProjectImagePayload | null;
  gallery?: ProjectImagePayload[];
  video?: { url: string; title: LocaleText } | null;
  description: LocaleText[];
  meta?: { label: LocaleText; value: LocalizedValue }[];
  entities?: string[];
  order?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
};

const normalizeLocaleText = (value: LocaleText): LocaleText => ({
  es: value.es.trim(),
  en: value.en.trim(),
});

const normalizeLocalizedValue = (value: LocalizedValue): LocalizedValue => {
  if (typeof value === "string") {
    return value.trim();
  }

  return normalizeLocaleText(value);
};

const normalizeImage = (
  image: ProjectImagePayload | undefined | null,
): (ProjectGalleryImage & { publicId?: string }) | undefined => {
  if (!image) {
    return undefined;
  }

  const src = image.src || (image.publicId ? buildCloudinaryImageUrl(image.publicId) ?? "" : "");

  return {
    alt: normalizeLocaleText(image.alt),
    publicId: image.publicId ?? undefined,
    footnote: image.footnote ? normalizeLocaleText(image.footnote) : undefined,
    src,
  };
};

const parseYouTubeStart = (value: string | null): number | undefined => {
  if (!value) {
    return undefined;
  }

  if (/^\d+$/.test(value)) {
    return Number.parseInt(value, 10);
  }

  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/);

  if (!match) {
    return undefined;
  }

  const [, hours, minutes, seconds] = match;
  const hoursValue = hours ? Number.parseInt(hours, 10) * 3600 : 0;
  const minutesValue = minutes ? Number.parseInt(minutes, 10) * 60 : 0;
  const secondsValue = seconds ? Number.parseInt(seconds, 10) : 0;

  return hoursValue + minutesValue + secondsValue || undefined;
};

const normalizeVideo = (
  value: { url: string; title: LocaleText } | null | undefined,
  projectSlug: string,
): ProjectVideo | undefined => {
  if (!value) {
    return undefined;
  }

  const rawUrl = value.url.trim();

  if (rawUrl.length === 0) {
    return undefined;
  }

  let url: URL;

  try {
    url = new URL(rawUrl);
  } catch {
    throw new Error(`Video url for ${projectSlug} is invalid`);
  }

  const hostname = url.hostname.replace(/^www\./, "");
  let provider: ProjectVideo["provider"] | undefined;
  let embedUrl: string | undefined;

  if (hostname === "youtu.be" || hostname.endsWith("youtube.com")) {
    provider = "youtube";
    let videoId: string | null = null;

    if (hostname === "youtu.be") {
      const [id] = url.pathname.split("/").filter(Boolean);
      videoId = id ?? null;
    } else {
      const segments = url.pathname.split("/").filter(Boolean);

      if (url.pathname === "/watch") {
        videoId = url.searchParams.get("v");
      } else if (segments[0] === "embed" || segments[0] === "shorts" || segments[0] === "live") {
        videoId = segments[1] ?? null;
      }
    }

    if (!videoId) {
      throw new Error(`Video url for ${projectSlug} must include a valid YouTube id`);
    }

    const start = parseYouTubeStart(url.searchParams.get("start") ?? url.searchParams.get("t"));
    embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;

    if (start) {
      embedUrl += `?start=${start}`;
    }
  } else if (hostname === "player.vimeo.com" || hostname.endsWith("vimeo.com")) {
    provider = "vimeo";
    const segments = url.pathname.split("/").filter(Boolean);
    const videoId = segments.pop();

    if (!videoId) {
      throw new Error(`Video url for ${projectSlug} must include a valid Vimeo id`);
    }

    embedUrl = `https://player.vimeo.com/video/${videoId}`;
  }

  if (!provider || !embedUrl) {
    throw new Error(
      `Video url for ${projectSlug} must point to a supported provider (YouTube or Vimeo)`,
    );
  }

  return {
    url: rawUrl,
    provider,
    embedUrl,
    title: normalizeLocaleText(value.title),
  };
};

const buildEntities = async (slugs: string[] | undefined): Promise<ProjectEntity[]> => {
  if (!slugs || slugs.length === 0) {
    return [];
  }

  const dbClients = await fetchClientsFromDatabase();
  const clients = dbClients ?? CLIENTS;
  const clientMap = new Map<string, Client>(clients.map((client) => [client.slug, client]));

  return slugs
    .map((slug) => {
      const client = clientMap.get(slug);

      if (!client) {
        return null;
      }

      return {
        slug: client.slug,
        name: client.name,
        summary: client.summary,
        sector: client.sector,
        website: client.website,
        image: client.image,
      } satisfies ProjectEntity;
    })
    .filter(Boolean) as ProjectEntity[];
};

const normalizeProjectDocument = async (document: ProjectDocument): Promise<Project> => {
  const cover = normalizeImage(document.cover);

  if (!cover) {
    throw new Error(`El proyecto ${document.slug} no tiene una portada configurada`);
  }

  const gallery = Array.isArray(document.gallery)
    ? document.gallery.map((image) => normalizeImage(image)).filter(Boolean)
    : [];

  const video = normalizeVideo(document.video ?? undefined, document.slug);
  const entities = await buildEntities(document.entities);

  return {
    slug: document.slug,
    name: normalizeLocaleText(document.name),
    subtitle: normalizeLocaleText(document.subtitle),
    categories: document.categories ?? [],
    year: document.year,
    client: normalizeLocalizedValue(document.client),
    location: normalizeLocalizedValue(document.location),
    cover,
    gallery: gallery as ProjectGalleryImage[],
    video,
    description: Array.isArray(document.description)
      ? (document.description as LocaleText[]).map(normalizeLocaleText)
      : [],
    meta: Array.isArray(document.meta)
      ? (document.meta as { label: LocaleText; value: LocalizedValue }[]).map((item) => ({
          label: normalizeLocaleText(item.label),
          value: normalizeLocalizedValue(item.value),
        }))
      : [],
    entities,
  } satisfies Project;
};

export const fetchProjectsFromDatabase = async (): Promise<Project[] | null> => {
  const db = await getMongoDatabase();

  if (!db) {
    return null;
  }

  const collection = db.collection<ProjectDocument>("projects");

  const documents = await collection
    .find({}, { projection: { _id: 0 } })
    .sort({ order: 1, "name.es": 1 })
    .toArray();

  const results: Project[] = [];

  for (const document of documents) {
    results.push(await normalizeProjectDocument(document));
  }

  return results;
};

export const fetchProjectBySlug = async (slug: string): Promise<Project | null> => {
  const db = await getMongoDatabase();

  if (!db) {
    return null;
  }

  const collection = db.collection<ProjectDocument>("projects");

  const document = await collection.findOne({ slug }, { projection: { _id: 0 } });

  if (!document) {
    return null;
  }

  return normalizeProjectDocument(document);
};

const prepareProjectDocument = (payload: ProjectPayload) => {
  return {
    slug: payload.slug,
    name: normalizeLocaleText(payload.name),
    subtitle: normalizeLocaleText(payload.subtitle),
    categories: payload.categories,
    year: payload.year,
    client: normalizeLocalizedValue(payload.client),
    location: normalizeLocalizedValue(payload.location),
    cover: normalizeImage(payload.cover) ?? null,
    gallery: Array.isArray(payload.gallery)
      ? payload.gallery.map((image) => normalizeImage(image)).filter(Boolean)
      : [],
    video: payload.video
      ? {
          url: payload.video.url.trim(),
          title: normalizeLocaleText(payload.video.title),
        }
      : null,
    description: payload.description.map(normalizeLocaleText),
    meta: Array.isArray(payload.meta)
      ? payload.meta.map((item) => ({
          label: normalizeLocaleText(item.label),
          value: normalizeLocalizedValue(item.value),
        }))
      : [],
    entities: payload.entities ?? [],
    order: payload.order ?? null,
    updatedAt: new Date(),
  };
};

export const upsertProject = async (payload: ProjectPayload): Promise<Project | null> => {
  const db = await getMongoDatabase();

  if (!db) {
    return null;
  }

  const collection = db.collection<ProjectDocument>("projects");

  const document = prepareProjectDocument(payload);

  await collection.updateOne(
    { slug: payload.slug },
    {
      $set: document,
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true },
  );

  const stored = await collection.findOne({ slug: payload.slug }, { projection: { _id: 0 } });

  return stored ? normalizeProjectDocument(stored) : null;
};

export const deleteProject = async (slug: string): Promise<boolean> => {
  const db = await getMongoDatabase();

  if (!db) {
    return false;
  }

  const collection = db.collection<ProjectDocument>("projects");

  const result = await collection.deleteOne({ slug });
  return (result.deletedCount ?? 0) > 0;
};

export const ensureProjectIndexes = async (): Promise<void> => {
  const db = await getMongoDatabase();

  if (!db) {
    return;
  }

  const collection = db.collection<ProjectDocument>("projects");

  await collection.createIndex({ slug: 1 }, { unique: true });
  await collection.createIndex({ order: 1, "name.es": 1 });
};
