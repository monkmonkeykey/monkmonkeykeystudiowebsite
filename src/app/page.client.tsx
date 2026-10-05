"use client";

import Image from "next/image";
import Link from "next/link";

import type { Client } from "@/content/clients";
import type { Service } from "@/content/services";
import { useLocale } from "@/components/site/locale-context";
import { RichText } from "@/components/site/rich-text";
import type { LocalizedValue, Project, ProjectCategory } from "@/domain/projects";
import { formatProjectTimeline, translateCategoryLabel } from "@/domain/projects";
import type { SiteContent } from "@/domain/site";
import { translate, type Locale, type LocaleText } from "@/lib/i18n";

type HomePageClientProps = {
  projects: Project[];
  clients: Client[];
  services: Service[];
  siteContent: SiteContent;
  categoryLabels: Record<ProjectCategory, LocaleText>;
};

const translateLocalizedValue = (locale: Locale, value: LocalizedValue): string =>
  typeof value === "string" ? value : value[locale];

export default function HomePageClient({
  projects,
  clients,
  services,
  siteContent,
  categoryLabels,
}: HomePageClientProps) {
  const { locale } = useLocale();
  const heroVideoUrl = siteContent.home.heroVideo?.url?.trim();
  const heroVideoPoster = siteContent.home.heroVideo?.poster?.trim();

  return (
    <div className="studio-home">
      <section className="relative -mx-4 min-h-[32rem] overflow-hidden bg-surface sm:-mx-7 sm:aspect-video sm:min-h-0 lg:-mx-12">
        {heroVideoUrl ? (
          <video
            key={heroVideoUrl}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            poster={heroVideoPoster || undefined}
          >
            <source src={heroVideoUrl} />
          </video>
        ) : (
          <div className="hero-fallback absolute inset-0" aria-hidden />
        )}

        <div className="absolute inset-0 bg-black/45" />

        <div className="absolute inset-0 z-10 flex items-center justify-center px-5 py-8 text-white sm:px-10 lg:px-14">
          <div className="flex w-full max-w-5xl flex-col items-center gap-6 text-center sm:gap-8">
            <RichText
              as="h1"
              value={siteContent.home.heroHeadline}
              className="hero-headline hero-title text-[clamp(1.05rem,2vw,1.85rem)] font-medium leading-[1.3] tracking-[-0.02em] text-white drop-shadow-[0_2px_16px_rgba(0,0,0,0.5)]"
            />

            <div className="flex w-full flex-col justify-center gap-2 text-xs sm:w-auto sm:flex-row">
              <Link href="/contacto" className="studio-action studio-action--primary studio-action--on-media">
                <RichText as="span" value={siteContent.home.heroPrimaryCta} />
                <span aria-hidden>↗</span>
              </Link>
              <Link href="/proyectos" className="studio-action studio-action--secondary studio-action--on-media">
                {translate(locale, siteContent.home.heroSecondaryCta)}
                <span aria-hidden>↗</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 sm:py-32 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-9">
            <RichText
              as="h2"
              value={siteContent.home.servicesTitle}
              className="max-w-5xl text-[clamp(2.8rem,6vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.055em]"
            />

            <div className="mt-16 border-t border-line lg:mt-24">
              {services.map((service) => (
                <article key={service.slug} className="service-row group grid gap-5 border-b border-line py-8 sm:grid-cols-[minmax(13rem,0.8fr)_minmax(16rem,1.2fr)_auto] sm:items-start sm:py-10">
                  <h3 className="text-2xl font-medium leading-tight tracking-[-0.035em] sm:text-3xl">
                    <RichText as="span" value={service.title} />
                  </h3>
                  <div>
                    <RichText as="p" value={service.summary} className="max-w-xl text-sm leading-relaxed text-muted sm:text-base" />
                    <p className="mt-5 max-w-xl text-xs leading-relaxed text-foreground/50">
                      {service.outcomes.slice(0, 2).map((outcome) => translate(locale, outcome)).join(" · ")}
                    </p>
                  </div>
                  <Link href={`/servicios#${service.slug}`} className="studio-action-icon" aria-label={translate(locale, siteContent.home.servicesCardCta)}>
                    ↗
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line py-24 sm:py-32 lg:py-40">
        <div className="mb-14 grid gap-8 lg:grid-cols-12 lg:gap-8">
          <div className="flex items-end justify-between gap-8 lg:col-span-9">
            <RichText
              as="h2"
              value={siteContent.home.projectsTitle}
              className="text-[clamp(2.8rem,6vw,6.5rem)] font-medium leading-[0.92] tracking-[-0.055em]"
            />
            <Link href="/proyectos" className="studio-text-link hidden text-xs sm:inline-flex">
              {translate(locale, siteContent.home.projectsCta)} <span aria-hidden>↗</span>
            </Link>
          </div>
        </div>

        <div className="grid gap-x-6 gap-y-20 lg:grid-cols-12 lg:gap-y-28">
          {projects.slice(0, 3).map((project, index) => (
            <Link
              key={project.slug}
              href={`/proyectos/${project.slug}`}
              className={`project-card group block ${index === 0 ? "lg:col-span-8" : index === 1 ? "lg:col-span-5 lg:col-start-8 lg:mt-28" : "lg:col-span-6 lg:col-start-2"}`}
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-surface">
                <Image
                  src={project.cover.src}
                  alt={translate(locale, project.cover.alt)}
                  fill
                  sizes={index === 0 ? "(min-width: 1024px) 66vw, 100vw" : "(min-width: 1024px) 50vw, 100vw"}
                  className="object-cover saturate-[0.8] transition duration-700 group-hover:scale-[1.025] group-hover:saturate-100"
                />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/10" />
                <span className="absolute bottom-4 right-4 flex size-11 translate-y-2 items-center justify-center border border-signal bg-signal text-sm text-black opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">↗</span>
              </div>
              <div className="grid gap-4 border-t border-line pt-4 sm:grid-cols-[1fr_auto]">
                <div>
                  <h3 className="text-2xl font-medium tracking-[-0.04em] transition-colors group-hover:text-signal sm:text-3xl">
                    {translate(locale, project.name)}
                  </h3>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">{translate(locale, project.subtitle)}</p>
                </div>
                <div className="space-y-1 font-mono text-[9px] uppercase tracking-[0.08em] text-muted sm:text-right">
                  <p>{formatProjectTimeline(project)}</p>
                  <p>{translateLocalizedValue(locale, project.location)}</p>
                  <p>{project.categories.map((category) => translateCategoryLabel(locale, category, categoryLabels)).join(" / ")}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-line py-24 sm:py-32 lg:py-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <p className="max-w-sm text-2xl font-medium leading-tight tracking-[-0.035em]">
              {locale === "es" ? "Colaboraciones construidas desde la confianza y el trabajo en equipo." : "Collaborations built through trust and teamwork."}
            </p>
          </div>
          <div className="grid border-l border-t border-line sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3">
            {clients.map((client) => (
              <article key={client.slug} className="client-cell group flex min-h-44 flex-col justify-between border-b border-r border-line p-5 transition-colors hover:bg-surface">
                {client.image ? (
                  <div className="relative h-10 w-24 opacity-55 grayscale transition group-hover:opacity-100 group-hover:grayscale-0">
                    <Image src={client.image.src} alt={translate(locale, client.image.alt)} fill sizes="96px" className="object-contain object-left" />
                  </div>
                ) : <span />}
                <div>
                  <p className="text-sm font-medium">{client.name}</p>
                  <p className="mt-1 text-xs text-muted">{translate(locale, client.sector)}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
