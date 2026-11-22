import { cn } from "@/lib/utils";
import { Html, Head, Main, NextScript, type DocumentProps } from "next/document";
import { SEOElements } from "@/components/SEO";

export default function Document(props: DocumentProps) {
  const locale = props.__NEXT_DATA__.locale || "sk";

  return (
    <Html lang={locale}>
      <Head>
        <SEOElements />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-32x32.png" />
        <link rel="shortcut icon" href="/favicon-32x32.png" />
      </Head>
      <body
        className={cn(
          "min-h-screen w-full scroll-smooth bg-background text-foreground antialiased"
        )}
      >
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
