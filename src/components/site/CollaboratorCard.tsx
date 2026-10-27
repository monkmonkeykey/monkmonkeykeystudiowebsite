"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";

import type { Client } from "@/content/clients";
import { translate } from "@/lib/i18n";
import { useLocale } from "./locale-context";
import { getPlainText } from "./rich-text";
import styles from "./collaborator-card.module.css";

type CollaboratorCardProps = Pick<Client, "name" | "sector" | "summary" | "image" | "website"> & {
  headingLevel?: 2 | 3;
  showImageCaption?: boolean;
};

const labels = {
  more: { es: "Leer más", en: "Read more" },
  less: { es: "Leer menos", en: "Read less" },
  website: { es: "Visitar sitio", en: "Visit website" },
};

const plain = (value: string) => getPlainText(value.replace(/<br\s*\/?>|<\/(?:p|div)>/gi, "\n"));

export function CollaboratorGrid({ children, variant = "directory" }: {
  children: ReactNode;
  variant?: "directory" | "project";
}) {
  return <div className={`${styles.grid} ${variant === "project" ? styles.project : styles.directory}`}>{children}</div>;
}

export function CollaboratorCard({ name, sector, summary, image, website, headingLevel = 2, showImageCaption = false }: CollaboratorCardProps) {
  const { locale } = useLocale();
  const titleId = useId();
  const descriptionId = useId();
  const measureRef = useRef<HTMLParagraphElement>(null);
  const [measurement, setMeasurement] = useState({ text: "", overflows: false });
  const [expandedText, setExpandedText] = useState("");
  const title = plain(name);
  const discipline = plain(translate(locale, sector));
  const description = plain(translate(locale, summary));
  const caption = showImageCaption && image?.footnote ? plain(translate(locale, image.footnote)) : "";
  const imageAlt = image ? plain(translate(locale, image.alt)) : "";
  const canExpand = measurement.text === description && measurement.overflows;
  const expansionKey = `${locale}:${description}`;
  const expanded = canExpand && expandedText === expansionKey;
  const Heading = headingLevel === 3 ? "h3" : "h2";

  useEffect(() => {
    const element = measureRef.current;
    if (!element) return;
    let disposed = false;
    // Measure an unclamped, inaccessible copy at exactly the visible text's width.
    // This also works while the visible description is expanded.
    const measure = () => {
      if (disposed) return;
      const lineHeight = parseFloat(getComputedStyle(element).lineHeight);
      const overflows = element.getBoundingClientRect().height > lineHeight * 2 + 1;
      setMeasurement((previous) => previous.text === description && previous.overflows === overflows
        ? previous : { text: description, overflows });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    const frame = requestAnimationFrame(measure);
    void document.fonts.ready.then(measure);
    document.fonts.addEventListener("loadingdone", measure);
    return () => {
      disposed = true;
      observer.disconnect();
      cancelAnimationFrame(frame);
      document.fonts.removeEventListener("loadingdone", measure);
    };
  }, [description, locale]);

  return (
    <article className={styles.card} aria-labelledby={title ? titleId : undefined}>
      {image?.src.trim() ? <figure className={styles.identity}>
        <div className={styles.logo}>
          <Image src={image.src} alt={/[\p{L}\p{N}]/u.test(imageAlt) ? imageAlt : title}
            fill sizes="192px" loading="lazy" />
        </div>
        {caption && <figcaption className={styles.imageCaption}>{caption}</figcaption>}
      </figure> : <div className={styles.logo} aria-hidden="true" />}
      <div className={styles.body}>
        {title && <Heading id={titleId} className={styles.title}>{title}</Heading>}
        {discipline && <p className={styles.sector}>{discipline}</p>}
        {description && <div className={styles.descriptionArea}>
          <p id={descriptionId} className={styles.description} data-collapsed={!expanded}>{description}</p>
          <p ref={measureRef} className={`${styles.description} ${styles.measure}`} aria-hidden="true">{description}</p>
        </div>}
      </div>
      <div className={styles.actions}>
        {canExpand && <button type="button" aria-expanded={expanded} aria-controls={descriptionId}
          onClick={() => setExpandedText(expanded ? "" : expansionKey)}>
          {translate(locale, expanded ? labels.less : labels.more)}
        </button>}
        {website?.trim() && <a href={website} target="_blank" rel="noopener noreferrer">{translate(locale, labels.website)}</a>}
      </div>
    </article>
  );
}
