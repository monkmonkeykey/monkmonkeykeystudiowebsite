import type { LocaleText } from "@/lib/i18n";

export type NavigationItem = {
  href: string;
  label: LocaleText;
};

export const NAVIGATION: NavigationItem[] = [
  { href: "/", label: { es: "Inicio", en: "Home" } },
  { href: "/servicios", label: { es: "Servicios", en: "Services" } },
  { href: "/clientes", label: { es: "Clientes", en: "Clients" } },
  { href: "/proyectos", label: { es: "Proyectos", en: "Work" } },
  { href: "/contacto", label: { es: "Contacto", en: "Contact" } },
];
