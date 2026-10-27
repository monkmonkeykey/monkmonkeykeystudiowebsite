"use client";

import Image from "next/image";
import { useId } from "react";
import type { ServiceGalleryImage } from "@/content/services";
import type { LocaleText } from "@/lib/i18n";
import { getPlainText } from "@/components/site/rich-text";
import { isServicePhotoSource } from "@/domain/service-photos";

export default function ServiceHomeImagePicker({ title, gallery, value, onChange, onPickLibrary }: {
  title: LocaleText;
  gallery: ServiceGalleryImage[];
  value: string;
  onChange: (src: string) => void;
  onPickLibrary?: () => void;
}) {
  const id = useId();
  const photos = gallery.filter((image) => isServicePhotoSource(image.src));
  const selected = photos.find((image) => image.src === value) ?? photos[0];
  return (
    <div className="space-y-3 rounded-2xl border border-foreground/10 bg-foreground/5 p-3">
      <label htmlFor={id} className="block text-sm font-semibold">Imagen destacada en el Home</label>
      <p className="text-xs text-foreground/60">Elige una fotografía de procesos para Nuestra práctica. La selección automática usa la primera fotografía de la galería.</p>
      <select id={id} aria-label={`Imagen destacada en el Home: ${getPlainText(title.es || title.en)}`} value={value}
        onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-foreground/20 bg-background px-3 py-3 text-sm">
        <option value="">Primera fotografía disponible</option>
        {value && !photos.some((image) => image.src === value) && <option value={value}>Selección no disponible</option>}
        {photos.map((image, index) => <option key={`${image.src}-${index}`} value={image.src}>{index + 1}. {getPlainText(image.alt.es || image.alt.en) || "Fotografía del servicio"}</option>)}
      </select>
      {value && !photos.some((image) => image.src === value) && <p role="alert" className="text-xs text-yellow-300">La selección ya no está en la galería o no es una fotografía válida. Elige otra o vuelve a la selección automática.</p>}
      {selected ? <div className="relative aspect-video max-w-sm overflow-hidden">
        <Image key={selected.src} src={selected.src} alt={`Vista previa de ${getPlainText(title.es || title.en)}`} fill sizes="384px" className="object-cover" onError={(event) => { event.currentTarget.style.visibility = "hidden"; }} />
      </div> : <p className="text-xs text-foreground/60">No hay fotografías disponibles; este servicio no mostrará imagen en el Home.</p>}
      {onPickLibrary && <button type="button" onClick={onPickLibrary} className="rounded-full border border-foreground/20 px-3 py-2 text-xs font-semibold">Elegir destacada de biblioteca</button>}
      <p className="text-xs text-foreground/60">Guarda los cambios del contenido del sitio para publicar la selección. El texto alternativo se edita en la galería del servicio.</p>
    </div>
  );
}
