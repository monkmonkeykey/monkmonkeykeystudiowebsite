import ContactPageClient from "./page.client";

import { getSiteContent } from "@/data/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ContactPage() {
  const siteContent = await getSiteContent();

  return <ContactPageClient siteContent={siteContent} />;
}
