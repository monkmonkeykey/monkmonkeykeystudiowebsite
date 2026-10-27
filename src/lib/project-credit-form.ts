import type { LocaleText } from "@/lib/i18n";
import { projectCreditsSchema, projectCreditFieldErrors, type ProjectCredits } from "@/domain/project-credits";

// IDs exist only in the editor, to retain the correct input/focus when reordering.
export type ProjectCreditEntryDraft = { id: string; name: string; role: LocaleText };
export type ProjectCreditsDraft = {
  artisticAuthorship: ProjectCreditEntryDraft[];
  studioContribution: LocaleText;
  additionalCredits: ProjectCreditEntryDraft[];
};

export const createProjectCreditEntry = (entry?: { name: string; role?: LocaleText }): ProjectCreditEntryDraft => ({
  id: crypto.randomUUID(),
  name: entry?.name ?? "",
  role: { es: entry?.role?.es ?? "", en: entry?.role?.en ?? "" },
});

export const createProjectCreditsDraft = (project?: ProjectCredits): ProjectCreditsDraft => ({
  artisticAuthorship: (project?.artisticAuthorship ?? []).map(createProjectCreditEntry),
  studioContribution: { es: project?.studioContribution?.es ?? "", en: project?.studioContribution?.en ?? "" },
  additionalCredits: (project?.additionalCredits ?? []).map(createProjectCreditEntry),
});

export const validateProjectCreditsDraft = (draft: ProjectCreditsDraft) => {
  const result = projectCreditsSchema.safeParse({
    artisticAuthorship: draft.artisticAuthorship.map(({ name, role }) => ({ name, role })),
    studioContribution: draft.studioContribution,
    additionalCredits: draft.additionalCredits.map(({ name, role }) => ({ name, role })),
  });
  return result.success ? { success: true as const, data: result.data, errors: {} }
    : { success: false as const, errors: projectCreditFieldErrors(result.error.issues) };
};

export const moveProjectCredit = (entries: ProjectCreditEntryDraft[], index: number, direction: -1 | 1): ProjectCreditEntryDraft[] => {
  const target = index + direction;
  if (target < 0 || target >= entries.length) return entries;
  const next = [...entries];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
};
