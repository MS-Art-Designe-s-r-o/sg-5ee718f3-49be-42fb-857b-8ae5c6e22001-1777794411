import type { GetServerSideProps } from "next";
import { LandingPage } from "@/components/LandingPage";
import { getLanding } from "@/content/landing";

// Stránka existuje len v slovenčine (ako blog) — ostatné jazyky presmeruje na SK verziu.
export const getServerSideProps: GetServerSideProps = async ({ locale, res }) => {
  if (locale && locale !== "sk") return { redirect: { destination: "/transfer-kosice-krakow", permanent: false, locale: false } as never };
  res.setHeader("Cache-Control", "public, s-maxage=600, stale-while-revalidate=3600");
  return { props: {} };
};

export default function Page() {
  return <LandingPage page={getLanding("transfer-kosice-krakow")} />;
}
