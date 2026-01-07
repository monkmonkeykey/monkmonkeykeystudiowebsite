import tls from "node:tls";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

type ContactEmailPayload = {
  from?: string;
  recipient: string;
  name: string;
  email: string;
  organization?: string;
  phone?: string;
  subject?: string;
  message: string;
};

type EmailProvider = "resend" | "gmail";

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

function resolveProvider(): EmailProvider {
  if (process.env.RESEND_API_KEY) {
    return "resend";
  }

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    return "gmail";
  }

  throw new Error(
    "Email provider not configured (RESEND_API_KEY/CONTACT_FROM or GMAIL_USER/GMAIL_APP_PASSWORD)",
  );
}

async function sendViaResend(payload: ContactEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = payload.from || process.env.CONTACT_FROM || payload.email;

  if (!apiKey || !from) {
    throw new Error("Resend provider not configured (RESEND_API_KEY/CONTACT_FROM)");
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

async function readSmtpResponse(socket: tls.TLSSocket) {
  return new Promise<string>((resolve, reject) => {
    let buffer = "";

    const onData = (chunk: Buffer) => {
      buffer += chunk.toString("utf8");

      const lines = buffer.split(/\r?\n/).filter(Boolean);
      const lastLine = lines[lines.length - 1];

      if (!lastLine) return;

      const match = lastLine.match(/^(\d{3})([ -])/);

      if (!match) return;
      if (match[2] === "-") return; // multi-line, wait for final line

      socket.off("data", onData);
      socket.off("error", onError);

      const code = Number(match[1]);
      if (code >= 400) {
        reject(new Error(`SMTP error ${code}: ${buffer.trim()}`));
      } else {
        resolve(buffer);
      }
    };

    const onError = (error: Error) => {
      socket.off("data", onData);
      reject(error);
    };

    socket.on("data", onData);
    socket.on("error", onError);
  });
}

async function smtpCommand(socket: tls.TLSSocket, command: string) {
  socket.write(`${command}\r\n`);
  return readSmtpResponse(socket);
}

async function sendViaGmail(payload: ContactEmailPayload) {
  const user = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;
  const host = process.env.GMAIL_HOST || "smtp.gmail.com";
  const port = Number(process.env.GMAIL_PORT || 465);
  const from = process.env.CONTACT_FROM || user;

  if (!user || !password || !from) {
    throw new Error(
      "Gmail provider not configured (GMAIL_USER/GMAIL_APP_PASSWORD/CONTACT_FROM)",
    );
  }

  const subject = payload.subject?.trim()
    ? payload.subject.trim()
    : `Nuevo mensaje de ${payload.name}`;

  const socket = tls.connect({ host, port, rejectUnauthorized: true });

  try {
    await new Promise<void>((resolve, reject) => {
      if (socket.readyState === "open") return resolve();
      socket.once("secureConnect", () => resolve());
      socket.once("error", reject);
    });

    await readSmtpResponse(socket); // initial 220 greeting
    await smtpCommand(socket, "EHLO localhost");
    await smtpCommand(socket, "AUTH LOGIN");
    await smtpCommand(socket, Buffer.from(user).toString("base64"));
    await smtpCommand(socket, Buffer.from(password).toString("base64"));
    await smtpCommand(socket, `MAIL FROM:<${from}>`);
    await smtpCommand(socket, `RCPT TO:<${payload.recipient}>`);
    await smtpCommand(socket, "DATA");

    const boundary = `----=_Part_${Date.now()}`;
    const headers = [
      `From: \"${payload.name}\" <${from}>`,
      `To: ${payload.recipient}`,
      `Reply-To: ${payload.email}`,
      `Subject: ${subject}`,
      "MIME-Version: 1.0",
      `Content-Type: multipart/alternative; boundary=\"${boundary}\"`,
    ].join("\r\n");

    const body = [
      `--${boundary}`,
      "Content-Type: text/plain; charset=\"UTF-8\"",
      "",
      formatText(payload),
      `--${boundary}`,
      "Content-Type: text/html; charset=\"UTF-8\"",
      "",
      formatHtml(payload),
      `--${boundary}--`,
      "",
    ].join("\r\n");

    socket.write(`${headers}\r\n\r\n${body}\r\n.\r\n`);
    await readSmtpResponse(socket);
    await smtpCommand(socket, "QUIT");
  } finally {
    socket.end();
  }
}

export async function sendContactEmail(payload: ContactEmailPayload) {
  const provider = resolveProvider();

  if (provider === "resend") {
    return sendViaResend(payload);
  }

  return sendViaGmail(payload);
}
