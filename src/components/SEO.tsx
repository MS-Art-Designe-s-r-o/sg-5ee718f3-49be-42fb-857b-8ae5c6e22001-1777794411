import Head from "next/head";
import { useRouter } from "next/router";
import { useTranslation } from "@/hooks/useTranslation";
import { locales, localizedUrl, defaultLocale, SITE_URL } from "@/locales";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  /** Stránka existuje len v slovenčine (blog) — bez hreflang alternatív pre ostatné jazyky. */
  singleLocale?: boolean;
}

export function SEOElements() {
  return (
    <>
      <meta name="robots" content="index, follow" />
      <meta name="author" content="E-TAXI Košice" />

      {/* Geo Tags */}
      <meta name="geo.region" content="SK-KI" />
      <meta name="geo.placename" content="Košice" />
      <meta name="geo.position" content="48.7164;21.2611" />
      <meta name="ICBM" content="48.7164, 21.2611" />
    </>
  );
}

export function SEO({ title, description, image = `${SITE_URL}/og-image.png`, url, type = "website", keywords, singleLocale }: SEOProps) {
  const { t, locale } = useTranslation();
  const router = useRouter();

  const seoTitle = title ?? t.seo.home.title;
  const seoDescription = description ?? t.seo.home.description;
  const seoKeywords = keywords ?? t.seo.home.keywords;

  const path = (router.asPath || "/").split("#")[0].split("?")[0];
  const canonical = url ?? localizedUrl(path, locale);

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{seoTitle}</title>
      <meta name="title" content={seoTitle} />
      <meta name="description" content={seoDescription} />
      <meta name="keywords" content={seoKeywords} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content={t.metaLanguage} />
      <meta name="author" content="E-TAXI Košice" />

      {/* Geo Tags */}
      <meta name="geo.region" content="SK-KI" />
      <meta name="geo.placename" content="Košice" />
      <meta name="geo.position" content="48.7164;21.2611" />
      <meta name="ICBM" content="48.7164, 21.2611" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={seoTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content={t.ogLocale} />
      <meta property="og:site_name" content="E-TAXI Košice" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={seoTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={image} />

      {/* Jazykové alternatívy */}
      <link rel="canonical" href={canonical} />
      {!singleLocale &&
        locales.map((l) => <link key={l} rel="alternate" hrefLang={l} href={localizedUrl(path, l)} />)}
      {!singleLocale && <link rel="alternate" hrefLang="x-default" href={localizedUrl(path, defaultLocale)} />}

      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    </Head>
  );
}
