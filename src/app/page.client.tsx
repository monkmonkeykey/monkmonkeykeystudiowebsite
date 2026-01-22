"use client";

import Image from "next/image";
import Link from "next/link";

import type { Client } from "@/content/clients";
import type { LocalizedValue, Project, ProjectCategory } from "@/domain/projects";
import { formatProjectTimeline, translateCategoryLabel } from "@/domain/projects";
import type { Service } from "@/content/services";
import type { SiteContent } from "@/domain/site";
import { translate, type Locale, type LocaleText } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";
import { RichText } from "@/components/site/rich-text";

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
    <div className="space-y-20">
      <section className="relative isolate -mx-[calc(50vw-50%)] w-screen overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5 min-h-[80vh] pb-10">
        {heroVideoUrl && (
          <div className="pointer-events-none absolute inset-0">
            <video
              key={heroVideoUrl}
              className="h-full w-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              poster={heroVideoPoster || undefined}
            >
              <source src={heroVideoUrl} />
            </video>
            <div className="absolute inset-0 bg-gradient-to-br from-background/88 via-background/78 to-background/72" />
          </div>
        )}
        <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-5xl flex-col justify-end gap-6 px-6 pb-10 text-center sm:px-10 lg:px-14">
          <RichText
            as="h1"
            value={siteContent.home.heroHeadline}
            className="text-sm font-normal leading-relaxed text-foreground"
          />
          <RichText
            value={siteContent.home.heroSubtitle}
            className="space-y-3 text-sm font-normal leading-relaxed text-foreground/70 [&>p]:leading-relaxed"
          />
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-lg shadow-foreground/20 transition hover:-translate-y-0.5 hover:bg-foreground/90"
            >
              <RichText as="span" value={siteContent.home.heroPrimaryCta} />
            </Link>
            <Link
              href="/proyectos"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 bg-background/80 px-5 py-2.5 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-foreground/30 hover:text-foreground/90"
            >
              <RichText as="span" value={siteContent.home.heroSecondaryCta} />
            </Link>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <header className="overflow-hidden rounded-3xl border border-foreground/10 bg-gradient-to-r from-foreground/5 via-background to-foreground/5 p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground/70 ring-1 ring-foreground/10">
                <span className="size-2 rounded-full bg-primary" />
                {translate(locale, siteContent.home.servicesBadgeLabel)}
              </div>
              <div className="space-y-2">
                <RichText
                  as="h2"
                  value={siteContent.home.servicesTitle}
                  className="text-2xl font-semibold tracking-tight sm:text-3xl"
                />
                <RichText value={siteContent.home.servicesCopy} className="prose prose-sm max-w-none text-foreground/70" />
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-foreground/60">
                {siteContent.home.servicesTags.map((tag, index) => (
                  <span
                    key={`${tag.es}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-1.5 ring-1 ring-foreground/10"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{
                        backgroundColor: index === 0 ? "rgb(74 222 128)" : index === 1 ? "rgb(56 189 248)" : "rgb(232 121 249)",
                      }}
                    />
                    {translate(locale, tag)}
                  </span>
                ))}
              </div>
              <Link
                href="/servicios"
                className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-sm transition hover:-translate-y-0.5 hover:bg-foreground/90"
              >
                <RichText as="span" value={siteContent.home.servicesCta} />
              </Link>
            </div>
            <div className="relative flex flex-wrap gap-3 rounded-2xl bg-background/80 p-4 ring-1 ring-foreground/10">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/servicios#${service.slug}`}
                  className="group inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-background px-3 py-2 text-sm font-semibold text-foreground/80 transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-foreground"
                >
                  <RichText as="span" value={service.title} />
                </Link>
              ))}
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-3">
          {services.map((service) => (
          <article
            key={service.slug}
            className="flex h-full flex-col justify-between rounded-3xl border border-foreground/10 bg-background/80 p-6 shadow-sm ring-1 ring-transparent transition hover:-translate-y-1 hover:border-primary/30 hover:ring-primary/10"
          >
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-foreground">
                <RichText as="span" value={service.title} />
              </h3>
              <p className="text-sm text-foreground/70">
                <RichText as="span" value={service.summary} />
              </p>
            </div>
            <div className="mt-6 space-y-2">
              {service.outcomes.map((outcome, index) => (
                <div
                    key={`${service.slug}-outcome-${index}`}
                    className="flex items-start gap-3 rounded-2xl border border-foreground/10 bg-foreground/[0.03] px-4 py-3 text-sm text-foreground/70"
                  >
                    <span className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-semibold text-primary ring-1 ring-primary/20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span>{translate(locale, outcome)}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/servicios#${service.slug}`}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-full border border-foreground/10 px-4 py-2 text-sm font-semibold text-foreground transition hover:-translate-y-0.5 hover:border-primary/30 hover:text-foreground"
              >
                <RichText as="span" value={siteContent.home.servicesCardCta} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <header className="overflow-hidden rounded-3xl border border-foreground/10 bg-gradient-to-r from-foreground/5 via-background to-foreground/5 p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground/70 ring-1 ring-foreground/10">
                <span className="size-2 rounded-full bg-primary" />
                {translate(locale, siteContent.home.projectsBadgeLabel)}
              </div>
              <RichText
                as="h2"
                value={siteContent.home.projectsTitle}
                className="text-2xl font-semibold tracking-tight sm:text-3xl"
              />
              <RichText
                value={siteContent.home.projectsDescription}
                className="text-base text-foreground/70"
              />
              <div className="flex flex-wrap gap-2 text-xs text-foreground/60">
                {siteContent.home.projectsTags.map((tag, index) => (
                  <span
                    key={`${tag.es}-${index}`}
                    className="inline-flex items-center gap-2 rounded-full bg-background/60 px-3 py-1.5 ring-1 ring-foreground/10"
                  >
                    <span
                      className="size-2 rounded-full"
                      style={{
                        backgroundColor:
                          index === 0 ? "rgb(52 211 153)" : index === 1 ? "rgb(56 189 248)" : "rgb(232 121 249)",
                      }}
                    />
                    {translate(locale, tag)}
                  </span>
                ))}
              </div>
              <Link
                href="/proyectos"
                className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-sm transition hover:-translate-y-0.5 hover:bg-foreground/90"
              >
                <RichText as="span" value={siteContent.home.projectsCta} />
              </Link>
            </div>
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/5">
              <Image
                src="/images/projects-visual.svg"
                alt={translate(locale, siteContent.home.projectsImageAlt)}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </header>
        <div className="grid gap-6 lg:grid-cols-2">
          {projects.slice(0, 2).map((project) => (
            <article
              key={project.slug}
              className="group flex h-full flex-col overflow-hidden rounded-3xl border border-foreground/10 bg-background/80 shadow-sm transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
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
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                    {translateLocalizedValue(locale, project.client)}
                  </p>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-foreground/50">
                    {formatProjectTimeline(project)}
                  </span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">
                    {translate(locale, project.name)}
                  </h3>
                  <p className="text-sm text-foreground/70">
                    {translate(locale, project.subtitle)}
                  </p>
                </div>
                  <p className="text-sm text-foreground/70 line-clamp-3">
                    {translate(locale, project.description[0])}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-foreground/60">
                    {project.categories.map((category) => (
                      <span
                        key={`${project.slug}-cat-${category}`}
                        className="rounded-full border border-foreground/10 bg-foreground/5 px-3 py-1"
                      >
                      {translateCategoryLabel(locale, category, categoryLabels)}
                      </span>
                    ))}
                  </div>
                <div className="mt-auto flex items-center justify-between pt-2 text-sm font-semibold text-foreground/70">
                  <Link href={`/proyectos/${project.slug}`} className="inline-flex items-center gap-2 transition hover:text-foreground">
                    <RichText as="span" value={siteContent.home.projectsCardCta} />
                  </Link>
                  <span className="text-xs uppercase tracking-[0.2em] text-foreground/50">
                    {translateLocalizedValue(locale, project.location)}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <header className="overflow-hidden rounded-3xl border border-foreground/10 bg-gradient-to-r from-foreground/5 via-background to-foreground/5 p-6 shadow-sm sm:p-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full bg-foreground/5 px-3 py-1 text-xs font-semibold text-foreground/70 ring-1 ring-foreground/10">
                <span className="size-2 rounded-full bg-primary" />
                <RichText as="span" value={siteContent.home.clientsTitle} />
              </div>
              <p className="text-base text-foreground/70">
                {locale === "es"
                  ? "Colaboramos con equipos de producto, innovación y data en toda Latinoamérica y Europa."
                  : "We collaborate with product, innovation, and data teams across Latin America and Europe."}
              </p>
            </div>
            <Link
              href="/contacto"
              className="inline-flex w-fit items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background shadow-sm transition hover:-translate-y-0.5 hover:bg-foreground/90"
            >
              <RichText as="span" value={siteContent.home.contactCta} />
            </Link>
          </div>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {clients.map((client) => (
            <article
              key={client.slug}
              className="flex h-full flex-col gap-4 rounded-2xl border border-foreground/10 bg-background/80 p-4 shadow-sm transition hover:-translate-y-1 hover:border-primary/30"
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
                  <RichText as="span" value={siteContent.home.clientsWebsiteLabel} />
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
