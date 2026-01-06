import { NextResponse } from "next/server";
import { z } from "zod";

import { getSiteContent } from "@/data/site";
import { sendContactEmail } from "@/server/email";

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  organization: z.string().optional(),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1),
});

export async function POST(request: Request) {
  const data = await request.json().catch(() => null);

  const parsed = contactSchema.safeParse(data);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid contact details" },
      { status: 400 },
    );
  }

  const siteContent = await getSiteContent();
  const recipient = process.env.CONTACT_RECIPIENT || siteContent.contact.email;

  try {
    await sendContactEmail({
      recipient,
      ...parsed.data,
    });
  } catch (error) {
    console.error("Failed to send contact email", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
