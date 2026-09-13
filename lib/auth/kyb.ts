const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "yahoo.com",
  "outlook.com",
  "hotmail.com",
  "aol.com",
  "icloud.com",
  "live.com",
  "msn.com",
  "protonmail.com",
  "proton.me",
  "gmx.com",
  "yandex.com",
  "mail.com",
  "zoho.com",
]);

/** The domain half of an address, lowercased — "" when there isn't one. */
export function emailDomain(email: string): string {
  const at = email.lastIndexOf("@");
  if (at === -1) return "";
  return email.slice(at + 1).trim().toLowerCase();
}

export function isWorkEmail(email: string): boolean {
  const domain = emailDomain(email);
  if (!domain) return false;
  return !FREE_EMAIL_DOMAINS.has(domain);
}

export const BUYER_TYPES = [
  { value: "frontier_lab", label: "Frontier lab" },
  { value: "neo_lab", label: "Neo lab" },
  { value: "enterprise_other", label: "Enterprise / other" },
] as const;

export type BuyerType = (typeof BUYER_TYPES)[number]["value"];

const BUYER_TYPE_VALUES = new Set(BUYER_TYPES.map((t) => t.value));

export function isBuyerType(value: string): value is BuyerType {
  return BUYER_TYPE_VALUES.has(value as BuyerType);
}
