const RESEND_ENDPOINT = "https://api.resend.com/emails";

type ContactEmailPayload = {
  recipient: string;
  name: string;
  email: string;
  organization?: string;
  phone?: string;
  subject?: string;
  message: string;
};

function formatHtml(payload: ContactEmailPayload) {
  const details = [
    `<p><strong>Nombre:</strong> ${payload.name}</p>`,
    `<p><strong>Email:</strong> ${payload.email}</p>`,
  ];

  if (payload.organization) {
    details.push(`<p><strong>Organización:</strong> ${payload.organization}</p>`);
  }

  if (payload.phone) {
    details.push(`<p><strong>Teléfono:</strong> ${payload.phone}</p>`);
  }

  const message = `<p><strong>Mensaje:</strong></p><p>${payload.message.replace(/\n/g, "<br/>")}</p>`;

  return `${details.join("")}${message}`;
}

function formatText(payload: ContactEmailPayload) {
  const parts = [
    `Nombre: ${payload.name}`,
    `Email: ${payload.email}`,
  ];

  if (payload.organization) {
    parts.push(`Organización: ${payload.organization}`);
  }

  if (payload.phone) {
    parts.push(`Teléfono: ${payload.phone}`);
  }

  parts.push("Mensaje:");
  parts.push(payload.message);

  return parts.join("\n");
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM || payload.email;

  if (!apiKey || !from) {
    throw new Error("Email provider not configured (RESEND_API_KEY/CONTACT_FROM)");
  }

  const subject = payload.subject?.trim()
    ? payload.subject.trim()
    : `Nuevo mensaje de ${payload.name}`;

  const response = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: payload.recipient,
      reply_to: payload.email,
      subject,
      html: formatHtml(payload),
      text: formatText(payload),
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend request failed: ${response.status} ${body}`);
  }
}
