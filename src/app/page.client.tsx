"use client";

import Image from "next/image";
import Link from "next/link";

import type { Client } from "@/content/clients";
import type {
  LocalizedValue,
  Project,
  ProjectCategory,
} from "@/domain/projects";
import type { Service } from "@/content/services";
import { translate, type Locale, type LocaleText } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";

type HomePageClientProps = {
  projects: Project[];
  clients: Client[];
  services: Service[];
  categoryLabels: Record<ProjectCategory, LocaleText>;
};

const HERO_HEADLINE = {
  es: "Producción técnica audiovisual y desarrollo de obra con nuevos medios para el sector artístico y cultural.",
  en: "A strategic partner to scale your digital products",
} as const;

const HERO_SUBTITLE = {
  es: "Somos un estudio especializado en producción técnica audiovisual y nuevos medios, colaborando con museos, universidades y artistas en proyectos que integran arte, tecnología y experimentación. Contamos con experiencia en sistemas de audio multicanal, programación creativa y fabricación mediante impresión 3D.",
  en: "We combine strategy, design, and growth so every release matches your business goals.",
} as const;

const HERO_PRIMARY = {
  es: "Contáctanos",
  en: "Book a call",
} as const;

const HERO_SECONDARY = {
  es: "Ver proyectos",
  en: "View work",
} as const;

const HOME_SERVICES_TITLE = {
  es: "Cómo colaboramos",
  en: "How we collaborate",
} as const;

const HOME_SERVICES_COPY = {
  es: "Seleccionamos squads a medida para cada etapa: desde validar oportunidades hasta acelerar productos en producción.",
  en: "We assemble the right squad for every stage—from validating opportunities to accelerating products in production.",
} as const;

const HOME_PROJECTS_TITLE = {
  es: "Historias recientes",
  en: "Recent stories",
} as const;

const HOME_CLIENTS_TITLE = {
  es: "Equipos que confían en nosotros",
  en: "Teams that trust us",
} as const;

const HOME_CLIENTS_WEBSITE = {
  es: "Abrir sitio",
  en: "Open site",
} as const;

const translateLocalizedValue = (locale: Locale, value: LocalizedValue): string =>
  typeof value === "string" ? value : value[locale];

export default function HomePageClient({
  projects,
  clients,
  services,
  categoryLabels,
}: HomePageClientProps) {
  const { locale } = useLocale();

  return (
    <div className="space-y-20">
      <section className="grid gap-10 lg:grid-cols-[1.05fr,0.95fr] lg:items-center">
        <div className="space-y-6">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
            {translate(locale, HERO_HEADLINE)}
          </h1>
          <p className="text-base text-foreground/70 sm:text-lg">
            {translate(locale, HERO_SUBTITLE)}
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/contacto"
              className="rounded-full bg-foreground px-5 py-2 text-sm font-semibold text-background transition hover:bg-foreground/90"
            >
              {translate(locale, HERO_PRIMARY)}
            </Link>
            <Link
              href="/proyectos"
              className="rounded-full border border-foreground/20 px-5 py-2 text-sm font-semibold text-foreground transition hover:border-foreground/40 hover:text-foreground/80"
            >
              {translate(locale, HERO_SECONDARY)}
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
          <Image
            src="/images/hero-visual.svg"
            alt={
              locale === "es"
                ? "Ilustración abstracta del flujo de trabajo de producto"
                : "Abstract illustration of a product workflow"
            }
            fill
            priority
            className="object-cover"
          />
          <div className="relative grid gap-4 p-6 text-sm text-foreground/80 sm:p-8">
            <div className="rounded-2xl bg-background/90 p-4 shadow-sm backdrop-blur">
              <p className="font-semibold">Discovery</p>
              <p className="mt-2 text-sm text-foreground/70">
                {locale === "es"
                  ? "Sumamos investigación rápida y workshops con tu equipo para entender el contexto desde el inicio."
                  : "We run rapid research and workshops with your team to understand context from day one."}
              </p>
            </div>
            <div className="rounded-2xl bg-background/90 p-4 shadow-sm backdrop-blur">
              <p className="font-semibold">Delivery</p>
              <p className="mt-2 text-sm text-foreground/70">
                {locale === "es"
                  ? "Trabajamos en ciclos cortos, con prototipos validados y métricas claras por sprint."
                  : "We work in short cycles, with validated prototypes and clear metrics each sprint."}
              </p>
            </div>
            <div className="rounded-2xl bg-background/90 p-4 shadow-sm backdrop-blur">
              <p className="font-semibold">Growth</p>
              <p className="mt-2 text-sm text-foreground/70">
                {locale === "es"
                  ? "Activamos experimentos de crecimiento y aprendizaje continuo para sostener resultados."
                  : "We activate growth experiments and continuous learning to sustain outcomes."}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {translate(locale, HOME_SERVICES_TITLE)}
            </h2>
            <p className="text-base text-foreground/70">
              {translate(locale, HOME_SERVICES_COPY)}
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
            <Image
              src="/images/services-visual.svg"
              alt={
                locale === "es"
                  ? "Ilustración abstracta de servicios colaborativos"
                  : "Abstract illustration of collaborative services"
              }
              fill
              className="object-cover"
            />
          </div>
        </header>
        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.slug}
              className="rounded-3xl border border-foreground/10 bg-background p-6 shadow-sm"
            >
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {locale === "es" ? "Servicio" : "Service"}
                </span>
                <h3 className="text-xl font-semibold text-foreground">
                  {translate(locale, service.title)}
                </h3>
                <p className="text-sm text-foreground/70">
                  {translate(locale, service.summary)}
                </p>
              </div>
              <ul className="mt-6 space-y-2 text-sm text-foreground/70">
                {service.outcomes.map((outcome, index) => (
                  <li key={`${service.slug}-outcome-${index}`} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-foreground/50" />
                    <span>{translate(locale, outcome)}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {translate(locale, HOME_PROJECTS_TITLE)}
            </h2>
            <p className="text-base text-foreground/70">
              {locale === "es"
                ? "Casos recientes donde acompañamos lanzamientos y activaciones clave."
                : "Recent cases where we supported key launches and activations."}
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
            <Image
              src="/images/projects-visual.svg"
              alt={
                locale === "es"
                  ? "Ilustración abstracta de tableros de proyecto"
                  : "Abstract illustration of project boards"
              }
              fill
              className="object-cover"
            />
          </div>
        </header>
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.slice(0, 2).map((project) => (
            <article
              key={project.slug}
              className="flex h-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-background shadow-sm"
            >
              <div className="relative aspect-[16/9] w-full overflow-hidden border-b border-foreground/10 bg-foreground/5">
                {project.video ? (
                  <iframe
                    src={project.video.embedUrl}
                    title={translate(locale, project.video.title)}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    className="absolute inset-0 h-full w-full"
                  />
                ) : (
                  <Image
                    src={project.cover.src}
                    alt={translate(locale, project.cover.alt)}
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                    {translateLocalizedValue(locale, project.client)}
                  </p>
                  <span className="inline-flex items-center rounded-full border border-foreground/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-foreground/50">
                    {project.year}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">
                  {translate(locale, project.name)}
                </h3>
                <p className="text-sm text-foreground/70">
                  {translate(locale, project.subtitle)}
                </p>
                <p className="text-sm text-foreground/70">
                  {translate(locale, project.description[0])}
                </p>
                <div className="mt-2 flex flex-wrap gap-2 text-xs text-foreground/60">
                  {project.categories.map((category) => (
                    <span
                      key={`${project.slug}-cat-${category}`}
                      className="rounded-full border border-foreground/10 px-3 py-1"
                    >
                      {translate(locale, categoryLabels[category])}
                    </span>
                  ))}
                </div>
                <div className="mt-auto pt-4">
                  <span className="text-xs uppercase tracking-[0.2em] text-foreground/40">
                    {translateLocalizedValue(locale, project.location)}
                  </span>
                </div>
              </div>
              <div className="border-t border-foreground/10 bg-foreground/5 px-6 py-4">
                <Link
                  href={`/proyectos/${project.slug}`}
                  className="text-sm font-semibold text-foreground/80 transition hover:text-foreground"
                >
                  {locale === "es" ? "Ver caso completo" : "Read full case"}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <header className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {translate(locale, HOME_CLIENTS_TITLE)}
            </h2>
            <p className="text-base text-foreground/70">
              {locale === "es"
                ? "Colaboramos con equipos de producto, innovación y data en toda Latinoamérica y Europa."
                : "We collaborate with product, innovation, and data teams across Latin America and Europe."}
            </p>
          </div>
          <div className="relative aspect-[4/3] w-full max-w-sm overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
            <Image
              src="/images/clients-visual.svg"
              alt={
                locale === "es"
                  ? "Ilustración abstracta de una red de clientes"
                  : "Abstract illustration of a client network"
              }
              fill
              className="object-cover"
            />
          </div>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {clients.map((client) => (
            <article
              key={client.slug}
              className="flex h-full flex-col gap-4 rounded-2xl border border-foreground/10 bg-background/80 p-4 shadow-sm"
            >
              {client.image && (
                <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-foreground/10 bg-foreground/5">
                  <Image
                    src={client.image.src}
                    alt={translate(locale, client.image.alt)}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground/80">{client.name}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                  {translate(locale, client.sector)}
                </p>
              </div>
              <p className="text-sm text-foreground/70">
                {translate(locale, client.summary)}
              </p>
              {client.website && (
                <a
                  href={client.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex w-fit items-center gap-2 text-xs font-semibold text-foreground/70 transition hover:text-foreground"
                >
                  <span>{translate(locale, HOME_CLIENTS_WEBSITE)}</span>
                  <span aria-hidden>↗</span>
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
