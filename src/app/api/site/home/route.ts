import { NextResponse } from "next/server";

import { homeSelectionError } from "@/domain/home";
import { hasDatabaseConfig } from "@/lib/env";
import { verifyRequestSession } from "@/server/auth";
import { saveHomeSettings } from "@/server/home";
import { fetchProjectsFromDatabase } from "@/server/projects";
import { homeSettingsSchema } from "@/server/validation";

export async function POST(request: Request) {
  const session = verifyRequestSession(request.headers.get("cookie") ?? undefined);
  if (!session || session.subject !== "admin") {
    return NextResponse.json({ error: "No autorizado. Inicia sesión como administrador." }, { status: 401 });
  }

  // Match the session's SameSite protection and reject explicit cross-origin writes.
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) {
    return NextResponse.json({ error: "Origen de solicitud no autorizado." }, { status: 403 });
  }
  if (!hasDatabaseConfig()) {
    return NextResponse.json({ error: "Configura MongoDB para guardar la configuración del inicio." }, { status: 503 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "El cuerpo de la solicitud no es JSON válido." }, { status: 400 });
  }
  const parsed = homeSettingsSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    // Validate against the actual database, never the Markdown fallback on outage.
    const projects = await fetchProjectsFromDatabase();
    if (!projects) {
      return NextResponse.json({ error: "No se pudo consultar MongoDB. Intenta guardar de nuevo." }, { status: 503 });
    }
    const error = homeSelectionError(projects, parsed.data.featuredProjectSlugs);
    if (error) return NextResponse.json({ error }, { status: 400 });
    const saved = await saveHomeSettings(parsed.data);
    if (!saved) throw new Error("Database unavailable");
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "No se pudo guardar la configuración del inicio. Intenta de nuevo." }, { status: 503 });
  }
}
