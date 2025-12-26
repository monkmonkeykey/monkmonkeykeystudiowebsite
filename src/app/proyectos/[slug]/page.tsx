import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ProjectDetail } from "@/components/projects/project-detail";
import { PROJECT_CATEGORY_LABELS } from "@/domain/projects";
import { getProjectBySlug, getProjects } from "@/data/projects";

const DEFAULT_DESCRIPTION =
  "MonkMonkeyKey acompaña a equipos de producto y museografía con experiencias memorables.";

type ProjectPageParams = { slug: string };

type ProjectPageProps = {
  params: ProjectPageParams;
};

export async function generateStaticParams() {
  const projects = await getProjects();

  return projects.map((project) => ({
    slug: project.slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = params;

  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Proyecto no encontrado · MonkMonkeyKey",
      description: DEFAULT_DESCRIPTION,
    };
  }

  const title = `${project.name.es} · MonkMonkeyKey`;
  const description = project.subtitle.es || DEFAULT_DESCRIPTION;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [
        {
          url: project.cover.src,
          alt: project.cover.alt.es,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [project.cover.src],
    },
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = params;

  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-10">
      <ProjectDetail project={project} categoryLabels={PROJECT_CATEGORY_LABELS} />
    </div>
  );
}
