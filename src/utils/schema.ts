import { absoluteUrl, business, contacts, telHref } from "@/data/business";
import { navigation } from "@/data/navigation";
import type { schoolFaq } from "@/data/school";

type Breadcrumb = {
  name: string;
  item: string;
};

type SchemaOptions = {
  path: string;
  breadcrumbs?: Breadcrumb[];
  includeRestaurant?: boolean;
  faq?: typeof schoolFaq;
};

function postalAddress() {
  return {
    "@type": "PostalAddress",
    streetAddress: business.address.street,
    addressLocality: business.address.city,
    addressRegion: business.address.region,
    addressCountry: business.address.country
  };
}

function breadcrumbList(items: Breadcrumb[]) {
  return {
    "@type": "BreadcrumbList",
    "@id": `${absoluteUrl(items.at(-1)?.item || "/")}#breadcrumb`,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.item)
    }))
  };
}

export function makeBreadcrumbs(path: string, label: string): Breadcrumb[] {
  const home = navigation[0];
  return [
    { name: home.label, item: home.href },
    { name: label, item: path }
  ];
}

export function makeSchema({ path, breadcrumbs, includeRestaurant = false, faq }: SchemaOptions) {
  const pageUrl = absoluteUrl(path);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "SportsClub",
      "@id": `${absoluteUrl("/")}#club`,
      name: business.legalName,
      alternateName: business.shortName,
      url: absoluteUrl("/"),
      logo: absoluteUrl(business.logo),
      foundingDate: business.founded,
      address: postalAddress(),
      telephone: contacts.operations.phone,
      sameAs: [business.instagram.url]
    },
    {
      "@type": "SportsActivityLocation",
      "@id": `${absoluteUrl("/sportski-kompleks/")}#sports-location`,
      name: business.locationName,
      address: postalAddress(),
      telephone: contacts.balloon.phone,
      image: absoluteUrl(business.ogImage),
      url: absoluteUrl("/sportski-kompleks/")
    },
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      isPartOf: {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        name: business.name,
        url: absoluteUrl("/")
      },
      about: { "@id": `${absoluteUrl("/")}#club` }
    }
  ];

  if (breadcrumbs?.length) {
    graph.push(breadcrumbList(breadcrumbs));
  }

  if (includeRestaurant) {
    graph.push({
      "@type": "Restaurant",
      "@id": `${absoluteUrl("/restoran-i-proslave/")}#restaurant`,
      name: "Restoran Milutinac",
      address: postalAddress(),
      telephone: [contacts.restaurantPrimary.phone, contacts.restaurantSecondary.phone],
      url: absoluteUrl("/restoran-i-proslave/")
    });
  }

  if (faq?.length) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faq.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: item.answer
        }
      }))
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph
  };
}

export { telHref };
