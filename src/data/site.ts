import { DEFAULT_SITE_CONTENT } from "@/content/site";
import type { SiteContent } from "@/domain/site";
import { hasDatabaseConfig } from "@/lib/env";
import { fetchSiteContent } from "@/server/site";

const mergeSiteContent = (fetched: SiteContent | null): SiteContent => ({
  ...DEFAULT_SITE_CONTENT,
  ...(fetched ?? {}),
});

export const getSiteContent = async (): Promise<SiteContent> => {
  if (!hasDatabaseConfig()) {
    return DEFAULT_SITE_CONTENT;
  }

  const site = await fetchSiteContent();
  return mergeSiteContent(site);
};
