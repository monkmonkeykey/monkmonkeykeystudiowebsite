import { NextResponse } from "next/server";
import { z } from "zod";

import { getSiteContent } from "@/data/site";
import { sendContactEmail } from "@/server/email";

const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const requestsByIp = new Map<string, number[]>();

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  organization: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(40).optional(),
  subject: z.string().trim().max(160).optional(),
  message: z.string().trim().min(1).max(5000),
  website: z.string().max(0).optional(),
}).superRefine((data, context) => {
  for (const [field, value] of Object.entries(data)) {
    if (typeof value === "string" && /[\r\n]/.test(value)) {
      context.addIssue({
        code: "custom",
        path: [field],
        message: "Line breaks are not allowed in this field",
      });
    }
  }
});

const getClientIp = (request: Request): string => {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return forwardedFor?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
};

const isRateLimited = (ip: string): boolean => {
  const now = Date.now();
  const recentRequests = (requestsByIp.get(ip) ?? []).filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestsByIp.set(ip, recentRequests);
    return true;
  }

  recentRequests.push(now);
  requestsByIp.set(ip, recentRequests);
  return false;
};

export async function POST(request: Request) {
  const data = await request.json().catch(() => null);

  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid contact details" },
      { status: 400 },
    );
  }

  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 },
    );
  }

  if (parsed.data.website) {
    return NextResponse.json({ error: "Invalid contact details" }, { status: 400 });
  }

  const siteContent = await getSiteContent();
  const recipient = process.env.CONTACT_RECIPIENT || siteContent.contact.email;
  const from = process.env.CONTACT_FROM || undefined;

  if (!recipient) {
    return NextResponse.json(
      { error: "No contact recipient configured" },
      { status: 500 },
    );
  }

  try {
    await sendContactEmail({
      from,
      recipient,
      ...parsed.data,
    });
  } catch (error) {
    console.error("Failed to send contact email", error);
    const message = error instanceof Error ? error.message : "Failed to send message";
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
