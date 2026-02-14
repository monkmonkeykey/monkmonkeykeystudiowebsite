import type { LocaleText } from "@/lib/i18n";

export type Service = {
  slug: string;
  title: LocaleText;
  summary: LocaleText;
  outcomes: LocaleText[];
};

export const SERVICES: Service[] = [
  {
    slug: "estrategia-producto",
    title: {
      es: "Producción de Arte Digital",
      en: "Product strategy",
    },
    summary: {
      es: "Desarrollo y materialización de obras digitales. Abarcamos desde la conceptualización visual hasta la ejecución técnica, creando piezas que integran nuevas tecnologías y estéticas contemporáneas.",
      en: "We design actionable roadmaps aligned with business goals.",
    },
    outcomes: [
      {
        es: "Audio Espacial y Producción Multicanal",
        en: "Opportunity assessment and initiative prioritisation",
      },
      {
        es: "Definición de métricas de impacto y governance",
        en: "Impact metrics and governance definition",
      },
      {
        es: "Roadmaps trimestrales con entregables claros",
        en: "Quarterly roadmaps with clear deliverables",
      },
    ],
  },
  {
    slug: "diseno-ux-ui",
    title: {
      es: "Audio Espacial y Producción Multicanal",
      en: "UX/UI design",
    },
    summary: {
      es: "Diseño sonoro y producción técnica especializada para conciertos de música experimental y electroacústica. Gestionamos sistemas de audio inmersivo y difusión multicanal para crear experiencias auditivas envolventes.",
      en: "We craft accessible experiences grounded in user research.",
    },
    outcomes: [
      {
        es: "Investigación cualitativa y cuantitativa",
        en: "Qualitative and quantitative research",
      },
      {
        es: "Sistemas de diseño reutilizables",
        en: "Reusable design systems",
      },
      {
        es: "Prototipos testeados antes del desarrollo",
        en: "Tested prototypes before development",
      },
    ],
  },
  {
    slug: "experimentacion-growth",
    title: {
      es: "Taller de Impresión 3D y Fabricación",
      en: "Experimentation & growth",
    },
    summary: {
      es: "Impresión 3D por filamento. Producción de piezas funcionales y aplicaciones para obra artística e instalaciones. Contamos con capacidad de impresión multicolor y formatos de impresión de hasta 30 x 30 x 60cm.",
      en: "Impresión 3D por filamento. Producción de piezas funcionales y aplicaciones para obra artística e instalaciones. Contamos con capacidad de impresión multicolor y formatos de impresión de hasta 30 x 30 x 60cm.",
    },
    outcomes: [
      {
        es: "Producción de piezas funcionales y estructurales en distintos materiales",
        en: "Design and implementation of A/B tests",
      },
      {
        es: "Laboratorios de discovery continuo",
        en: "Continuous discovery labs",
      },
      {
        es: "Optimización recurrente de funnel y retención",
        en: "Recurring funnel and retention optimisation",
      },
    ],
  },
];
