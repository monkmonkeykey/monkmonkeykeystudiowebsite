"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState, type MouseEvent } from "react";

import type { LocalizedValue, Project, ProjectCategory, ProjectGalleryImage } from "@/domain/projects";
import { formatProjectTimeline, translateCategoryLabel } from "@/domain/projects";
import { translate, type LocaleText } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";
import { getPlainText, RichText } from "@/components/site/rich-text";
import styles from "./project-detail.module.css";

const labels = {
  back: { es: "Volver a proyectos", en: "Back to projects" },
  backAll: { es: "Volver a todos los proyectos", en: "Back to all projects" },
  about: { es: "Sobre el proyecto", en: "About the project" },
  facts: { es: "Ficha del proyecto", en: "Project information" },
  location: { es: "Lugar", en: "Location" },
  client: { es: "Cliente / institución", en: "Client / institution" },
  video: { es: "Video", en: "Video" },
  gallery: { es: "Galería", en: "Gallery" },
  collaborations: { es: "Colaboraciones", en: "Collaborations" },
  website: { es: "Visitar sitio", en: "Visit site" },
  close: { es: "Cerrar", en: "Close" },
  previous: { es: "Anterior", en: "Previous" },
  next: { es: "Siguiente", en: "Next" },
};

const plain = (value: string) => getPlainText(value.replace(/<br\s*\/?>|<\/(?:p|div)>/gi, "\n"));

// Compare the underlying Cloudinary asset, including differently versioned URLs.
// Other image sources retain their path/query identity.
const imageIdentity = (src: string): string => {
  try {
    const url = new URL(src.trim(), "https://local.invalid");
    const marker = "/image/upload/";
    if (url.hostname === "res.cloudinary.com" && url.pathname.includes(marker)) {
      const [cloud, resource] = url.pathname.split(marker);
      const parts = resource.split("/");
      const version = parts.findIndex((part) => /^v\d+$/.test(part));
      if (version >= 0) parts.splice(0, version + 1);
      else while (parts.length > 1 && /^(?:[a-z]{1,3}_[^/]+)(?:,|$)/.test(parts[0])) parts.shift();
      return `${cloud}/${parts.join("/").replace(/\.(?:jpe?g|png|webp|avif)$/i, "")}`;
    }
    return `${url.origin}${url.pathname}${url.search}`;
  } catch {
    return src.trim();
  }
};

// Keep rich text while preventing a stored heading from introducing another H1.
const paragraphCopy = (value: LocaleText): LocaleText => ({
  es: value.es.replace(/<(\/?)h[1-6](?=[\s>])/gi, "<$1p"),
  en: value.en.replace(/<(\/?)h[1-6](?=[\s>])/gi, "<$1p"),
});

type ProjectDetailProps = {
  project: Project;
  categoryLabels: Record<ProjectCategory, LocaleText>;
};

type ViewerPhoto = { image: ProjectGalleryImage; captions: string[] };

export function ProjectDetail({ project, categoryLabels }: ProjectDetailProps) {
  const { locale } = useLocale();
  const text = (value: LocaleText) => plain(translate(locale, value));
  const localized = (value: LocalizedValue) => typeof value === "string" ? plain(value) : text(value);
  const photoAlt = (image: ProjectGalleryImage) => {
    const alt = text(image.alt);
    return /[\p{L}\p{N}]/u.test(alt) ? alt : (image.footnote ? text(image.footnote) : "") || text(project.name);
  };
  const [activeImageIndex, setActiveImageIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openingButtonRef = useRef<HTMLButtonElement | null>(null);
  const viewerTitleId = useId();

  const cover = project.cover?.src.trim() ? project.cover : null;
  const duplicateCovers = cover ? project.gallery.filter((image) => imageIdentity(image.src) === imageIdentity(cover.src)) : [];
  const gallery = project.gallery.filter((image) => image.src.trim() && (!cover || imageIdentity(image.src) !== imageIdentity(cover.src)));
  const captions = (images: ProjectGalleryImage[]) => Array.from(new Set(images.flatMap((image) => {
    const caption = image.footnote ? text(image.footnote) : "";
    return caption ? [caption] : [];
  })));
  const coverCaptions = cover ? captions([cover, ...duplicateCovers]) : [];
  const photos: ViewerPhoto[] = [
    ...(cover ? [{ image: cover, captions: coverCaptions }] : []),
    ...gallery.map((image) => ({ image, captions: captions([image]) })),
  ];
  const activePhoto = activeImageIndex === null ? null : photos[activeImageIndex];
  const isViewerOpen = Boolean(activePhoto);
  const timeline = (project.startYear && project.startYear === project.endYear
    ? String(project.startYear) : formatProjectTimeline(project)).replace(/^(\d{4})\s*[–—-]\s*\1$/, "$1");
  const description = project.description.filter((paragraph) => text(paragraph));
  const clientValue = localized(project.client);
  const clientName = project.entities.find((entity) => entity.slug === clientValue)?.name ?? clientValue;
  const detailItems = [
    { label: labels.location, value: localized(project.location) },
    { label: labels.client, value: clientName },
    ...project.meta.map((item) => ({ label: item.label, value: localized(item.value) })),
  ].filter((item) => text(item.label) && item.value && !(
    /^(?:año|year|periodo|período|period)$/i.test(text(item.label)) && item.value === timeline
  ));
  const entities = project.entities.filter((entity) => plain(entity.name) || text(entity.summary) || entity.image?.src);

  const openViewer = (index: number, event: MouseEvent<HTMLButtonElement>) => {
    openingButtonRef.current = event.currentTarget;
    setActiveImageIndex(index);
  };
  const closeViewer = () => setActiveImageIndex(null);
  const goTo = (direction: -1 | 1) => setActiveImageIndex((current) => current === null ? null : (current + direction + photos.length) % photos.length);

  useEffect(() => {
    if (!isViewerOpen) return;
    const dialog = dialogRef.current;
    if (!dialog) return;
    const overflow = document.body.style.overflow;
    const padding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = padding;
      if (openingButtonRef.current?.isConnected) openingButtonRef.current.focus({ preventScroll: true });
    };
  }, [isViewerOpen]);

  return (
    <article className={styles.detail} lang={locale}>
      <header className={styles.header}>
        <Link href="/proyectos" className={styles.link}>{text(labels.back)}</Link>
        <h1 className={text(project.name).length > 160 ? styles.extendedTitle : undefined}>{text(project.name)}</h1>
        {text(project.subtitle) && <RichText value={paragraphCopy(project.subtitle)} className={styles.subtitle} />}
        {(timeline || project.categories.length > 0) && <div className={styles.headerMeta}>
          {timeline && <span>{timeline}</span>}
          {project.categories.length > 0 && <span>{project.categories.map((category) => translateCategoryLabel(locale, category, categoryLabels)).join(" / ")}</span>}
        </div>}
      </header>

      {cover && <figure className={styles.cover}>
        <button type="button" className={styles.photoButton} onClick={(event) => openViewer(0, event)}
          aria-label={locale === "es" ? "Ampliar portada" : "Enlarge cover"}>
          <Image src={cover.src} alt={photoAlt(cover)} width={1600} height={1000} priority sizes="(min-width: 1320px) 1192px, 100vw" className={styles.coverImage} />
        </button>
        {coverCaptions.length > 0 && <figcaption className={styles.caption}>{coverCaptions.map((caption) => <p key={caption}>{caption}</p>)}</figcaption>}
      </figure>}

      {(description.length > 0 || detailItems.length > 0) && <section aria-label={text(labels.about)} className={`${styles.context} ${description.length && detailItems.length ? styles.contextColumns : ""}`}>
        {description.length > 0 && <div className={styles.description}>
          {description.map((paragraph, index) => <RichText key={`${project.slug}-paragraph-${index}`} value={paragraphCopy(paragraph)} className={styles.paragraph} />)}
        </div>}
        {detailItems.length > 0 && <aside aria-label={text(labels.facts)} className={styles.facts}>
          <dl>{detailItems.map((item, index) => <div key={`${project.slug}-detail-${index}`}>
            <dt>{text(item.label)}</dt><dd>{item.value}</dd>
          </div>)}</dl>
        </aside>}
      </section>}

      {project.video && <section className={styles.section} aria-labelledby="project-video-title">
        <div className={styles.sectionHeading}>
          <h2 id="project-video-title">{text(labels.video)}</h2>
          <a href={project.video.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
            {`${locale === "es" ? "Ver en" : "Watch on"} ${project.video.provider === "youtube" ? "YouTube" : "Vimeo"}`}
          </a>
        </div>
        <div className={styles.video}>
          <iframe src={project.video.embedUrl} title={text(project.video.title) || `${text(labels.video)}: ${text(project.name)}`}
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
        </div>
      </section>}

      {gallery.length > 0 && <section className={styles.section} aria-labelledby="project-gallery-title">
        <h2 id="project-gallery-title">{text(labels.gallery)}</h2>
        <div className={styles.gallery}>
          {gallery.map((image, index) => <figure key={`${project.slug}-gallery-${index}`}>
            <button type="button" className={styles.photoButton} onClick={(event) => openViewer(index + (cover ? 1 : 0), event)}
              aria-label={`${locale === "es" ? "Ampliar fotografía" : "Enlarge photograph"} ${index + 1}`}>
              <Image src={image.src} alt={photoAlt(image)} width={1200} height={800} loading="lazy"
                sizes="(min-width: 1320px) 580px, (min-width: 768px) 50vw, 100vw" className={styles.galleryImage} />
            </button>
            {captions([image]).length > 0 && <figcaption className={styles.caption}>{captions([image]).map((caption) => <p key={caption}>{caption}</p>)}</figcaption>}
          </figure>)}
        </div>
      </section>}

      {entities.length > 0 && <section className={styles.section} aria-labelledby="project-collaborations-title">
        <h2 id="project-collaborations-title">{text(labels.collaborations)}</h2>
        <div className={styles.entities}>
          {entities.map((entity) => <article key={entity.slug} className={styles.entity}>
            {entity.image?.src && <div className={styles.entityLogo}><Image src={entity.image.src} alt={/[\p{L}\p{N}]/u.test(text(entity.image.alt)) ? text(entity.image.alt) : plain(entity.name)} fill sizes="112px" loading="lazy" /></div>}
            <div className={styles.entityText}>
              {plain(entity.name) && <h3>{plain(entity.name)}</h3>}
              {text(entity.sector) && <p className={styles.entitySector}>{text(entity.sector)}</p>}
              {text(entity.summary) && <p>{text(entity.summary)}</p>}
              {entity.website && <a href={entity.website} target="_blank" rel="noopener noreferrer" className={styles.link}>{text(labels.website)}</a>}
            </div>
          </article>)}
        </div>
      </section>}

      <nav className={styles.return} aria-label={locale === "es" ? "Archivo de proyectos" : "Project archive"}>
        <Link href="/proyectos" className={styles.link}>{text(labels.backAll)}</Link>
      </nav>

      {activePhoto && <dialog ref={dialogRef} className={styles.viewer} aria-labelledby={viewerTitleId}
        onCancel={(event) => { event.preventDefault(); closeViewer(); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); goTo(event.key === "ArrowLeft" ? -1 : 1); }
          if (event.key === "Tab") {
            const controls = event.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])");
            const first = controls[0];
            const last = controls[controls.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
          }
        }}>
        <div className={styles.viewerToolbar}>
          <div><p id={viewerTitleId}>{text(labels.gallery)}</p><p className={styles.viewerCount} role="status">{activeImageIndex! + 1} / {photos.length}</p></div>
          <div className={styles.viewerControls}>
            {photos.length > 1 && <><button type="button" onClick={() => goTo(-1)}>{text(labels.previous)}</button><button type="button" onClick={() => goTo(1)}>{text(labels.next)}</button></>}
            <button ref={closeButtonRef} type="button" onClick={closeViewer}>{text(labels.close)}</button>
          </div>
        </div>
        <figure className={styles.viewerFigure}>
          <div className={styles.viewerImage}><Image src={activePhoto.image.src} alt={photoAlt(activePhoto.image)} fill loading="eager" sizes="(min-width: 1280px) 1152px, 100vw" className={styles.viewerPhoto} /></div>
          {activePhoto.captions.length > 0 && <figcaption className={styles.caption}>{activePhoto.captions.map((caption) => <p key={caption}>{caption}</p>)}</figcaption>}
        </figure>
      </dialog>}
    </article>
  );
}
