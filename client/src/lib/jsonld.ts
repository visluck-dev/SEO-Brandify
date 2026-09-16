import { SITE_URL } from "@/constants/legal";
import { SERVICES } from "@/constants/services";

/** BreadcrumbList for sub-pages: Home › page. */
export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  const list = [{ name: "Home", path: "/" }, ...items];
  return {
    "@type": "BreadcrumbList",
    itemListElement: list.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path === "/" ? "/" : item.path}`,
    })),
  };
}

/** ItemList of Service entries for the Services page. */
export const servicesJsonLd = {
  "@type": "ItemList",
  itemListElement: SERVICES.map((s, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Service",
      name: s.title,
      description: s.description,
      provider: { "@id": `${SITE_URL}/#organization` },
      areaServed: "GB",
      url: `${SITE_URL}/services#${s.id}`,
    },
  })),
};
