"use client";

import type { Client } from "@/content/clients";
import type { SiteContent } from "@/domain/site";
import { RichText } from "@/components/site/rich-text";
import { CollaboratorCard, CollaboratorGrid } from "@/components/site/CollaboratorCard";

type ClientsPageClientProps = {
  clients: Client[];
  copy: SiteContent["clientsPage"];
};

export default function ClientsPageClient({ clients, copy }: ClientsPageClientProps) {
  return (
    <div className="space-y-16 sm:space-y-24">
      <header className="grid gap-8 border-t border-line pt-5 lg:grid-cols-12">
        <div className="lg:col-span-10">
        <RichText
          as="h1"
          value={copy.title}
          className="studio-page-title"
        />
        <RichText
          value={copy.copy}
          className="studio-page-intro"
        />
        </div>
      </header>

      <CollaboratorGrid>
        {clients.map((client) => (
          <CollaboratorCard key={client.slug} {...client} showImageCaption />
        ))}
      </CollaboratorGrid>
    </div>
  );
}
