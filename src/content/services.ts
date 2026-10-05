import type { LocaleText } from "@/lib/i18n";

export type ServiceGalleryImage = {
  src: string;
  alt: LocaleText;
};

export type Service = {
  slug: string;
  title: LocaleText;
  summary: LocaleText;
  outcomes: LocaleText[];
  gallery?: ServiceGalleryImage[];
};

export const SERVICES: Service[] = [
  {
    slug: "estrategia-producto",
    title: {
      es: "Producción de Arte Digital",
      en: "Digital Art Production",
    },
    summary: {
      es: "Desarrollo y materialización de obras digitales. Abarcamos desde la conceptualización visual hasta la ejecución técnica, creando piezas que integran nuevas tecnologías y estéticas contemporáneas.",
      en: "Development and production of digital artworks, from visual conception to technical execution, integrating new technologies and contemporary aesthetics.",
    },
    outcomes: [
      {
        es: "Desarrollo de sistemas interactivos y audiovisuales",
        en: "Interactive and audiovisual system development",
      },
      {
        es: "Integración de hardware, software y contenido",
        en: "Hardware, software, and content integration",
      },
      {
        es: "Documentación, montaje y operación de la obra",
        en: "Artwork documentation, installation, and operation",
      },
    ],
    gallery: [
      {
        src: "/projects/atlas-experience-lab/cover.svg",
        alt: {
          es: "Montaje principal de obra digital",
          en: "Main digital artwork setup",
        },
      },
      {
        src: "/projects/atlas-experience-lab/gallery-1.svg",
        alt: {
          es: "Detalle técnico de instalación",
          en: "Technical installation detail",
        },
      },
      {
        src: "/projects/atlas-experience-lab/gallery-2.svg",
        alt: {
          es: "Espacio expositivo con visuales",
          en: "Exhibition space with visuals",
        },
      },
    ],
  },
  {
    slug: "diseno-ux-ui",
    title: {
      es: "Audio Espacial y Producción Multicanal",
      en: "Spatial Audio and Multichannel Production",
    },
    summary: {
      es: "Diseño sonoro y producción técnica especializada para conciertos de música experimental y electroacústica. Gestionamos sistemas de audio inmersivo y difusión multicanal para crear experiencias auditivas envolventes.",
      en: "Specialized sound design and technical production for experimental and electroacoustic music, with immersive and multichannel audio systems.",
    },
    outcomes: [
      {
        es: "Diseño sonoro y espacialización",
        en: "Sound design and spatialization",
      },
      {
        es: "Diseño, ajuste y calibración de sistemas multicanal",
        en: "Multichannel system design, tuning, and calibration",
      },
      {
        es: "Producción y operación técnica de conciertos",
        en: "Concert production and technical operation",
      },
    ],
    gallery: [
      {
        src: "/projects/museo-banco-mexico/cover.svg",
        alt: {
          es: "Escenario sonoro en museo",
          en: "Museum sound stage",
        },
      },
      {
        src: "/projects/museo-banco-mexico/gallery-1.svg",
        alt: {
          es: "Sistema de audio multicanal",
          en: "Multichannel audio system",
        },
      },
      {
        src: "/projects/museo-banco-mexico/gallery-3.svg",
        alt: {
          es: "Ajustes técnicos en sala",
          en: "Technical adjustments onsite",
        },
      },
    ],
  },
  {
    slug: "experimentacion-growth",
    title: {
      es: "Taller de Impresión 3D y Fabricación",
      en: "3D Printing and Fabrication Workshop",
    },
    summary: {
      es: "Soluciones de materialización física. Ofrecemos servicios de impresión 3D para prototipado, creación de piezas artísticas y modelado, llevando tus ideas del plano digital al objeto tangible.",
      en: "Physical production solutions for prototyping, artistic pieces, and modeling, taking ideas from digital files to tangible objects.",
    },
    outcomes: [
      {
        es: "Modelado y preparación de archivos para fabricación",
        en: "Modeling and file preparation for fabrication",
      },
      {
        es: "Prototipado y producción de piezas",
        en: "Prototyping and part production",
      },
      {
        es: "Pruebas de material, ensamble y acabados",
        en: "Material testing, assembly, and finishing",
      },
    ],
    gallery: [
      {
        src: "/projects/loop-brand-labs/cover.svg",
        alt: {
          es: "Prototipo físico impreso en 3D",
          en: "3D printed physical prototype",
        },
      },
      {
        src: "/projects/loop-brand-labs/gallery-1.svg",
        alt: {
          es: "Piezas impresas para obra",
          en: "Printed pieces for artwork",
        },
      },
      {
        src: "/projects/loop-brand-labs/gallery-2.svg",
        alt: {
          es: "Iteración de modelos en taller",
          en: "Workshop model iterations",
        },
      },
    ],
  },
];
