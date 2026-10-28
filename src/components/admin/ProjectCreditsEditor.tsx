"use client";

import { useId } from "react";
import { PROJECT_EDITORIAL_LABELS, projectEditorialLabel, type ProjectEditorialLabel } from "@/domain/project-presentation";
import {
  createProjectCreditEntry, moveProjectCredit,
  type ProjectCreditsDraft, type ProjectCreditEntryDraft,
} from "@/lib/project-credit-form";

const inputClass = "w-full rounded-xl border border-foreground/15 bg-foreground/5 px-3 py-2 text-sm outline-none transition focus:border-foreground/40 focus:bg-background";
const buttonClass = "min-h-11 rounded-full border border-foreground/15 px-3 py-2 text-xs font-semibold text-foreground/70 transition hover:border-foreground/40 hover:text-foreground disabled:opacity-40";

export default function ProjectCreditsEditor({ value, onChange, errors, disabled = false }: {
  value: ProjectCreditsDraft;
  onChange: (value: ProjectCreditsDraft) => void;
  errors: Record<string, string>;
  disabled?: boolean;
}) {
  const id = useId();
  const presentation = value.editorialPresentation;
  const field = (label: string, path: string, content: string, change: (text: string) => void, multiline = false, fieldId = path, placeholder?: string) => {
    const error = errors[path];
    const inputId = `${id}-${fieldId}`;
    const props = {
      id: inputId, value: content, placeholder, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => change(event.target.value),
      "aria-invalid": Boolean(error), "aria-describedby": error ? `${inputId}-error` : undefined,
      className: inputClass,
    };
    return <div key={inputId} className="space-y-2">
      <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-[0.18em] text-foreground/60">{label}</label>
      {multiline ? <textarea {...props} rows={4} /> : <input {...props} />}
      {error && <p id={`${inputId}-error`} role="alert" className="text-sm text-red-600">{error}</p>}
    </div>;
  };
  const list = (key: "artisticAuthorship" | "additionalCredits", title: string, addLabel: string) => {
    const entries = value[key];
    const isAuthor = key === "artisticAuthorship";
    const update = (entry: ProjectCreditEntryDraft) => onChange({ ...value, [key]: entries.map((item) => item.id === entry.id ? entry : item) });
    return <fieldset className="min-w-0 space-y-4" aria-describedby={`${id}-${key}-help`}>
      <legend className="text-sm font-semibold text-foreground/80">{title}</legend>
      <p id={`${id}-${key}-help`} className="text-sm text-foreground/60">
        {isAuthor ? "Artistas o colectivos responsables de la creación. La función es opcional; si la introduces, completa ES y EN."
          : "Personas o equipos y su responsabilidad. Completa el nombre y la función en ES y EN."}
      </p>
      {errors[key] && <p role="alert" className="text-sm text-red-600">{errors[key]}</p>}
      <ol className="space-y-4">
        {entries.map((entry, index) => <li key={entry.id} className="space-y-3 rounded-2xl border border-foreground/10 bg-background/70 p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-semibold text-foreground/60">{isAuthor ? "Autoría" : "Crédito"} {index + 1}</p>
            <div className="flex flex-wrap gap-2">
              <button type="button" className={buttonClass} disabled={index === 0} aria-label={`Subir ${isAuthor ? "autoría" : "crédito"} ${index + 1}`}
                onClick={() => onChange({ ...value, [key]: moveProjectCredit(entries, index, -1) })}>Subir</button>
              <button type="button" className={buttonClass} disabled={index === entries.length - 1} aria-label={`Bajar ${isAuthor ? "autoría" : "crédito"} ${index + 1}`}
                onClick={() => onChange({ ...value, [key]: moveProjectCredit(entries, index, 1) })}>Bajar</button>
              <button type="button" className={buttonClass} aria-label={`Eliminar ${isAuthor ? "autoría" : "crédito"} ${index + 1}`}
                onClick={() => onChange({ ...value, [key]: entries.filter((item) => item.id !== entry.id) })}>Eliminar</button>
            </div>
          </div>
          {field("Nombre", `${key}.${index}.name`, entry.name, (name) => update({ ...entry, name }), false, `${entry.id}-name`)}
          <div className="grid gap-3 md:grid-cols-2">
            {field(`Función — ES${isAuthor ? " (opcional)" : ""}`, `${key}.${index}.role.es`, entry.role.es, (es) => update({ ...entry, role: { ...entry.role, es } }), false, `${entry.id}-role-es`)}
            {field(`Función — EN${isAuthor ? " (opcional)" : ""}`, `${key}.${index}.role.en`, entry.role.en, (en) => update({ ...entry, role: { ...entry.role, en } }), false, `${entry.id}-role-en`)}
          </div>
          {errors[`${key}.${index}.role`] && <p role="alert" className="text-sm text-red-600">{errors[`${key}.${index}.role`]}</p>}
        </li>)}
      </ol>
      <button type="button" className={buttonClass} onClick={() => onChange({ ...value, [key]: [...entries, createProjectCreditEntry()] })}>{addLabel}</button>
    </fieldset>;
  };

  return <fieldset disabled={disabled} className="min-w-0 space-y-6 rounded-3xl border border-foreground/10 p-4 sm:p-6">
    <legend className="px-2 text-base font-semibold text-foreground">Autoría, participación y créditos</legend>
    <p className="text-sm text-foreground/60">Información opcional e independiente del cliente y las organizaciones asociadas. No se asigna autoría ni participación automáticamente.</p>
    <fieldset className="min-w-0 space-y-3 rounded-2xl border border-foreground/10 p-4">
      <legend className="px-1 text-sm font-semibold text-foreground/80">Presentación en la ficha pública</legend>
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input type="checkbox" checked={presentation.visible}
          onChange={(event) => onChange({ ...value, editorialPresentation: { ...presentation, visible: event.target.checked } })} />
        Mostrar el bloque de información del proyecto
      </label>
      <label className="flex min-h-11 items-center gap-3 text-sm">
        <input type="checkbox" checked={presentation.showHeading}
          onChange={(event) => onChange({ ...value, editorialPresentation: { ...presentation, showHeading: event.target.checked } })} />
        Mostrar el título principal del bloque
      </label>
      <p className="text-sm text-foreground/60">Para quitar solo «Sobre el proyecto», desmarca el título. Al ocultar todo el bloque se retiran de la ficha la descripción, participación, información, autoría y créditos; sus datos se conservan para volver a mostrarlos.</p>
      <details className="min-w-0">
        <summary className="min-h-11 cursor-pointer py-3 text-sm font-semibold text-foreground/80">Personalizar títulos y etiquetas</summary>
        <p className="mb-4 text-sm text-foreground/60">Estos ajustes son exclusivos de este proyecto. Completa ES y EN para personalizar una etiqueta. Deja ambas versiones vacías para recuperar el nombre predeterminado.</p>
        <div className="space-y-4">
          {(Object.keys(PROJECT_EDITORIAL_LABELS) as ProjectEditorialLabel[]).map((key) => <div key={key} className="grid gap-3 md:grid-cols-2">
            {(["es", "en"] as const).map((locale) => field(
              `${PROJECT_EDITORIAL_LABELS[key].es} — ${locale.toUpperCase()}`,
              `editorialPresentation.labels.${key}.${locale}`,
              presentation.labels[key][locale],
              (text) => onChange({ ...value, editorialPresentation: { ...presentation, labels: {
                ...presentation.labels, [key]: { ...presentation.labels[key], [locale]: text },
              } } }), false, `presentation-${key}-${locale}`, PROJECT_EDITORIAL_LABELS[key][locale],
            ))}
          </div>)}
        </div>
      </details>
    </fieldset>
    {list("artisticAuthorship", projectEditorialLabel(presentation, "authorship").es, "Agregar artista")}
    <fieldset className="min-w-0 space-y-3">
      <legend className="text-sm font-semibold text-foreground/80">{projectEditorialLabel(presentation, "contribution").es}</legend>
      <p className="text-sm text-foreground/60">Describe las tareas realizadas por el estudio. Deja ambas versiones vacías si no deseas registrar participación.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {field("Participación — ES", "studioContribution.es", value.studioContribution.es, (es) => onChange({ ...value, studioContribution: { ...value.studioContribution, es } }), true)}
        {field("Participación — EN", "studioContribution.en", value.studioContribution.en, (en) => onChange({ ...value, studioContribution: { ...value.studioContribution, en } }), true)}
      </div>
      {errors.studioContribution && <p role="alert" className="text-sm text-red-600">{errors.studioContribution}</p>}
    </fieldset>
    {list("additionalCredits", projectEditorialLabel(presentation, "additionalCredits").es, "Agregar crédito")}
  </fieldset>;
}
