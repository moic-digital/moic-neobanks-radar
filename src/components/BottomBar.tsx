"use client"

import { Star, Layers, Compass, ChevronRight } from "lucide-react"
import { CardData } from "@/types/card"
import { ViewMode } from "@/types/card"

interface FloatingBarProps {
  readonly selectedCards: readonly CardData[]
  readonly onCompare: () => void
}

export function FloatingBar({ selectedCards, onCompare }: FloatingBarProps) {
  if (selectedCards.length === 0) return null

  return (
    <div className="absolute bottom-4 sm:bottom-8 left-2 right-2 sm:left-1/2 sm:right-auto sm:-translate-x-1/2 z-30">
      <div className="flex items-center gap-2 sm:gap-4 p-2 sm:pl-6 sm:pr-2 bg-black border-4 border-white">
        <div className="flex flex-col flex-1 sm:flex-initial min-w-0">
          <span className="text-xs sm:text-sm font-black text-white uppercase truncate">
            {selectedCards.length} selected
          </span>
          <span className="text-[10px] sm:text-xs text-white/50 font-mono hidden sm:block">
            Ready to compare
          </span>
        </div>

        <div className="hidden sm:block h-10 w-1 bg-white/30" />

        <div className="hidden sm:flex -space-x-2 px-2">
          {selectedCards.slice(0, 3).map((card) => (
            <img
              key={card.id}
              src={card.logo}
              className="w-8 sm:w-10 h-8 sm:h-10 border-2 border-white bg-white"
              alt={card.name}
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = `https://ui-avatars.com/api/?name=${card.issuer}&background=random`
              }}
            />
          ))}
          {selectedCards.length > 3 && (
            <div className="w-8 sm:w-10 h-8 sm:h-10 border-2 border-white bg-black text-white flex items-center justify-center text-[10px] sm:text-xs font-black">
              +{selectedCards.length - 3}
            </div>
          )}
        </div>

        <button
          onClick={onCompare}
          className="h-10 sm:h-12 px-4 sm:px-6 bg-lime-400 hover:bg-lime-300 text-black font-black uppercase flex items-center gap-2 transition-all border-4 border-lime-400 text-xs sm:text-sm"
        >
          Compare <ChevronRight className="w-4 sm:w-5 h-4 sm:h-5" />
        </button>
      </div>
    </div>
  )
}

interface MobileNavProps {
  readonly view: ViewMode
  readonly onNavigate: (view: ViewMode) => void
  readonly onWizard: () => void
  readonly selectedCount: number
}

export function MobileNav({
  view,
  onNavigate,
  onWizard,
  selectedCount,
}: MobileNavProps) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-black border-t-4 border-white flex z-40">
      <button
        onClick={() => onNavigate("discover")}
        className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 ${
          view === "discover" ? "bg-white text-black" : "text-white"
        }`}
      >
        <Star className="w-5 h-5" />
        <span className="text-[10px] font-black uppercase">Discover</span>
      </button>

      <button
        onClick={() => onNavigate("compare")}
        className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 relative ${
          view === "compare" ? "bg-white text-black" : "text-white"
        }`}
      >
        <Layers className="w-5 h-5" />
        <span className="text-[10px] font-black uppercase">Compare</span>
        {selectedCount > 0 && (
          <span className="absolute top-1 right-1/4 w-5 h-5 bg-lime-400 text-black text-[10px] font-black flex items-center justify-center">
            {selectedCount}
          </span>
        )}
      </button>

      <button
        onClick={onWizard}
        className="flex-1 flex flex-col items-center justify-center py-3 gap-1 bg-lime-400 text-black"
      >
        <Compass className="w-5 h-5" />
        <span className="text-[10px] font-black uppercase">Wizard</span>
      </button>
    </div>
  )
}
