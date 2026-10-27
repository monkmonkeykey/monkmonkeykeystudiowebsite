import { z } from "zod";
import type { LocaleText } from "@/lib/i18n";

export type ArtisticAuthor = { name: string; role?: LocaleText };
export type AdditionalCredit = { name: string; role: LocaleText };

export type ProjectCredits = {
  artisticAuthorship?: ArtisticAuthor[];
  studioContribution?: LocaleText;
  additionalCredits?: AdditionalCredit[];
};

// Null explicitly clears the studio text. Omitted fields leave stored values alone.
export type ProjectCreditsPayload = Omit<ProjectCredits, "studioContribution"> & {
  studioContribution?: LocaleText | null;
};

const optionalBilingualText = z.object({
  es: z.string().trim(),
  en: z.string().trim(),
}).superRefine((value, context) => {
  if (value.es || value.en) {
    if (!value.es) context.addIssue({ code: "custom", path: ["es"], message: "Completa la versión en español." });
    if (!value.en) context.addIssue({ code: "custom", path: ["en"], message: "Completa la versión en inglés." });
  }
});

const nameSchema = z.string({ error: "Escribe el nombre de la persona o colectivo." })
  .trim().min(1, "Escribe el nombre de la persona o colectivo.");

export const projectCreditsSchema = z.object({
  artisticAuthorship: z.array(z.object({
    name: nameSchema,
    role: optionalBilingualText.transform((value) => value.es ? value : undefined).optional(),
  }).transform(({ name, role }) => role ? { name, role } : { name })).optional(),
  studioContribution: optionalBilingualText.transform((value) => value.es ? value : null).nullable().optional(),
  additionalCredits: z.array(z.object({
    name: nameSchema,
    role: z.object({
      es: z.string({ error: "Escribe la función en español." }).trim().min(1, "Escribe la función en español."),
      en: z.string({ error: "Escribe la función en inglés." }).trim().min(1, "Escribe la función en inglés."),
    }, { error: "Escribe la función en español e inglés." }),
  })).optional(),
});

export const projectCreditFieldErrors = (issues: { path: PropertyKey[]; message: string }[]): Record<string, string> => {
  const errors: Record<string, string> = {};
  for (const issue of issues) {
    if (!["artisticAuthorship", "studioContribution", "additionalCredits"].includes(String(issue.path[0]))) continue;
    const path = issue.path.join(".");
    errors[path] ??= issue.message;
  }
  return errors;
};

export const normalizeProjectCredits = (value: ProjectCreditsPayload): ProjectCredits => {
  const result = projectCreditsSchema.parse({
    ...(value.artisticAuthorship !== undefined ? { artisticAuthorship: value.artisticAuthorship } : {}),
    ...(value.studioContribution !== undefined ? { studioContribution: value.studioContribution } : {}),
    ...(value.additionalCredits !== undefined ? { additionalCredits: value.additionalCredits } : {}),
  });
  const { studioContribution, ...lists } = result;
  return {
    ...lists,
    ...(studioContribution ? { studioContribution } : {}),
  };
};
