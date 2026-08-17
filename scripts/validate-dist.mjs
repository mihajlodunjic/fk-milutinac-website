import fs from "node:fs";
import path from "node:path";

const dist = "dist";
const routes = [
  "/",
  "/skola-fudbala/",
  "/klub/",
  "/sportski-kompleks/",
  "/fudbalski-rodjendani/",
  "/restoran-i-proslave/",
  "/kontakt/",
  "/404/"
];

const fileFor = (route) => {
  if (route === "/") return path.join(dist, "index.html");
  if (route === "/404/") return path.join(dist, "404.html");
  return path.join(dist, route, "index.html");
};

const checks = [];
const htmlFiles = routes.map((route) => [route, fs.readFileSync(fileFor(route), "utf8")]);

function add(name, ok, detail = undefined) {
  checks.push({ name, ok, detail });
}

add(
  "routes",
  routes.every((route) => fs.existsSync(fileFor(route))),
  routes.filter((route) => !fs.existsSync(fileFor(route)))
);

const metadata = htmlFiles.map(([route, html]) => ({
  route,
  title: (html.match(/<title>([^<]+)<\/title>/) || [])[1] || "",
  description: (html.match(/<meta name="description" content="([^"]+)/) || [])[1] || "",
  canonical: /<link rel="canonical"/.test(html),
  openGraph: /property="og:title"/.test(html) && /property="og:image"/.test(html),
  h1Count: (html.match(/<h1\b/g) || []).length,
  jsonLdCount: (html.match(/<script type="application\/ld\+json">/g) || []).length
}));

add(
  "metadata",
  metadata.every((item) => item.title && item.description && item.canonical && item.openGraph && item.h1Count === 1 && item.jsonLdCount >= 1),
  metadata
);

const badAssetLinks = [];
const badInternalLinks = [];
const telLinks = new Set();

for (const [route, html] of htmlFiles) {
  const attrs = [
    ...[...html.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]),
    ...[...html.matchAll(/srcset="([^"]+)"/g)].flatMap((match) =>
      match[1].split(",").map((item) => item.trim().split(/\s+/)[0])
    )
  ];

  for (const raw of attrs) {
    const url = raw.replace(/&amp;/g, "&");
    if (url.startsWith("tel:")) telLinks.add(url);
    if (!url.startsWith("/") || url.startsWith("//")) continue;

    const clean = url.split("#")[0].split("?")[0];
    if (!clean) continue;

    if (/\.[a-z0-9]+$/i.test(clean)) {
      const file = path.join(dist, clean);
      if (!fs.existsSync(file)) badAssetLinks.push({ route, url });
    } else {
      const file = clean === "/" ? path.join(dist, "index.html") : path.join(dist, clean, "index.html");
      if (!fs.existsSync(file)) badInternalLinks.push({ route, url });
    }
  }
}

add("asset_links", badAssetLinks.length === 0, badAssetLinks);
add("internal_links", badInternalLinks.length === 0, badInternalLinks);

const expectedTelLinks = [
  "tel:+381693648801",
  "tel:+381655850690",
  "tel:+381693648803",
  "tel:+381693648804",
  "tel:+381693648800"
];
add(
  "tel_links",
  expectedTelLinks.every((tel) => telLinks.has(tel)),
  [...telLinks].sort()
);

const publicNotes = htmlFiles.flatMap(([route, html]) =>
  ["Content verification", "Nejasnoća", "Privremeni tretman", "Barça Academy"].filter((text) => html.includes(text)).map((text) => ({
    route,
    text
  }))
);
add("no_internal_notes", publicNotes.length === 0, publicNotes);

const contactHtml = fs.readFileSync(fileFor("/kontakt/"), "utf8");
add("contact_form_absent_without_endpoint", !contactHtml.includes("<form"));

const robots = fs.readFileSync(path.join(dist, "robots.txt"), "utf8");
add("robots", robots.includes("Sitemap:") && robots.includes("Disallow: /"), robots);

const sitemap = fs.readFileSync(path.join(dist, "sitemap-0.xml"), "utf8");
add(
  "sitemap_routes",
  ["/skola-fudbala/", "/klub/", "/sportski-kompleks/", "/fudbalski-rodjendani/", "/restoran-i-proslave/", "/kontakt/"].every((route) =>
    sitemap.includes(route)
  ),
  sitemap
);

const structuredDataOk = htmlFiles.every(([route, html]) => {
  const json = (html.match(/<script type="application\/ld\+json">([^<]+)<\/script>/) || [])[1];
  if (!json) return false;
  const parsed = JSON.parse(json);
  const types = parsed["@graph"].map((node) => node["@type"]);
  if (route === "/skola-fudbala/" && !types.includes("FAQPage")) return false;
  if (route === "/restoran-i-proslave/" && !types.includes("Restaurant")) return false;
  return types.includes("SportsClub") && types.includes("SportsActivityLocation");
});
add("structured_data", structuredDataOk);

for (const check of checks) {
  console.log(`${check.ok ? "PASS" : "FAIL"} ${check.name}`);
  if (!check.ok || ["metadata", "tel_links", "robots"].includes(check.name)) {
    console.log(JSON.stringify(check.detail, null, 2));
  }
}

if (checks.some((check) => !check.ok)) {
  process.exit(1);
}
