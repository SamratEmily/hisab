// ============================================================
// Hisab — Constants
// ============================================================

export const APP_NAME = "হিসাব";
export const APP_NAME_EN = "Hisab";
export const APP_TAGLINE = "টাকা-পয়সার হিসাব রাখুন সহজেই";

export const TRANSACTION_LABELS = {
  given: "দেয়া",
  taken: "পাওনা",
} as const;

export const NAV_ITEMS = [
  { href: "/dashboard", label: "হোম", labelEn: "Home" },
  { href: "/dashboard/deya", label: "দেয়া", labelEn: "Deya" },
  { href: "/dashboard/paona", label: "পাওনা", labelEn: "Paona" },
  { href: "/dashboard/contacts", label: "পরিচিতি", labelEn: "Contacts" },
] as const;

export const RELATION_OPTIONS = [
  { value: "friend", label: "বন্ধু" },
  { value: "family", label: "পরিবার" },
  { value: "relative", label: "আত্মীয়" },
  { value: "colleague", label: "সহকর্মী" },
  { value: "neighbor", label: "প্রতিবেশী" },
  { value: "business", label: "ব্যবসায়িক" },
  { value: "other", label: "অন্যান্য" },
] as const;

export const CURRENCY = "৳";

export function formatCurrency(amount: number): string {
  return `${CURRENCY}${Math.abs(amount).toLocaleString("bn-BD")}`;
}

export function formatCurrencyEn(amount: number): string {
  return `${CURRENCY}${Math.abs(amount).toLocaleString("en-BD", { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
}
