import type { ClientImage } from "@/content/clients";
import type { Locale, LocaleText } from "@/lib/i18n";

export type LocalizedValue = string | LocaleText;

export type ProjectGalleryImage = {
  src: string;
  alt: LocaleText;
  footnote?: LocaleText;
};

export type ProjectVideoProvider = "youtube" | "vimeo";

export type ProjectVideo = {
  url: string;
  provider: ProjectVideoProvider;
  embedUrl: string;
  title: LocaleText;
};

export type ProjectEntity = {
  slug: string;
  name: string;
  summary: LocaleText;
  sector: LocaleText;
  website?: string;
  image?: ClientImage;
};

export type ProjectCategory = string;

export const PROJECT_CATEGORY_LABELS: Record<ProjectCategory, LocaleText> = {
  museografia: {
    es: "Museografía",
    en: "Museography",
  },
  "experiencias-digitales": {
    es: "Experiencias digitales",
    en: "Digital experiences",
  },
  "produccion-obra": {
    es: "Producción de obra de arte",
    en: "Production of artwork",
  },
  branding: {
    es: "Branding",
    en: "Branding",
  },
};

export type Project = {
  slug: string;
  name: LocaleText;
  subtitle: LocaleText;
  categories: ProjectCategory[];
  year: string;
  startYear?: number;
  endYear?: number;
  client: LocalizedValue;
  location: LocalizedValue;
  cover: ProjectGalleryImage;
  gallery: ProjectGalleryImage[];
  video?: ProjectVideo;
  description: LocaleText[];
  meta: { label: LocaleText; value: LocalizedValue }[];
  entities: ProjectEntity[];
  isPrivate?: boolean;
};

export const formatProjectTimeline = (project: Project): string => {
  if (project.startYear && project.endYear) {
    return `${project.startYear} – ${project.endYear}`;
  }

  if (project.startYear) {
    return `${project.startYear}${project.endYear ? ` – ${project.endYear}` : ""}`;
  }

  return project.year;
};

const capitalizeWords = (value: string): string =>
  value.replace(/\b(\w)/g, (match) => match.toUpperCase());

const humanizeCategory = (category: string): string => {
  const normalized = category.trim().replace(/[-_]+/g, " ");

  if (!normalized) {
    return category;
  }

  return capitalizeWords(normalized);
};

export const translateCategoryLabel = (
  locale: Locale,
  category: ProjectCategory,
  labels: Record<ProjectCategory, LocaleText> = PROJECT_CATEGORY_LABELS,
): string => {
  const label = labels[category];

  if (label) {
    return label[locale];
  }

  return humanizeCategory(category);
};
