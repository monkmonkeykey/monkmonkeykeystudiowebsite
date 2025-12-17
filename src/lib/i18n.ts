export type Locale = "es" | "en";

export type LocaleText = Record<Locale, string>;

export const AVAILABLE_LOCALES: { code: Locale; label: string }[] = [
  { code: "es", label: "ES" },
  { code: "en", label: "EN" },
];

export const translate = (locale: Locale, value: LocaleText): string => value[locale];
