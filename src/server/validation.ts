import { z } from "zod";

export const localeTextSchema = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
});

export const localizedValueSchema = z.union([
  z.string().min(1),
  localeTextSchema,
]);

export const clientImageSchema = z
  .object({
    src: z.string().min(1).optional(),
    publicId: z.string().min(1).optional(),
    alt: localeTextSchema,
    footnote: localeTextSchema.optional(),
  })
  .refine((value) => Boolean(value.src) || Boolean(value.publicId), {
    message: "Image requires a src or publicId",
  });

export const clientPayloadSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  kind: z.enum(["client", "institution", "partner"]).optional(),
  order: z.number().int().optional(),
  sector: localeTextSchema,
  summary: localeTextSchema,
  website: z.string().url().optional(),
  image: clientImageSchema.nullable().optional(),
});

export const projectCategorySchema = z.string().trim().min(1);

export const projectImageSchema = clientImageSchema;

export const projectMetaSchema = z.object({
  label: localeTextSchema,
  value: localizedValueSchema,
});

export const projectVideoSchema = z
  .object({
    url: z.string().url(),
    title: localeTextSchema,
  })
  .optional()
  .nullable();

export const projectPayloadSchema = z.object({
  slug: z.string().min(1),
  name: localeTextSchema,
  subtitle: localeTextSchema,
  categories: z.array(projectCategorySchema).min(1),
  year: z.string().min(1),
  startYear: z.number().int().optional(),
  endYear: z.number().int().optional(),
  client: localizedValueSchema,
  location: localizedValueSchema,
  cover: projectImageSchema,
  gallery: z.array(projectImageSchema).optional(),
  video: projectVideoSchema,
  description: z.array(localeTextSchema).min(1),
  meta: z.array(projectMetaSchema).optional(),
  entities: z.array(z.string().min(1)).optional(),
  order: z.number().int().optional(),
  isPrivate: z.boolean().optional(),
});

export const serviceSchema = z.object({
  slug: z.string().min(1),
  title: localeTextSchema,
  summary: localeTextSchema,
  outcomes: z.array(localeTextSchema).default([]),
});

const mediaSchema = z
  .object({
    url: z.string().url().optional(),
    publicId: z.string().min(1).optional(),
    poster: z.string().url().optional(),
  })
  .optional()
  .refine((value) => {
    if (!value) return true;
    return Boolean(value.url) || Boolean(value.publicId) || Boolean(value.poster);
  }, "Provide a video URL, publicId, or poster to enable the hero video.");

export const siteCopySchema = z.object({
  navigation: z.object({
    brand: localeTextSchema,
    homeLabel: localeTextSchema,
    servicesLabel: localeTextSchema,
    clientsLabel: localeTextSchema,
    projectsLabel: localeTextSchema,
    contactLabel: localeTextSchema,
    openMenuLabel: localeTextSchema,
    closeMenuLabel: localeTextSchema,
  }),
  home: z.object({
    heroHeadline: localeTextSchema,
    heroSubtitle: localeTextSchema,
    heroPrimaryCta: localeTextSchema,
    heroSecondaryCta: localeTextSchema,
    heroTags: z.array(localeTextSchema).default([]),
    heroVideo: mediaSchema,
    servicesTitle: localeTextSchema,
    servicesCopy: localeTextSchema,
    servicesCta: localeTextSchema,
    servicesTags: z.array(localeTextSchema).default([]),
    servicesBadgeLabel: localeTextSchema,
    servicesCardCta: localeTextSchema,
    projectsTitle: localeTextSchema,
    projectsDescription: localeTextSchema,
    projectsTags: z.array(localeTextSchema).default([]),
    projectsBadgeLabel: localeTextSchema,
    projectsCardCta: localeTextSchema,
    projectsImageAlt: localeTextSchema,
    projectsCta: localeTextSchema,
    clientsTitle: localeTextSchema,
    clientsWebsiteLabel: localeTextSchema,
    contactCta: localeTextSchema,
  }),
  servicesPage: z.object({
    title: localeTextSchema,
    copy: localeTextSchema,
    ctaLabel: localeTextSchema,
    chips: z.array(localeTextSchema).default([]),
    outcomesLabel: localeTextSchema,
    quickMapLabel: localeTextSchema,
    highlightPrimaryLabel: localeTextSchema,
    highlightSecondaryLabel: localeTextSchema,
    sessionTitle: localeTextSchema,
    sessionCopy: localeTextSchema,
    talkCtaLabel: localeTextSchema,
    backToTopLabel: localeTextSchema,
    imageAlt: localeTextSchema,
  }),
  projectsPage: z.object({
    title: localeTextSchema,
    copy: localeTextSchema,
    filterAllLabel: localeTextSchema,
    emptyState: localeTextSchema,
    cardCta: localeTextSchema,
    ctaTitle: localeTextSchema,
    ctaDescription: localeTextSchema,
    ctaAction: localeTextSchema,
  }),
  clientsPage: z.object({
    title: localeTextSchema,
    copy: localeTextSchema,
    imageAlt: localeTextSchema,
    websiteLabel: localeTextSchema,
  }),
  contact: z.object({
    title: localeTextSchema,
    copy: localeTextSchema,
    email: z.string().email(),
    preparation: z.array(localeTextSchema).default([]),
    bookCallTitle: localeTextSchema,
    bookCallCopy: localeTextSchema,
    bookCallCta: localeTextSchema,
    preparationTitle: localeTextSchema,
    formTitle: localeTextSchema,
    formSubtitle: localeTextSchema,
    successLabel: localeTextSchema,
    nameLabel: localeTextSchema,
    emailLabel: localeTextSchema,
    organizationLabel: localeTextSchema,
    phoneLabel: localeTextSchema,
    subjectLabel: localeTextSchema,
    messageLabel: localeTextSchema,
    submitLabel: localeTextSchema,
    sendingLabel: localeTextSchema,
    moreContactTitle: localeTextSchema,
    moreContactLabel: localeTextSchema,
    moreContactNote: localeTextSchema,
    imageAlt: localeTextSchema,
  }),
  footer: z.object({
    tagline: localeTextSchema,
    adminLabel: localeTextSchema,
    instagramLabel: localeTextSchema,
    instagramUrl: z.string().url().optional(),
    facebookLabel: localeTextSchema,
    facebookUrl: z.string().url().optional(),
    linkedinLabel: localeTextSchema,
    linkedinUrl: z.string().url().optional(),
  }),
  services: z.array(serviceSchema).min(1),
});

export const sitePayloadSchema = siteCopySchema;
