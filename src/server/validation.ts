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

export const siteCopySchema = z.object({
  home: z.object({
    heroHeadline: localeTextSchema,
    heroSubtitle: localeTextSchema,
    heroPrimaryCta: localeTextSchema,
    heroSecondaryCta: localeTextSchema,
    heroTags: z.array(localeTextSchema).default([]),
    servicesTitle: localeTextSchema,
    servicesCopy: localeTextSchema,
    servicesCta: localeTextSchema,
    servicesTags: z.array(localeTextSchema).default([]),
    projectsTitle: localeTextSchema,
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
  }),
  contact: z.object({
    title: localeTextSchema,
    copy: localeTextSchema,
    email: z.string().email(),
    preparation: z.array(localeTextSchema).default([]),
  }),
  services: z.array(serviceSchema).min(1),
});

export const sitePayloadSchema = siteCopySchema;
