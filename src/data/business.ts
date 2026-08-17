export type ContactKey =
  | "school"
  | "balloon"
  | "birthdays"
  | "operations"
  | "sports"
  | "restaurantPrimary"
  | "restaurantSecondary";

export type Contact = {
  key: ContactKey;
  label: string;
  purpose: string;
  phone: string;
  cta: string;
  ariaLabel: string;
};

const siteUrlFromEnv = import.meta.env.PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
const mapUrlFromEnv = import.meta.env.PUBLIC_MAP_URL || "";

export const hasConfiguredSiteUrl = Boolean(siteUrlFromEnv);

export const business = {
  name: "FK Milutinac Zemun",
  legalName: "Fudbalski klub Milutinac Zemun",
  shortName: "FK Milutinac",
  founded: "1947",
  locationName: "SC Milutinac Gardoš",
  address: {
    street: "Nade Dimić 5–7",
    city: "Zemun",
    region: "Beograd",
    country: "RS",
    postalCountry: "Srbija",
    line: "Nade Dimić 5–7, Zemun, Beograd",
    compactLine: "Nade Dimić 5–7, Zemun",
    displayLine: "NADE DIMIĆ 5–7 / ZEMUN / SC MILUTINAC GARDOŠ"
  },
  instagram: {
    handle: "@fk.milutinac",
    url: "https://www.instagram.com/fk.milutinac/",
    label: "FK Milutinac na Instagramu"
  },
  siteUrl: siteUrlFromEnv || "http://localhost:4321",
  hasConfiguredSiteUrl,
  environment: import.meta.env.PUBLIC_ENVIRONMENT || "local",
  mapUrl:
    mapUrlFromEnv ||
    "https://www.google.com/maps/search/?api=1&query=Nade%20Dimi%C4%87%205%E2%80%937%2C%20Zemun%2C%20Beograd",
  logo: "/logo-clean.png",
  logoWebp: "/logo-clean.webp",
  originalLogo: "/logo.png",
  ogImage: "/og.png"
} as const;

export const contacts: Record<ContactKey, Contact> = {
  school: {
    key: "school",
    label: "Škola fudbala",
    purpose: "Upis, aktuelne grupe i termini.",
    phone: "+381 69 3648 801",
    cta: "Pozovi školu fudbala",
    ariaLabel: "Pozovi školu fudbala FK Milutinac"
  },
  balloon: {
    key: "balloon",
    label: "Balon",
    purpose: "Rezervisanje termina u balonu.",
    phone: "+381 65 5850 690",
    cta: "Pozovi za termin",
    ariaLabel: "Pozovi za termin u balonu FK Milutinac"
  },
  birthdays: {
    key: "birthdays",
    label: "Dečji rođendani",
    purpose: "Raspoloživost i dogovor oko organizacije.",
    phone: "+381 69 3648 803",
    cta: "Pozovi za rođendan",
    ariaLabel: "Pozovi FK Milutinac za fudbalski rođendan"
  },
  operations: {
    key: "operations",
    label: "Klub i organizacija",
    purpose: "Operativna pitanja u vezi sa klubom.",
    phone: "+381 69 3648 804",
    cta: "Pozovi operativnog direktora",
    ariaLabel: "Pozovi operativnog direktora FK Milutinac"
  },
  sports: {
    key: "sports",
    label: "Sportski sektor",
    purpose: "Pitanja u vezi sa sportskim radom i selekcijama.",
    phone: "+381 69 3648 800",
    cta: "Pozovi sportskog direktora",
    ariaLabel: "Pozovi sportskog direktora FK Milutinac"
  },
  restaurantPrimary: {
    key: "restaurantPrimary",
    label: "Restoran i proslave",
    purpose: "Privatne i poslovne proslave.",
    phone: "+381 69 3648 803",
    cta: "Pozovi restoran",
    ariaLabel: "Pozovi Restoran Milutinac"
  },
  restaurantSecondary: {
    key: "restaurantSecondary",
    label: "Restoran i proslave",
    purpose: "Dodatni kontakt za restoran i proslave.",
    phone: "+381 69 3648 804",
    cta: "Pozovi +381 69 3648 804",
    ariaLabel: "Pozovi dodatni kontakt za Restoran Milutinac"
  }
};

export function telHref(phone: string) {
  return `tel:${phone.replace(/[^\d+]/g, "")}`;
}

export function absoluteUrl(path = "/") {
  if (/^https?:\/\//.test(path)) return path;
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${business.siteUrl}${cleanPath}`;
}
