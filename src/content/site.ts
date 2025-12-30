import type { SiteCopy } from "@/domain/site";
import { SERVICES } from "@/content/services";

export const DEFAULT_SITE_CONTENT: SiteCopy = {
  home: {
    heroHeadline: {
      es: "Producción técnica audiovisual y desarrollo de obra con nuevos medios para el sector artístico y cultural.",
      en: "Technical production and new-media execution for the arts and cultural sector.",
    },
    heroSubtitle: {
      es: "monkmonkeykey estudio es un estudio de producción creativa y técnica especializado en obras de arte con nuevos medios, experiencias interactivas y conciertos de música experimental.\n\nTrabajamos con artistas, instituciones culturales y académicas para desarrollar proyectos que integran tecnología, sonido y espacio, desde la concepción técnica hasta la implementación, operación y puesta en funcionamiento.\n\nCon base en la Ciudad de México, colaboramos en proyectos a nivel nacional e internacional, tanto en montajes presenciales como en implementaciones remotas cuando la naturaleza de la obra lo permite.\n\nNuestro enfoque parte del arte, pero se sostiene en la producción: resolver, materializar y hacer que las ideas funcionen en contextos reales.",
      en: "monkmonkeykey estudio is a creative and technical production studio focused on new-media artworks, interactive experiences, and experimental music performances.\n\nWe partner with artists, cultural institutions, and academia to craft projects that merge technology, sound, and space—from technical conception through implementation, operation, and go-live.\n\nBased in Mexico City, we collaborate on projects across Mexico and internationally, on-site when needed or remotely when the work allows.\n\nOur perspective starts from art but is grounded in production: solving, materializing, and making ideas work in real contexts.",
    },
    heroPrimaryCta: { es: "Contáctanos", en: "Book a call" },
    heroSecondaryCta: { es: "Ver proyectos", en: "View work" },
    heroTags: [],
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
  projectsPage: {
    title: { es: "Algunos proyectos", en: "Featured work" },
    copy: {
      es: "Casos en los que acompañamos a equipos de producto, museografía y marcas para desplegar experiencias memorables.",
      en: "Projects where we partner with product, museography, and brand teams to deploy memorable experiences.",
    },
    filterAllLabel: { es: "Todos", en: "All" },
    emptyState: {
      es: "No hay proyectos para esta categoría todavía.",
      en: "There are no projects for this category yet.",
    },
    cardCta: { es: "Ver", en: "View" },
    ctaTitle: { es: "¿Listo para crear algo memorable?", en: "Ready to create something memorable?" },
    ctaDescription: {
      es: "Agendemos una llamada para entender tus objetivos y armar un plan a medida.",
      en: "Let’s schedule a call to learn about your goals and craft a tailored plan together.",
    },
    ctaAction: { es: "Agenda una llamada", en: "Book a call" },
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
