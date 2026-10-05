import type { SiteCopy } from "@/domain/site";
import { SERVICES } from "@/content/services";

export const DEFAULT_SITE_CONTENT: SiteCopy = {
  navigation: {
    brand: { es: "monkmonkeykey.studio", en: "monkmonkeykey.studio" },
    homeLabel: { es: "Inicio", en: "Home" },
    servicesLabel: { es: "Servicios", en: "Services" },
    clientsLabel: { es: "Clientes", en: "Clients" },
    projectsLabel: { es: "Proyectos", en: "Work" },
    contactLabel: { es: "Contacto", en: "Contact" },
    openMenuLabel: { es: "Abrir menú", en: "Open menu" },
    closeMenuLabel: { es: "Cerrar menú", en: "Close menu" },
  },
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
    servicesTitle: { es: "Del concepto a la puesta en marcha", en: "From concept to activation" },
    servicesCopy: {
      es: "Integramos producción creativa y resolución técnica para materializar obras, instalaciones y experiencias en contextos reales.",
      en: "We combine creative production and technical execution to materialize artworks, installations, and experiences in real-world settings.",
    },
    servicesCta: { es: "Ver todos los servicios", en: "See all services" },
    servicesTags: [
      { es: "Concepto a montaje", en: "Concept to installation" },
      { es: "Producción integral", en: "End-to-end production" },
      { es: "Operación en sitio", en: "On-site operation" },
    ],
    servicesBadgeLabel: { es: "Servicios", en: "Services" },
    servicesCardCta: { es: "Ver formato", en: "View format" },
    projectsTitle: { es: "Trabajo seleccionado", en: "Selected work" },
    projectsDescription: {
      es: "Una selección de instalaciones, experiencias y producciones desarrolladas junto a artistas e instituciones.",
      en: "A selection of installations, experiences, and productions developed with artists and institutions.",
    },
    projectsTags: [
      { es: "Museos y universidades", en: "Museums & universities" },
      { es: "Experiencias inmersivas", en: "Immersive experiences" },
      { es: "Producción técnica", en: "Technical production" },
    ],
    projectsBadgeLabel: { es: "Proyectos", en: "Projects" },
    projectsCardCta: { es: "Ver más", en: "View more" },
    projectsImageAlt: {
      es: "Ilustración abstracta de tableros de proyecto",
      en: "Abstract illustration of project boards",
    },
    projectsCta: { es: "Ver proyectos", en: "Browse projects" },
    clientsTitle: { es: "Colaboraciones", en: "Collaborations" },
    clientsWebsiteLabel: { es: "Abrir sitio", en: "Open site" },
    contactCta: { es: "Agenda una llamada", en: "Book a call" },
  },
  servicesPage: {
    title: { es: "Capacidades y formas de trabajo", en: "Capabilities and ways of working" },
    copy: {
      es: "Cada proyecto requiere una combinación distinta de sensibilidad artística, conocimiento técnico y producción. Nos integramos desde la planeación hasta el montaje y la operación.",
      en: "Every project calls for a different combination of artistic sensitivity, technical expertise, and production. We join from planning through installation and operation.",
    },
    ctaLabel: { es: "Agenda una llamada", en: "Book a call" },
    chips: [
      { es: "Concepto a ejecución", en: "Concept to execution" },
      { es: "Equipos a la medida", en: "Project-specific teams" },
      { es: "Pruebas y prototipos", en: "Tests and prototypes" },
    ],
    outcomesLabel: { es: "Entregables principales", en: "Key deliverables" },
    quickMapLabel: { es: "Mapa rápido", en: "Quick map" },
    highlightPrimaryLabel: { es: "Planeación técnica", en: "Technical planning" },
    highlightSecondaryLabel: { es: "Equipo dedicado", en: "Dedicated team" },
    sessionTitle: { es: "Sesión inicial", en: "Kick-off session" },
    sessionCopy: {
      es: "Alineamos intención artística, alcance, espacio, tiempos y responsables.",
      en: "We align artistic intent, scope, space, timing, and responsibilities.",
    },
    talkCtaLabel: { es: "Hablar con el equipo", en: "Talk with the team" },
    backToTopLabel: { es: "Volver arriba", en: "Back to top" },
    imageSrc: "/images/services-visual.svg",
    imageAlt: { es: "Ilustración de servicio", en: "Service illustration" },
    gallery: [
      {
        src: "/images/services-visual.svg",
        alt: { es: "Ilustración de producción técnica", en: "Technical production illustration" },
      },
      {
        src: "/images/clients-visual.svg",
        alt: { es: "Ilustración de colaboración", en: "Collaboration illustration" },
      },
      {
        src: "/images/contact-visual.svg",
        alt: { es: "Ilustración de operación en sitio", en: "On-site operation illustration" },
      },
    ],
  },
  projectsPage: {
    title: { es: "Algunos proyectos", en: "Featured work" },
    copy: {
      es: "Obras e instalaciones desarrolladas junto a artistas, museos, universidades y organizaciones culturales.",
      en: "Works and installations developed with artists, museums, universities, and cultural organizations.",
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
  clientsPage: {
    title: { es: "Clientes y aliados", en: "Clients and partners" },
    copy: {
      es: "Colaboramos con artistas, instituciones culturales, universidades y equipos independientes para hacer posibles proyectos complejos.",
      en: "We collaborate with artists, cultural institutions, universities, and independent teams to make complex projects possible.",
    },
    imageSrc: "/images/clients-visual.svg",
    imageAlt: {
      es: "Ilustración abstracta de conexiones con clientes",
      en: "Abstract illustration of client connections",
    },
    websiteLabel: { es: "Visitar sitio", en: "Visit site" },
  },
  contact: {
    title: { es: "Construyamos juntos", en: "Let’s build together" },
    copy: {
      es: "Cuéntanos sobre la obra, instalación o experiencia que quieres desarrollar y conversemos sobre sus posibilidades técnicas.",
      en: "Tell us about the artwork, installation, or experience you want to develop, and let’s explore its technical possibilities.",
    },
    email: "hola@monkmonkeykey.com",
    preparation: [
      { es: "Intención artística, contexto y objetivos del proyecto.", en: "Artistic intent, context, and project goals." },
      { es: "Espacio, recursos técnicos y equipo involucrado.", en: "Space, technical resources, and team involved." },
      { es: "Fechas, restricciones y próximos hitos.", en: "Dates, constraints, and upcoming milestones." },
    ],
    bookCallTitle: { es: "Agenda una llamada", en: "Book a call" },
    bookCallCopy: {
      es: "Compartiremos disponibilidad en menos de 24 horas hábiles.",
      en: "We will share our availability within 24 business hours.",
    },
    bookCallCta: { es: "Escríbenos", en: "Write to us" },
    preparationTitle: { es: "Qué preparamos", en: "What we prepare" },
    formTitle: { es: "Escríbenos", en: "Send a message" },
    formSubtitle: { es: "Te responderemos en menos de un día hábil.", en: "We’ll reply within one business day." },
    successLabel: { es: "Enviado", en: "Sent" },
    nameLabel: { es: "Nombre", en: "Name" },
    emailLabel: { es: "Correo", en: "Email" },
    organizationLabel: { es: "Organización", en: "Organization" },
    phoneLabel: { es: "Teléfono", en: "Phone" },
    subjectLabel: { es: "Asunto", en: "Subject" },
    messageLabel: { es: "Mensaje", en: "Message" },
    submitLabel: { es: "Enviar mensaje", en: "Send message" },
    sendingLabel: { es: "Enviando...", en: "Sending..." },
    moreContactTitle: { es: "Más formas de contacto", en: "More ways to reach us" },
    moreContactLabel: { es: "Correo", en: "Email" },
    moreContactNote: {
      es: "Prefieres agendar? También puedes escribirnos para compartir detalles y coordinar una llamada.",
      en: "Prefer to schedule? Share details here and we’ll coordinate a call.",
    },
    imageSrc: "/images/contact-visual.svg",
    imageAlt: {
      es: "Ilustración abstracta de una reunión de trabajo",
      en: "Abstract illustration of a working session",
    },
  },
  footer: {
    tagline: {
      es: "Producción artística y técnica para proyectos que integran tecnología, sonido y espacio.",
      en: "Creative and technical production for projects combining technology, sound, and space.",
    },
    adminLabel: { es: "Administrar sitio", en: "Manage site" },
    instagramLabel: { es: "Instagram · @monkmokeykey_studio", en: "Instagram · @monkmokeykey_studio" },
    instagramUrl: "https://www.instagram.com/monkmokeykey_studio/",
    facebookLabel: { es: "Facebook", en: "Facebook" },
    facebookUrl: "",
    linkedinLabel: { es: "LinkedIn", en: "LinkedIn" },
    linkedinUrl: "",
  },
  services: SERVICES,
};
