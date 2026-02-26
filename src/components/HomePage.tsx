"use client"

import { useState, useMemo } from "react"
import { Filters, SortOption, CardData } from "@/types/card"
import { matchesRegion } from "@/utils/regions"
import HeroSection from "@/components/HeroSection"
import CryptoCard from "@/components/CryptoCard"
import FilterBar from "@/components/FilterBar"

interface HomePageProps {
  readonly cards: readonly CardData[]
}

const DEFAULT_FILTERS: Filters = {
  search: "",
  cardType: [],
  network: [],
  custody: [],
  minCashback: 0,
  annualFee: "all",
  fxFee: "all",
  region: "",
  kyc: "",
  currency: "",
}

export default function HomePage({ cards }: HomePageProps) {
  const [sort, setSort] = useState<SortOption>("nameAZ")
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  const filteredCards = useMemo(() => {
    const result = cards.filter((card) => {
      const searchLower = filters.search.toLowerCase()
      const matchesSearch =
        card.name.toLowerCase().includes(searchLower) ||
        card.issuer.toLowerCase().includes(searchLower) ||
        card.perks.some((p) => p.toLowerCase().includes(searchLower))

      const matchesNetwork =
        filters.network.length === 0 ||
        filters.network.includes(card.network)

      const matchesCustody =
        filters.custody.length === 0 ||
        filters.custody.includes(card.custody)

      const matchesCashback =
        typeof card.cashbackMax === "number"
          ? card.cashbackMax >= filters.minCashback
          : filters.minCashback === 0

      const matchesRegionFilter = matchesRegion(card.regions, filters.region)

      const matchesKyc =
        filters.kyc === ""
          ? true
          : filters.kyc === "required"
            ? card.kyc === "Required" || card.kyc === "Light"
            : card.kyc === "None"

      const matchesCurrency =
        filters.currency === "" ||
        card.supportedCurrencies.includes(filters.currency) ||
        card.supportedCurrencies.includes("Global")

      return (
        matchesSearch &&
        matchesNetwork &&
        matchesCustody &&
        matchesCashback &&
        matchesRegionFilter &&
        matchesKyc &&
        matchesCurrency
      )
    })

    return [...result].sort((a, b) => {
      if (sort === "featured") {
        return (a.rank ?? 999) - (b.rank ?? 999)
      }
      if (sort === "cashbackHigh") {
        const aVal = typeof a.cashbackMax === "number" ? a.cashbackMax : 0
        const bVal = typeof b.cashbackMax === "number" ? b.cashbackMax : 0
        return bVal - aVal
      }
      if (sort === "nameAZ") {
        return a.name.localeCompare(b.name)
      }
      return 0
    })
  }, [cards, filters, sort])

  return (
    <div className="min-h-screen bg-moic-navy selection:bg-moic-blue selection:text-white">
      <HeroSection />

      <main className="px-4 sm:px-6 md:px-8 pb-12 bg-moic-navy">
        <FilterBar
          filters={filters}
          sort={sort}
          onFilterChange={setFilters}
          onSortChange={setSort}
          resultsCount={filteredCards.length}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <CryptoCard key={card.id} card={card} />
            ))
          ) : (
            <div className="col-span-full py-12 sm:py-20 text-center border border-white/10 rounded-xl">
              <p className="text-white/50 text-sm sm:text-base">
                No cards match your filters
              </p>
              <button
                onClick={() => setFilters(DEFAULT_FILTERS)}
                className="mt-4 text-moic-blue font-semibold hover:underline text-sm sm:text-base"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
