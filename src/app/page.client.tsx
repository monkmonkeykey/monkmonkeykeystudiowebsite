"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { Client } from "@/content/clients";
import type { Service } from "@/content/services";
import { useLocale } from "@/components/site/locale-context";
import { getPlainText } from "@/components/site/rich-text";
import type { Project, ProjectCategory } from "@/domain/projects";
import { formatProjectTimeline, translateCategoryLabel } from "@/domain/projects";
import type { SiteContent } from "@/domain/site";
import { translate, type LocaleText } from "@/lib/i18n";
import styles from "./home.module.css";

type HomePageClientProps = {
  projects: Project[];
  heroProjects: Project[];
  clients: Client[];
  services: Service[];
  siteContent: SiteContent;
  categoryLabels: Record<ProjectCategory, LocaleText>;
};

// Home-only editorial copy; stored project, service and collaborator content stays intact.
const copy = {
  label: { es: "Estudio de producción artística", en: "Artistic production studio" },
  title: { es: "Cada proyecto encuentra su forma.", en: "Every project finds its form." },
  description: {
    es: "Colaboramos con artistas e instituciones para desarrollar obras y experiencias que integran sonido, tecnología y nuevos medios.",
    en: "We collaborate with artists and institutions to develop works and experiences that bring together sound, technology, and new media.",
  },
  explore: { es: "Explorar proyectos", en: "Explore projects" },
  projects: { es: "Proyectos seleccionados", en: "Selected projects" },
  archive: { es: "Ver todos los proyectos", en: "View all projects" },
  practice: { es: "Nuestra práctica", en: "Our practice" },
  practiceTitle: { es: "Distintas ideas, distintas maneras de hacer.", en: "Different ideas, different ways of making." },
  practiceCopy: {
    es: "Cada colaboración empieza por escuchar. Nos interesa comprender la intención de cada artista y explorar, en conjunto, las posibilidades de su proyecto.",
    en: "Every collaboration begins with listening. We seek to understand each artist’s intention and explore the possibilities of their project together.",
  },
  practiceDetail: {
    es: "Desde el sonido y las experiencias interactivas hasta la producción de obra, combinamos experimentación y trabajo técnico para acompañar las ideas hasta su materialización. Trabajamos desde la Ciudad de México, en diálogo con distintas prácticas y contextos.",
    en: "From sound and interactive experiences to artwork production, we combine experimentation and technical work to help ideas take shape. Based in Mexico City, we work in dialogue with different practices and contexts.",
  },
  services: { es: "Capacidades y servicios", en: "Capabilities and services" },
  serviceLink: { es: "Ver servicio", en: "View service" },
  collaborations: { es: "Colaboraciones", en: "Collaborations" },
  collaboratorsCopy: {
    es: "Artistas, instituciones y equipos con quienes hemos compartido ideas y hecho posibles proyectos en distintos contextos.",
    en: "Artists, institutions, and teams with whom we have shared ideas and brought projects to life across different contexts.",
  },
};

// English presentation of the existing service summaries, scoped to Home.
// CMS records and destinations remain unchanged.
const serviceEnglish: Record<string, { title: string; summary: string }> = {
  audio: {
    title: "Sound and technical production for concerts",
    summary: "Audio equipment and backline rental, with technical production for experimental and electroacoustic music concerts and cultural events.",
  },
  "arte-nuevos-medios": {
    title: "Art and new media production",
    summary: "Production of artworks using digital technologies, interactive systems, and electronic devices.",
  },
  impresion3d: {
    title: "3D printing",
    summary: "Filament 3D printing for functional parts, artworks, and installations, with multicolour options and formats up to 30 × 30 × 60 cm.",
  },
};

const homeCategoryEnglish: Record<string, string> = {
  "audio-multicanal": "Multichannel audio",
  "produccion-tecnica": "Technical production",
};

export default function HomePageClient({ projects, heroProjects, clients, services, categoryLabels }: HomePageClientProps) {
  const { locale } = useLocale();
  const text = (value: LocaleText) => getPlainText(translate(locale, value));
  const [activeVideo, setActiveVideo] = useState<string | null>(null);
  const heroSlugs = new Set(heroProjects.map((project) => project.slug));
  const remainingProjects = projects.filter((project) => !heroSlugs.has(project.slug));
  // Keep the next section's existing order and design; avoid repeats where possible.
  const selectedProjects = remainingProjects.length ? remainingProjects.slice(0, 5) : projects.slice(0, 5);
  const timeline = (project: Project) => project.startYear && project.startYear === project.endYear
    ? String(project.startYear)
    : formatProjectTimeline(project);
  const imageAlt = (alt: LocaleText, project: Project) => {
    const description = text(alt);
    return /[\p{L}\p{N}]/u.test(description)
      ? description
      : `${locale === "es" ? "Registro del proyecto" : "Project documentation"}: ${text(project.name)}`;
  };
  const serviceTitle = (service: Service) => locale === "en" && serviceEnglish[service.slug]
    ? serviceEnglish[service.slug].title : text(service.title);
  const serviceSummary = (service: Service) => locale === "en" && serviceEnglish[service.slug]
    ? serviceEnglish[service.slug].summary
    : text(service.summary).match(/^.*?[.!?](?:\s|$)/)?.[0]?.trim() || text(service.summary);
  const categoryText = (category: ProjectCategory) => {
    const label = translateCategoryLabel(locale, category, categoryLabels);
    const key = label.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[ _]+/g, "-");
    return locale === "en" ? homeCategoryEnglish[key] ?? label : label;
  };
  return (
    <div className={styles.home}>
      <section className={styles.hero} aria-labelledby="home-title">
        <div className={styles.heroIntro}>
          <div>
            <p className={styles.kicker}>{text(copy.label)}</p>
            <h1 id="home-title">{text(copy.title)}</h1>
          </div>
          <div className={styles.heroDescription}>
            <p>{text(copy.description)}</p>
            <Link href="/proyectos" className={styles.link}>{text(copy.archive)}</Link>
          </div>
        </div>
        {heroProjects.length ? (
          <div className={styles.heroProjects}>
            {heroProjects.map((project, index) => (
              <article key={project.slug} className={`${styles.heroProject} ${index === 0 ? styles.heroLead : ""}`}>
                <div className={styles.heroMedia}>
                  {activeVideo === project.slug && project.video ? (
                    <iframe
                      src={project.video.embedUrl}
                      title={text(project.video.title) || text(project.name)}
                      allow="fullscreen; picture-in-picture"
                      allowFullScreen
                      referrerPolicy="strict-origin-when-cross-origin"
                    />
                  ) : (
                    <Link href={`/proyectos/${project.slug}`} aria-label={text(project.name)}>
                      <Image
                        src={project.cover.src}
                        alt={imageAlt(project.cover.alt, project)}
                        fill
                        priority={index === 0}
                        sizes={index === 0 ? "(min-width: 1320px) 784px, (min-width: 768px) 64vw, 100vw" : "(min-width: 1320px) 384px, (min-width: 768px) 32vw, 100vw"}
                      />
                    </Link>
                  )}
                </div>
                <div className={styles.heroCaption}>
                  <h2><Link href={`/proyectos/${project.slug}`}>{text(project.name)}</Link></h2>
                  <span>{timeline(project)}</span>
                  {project.video ? (
                    <button
                      type="button"
                      className={styles.heroVideoButton}
                      aria-expanded={activeVideo === project.slug}
                      aria-label={`${locale === "es" ? "Video de" : "Video for"} ${text(project.name)}`}
                      onClick={() => setActiveVideo(activeVideo === project.slug ? null : project.slug)}
                    >
                      {activeVideo === project.slug
                        ? locale === "es" ? "Cerrar video" : "Close video"
                        : locale === "es" ? "Ver video" : "Watch video"}
                    </button>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        ) : null}
      </section>

      <section className={styles.section} aria-labelledby="selected-projects">
        <div className={styles.sectionHeading}>
          <h2 id="selected-projects">{text(copy.projects)}</h2>
          <Link href="/proyectos" className={styles.link}>{text(copy.archive)}</Link>
        </div>
        <div className={styles.projects}>
          {selectedProjects.map((project, index) => (
            <Link key={project.slug} href={`/proyectos/${project.slug}`} className={`${styles.project} ${index === 0 ? styles.featured : ""}`}>
              <div className={styles.projectImage}>
                <Image src={project.cover.src} alt={imageAlt(project.cover.alt, project)} fill sizes={index === 0 ? "(min-width: 1320px) 784px, (min-width: 1024px) 64vw, (min-width: 768px) 50vw, 100vw" : "(min-width: 1320px) 376px, (min-width: 1024px) 32vw, (min-width: 768px) 50vw, 100vw"} />
              </div>
              <h3>{text(project.name)}</h3>
              <div className={styles.projectMeta}>
                <span>{timeline(project)}</span>
                <span>{project.categories.map(categoryText).join(" / ")}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className={`${styles.section} ${styles.practice}`} aria-labelledby="practice-title">
        <div>
          <p className={styles.kicker}>{text(copy.practice)}</p>
          <h2 id="practice-title">{text(copy.practiceTitle)}</h2>
        </div>
        <div className={styles.practiceCopy}>
          <p>{text(copy.practiceCopy)}</p>
          <p>{text(copy.practiceDetail)}</p>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="capabilities-title">
        <div className={styles.sectionHeading}><h2 id="capabilities-title">{text(copy.services)}</h2></div>
        {services.map((service) => (
          <article key={service.slug} className={styles.service}>
            <h3>{serviceTitle(service)}</h3>
            <p>{serviceSummary(service)}</p>
            <Link href={`/servicios#${service.slug}`} className={styles.link} aria-label={`${text(copy.serviceLink)}: ${serviceTitle(service)}`}>{text(copy.serviceLink)}</Link>
          </article>
        ))}
      </section>

      <section className={styles.section} aria-labelledby="collaborations-title">
        <h2 id="collaborations-title">{text(copy.collaborations)}</h2>
        <p className={styles.collaborationIntro}>{text(copy.collaboratorsCopy)}</p>
        <div className={styles.clients}>
          {clients.map((client) => (
            <article key={client.slug} className={styles.client}>
              {client.image ? <div className={styles.clientLogo}><Image src={client.image.src} alt={text(client.image.alt)} fill sizes="144px" /></div> : null}
              <h3>{client.website ? <a href={client.website} target="_blank" rel="noreferrer">{client.name}</a> : client.name}</h3>
              <p>{locale === "en" && text(client.sector).toLowerCase() === "ensamble" ? "Ensemble" : text(client.sector)}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
