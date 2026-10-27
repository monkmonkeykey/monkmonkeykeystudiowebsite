import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetail } from "@/components/projects/project-detail";
import { PROJECT_CATEGORY_LABELS } from "@/domain/projects";
import { getProjectBySlug } from "@/data/projects";
import { getPlainText } from "@/components/site/rich-text";
import { translate } from "@/lib/i18n";

const isSocialImage = (src: string): boolean => {
  if (src.startsWith("/") && !src.startsWith("//")) return true;
  try {
    return ["https:", "http:"].includes(new URL(src).protocol);
  } catch {
    return false;
  }
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

type ProjectPageParams = { slug: string };

type ProjectPageProps = {
  params?: Promise<ProjectPageParams>;
};

async function resolveParams(params?: Promise<ProjectPageParams>) {
  if (!params) {
    notFound();
  }

  const resolved = await params;

  if (!resolved) {
    notFound();
  }

  return resolved;
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await resolveParams(params);

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const name = getPlainText(translate("es", project.name));
  const title = `${name} · MonkMonkeyKey`;
  const description = getPlainText(translate("es", project.subtitle).replace(/<br\s*\/?>|<\/?(?:p|div)\b[^>]*>/gi, " ")).replace(/\s+/g, " ")
    || project.description.map((paragraph) => getPlainText(translate("es", paragraph))).find(Boolean)
    || name;
  const cover = project.cover.src.trim();
  const coverAlt = getPlainText(translate("es", project.cover.alt));
  const images = cover && isSocialImage(cover) ? [{ url: cover, alt: /[\p{L}\p{N}]/u.test(coverAlt) ? coverAlt : name }] : [];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images,
    },
    twitter: {
      card: images.length ? "summary_large_image" : "summary",
      title,
      description,
      images: images.map((image) => image.url),
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await resolveParams(params);

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return <ProjectDetail key={project.slug} project={project} categoryLabels={PROJECT_CATEGORY_LABELS} />;
}
