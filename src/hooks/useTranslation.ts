import { useRouter } from "next/router";
import { getDictionary, defaultLocale, type Locale, type Dictionary } from "@/locales";

export function useTranslation(): { t: Dictionary; locale: Locale } {
  const { locale } = useRouter();
  const active = (locale as Locale) || defaultLocale;
  return { t: getDictionary(active), locale: active };
}
