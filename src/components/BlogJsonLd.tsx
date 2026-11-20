import Head from "next/head";

export function JsonLd({ id, data }: { id: string; data: unknown }) {
  return (
    <Head>
      <script
        key={id}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
      />
    </Head>
  );
}
