import ServicesPageClient from "./page.client";

import { getSiteContent } from "@/data/site";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ServicesPage() {
  const siteContent = await getSiteContent();

  return <ServicesPageClient services={siteContent.services} siteContent={siteContent} />;
}
