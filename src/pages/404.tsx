import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/hooks/useTranslation"

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <>
      <Head>
        <title>{t.notFound.title}</title>
        <meta name="description" content={t.notFound.title} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">404</h1>
          <p className="text-lg text-gray-600">{t.notFound.message}</p>
          <Button asChild>
            <Link href="/">
              {t.notFound.back}
            </Link>
          </Button>
        </div>
      </main>
    </>
  )
}
