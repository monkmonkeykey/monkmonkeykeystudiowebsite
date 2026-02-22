import { z } from "zod";

export const localeTextSchema = z.object({
  es: z.string().min(1),
  en: z.string().min(1),
});

const siteLocaleTextSchema = z.object({
  es: z.string(),
  en: z.string(),
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
    brand: siteLocaleTextSchema,
    homeLabel: siteLocaleTextSchema,
    servicesLabel: siteLocaleTextSchema,
    clientsLabel: siteLocaleTextSchema,
    projectsLabel: siteLocaleTextSchema,
    contactLabel: siteLocaleTextSchema,
    openMenuLabel: siteLocaleTextSchema,
    closeMenuLabel: siteLocaleTextSchema,
  }),
  home: z.object({
    heroHeadline: siteLocaleTextSchema,
    heroSubtitle: siteLocaleTextSchema,
    heroPrimaryCta: siteLocaleTextSchema,
    heroSecondaryCta: siteLocaleTextSchema,
    heroTags: z.array(siteLocaleTextSchema).default([]),
    heroVideo: mediaSchema,
    servicesTitle: siteLocaleTextSchema,
    servicesCopy: siteLocaleTextSchema,
    servicesCta: siteLocaleTextSchema,
    servicesTags: z.array(siteLocaleTextSchema).default([]),
    servicesBadgeLabel: siteLocaleTextSchema,
    servicesCardCta: siteLocaleTextSchema,
    projectsTitle: siteLocaleTextSchema,
    projectsDescription: siteLocaleTextSchema,
    projectsTags: z.array(siteLocaleTextSchema).default([]),
    projectsBadgeLabel: siteLocaleTextSchema,
    projectsCardCta: siteLocaleTextSchema,
    projectsImageAlt: siteLocaleTextSchema,
    projectsCta: siteLocaleTextSchema,
    clientsTitle: siteLocaleTextSchema,
    clientsWebsiteLabel: siteLocaleTextSchema,
    contactCta: siteLocaleTextSchema,
  }),
  servicesPage: z.object({
    title: siteLocaleTextSchema,
    copy: siteLocaleTextSchema,
    ctaLabel: siteLocaleTextSchema,
    chips: z.array(siteLocaleTextSchema).default([]),
    outcomesLabel: siteLocaleTextSchema,
    quickMapLabel: siteLocaleTextSchema,
    highlightPrimaryLabel: siteLocaleTextSchema,
    highlightSecondaryLabel: siteLocaleTextSchema,
    sessionTitle: siteLocaleTextSchema,
    sessionCopy: siteLocaleTextSchema,
    talkCtaLabel: siteLocaleTextSchema,
    backToTopLabel: siteLocaleTextSchema,
    imageSrc: z.string().min(1).optional(),
    imageAlt: siteLocaleTextSchema,
    gallery: z
      .array(
        z.object({
          src: z.string().min(1),
          alt: siteLocaleTextSchema,
        }),
      )
      .default([]),
  }),
  projectsPage: z.object({
    title: siteLocaleTextSchema,
    copy: siteLocaleTextSchema,
    filterAllLabel: siteLocaleTextSchema,
    emptyState: siteLocaleTextSchema,
    cardCta: siteLocaleTextSchema,
    ctaTitle: siteLocaleTextSchema,
    ctaDescription: siteLocaleTextSchema,
    ctaAction: siteLocaleTextSchema,
  }),
  clientsPage: z.object({
    title: siteLocaleTextSchema,
    copy: siteLocaleTextSchema,
    imageSrc: z.string().min(1).optional(),
    imageAlt: siteLocaleTextSchema,
    websiteLabel: siteLocaleTextSchema,
  }),
  contact: z.object({
    title: siteLocaleTextSchema,
    copy: siteLocaleTextSchema,
    email: z.string().email(),
    preparation: z.array(siteLocaleTextSchema).default([]),
    bookCallTitle: siteLocaleTextSchema,
    bookCallCopy: siteLocaleTextSchema,
    bookCallCta: siteLocaleTextSchema,
    preparationTitle: siteLocaleTextSchema,
    formTitle: siteLocaleTextSchema,
    formSubtitle: siteLocaleTextSchema,
    successLabel: siteLocaleTextSchema,
    nameLabel: siteLocaleTextSchema,
    emailLabel: siteLocaleTextSchema,
    organizationLabel: siteLocaleTextSchema,
    phoneLabel: siteLocaleTextSchema,
    subjectLabel: siteLocaleTextSchema,
    messageLabel: siteLocaleTextSchema,
    submitLabel: siteLocaleTextSchema,
    sendingLabel: siteLocaleTextSchema,
    moreContactTitle: siteLocaleTextSchema,
    moreContactLabel: siteLocaleTextSchema,
    moreContactNote: siteLocaleTextSchema,
    imageSrc: z.string().min(1).optional(),
    imageAlt: siteLocaleTextSchema,
  }),
  footer: z.object({
    tagline: siteLocaleTextSchema,
    adminLabel: siteLocaleTextSchema,
    instagramLabel: siteLocaleTextSchema,
    instagramUrl: z.string().url().optional(),
    facebookLabel: siteLocaleTextSchema,
    facebookUrl: z.string().url().optional(),
    linkedinLabel: siteLocaleTextSchema,
    linkedinUrl: z.string().url().optional(),
  }),
  services: z.array(serviceSchema).min(1),
});

export const sitePayloadSchema = siteCopySchema;
