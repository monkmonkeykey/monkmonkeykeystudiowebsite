import type { Service, ServiceGalleryImage } from "@/content/services";

// Use the image hosts already supported by Next.js. Exclude illustration fallbacks.
export const isServicePhotoSource = (src: string): boolean => {
  const value = src.trim();
  if (value.startsWith("/") && !value.startsWith("//")) {
    return /^\/[^?#]+\.(?:jpe?g|png|webp|avif)(?:\?[^#]*)?$/i.test(value);
  }
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname === "res.cloudinary.com"
      && url.pathname.includes("/image/upload/")
      && !/\.(?:svg|pdf|gif)(?:$|\/)/i.test(url.pathname);
  } catch {
    return false;
  }
};

export const servicePhotoCandidates = (service: Service): ServiceGalleryImage[] => {
  const photos = (service.gallery ?? []).filter((image) => isServicePhotoSource(image.src));
  const featured = photos.find((image) => image.src === service.homeFeaturedImageSrc);
  return featured ? [featured, ...photos.filter((image) => image.src !== featured.src)] : photos;
};

// Current CMS slugs and their static-content predecessors, in editorial order.
const SERVICE_AREAS = [
  ["audio", "diseno-ux-ui"],
  ["arte-nuevos-medios", "estrategia-producto"],
  ["impresion3d", "experimentacion-growth"],
];

export const practicePhotoServices = (services: Service[]): Service[] => SERVICE_AREAS
  .map((slugs) => services.find((service) => slugs.includes(service.slug)))
  .filter((service): service is Service => Boolean(service));
