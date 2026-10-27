"use client";

import Image from "next/image";
import { useState } from "react";

import type { Service } from "@/content/services";
import { practicePhotoServices, servicePhotoCandidates } from "@/domain/service-photos";
import { translate } from "@/lib/i18n";
import { useLocale } from "@/components/site/locale-context";
import { getPlainText } from "@/components/site/rich-text";
import styles from "@/app/home.module.css";

const photoDescriptions = {
  audio: { es: "Documentación de producción sonora y técnica en concierto", en: "Documentation of sound and technical production at a concert" },
  art: { es: "Documentación de una instalación de arte y nuevos medios", en: "Documentation of an art and new media installation" },
  fabrication: { es: "Piezas y prototipos de impresión 3D y fabricación", en: "3D printed pieces and fabrication prototypes" },
};

export default function PracticeGallery({ services }: { services: Service[] }) {
  const { locale } = useLocale();
  const [failedSources, setFailedSources] = useState<Set<string>>(() => new Set());
  const photos = practicePhotoServices(services).flatMap((service) => {
    const image = servicePhotoCandidates(service).find((candidate) => !failedSources.has(candidate.src));
    return image ? [{ service, image }] : [];
  });

  if (!photos.length) return null;

  return (
    <div className={styles.practiceGallery} role="group" aria-label={locale === "es" ? "Procesos y formas de trabajo del estudio" : "Studio processes and ways of working"}>
      {photos.map(({ service, image }, index) => {
        const description = getPlainText(translate(locale, image.alt));
        const area = ["audio", "diseno-ux-ui"].includes(service.slug) ? "audio"
          : ["arte-nuevos-medios", "estrategia-producto"].includes(service.slug) ? "art" : "fabrication";
        const isGeneric = /^(?:Imagen \d+ del servicio \d+|Image \d+ for service \d+)$/i.test(description);
        const alt = /[\p{L}\p{N}]/u.test(description) && !isGeneric ? description : photoDescriptions[area][locale];
        return (
          <div key={service.slug} className={`${styles.practicePhoto} ${index === 0 ? styles.practicePhotoLead : ""}`}>
            <Image src={image.src} alt={alt} fill loading="lazy"
              sizes={index === 0 ? "(min-width: 1320px) 572px, (min-width: 768px) 44vw, 100vw" : "(min-width: 1320px) 280px, (min-width: 768px) 22vw, 50vw"}
              onError={() => setFailedSources((previous) => new Set(previous).add(image.src))} />
          </div>
        );
      })}
    </div>
  );
}
