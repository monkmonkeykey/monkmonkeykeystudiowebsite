import { DEFAULT_SITE_CONTENT } from "@/content/site";
import type { SiteContent, SiteCopy } from "@/domain/site";
import type { LocaleText } from "@/lib/i18n";
import { buildCloudinaryVideoUrl } from "@/server/cloudinary";
import { getMongoDatabase } from "@/server/mongodb";

const COLLECTION = "siteContent";
const DOCUMENT_ID = "global";

const normalizeLocaleText = (value: LocaleText): LocaleText => ({
  es: value.es.trim(),
  en: value.en.trim(),
});

const normalizeLocaleList = (values: LocaleText[] | undefined): LocaleText[] =>
  (values ?? []).map(normalizeLocaleText).filter((item) => item.es.length > 0 || item.en.length > 0);

const normalizeHeroVideo = (
  value: SiteCopy["home"]["heroVideo"],
): SiteCopy["home"]["heroVideo"] | undefined => {
  if (!value) return undefined;

  const urlCandidate = value.url?.trim();
  const publicId = value.publicId?.trim();
  const poster = value.poster?.trim();
  const resolvedUrl = urlCandidate || (publicId ? buildCloudinaryVideoUrl(publicId) ?? "" : "");

  if (!resolvedUrl && !poster) {
    return undefined;
  }

  return {
    url: resolvedUrl || undefined,
    publicId: publicId || undefined,
    poster: poster || undefined,
  };
};

const normalizeSiteCopy = (value: SiteCopy): SiteCopy => ({
  home: {
    heroHeadline: normalizeLocaleText(value.home.heroHeadline),
    heroSubtitle: normalizeLocaleText(value.home.heroSubtitle),
    heroPrimaryCta: normalizeLocaleText(value.home.heroPrimaryCta),
    heroSecondaryCta: normalizeLocaleText(value.home.heroSecondaryCta),
    heroTags: normalizeLocaleList(value.home.heroTags),
    heroVideo: normalizeHeroVideo(value.home.heroVideo),
    servicesTitle: normalizeLocaleText(value.home.servicesTitle),
    servicesCopy: normalizeLocaleText(value.home.servicesCopy),
    servicesCta: normalizeLocaleText(value.home.servicesCta),
    servicesTags: normalizeLocaleList(value.home.servicesTags),
    projectsTitle: normalizeLocaleText(value.home.projectsTitle),
    projectsCta: normalizeLocaleText(value.home.projectsCta),
    clientsTitle: normalizeLocaleText(value.home.clientsTitle),
    clientsWebsiteLabel: normalizeLocaleText(value.home.clientsWebsiteLabel),
    contactCta: normalizeLocaleText(value.home.contactCta),
  },
  projectsPage: {
    title: normalizeLocaleText(value.projectsPage.title),
    copy: normalizeLocaleText(value.projectsPage.copy),
    filterAllLabel: normalizeLocaleText(value.projectsPage.filterAllLabel),
    emptyState: normalizeLocaleText(value.projectsPage.emptyState),
    cardCta: normalizeLocaleText(value.projectsPage.cardCta),
    ctaTitle: normalizeLocaleText(value.projectsPage.ctaTitle),
    ctaDescription: normalizeLocaleText(value.projectsPage.ctaDescription),
    ctaAction: normalizeLocaleText(value.projectsPage.ctaAction),
  },
  servicesPage: {
    title: normalizeLocaleText(value.servicesPage.title),
    copy: normalizeLocaleText(value.servicesPage.copy),
    ctaLabel: normalizeLocaleText(value.servicesPage.ctaLabel),
    chips: normalizeLocaleList(value.servicesPage.chips),
    outcomesLabel: normalizeLocaleText(value.servicesPage.outcomesLabel),
  },
  contact: {
    title: normalizeLocaleText(value.contact.title),
    copy: normalizeLocaleText(value.contact.copy),
    email: value.contact.email.trim(),
    preparation: normalizeLocaleList(value.contact.preparation),
  },
  services: value.services.map((service) => ({
    ...service,
    slug: service.slug.trim(),
    title: normalizeLocaleText(service.title),
    summary: normalizeLocaleText(service.summary),
    outcomes: normalizeLocaleList(service.outcomes),
  })),
});

export const fetchSiteContent = async (): Promise<SiteContent | null> => {
  const db = await getMongoDatabase();

  if (!db) {
    return null;
  }

  const document = await db.collection<SiteContent>(COLLECTION).findOne({ _id: DOCUMENT_ID });

  if (!document) {
    return null;
  }

  return normalizeSiteCopy(document);
};

export const upsertSiteContent = async (payload: SiteCopy): Promise<SiteContent | null> => {
  const db = await getMongoDatabase();

  if (!db) {
    return null;
  }

  const normalized = normalizeSiteCopy({ ...DEFAULT_SITE_CONTENT, ...payload });

  await db
    .collection<SiteContent>(COLLECTION)
    .updateOne({ _id: DOCUMENT_ID }, { $set: { ...normalized, updatedAt: new Date().toISOString() } }, { upsert: true });

  return { ...normalized, updatedAt: new Date().toISOString() };
};
