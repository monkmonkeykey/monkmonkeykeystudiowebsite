import type { Project } from "@/domain/projects";
import { initialHomeSettings, type HomeSettings } from "@/domain/home";
import { getMongoDatabase } from "@/server/mongodb";
import { homeSettingsSchema } from "@/server/validation";

// A separate global document keeps other site forms and project order independent.
const COLLECTION = "siteContent";
const DOCUMENT_ID = "home";

export const getHomeSettings = async (projects: Project[]): Promise<HomeSettings> => {
  try {
    const db = await getMongoDatabase();
    if (!db) return initialHomeSettings(projects);
    const document = await db.collection<HomeSettings>(COLLECTION).findOne({ _id: DOCUMENT_ID });
    const parsed = homeSettingsSchema.safeParse(document);
    if (parsed.success) return { ...parsed.data, updatedAt: document?.updatedAt };
  } catch {
    console.warn("[home] No se pudo leer la configuración del inicio; se usará la selección inicial disponible.");
  }
  return initialHomeSettings(projects);
};

export const saveHomeSettings = async (settings: HomeSettings): Promise<HomeSettings | null> => {
  const db = await getMongoDatabase();
  if (!db) return null;
  const saved: HomeSettings = {
    featuredProjectSlugs: settings.featuredProjectSlugs,
    updatedAt: new Date().toISOString(),
  };
  await db.collection<HomeSettings>(COLLECTION).updateOne(
    { _id: DOCUMENT_ID },
    { $set: saved },
    { upsert: true },
  );
  return saved;
};
