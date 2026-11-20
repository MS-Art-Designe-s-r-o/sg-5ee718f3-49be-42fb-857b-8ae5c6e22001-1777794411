import Head from "next/head";
import { SITE_URL, SITE_NAME } from "@/lib/site";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  /** Absolute URL or site-relative path (e.g. "/cennik"). Backward compatible. */
  url?: string;
  /** Preferred: site-relative path used for canonical and og:url. */
  path?: string;
  type?: string;
  /** @deprecated Ignored (meta keywords are obsolete). Kept for compatibility. */
  keywords?: string;
  noindex?: boolean;
  imageAlt?: string;
  /** Extra JSON-LD node(s) rendered in the page head. */
  jsonLd?: object | object[];
  /** Article metadata (for type="article"). */
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEOElements() {
  return (
    <>
      <meta name="author" content={SITE_NAME} />

      {/* Geo Tags */}
      <meta name="geo.region" content="SK-KI" />
      <meta name="geo.placename" content="Košice" />
      <meta name="geo.position" content="48.7164;21.2611" />
      <meta name="ICBM" content="48.7164, 21.2611" />
    </>
  );
}

function toAbsolute(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  return `${SITE_URL}${value.startsWith("/") ? value : `/${value}`}`;
}

export function SEO({
  title = "E-TAXI Košice | Taxislužba 24/7 | Transfery na letisko Budapešť, Krakov, Viedeň",
  description = "Profesionálna taxislužba v Košiciach ✓ Dispečing 24/7 ✓ Letiskové transfery Budapešť, Krakov, Viedeň ✓ Online objednávka ✓ Moderné vozidlá ✓ Expresné transfery na letiská",
  image = `${SITE_URL}/og-image.png`,
  url,
  path,
  type = "website",
  noindex = false,
  imageAlt = "E-TAXI Košice - taxislužba 24/7",
  jsonLd,
  publishedTime,
  modifiedTime,
}: SEOProps) {
  const rawUrl = path ?? url ?? "/";
  let canonical = toAbsolute(rawUrl);
  if (canonical.length > SITE_URL.length + 1) canonical = canonical.replace(/\/$/, "");
  else canonical = SITE_URL;
  const imageUrl = toAbsolute(image);
  const isDefaultImage = imageUrl === `${SITE_URL}/og-image.png`;
  const nodes = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta
        name="robots"
        content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1"}
      />
      <link rel="canonical" href={canonical} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:alt" content={imageAlt} />
      {isDefaultImage && <meta property="og:image:width" content="1200" />}
      {isDefaultImage && <meta property="og:image:height" content="590" />}
      <meta property="og:locale" content="sk_SK" />
      <meta property="og:site_name" content={SITE_NAME} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {nodes.map((node, i) => (
        <script
          key={`jsonld-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node).replace(/</g, "\\u003c") }}
        />
      ))}
    </Head>
  );
}
