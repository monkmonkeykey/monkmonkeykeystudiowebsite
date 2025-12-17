import type { ClientImage } from "@/content/clients";
import type { LocaleText } from "@/lib/i18n";

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

export type ProjectCategory =
  | "museografia"
  | "experiencias-digitales"
  | "produccion-obra"
  | "branding";

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
  client: LocalizedValue;
  location: LocalizedValue;
  cover: ProjectGalleryImage;
  gallery: ProjectGalleryImage[];
  video?: ProjectVideo;
  description: LocaleText[];
  meta: { label: LocaleText; value: LocalizedValue }[];
  entities: ProjectEntity[];
};
