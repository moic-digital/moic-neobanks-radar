"use client"

import { useState, useMemo, useEffect } from "react"
import { Menu, Star, Compass } from "lucide-react"
import { cards } from "@/data/cards"
import { Filters, SortOption, ViewMode, CardData } from "@/types/card"
import { matchesRegion, MAX_COMPARE_CARDS } from "@/utils/regions"
import CryptoCard from "@/components/CryptoCard"
import FilterBar from "@/components/FilterBar"
import CompareView from "@/components/CompareView"
import CardWizard from "@/components/CardWizard"
import { FloatingBar, MobileNav } from "@/components/BottomBar"

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

export default function HomePage() {
  const [selectedIds, setSelectedIds] = useState<readonly string[]>([])
  const [sort, setSort] = useState<SortOption>("featured")
  const [view, setView] = useState<ViewMode>("discover")
  const [wizardOpen, setWizardOpen] = useState(false)
  const [showEmptyCompare, setShowEmptyCompare] = useState(false)
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  useEffect(() => {
    if (selectedIds.length === 0 && view === "compare") {
      setView("discover")
    }
  }, [selectedIds.length, view])

  useEffect(() => {
    if (selectedIds.length > 0) {
      setShowEmptyCompare(false)
    }
  }, [selectedIds.length])

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
        filters.kyc === "" || card.kyc === filters.kyc

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
  }, [filters, sort])

  function handleToggleSelect(id: string) {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((s) => s !== id))
    } else {
      if (selectedIds.length >= MAX_COMPARE_CARDS) {
        return
      }
      setSelectedIds([...selectedIds, id])
    }
  }

  function handleNavigate(newView: ViewMode) {
    if (newView === "compare" && selectedIds.length === 0) {
      setShowEmptyCompare(true)
      return
    }
    setShowEmptyCompare(false)
    setView(newView)
  }

  function handleCompare() {
    if (selectedIds.length === 0) {
      setShowEmptyCompare(true)
      return
    }
    setShowEmptyCompare(false)
    setView("compare")
  }

  function handleBackToDiscover() {
    setShowEmptyCompare(false)
    setView("discover")
  }

  const selectedCards: readonly CardData[] = cards.filter((c) =>
    selectedIds.includes(c.id)
  )

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-black font-mono selection:bg-lime-400 selection:text-black">
      <CardWizard
        isOpen={wizardOpen}
        onClose={() => setWizardOpen(false)}
        onSelectCard={(id) =>
          setSelectedIds((prev) => [...prev, id])
        }
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative transition-all duration-300">
        {/* Empty compare overlay */}
        {showEmptyCompare && (
          <div className="absolute inset-0 z-50 bg-black flex items-center justify-center p-4">
            <div className="border-4 border-white p-6 sm:p-12 max-w-lg text-center w-full">
              <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-lime-400 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
                <Star className="w-8 h-8 sm:w-10 sm:h-10 text-lime-400" />
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-white uppercase mb-3 sm:mb-4">
                No Cards Selected
              </h2>
              <p className="text-white/70 font-mono mb-6 sm:mb-8 text-sm sm:text-lg">
                Please select the cards first.
              </p>
              <button
                onClick={handleBackToDiscover}
                className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-lime-400 text-black font-black uppercase tracking-wider border-4 border-lime-400 hover:bg-lime-300 transition-all flex items-center gap-3 justify-center mx-auto"
              >
                <Star className="w-5 h-5" />
                <span className="text-sm sm:text-base">Discover Cards</span>
              </button>
            </div>
          </div>
        )}

        {view === "discover" ? (
          <>
            <header className="h-16 sm:h-20 md:h-24 shrink-0 flex items-center justify-between px-4 sm:px-6 md:px-8 bg-black border-b-4 border-white z-10">
              <div className="flex items-center gap-3">
                <button className="md:hidden p-2 border-2 border-white text-white mr-1">
                  <Menu className="w-5 h-5" />
                </button>
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight truncate">
                    Explore Cards
                  </h1>
                  <p className="text-white/50 font-mono text-xs sm:text-sm mt-0.5 sm:mt-1">
                    {filteredCards.length} cards
                  </p>
                </div>
              </div>
              <button
                onClick={() => setWizardOpen(true)}
                className="md:hidden p-2 bg-lime-400 text-black border-2 border-lime-400"
              >
                <Compass className="w-5 h-5" />
              </button>
            </header>

            <main className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 pb-32 sm:pb-36 bg-black">
              <FilterBar
                filters={filters}
                sort={sort}
                onFilterChange={setFilters}
                onSortChange={setSort}
                resultsCount={filteredCards.length}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredCards.length > 0 ? (
                  filteredCards.map((card) => (
                    <CryptoCard
                      key={card.id}
                      card={card}
                      selected={selectedIds.includes(card.id)}
                      onSelect={handleToggleSelect}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-12 sm:py-20 text-center border-4 border-white/20">
                    <p className="text-white/60 font-mono uppercase text-sm sm:text-base">
                      No cards match your filters
                    </p>
                    <button
                      onClick={() => setFilters(DEFAULT_FILTERS)}
                      className="mt-4 text-lime-400 font-black uppercase hover:underline text-sm sm:text-base"
                    >
                      Clear all filters
                    </button>
                  </div>
                )}
              </div>
            </main>

            <FloatingBar
              selectedCards={selectedCards}
              onCompare={handleCompare}
            />
          </>
        ) : (
          <CompareView
            cards={selectedCards}
            onRemove={handleToggleSelect}
            onBack={() => setView("discover")}
          />
        )}

        <MobileNav
          view={view}
          onNavigate={handleNavigate}
          onWizard={() => setWizardOpen(true)}
          selectedCount={selectedIds.length}
        />
      </div>
    </div>
  )
}
