import type { SiteCopy } from "@/domain/site";
import { SERVICES } from "@/content/services";

export const DEFAULT_SITE_CONTENT: SiteCopy = {
  home: {
    heroHeadline: {
      es: "Producción técnica audiovisual y desarrollo de obra con nuevos medios para el sector artístico y cultural.",
      en: "A strategic partner to scale your digital products",
    },
    heroSubtitle: {
      es: "Somos un estudio especializado en producción técnica audiovisual y nuevos medios, colaborando con museos, universidades y artistas en proyectos que integran arte, tecnología y experimentación. Contamos con experiencia en sistemas de audio multicanal, programación creativa y fabricación mediante impresión 3D.",
      en: "We combine strategy, design, and growth so every release matches your business goals.",
    },
    heroPrimaryCta: { es: "Contáctanos", en: "Book a call" },
    heroSecondaryCta: { es: "Ver proyectos", en: "View work" },
    heroTags: [
      { es: "Estudio creativo", en: "Creative studio" },
      { es: "Arte + tecnología", en: "Art + technology" },
      { es: "Instalaciones inmersivas", en: "Immersive setups" },
      { es: "Producción técnica", en: "Technical production" },
    ],
    servicesTitle: { es: "Cómo colaboramos", en: "How we collaborate" },
    servicesCopy: {
      es: "Seleccionamos squads a medida para cada etapa: desde validar oportunidades hasta acelerar productos en producción.",
      en: "We assemble the right squad for every stage—from validating opportunities to accelerating products in production.",
    },
    servicesCta: { es: "Ver todos los servicios", en: "See all services" },
    servicesTags: [
      { es: "Discovery a delivery", en: "Discovery to delivery" },
      { es: "Equipos extendidos", en: "Embedded squads" },
      { es: "Pruebas rápidas", en: "Rapid tests" },
    ],
    projectsTitle: { es: "Historias recientes", en: "Recent stories" },
    projectsCta: { es: "Ver proyectos", en: "Browse projects" },
    clientsTitle: { es: "Equipos que confían en nosotros", en: "Teams that trust us" },
    clientsWebsiteLabel: { es: "Abrir sitio", en: "Open site" },
    contactCta: { es: "Agenda una llamada", en: "Book a call" },
  },
  servicesPage: {
    title: { es: "Servicios y formatos de trabajo", en: "Services and collaboration formats" },
    copy: {
      es: "Cada engagement se adapta al momento de tu producto. Podemos sumarnos como task force temporal, equipo extendido o líderes de práctica.",
      en: "Each engagement adapts to your product stage. We can join as a temporary task force, extended team, or practice leads.",
    },
    ctaLabel: { es: "Agenda una llamada", en: "Book a call" },
    chips: [
      { es: "Discovery a ejecución", en: "Discovery to delivery" },
      { es: "Equipos extendidos", en: "Extended squads" },
      { es: "Pruebas rápidas", en: "Rapid experiments" },
    ],
    outcomesLabel: { es: "Entregables principales", en: "Key deliverables" },
  },
  contact: {
    title: { es: "Construyamos juntos", en: "Let’s build together" },
    copy: {
      es: "Cuéntanos sobre tu reto de producto y coordinemos una sesión exploratoria de 30 minutos.",
      en: "Tell us about your product challenge and we will schedule a 30-minute exploratory session.",
    },
    email: "hola@monkmonkeykey.com",
    preparation: [
      { es: "Contexto del producto y objetivos de negocio.", en: "Product context and business goals." },
      { es: "Estado actual del equipo y métricas disponibles.", en: "Current team setup and available metrics." },
      { es: "Hipótesis a validar y próximos hitos.", en: "Hypotheses to validate and upcoming milestones." },
    ],
  },
  services: SERVICES,
};
