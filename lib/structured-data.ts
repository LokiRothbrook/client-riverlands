const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://riverlands.org";

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Riverlands",
    url: SITE_URL,
    description:
      "Explore the historic river counties of western Illinois. Events, history, local businesses, and natural beauty.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function articleSchema({
  title,
  description,
  datePublished,
  dateModified,
  author,
  image,
  url,
}: {
  title: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  author: string;
  image?: string;
  url: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Person",
      name: author,
    },
    publisher: {
      "@type": "Organization",
      name: "Riverlands",
      url: SITE_URL,
    },
    ...(image && { image }),
    url,
  };
}

export function eventSchema({
  name,
  description,
  startDate,
  endDate,
  location,
  url,
  image,
}: {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: string;
  url?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name,
    description,
    startDate,
    ...(endDate && { endDate }),
    location: {
      "@type": "Place",
      name: location,
    },
    organizer: {
      "@type": "Organization",
      name: "Riverlands",
      url: SITE_URL,
    },
    ...(url && { url }),
    ...(image && { image }),
  };
}

export function localBusinessSchema({
  name,
  description,
  address,
  url,
  phone,
  image,
}: {
  name: string;
  description: string;
  address?: string;
  url?: string;
  phone?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    ...(address && {
      address: {
        "@type": "PostalAddress",
        streetAddress: address,
      },
    }),
    ...(url && { url }),
    ...(phone && { telephone: phone }),
    ...(image && { image }),
  };
}

export function breadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
