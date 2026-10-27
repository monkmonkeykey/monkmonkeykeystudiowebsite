"use client";

import { useId } from "react";
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
  const field = (label: string, path: string, content: string, change: (text: string) => void, multiline = false, fieldId = path) => {
    const error = errors[path];
    const inputId = `${id}-${fieldId}`;
    const props = {
      id: inputId, value: content, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => change(event.target.value),
      "aria-invalid": Boolean(error), "aria-describedby": error ? `${inputId}-error` : undefined,
      className: inputClass,
    };
    return <div className="space-y-2">
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
    {list("artisticAuthorship", "Autoría artística", "Agregar artista")}
    <fieldset className="min-w-0 space-y-3">
      <legend className="text-sm font-semibold text-foreground/80">Participación de monkmonkeykey</legend>
      <p className="text-sm text-foreground/60">Describe las tareas realizadas por el estudio. Deja ambas versiones vacías si no deseas registrar participación.</p>
      <div className="grid gap-3 md:grid-cols-2">
        {field("Participación — ES", "studioContribution.es", value.studioContribution.es, (es) => onChange({ ...value, studioContribution: { ...value.studioContribution, es } }), true)}
        {field("Participación — EN", "studioContribution.en", value.studioContribution.en, (en) => onChange({ ...value, studioContribution: { ...value.studioContribution, en } }), true)}
      </div>
      {errors.studioContribution && <p role="alert" className="text-sm text-red-600">{errors.studioContribution}</p>}
    </fieldset>
    {list("additionalCredits", "Créditos adicionales", "Agregar crédito")}
  </fieldset>;
}
