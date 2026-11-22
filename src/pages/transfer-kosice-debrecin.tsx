import type { GetServerSideProps } from "next";
import { LandingPage } from "@/components/LandingPage";
import { getLanding } from "@/content/landing";
import { getLocalizedLanding, isRouteLocale } from "@/content/i18n/build";

const SLUG = "transfer-kosice-debrecin";

// SK + preklady EN/DE/HU/PL (src/content/i18n).
export const getServerSideProps: GetServerSideProps = async ({ locale, res }) => {
  const l = locale && isRouteLocale(locale) ? locale : "sk";
  if (locale && locale !== l) return { redirect: { destination: `/${SLUG}`, permanent: false, locale: false } as never };
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
  return { props: { locale: l } };
};

export default function Page({ locale }: { locale: string }) {
  const page = isRouteLocale(locale) ? getLocalizedLanding(SLUG, locale) : getLanding(SLUG);
  return <LandingPage page={page} locale={locale} />;
}
