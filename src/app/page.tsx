import { fetchCards } from "@/lib/sheets"
import HomePage from "@/components/HomePage"
import {
  buildWebSiteJsonLd,
  buildItemListJsonLd,
  safeJsonLdStringify,
} from "@/lib/seo"

export default async function Page() {
  const cards = await fetchCards()

  const webSiteJsonLd = buildWebSiteJsonLd()
  const itemListJsonLd = buildItemListJsonLd(cards)

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLdStringify(webSiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: safeJsonLdStringify(itemListJsonLd),
        }}
      />
      <HomePage cards={cards} />
    </>
  )
}
