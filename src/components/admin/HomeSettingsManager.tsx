"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { getPlainText } from "@/components/site/rich-text";
import {
  homeSelectionError,
  isHomeProjectEligible,
  resolveHomeProjects,
  type HomeProjectSlots,
  type HomeSettings,
} from "@/domain/home";
import { formatProjectTimeline, type Project } from "@/domain/projects";
import { extractApiErrorMessage } from "@/lib/admin-api";

const projectTitle = (project: Project) => getPlainText(project.name.es || project.name.en);
const searchText = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const thumbnail = (project: Project) => project.cover?.src && isHomeProjectEligible({ ...project, isPrivate: false }) ? (
  <Image src={project.cover.src} alt="" width={72} height={48} unoptimized className="h-12 w-18 shrink-0 rounded-lg object-cover" />
) : null;

export default function HomeSettingsManager({
  projects,
  settings,
  databaseReady,
}: {
  projects: Project[];
  settings: HomeSettings;
  databaseReady: boolean;
}) {
  const router = useRouter();
  const [slots, setSlots] = useState<HomeProjectSlots>(() => [settings.featuredProjectSlugs[0], settings.featuredProjectSlugs[1], settings.featuredProjectSlugs[2] ?? null]);
  const [searches, setSearches] = useState<[string, string, string]>(["", "", ""]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ error: boolean; text: string } | null>(null);
  const selectionError = homeSelectionError(projects, slots);
  const preview = resolveHomeProjects(projects, slots);

  const select = (index: number, slug: string | null) => {
    setSlots((previous) => {
      const next: HomeProjectSlots = [...previous];
      next[index] = slug;
      return next;
    });
    setMessage(null);
  };

  const save = async () => {
    if (selectionError) {
      setMessage({ error: true, text: selectionError });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const response = await fetch("/api/site/home", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featuredProjectSlugs: slots }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(extractApiErrorMessage(payload, "No se pudo guardar la configuración."));
      setMessage({ error: false, text: "Configuración del inicio guardada. La portada ya usa este orden." });
      router.refresh();
    } catch (error) {
      setMessage({ error: true, text: error instanceof Error ? error.message : "No se pudo conectar. Intenta de nuevo." });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6 rounded-4xl border border-foreground/10 bg-foreground/5 p-6 shadow-sm" aria-labelledby="home-settings-title">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 id="home-settings-title" className="text-xl font-semibold text-foreground">Configuración del inicio</h2>
          <p className="mt-2 text-sm text-foreground/70">Elige y ordena los proyectos de portada. El orden del archivo general se conserva.</p>
        </div>
        <button type="button" onClick={save} disabled={!databaseReady || saving || Boolean(selectionError)}
          className="shrink-0 rounded-full bg-foreground px-4 py-3 text-sm font-semibold text-background disabled:cursor-not-allowed disabled:opacity-50">
          {saving ? "Guardando..." : "Guardar configuración"}
        </button>
      </header>

      {message && <p role={message.error ? "alert" : "status"} className="rounded-2xl border border-foreground/10 bg-background px-4 py-3 text-sm">{message.text}</p>}
      {selectionError && <p role="alert" className="rounded-2xl border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">{selectionError} El Home usará una alternativa pública mientras corriges la selección.</p>}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold">Proyectos destacados en portada</h3>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={saving || slots[0] === slots[1]} onClick={() => { setSlots([slots[1], slots[0], slots[2] ?? null]); setMessage(null); }}
            className="rounded-full border border-foreground/20 bg-background px-4 py-3 text-sm disabled:opacity-50">{slots[2] ? "Intercambiar 1 y 2" : "Intercambiar posiciones"}</button>
          {slots[2] && <button type="button" disabled={saving} onClick={() => {
            const second = slots[1] ?? preview[1]?.slug ?? null;
            setSlots([slots[0], slots[2] ?? null, second === slots[2] ? null : second]);
            setMessage(null);
          }}
            className="rounded-full border border-foreground/20 bg-background px-4 py-3 text-sm disabled:opacity-50">Intercambiar 2 y 3</button>}
        </div>
      </div>
      <p className="text-sm text-foreground/70">Solo puedes elegir proyectos públicos con portada. Usa «Orden automático» para completar las primeras dos posiciones. El tercer proyecto es opcional: elige uno para añadirlo o «Sin tercer proyecto» para mostrar solo dos.</p>

      <div className="grid gap-4 md:grid-cols-2">
        {slots.map((slug, index) => {
          const current = projects.find((project) => project.slug === slug);
          const query = searchText(searches[index]);
          const matches = projects.filter((project) => searchText(`${projectTitle(project)} ${project.name.en} ${formatProjectTimeline(project)} ${project.slug}`).includes(query));
          return (
            <fieldset key={index} disabled={saving} className="min-w-0 space-y-3 rounded-3xl border border-foreground/10 bg-background p-4">
              <legend className="px-2 text-sm font-semibold">Proyecto destacado {index + 1}{index === 2 ? " (opcional)" : ""}</legend>
              <details>
                <summary className="flex min-h-16 cursor-pointer items-center gap-3 rounded-2xl border border-foreground/20 p-3 text-sm">
                  {current && thumbnail(current)}
                  <span className="min-w-0 break-words">{current ? projectTitle(current) : slug ? `Referencia no disponible: ${slug}` : index === 2 ? "Sin tercer proyecto" : "Orden automático"}<span className="mt-1 block text-xs text-foreground/60">Cambiar selección ▾</span></span>
                </summary>
                <div className="mt-3 space-y-3">
                  <label className="block text-sm" htmlFor={`home-project-search-${index}`}>Buscar proyecto destacado {index + 1}</label>
                  <input id={`home-project-search-${index}`} type="search" value={searches[index]} placeholder="Título o año"
                    onChange={(event) => setSearches((previous) => {
                      const next: [string, string, string] = [...previous];
                      next[index] = event.target.value;
                      return next;
                    })}
                    className="w-full rounded-2xl border border-foreground/20 bg-background px-3 py-3 text-sm" />
                  <div className="max-h-80 space-y-2 overflow-y-auto" role="group" aria-label={`Opciones del proyecto destacado ${index + 1}`}>
                    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-2xl border border-foreground/10 p-3 text-sm">
                      <input type="radio" name={`home-project-${index}`} checked={slug === null} onChange={() => select(index, null)} />
                      {index === 2 ? "Sin tercer proyecto" : "Orden automático"}
                    </label>
                    {matches.map((project) => {
                      const duplicate = slots.some((otherSlug, otherIndex) => otherIndex !== index && project.slug === otherSlug);
                      const eligible = isHomeProjectEligible(project);
                      return (
                        <label key={project.slug} className={`flex min-h-16 items-center gap-3 rounded-2xl border border-foreground/10 p-3 text-sm ${eligible && !duplicate ? "cursor-pointer" : "opacity-50"}`}>
                          <input type="radio" name={`home-project-${index}`} value={project.slug} checked={slug === project.slug} disabled={!eligible || duplicate} onChange={() => select(index, project.slug)} />
                          {thumbnail(project)}
                          <span className="min-w-0 break-words"><span className="block font-medium">{projectTitle(project)}</span>
                            <span className="text-xs text-foreground/60">{formatProjectTimeline(project) || "Sin año"} · {project.isPrivate ? "Privado" : "Publicado"}{!eligible && !project.isPrivate ? " · Sin portada válida" : ""}{duplicate ? " · Elegido en la otra posición" : ""}</span>
                          </span>
                        </label>
                      );
                    })}
                    {!matches.length && <p className="p-3 text-sm text-foreground/60">No hay proyectos que coincidan con la búsqueda.</p>}
                  </div>
                </div>
              </details>
            </fieldset>
          );
        })}
      </div>

      <div className="space-y-3" aria-label="Vista previa de la portada">
        <h4 className="text-sm font-semibold">Vista previa del orden en portada</h4>
        <ol className="grid gap-3 sm:grid-cols-2">
          {preview.map((project, index) => <li key={project.slug} className="flex min-w-0 items-center gap-3 rounded-2xl border border-foreground/10 bg-background p-3">
            <span className="text-sm text-foreground/60">{index + 1}.</span>{thumbnail(project)}
            <span className="min-w-0 break-words text-sm">{projectTitle(project)}<span className="block text-xs text-foreground/60">{formatProjectTimeline(project)}</span></span>
          </li>)}
        </ol>
        {preview.length < (slots[2] ? 3 : 2) && <p className="text-sm text-foreground/70">No hay suficientes proyectos públicos con portada. Se mostrarán únicamente los disponibles.</p>}
      </div>
    </section>
  );
}
