import type { LocaleText } from "@/lib/i18n";

export const PROJECT_EDITORIAL_LABELS = {
  about: { es: "Sobre el proyecto", en: "About the project" },
  authorship: { es: "Autoría artística", en: "Artistic authorship" },
  contribution: { es: "Participación de monkmonkeykey", en: "monkmonkeykey’s contribution" },
  additionalCredits: { es: "Créditos adicionales", en: "Additional credits" },
  location: { es: "Lugar", en: "Location" },
  client: { es: "Cliente / institución", en: "Client / institution" },
} satisfies Record<string, LocaleText>;

export type ProjectEditorialLabel = keyof typeof PROJECT_EDITORIAL_LABELS;
export type ProjectEditorialPresentation = {
  visible?: boolean;
  showHeading?: boolean;
  labels?: Partial<Record<ProjectEditorialLabel, LocaleText>>;
};

export const projectEditorialLabel = (presentation: ProjectEditorialPresentation | undefined, key: ProjectEditorialLabel): LocaleText => ({
  es: presentation?.labels?.[key]?.es.trim() || PROJECT_EDITORIAL_LABELS[key].es,
  en: presentation?.labels?.[key]?.en.trim() || PROJECT_EDITORIAL_LABELS[key].en,
});
