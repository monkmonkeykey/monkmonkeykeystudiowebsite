import type { LocaleText } from "@/lib/i18n";
import type { Service } from "@/content/services";

export type SiteCopy = {
  home: {
    heroHeadline: LocaleText;
    heroSubtitle: LocaleText;
    heroPrimaryCta: LocaleText;
    heroSecondaryCta: LocaleText;
    heroTags: LocaleText[];
    heroVideo?: {
      url?: string;
      publicId?: string;
      poster?: string;
    };
    servicesTitle: LocaleText;
    servicesCopy: LocaleText;
    servicesCta: LocaleText;
    servicesTags: LocaleText[];
    projectsTitle: LocaleText;
    projectsCta: LocaleText;
    clientsTitle: LocaleText;
    clientsWebsiteLabel: LocaleText;
    contactCta: LocaleText;
  };
  servicesPage: {
    title: LocaleText;
    copy: LocaleText;
    ctaLabel: LocaleText;
    chips: LocaleText[];
    outcomesLabel: LocaleText;
  };
  contact: {
    title: LocaleText;
    copy: LocaleText;
    email: string;
    preparation: LocaleText[];
  };
  services: Service[];
};

export type SiteContent = SiteCopy & {
  updatedAt?: string;
};
