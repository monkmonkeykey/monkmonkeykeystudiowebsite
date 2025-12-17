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
      es: "Estrategia de producto",
      en: "Product strategy",
    },
    summary: {
      es: "Diseñamos hojas de ruta accionables alineadas con los objetivos del negocio.",
      en: "We design actionable roadmaps aligned with business goals.",
    },
    outcomes: [
      {
        es: "Diagnóstico de oportunidades y priorización de iniciativas",
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
      es: "Diseño UX/UI",
      en: "UX/UI design",
    },
    summary: {
      es: "Creamos experiencias accesibles basadas en investigación con usuarios.",
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
      es: "Experimentación y growth",
      en: "Experimentation & growth",
    },
    summary: {
      es: "Validamos hipótesis con experimentos rápidos y mediciones continuas.",
      en: "We validate hypotheses with rapid experiments and continuous measurement.",
    },
    outcomes: [
      {
        es: "Diseño e implementación de experimentos A/B",
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
