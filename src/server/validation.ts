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

export const projectCategorySchema = z.enum([
  "museografia",
  "experiencias-digitales",
  "branding",
]);

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
  client: localizedValueSchema,
  location: localizedValueSchema,
  cover: projectImageSchema,
  gallery: z.array(projectImageSchema).optional(),
  video: projectVideoSchema,
  description: z.array(localeTextSchema).min(1),
  meta: z.array(projectMetaSchema).optional(),
  entities: z.array(z.string().min(1)).optional(),
  order: z.number().int().optional(),
});
