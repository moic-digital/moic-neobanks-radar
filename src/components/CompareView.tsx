"use client"

import {
  ArrowLeft,
  X,
  Check,
  Minus,
  Zap,
  CreditCard,
  Globe,
  Shield,
  Coins,
  Smartphone,
  Wallet,
  Gift,
  Star,
  Layers,
} from "lucide-react"
import { CardData } from "@/types/card"

interface CompareViewProps {
  readonly cards: readonly CardData[]
  readonly onRemove: (id: string) => void
  readonly onBack: () => void
}

function formatCustody(value: string): string {
  return value === "Self-Custody" || value === "Non-Custodial"
    ? "Self-Custody"
    : value
}

interface CompareRow {
  readonly label: string
  readonly key: keyof CardData
  readonly icon?: React.ComponentType<{ className?: string }>
  readonly format?: (value: unknown) => string
  readonly type?: "boolean"
}

const COMPARE_ROWS: readonly CompareRow[] = [
  { label: "Type", key: "type", icon: CreditCard },
  { label: "Network", key: "network", icon: Globe },
  {
    label: "Custody",
    key: "custody",
    icon: Shield,
    format: (v) => formatCustody(v as string),
  },
  {
    label: "Cashback",
    key: "cashbackMax",
    format: (v) => (typeof v === "number" ? `${v}%` : (v as string) || "N/A"),
  },
  { label: "Annual Fee", key: "annualFee" },
  { label: "FX Fee", key: "fxFee" },
  { label: "Staking", key: "stakingRequired", icon: Coins },
  { label: "ATM", key: "atmLimit" },
  { label: "Mobile Pay", key: "mobilePay", type: "boolean", icon: Smartphone },
  { label: "Assets", key: "supportedAssets", icon: Wallet },
  { label: "Metal", key: "metal", type: "boolean" },
  { label: "Bonus", key: "signupBonus", icon: Gift },
  { label: "Regions", key: "regions" },
]

export default function CompareView({
  cards,
  onRemove,
  onBack,
}: CompareViewProps) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-4 sm:p-8 bg-black">
        <div className="border-4 border-white p-6 sm:p-12 max-w-lg w-full">
          <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-lime-400 mx-auto mb-4 sm:mb-6 flex items-center justify-center">
            <Layers className="w-8 h-8 sm:w-10 sm:h-10 text-lime-400" />
          </div>
          <h3 className="text-xl sm:text-3xl font-black text-white uppercase mb-3 sm:mb-4">
            No Cards Selected
          </h3>
          <p className="text-white/70 font-mono mb-6 sm:mb-8 text-sm sm:text-base">
            Please select the cards first.
          </p>
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-lime-400 text-black font-black uppercase tracking-wider border-4 border-lime-400 hover:bg-lime-300 transition-all flex items-center gap-3 justify-center mx-auto text-sm sm:text-base"
          >
            <Star className="w-5 h-5" />
            Discover Cards
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-black pb-16 md:pb-0">
      <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-6 bg-black border-b-4 border-white shrink-0">
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={onBack}
            className="p-2 sm:p-3 border-4 border-white text-white hover:bg-white hover:text-black transition-all"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div>
            <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
              Compare
            </h2>
            <p className="text-xs sm:text-sm text-white/50 font-mono">
              {cards.length} cards
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
        <div className="bg-black border-4 border-white overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-3 sm:p-4 md:p-6 w-24 sm:w-40 md:w-64 bg-white text-black border-b-4 border-r-4 border-black sticky left-0 z-10">
                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider">
                      Overview
                    </span>
                  </th>
                  {cards.map((card) => (
                    <th
                      key={card.id}
                      className="p-3 sm:p-4 md:p-6 min-w-[160px] sm:min-w-[200px] md:min-w-[240px] border-b-4 border-l-4 border-white bg-black align-top relative group"
                    >
                      <div className="flex flex-col items-center text-center">
                        <div className="relative mb-2 sm:mb-4">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 border-4 border-white bg-white p-1">
                            <img
                              src={card.logo}
                              alt={card.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement
                                target.src = `https://ui-avatars.com/api/?name=${card.issuer}&background=random`
                              }}
                            />
                          </div>
                          <button
                            onClick={() => onRemove(card.id)}
                            className="absolute -top-2 -right-2 bg-black text-white hover:bg-red-500 hover:text-white border-2 border-white p-1 transition-all"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                        <h3 className="font-black text-sm sm:text-base md:text-lg text-white uppercase mb-1 line-clamp-2">
                          {card.name}
                        </h3>
                        <span className="text-[10px] sm:text-xs font-mono px-2 py-1 border-2 border-white/50 text-white/70">
                          {card.issuer}
                        </span>
                        <a
                          href={card.officialLink}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-2 sm:mt-4 text-[10px] sm:text-xs font-black text-lime-400 hover:text-lime-300 flex items-center gap-1 uppercase"
                        >
                          Visit <Zap className="w-3 h-3" />
                        </a>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-xs sm:text-sm font-mono">
                {COMPARE_ROWS.map((row, idx) => (
                  <tr
                    key={row.key}
                    className={idx % 2 === 0 ? "bg-black" : "bg-white/5"}
                  >
                    <td className="p-2 sm:p-3 md:p-5 font-black text-white uppercase text-[10px] sm:text-xs sticky left-0 bg-inherit border-r-4 border-white z-10">
                      <div className="flex items-center gap-1 sm:gap-2">
                        {row.icon && (
                          <row.icon className="w-3 h-3 sm:w-4 sm:h-4 text-lime-400 shrink-0" />
                        )}
                        <span className="truncate">{row.label}</span>
                      </div>
                    </td>
                    {cards.map((card) => {
                      const value = card[row.key]
                      let content: React.ReactNode

                      if (row.type === "boolean") {
                        content = value ? (
                          <div className="flex justify-center">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-lime-400 bg-lime-400/20 flex items-center justify-center">
                              <Check className="w-3 h-3 sm:w-5 sm:h-5 text-lime-400" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex justify-center">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/30 flex items-center justify-center">
                              <Minus className="w-3 h-3 sm:w-4 sm:h-4 text-white/30" />
                            </div>
                          </div>
                        )
                      } else {
                        content = (
                          <span
                            className={`font-mono text-[10px] sm:text-xs md:text-sm ${
                              row.key === "cashbackMax"
                                ? "text-lime-400 font-black"
                                : "text-white"
                            }`}
                          >
                            {row.format
                              ? row.format(value)
                              : String(value || "N/A")}
                          </span>
                        )
                      }

                      return (
                        <td
                          key={`${card.id}-${row.key}`}
                          className="p-2 sm:p-3 md:p-5 text-center border-l-4 border-white/20"
                        >
                          {content}
                        </td>
                      )
                    })}
                  </tr>
                ))}

                {/* Features row */}
                <tr className="bg-black border-t-4 border-white">
                  <td className="p-3 sm:p-4 md:p-6 font-black text-white uppercase text-[10px] sm:text-xs sticky left-0 bg-black border-r-4 border-white z-10 align-top">
                    Features
                  </td>
                  {cards.map((card) => (
                    <td
                      key={`${card.id}-perks`}
                      className="p-3 sm:p-4 md:p-6 align-top border-l-4 border-white/20"
                    >
                      <ul className="space-y-2 sm:space-y-3 text-left inline-block">
                        {card.perks.slice(0, 4).map((perk, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-white/80"
                          >
                            <div className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-lime-400 flex items-center justify-center shrink-0 mt-0.5">
                              <Check className="w-2 h-2 sm:w-3 sm:h-3 text-lime-400" />
                            </div>
                            <span className="text-[10px] sm:text-xs font-mono leading-4 sm:leading-5 line-clamp-2">
                              {perk}
                            </span>
                          </li>
                        ))}
                        {card.perks.length > 4 && (
                          <li className="text-[10px] sm:text-xs text-white/50 font-mono">
                            +{card.perks.length - 4} more
                          </li>
                        )}
                      </ul>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
