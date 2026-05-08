export const SITE_NAME = "Sparks Station";
export const SITE_DOMAIN = "sparks-station.com";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? `https://${SITE_DOMAIN}`;
export const SITE_SELLER_NAME = "Sparks Station運営事務局";
export const SITE_OPERATOR_NAME = "川上 大和";
export const SITE_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "sparks.station.contact@gmail.com";

export function getMailtoHref(subject?: string): string {
  const params = subject ? `?subject=${encodeURIComponent(subject)}` : "";
  return `mailto:${SITE_CONTACT_EMAIL}${params}`;
}
