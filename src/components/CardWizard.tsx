"use client"

import { useState } from "react"
import { Globe, X, Compass, ChevronRight } from "lucide-react"
import { CardData } from "@/types/card"
import { matchesRegion } from "@/utils/regions"

interface CardWizardProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly onSelectCard: (id: string) => void
  readonly cards: readonly CardData[]
}

interface WizardState {
  readonly region: string
  readonly currency: string
  readonly kyc: string
}

type WizardStep = "region" | "currency" | "kyc" | "result"

const REGIONS = [
  { name: "United States", flag: "\ud83c\uddfa\ud83c\uddf8" },
  { name: "United Kingdom", flag: "\ud83c\uddec\ud83c\udde7" },
  { name: "India", flag: "\ud83c\uddee\ud83c\uddf3" },
  { name: "Germany", flag: "\ud83c\udde9\ud83c\uddea" },
  { name: "Brazil", flag: "\ud83c\udde7\ud83c\uddf7" },
  { name: "Canada", flag: "\ud83c\udde8\ud83c\udde6" },
  { name: "Australia", flag: "\ud83c\udde6\ud83c\uddfa" },
  { name: "Nigeria", flag: "\ud83c\uddf3\ud83c\uddec" },
  { name: "Japan", flag: "\ud83c\uddef\ud83c\uddf5" },
  { name: "Singapore", flag: "\ud83c\uddf8\ud83c\uddec" },
  { name: "UAE", flag: "\ud83c\udde6\ud83c\uddea" },
  { name: "France", flag: "\ud83c\uddeb\ud83c\uddf7" },
]

const CURRENCIES = ["USD", "EUR", "GBP", "INR", "BRL", "NGN", "JPY", "AUD"]

export default function CardWizard({
  isOpen,
  onClose,
  onSelectCard,
  cards: allCards,
}: CardWizardProps) {
  const [step, setStep] = useState<WizardStep>("region")
  const [state, setState] = useState<WizardState>({
    region: "",
    currency: "",
    kyc: "",
  })
  const [results, setResults] = useState<readonly CardData[]>([])

  if (!isOpen) return null

  function handleSelect(key: keyof WizardState, value: string) {
    const newState = { ...state, [key]: value }
    setState(newState)

    if (key === "region") setStep("currency")
    if (key === "currency") setStep("kyc")
    if (key === "kyc") {
      const filtered = allCards.filter((card) => {
        const regionMatch = matchesRegion(card.regions, newState.region)
        const currencyMatch =
          card.supportedCurrencies.includes(newState.currency) ||
          card.supportedCurrencies.includes("Global") ||
          (newState.currency === "INR" && card.regions.includes("Global"))
        const kycMatch =
          newState.kyc === "Any" ? true : card.kyc === newState.kyc
        return regionMatch && currencyMatch && kycMatch
      })
      setResults(filtered)
      setStep("result")
    }
  }

  function reset() {
    setStep("region")
    setState({ region: "", currency: "", kyc: "" })
  }

  function renderStep() {
    switch (step) {
      case "region":
        return (
          <div className="space-y-3 sm:space-y-4 flex flex-col h-full">
            <div className="shrink-0">
              <h3 className="text-lg sm:text-xl font-black text-white mb-1 sm:mb-2 uppercase">
                Where do you live?
              </h3>
              <p className="text-xs sm:text-sm text-white/50 mb-3 sm:mb-4 font-mono">
                Select your country.
              </p>
            </div>
            <div className="overflow-y-auto flex-1 pr-2 -mr-2">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 pb-2">
                {REGIONS.map((r) => (
                  <button
                    key={r.name}
                    onClick={() => handleSelect("region", r.name)}
                    className="p-2 sm:p-3 border-4 border-white hover:border-lime-400 hover:bg-lime-400 hover:text-black transition-all text-left group flex items-center gap-2 sm:gap-3"
                  >
                    <span className="text-lg sm:text-2xl">{r.flag}</span>
                    <span className="font-black text-white text-[10px] sm:text-xs group-hover:text-black uppercase truncate">
                      {r.name}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={() => handleSelect("region", "Global")}
                className="p-2 sm:p-3 w-full border-4 border-dashed border-white/50 hover:border-lime-400 hover:bg-lime-400 hover:text-black transition-all text-center group flex items-center justify-center gap-2 mt-2"
              >
                <span className="text-lg sm:text-xl">
                  {"\ud83c\udf0d"}
                </span>
                <span className="font-black text-white/70 group-hover:text-black uppercase text-xs sm:text-sm">
                  Other / Global
                </span>
              </button>
            </div>
          </div>
        )

      case "currency":
        return (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-white mb-1 sm:mb-2 uppercase">
              Primary Currency?
            </h3>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              {CURRENCIES.map((c) => (
                <button
                  key={c}
                  onClick={() => handleSelect("currency", c)}
                  className="p-3 sm:p-4 border-4 border-white hover:border-lime-400 hover:bg-lime-400 transition-all text-left group"
                >
                  <span className="font-black text-white group-hover:text-black text-sm sm:text-lg">
                    {c}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )

      case "kyc":
        return (
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-black text-white mb-1 sm:mb-2 uppercase">
              Privacy Preference
            </h3>
            <div className="space-y-2 sm:space-y-3">
              <button
                onClick={() => handleSelect("kyc", "Required")}
                className="w-full p-3 sm:p-4 border-4 border-white hover:border-lime-400 hover:bg-lime-400 text-left group transition-all"
              >
                <span className="font-black block text-white group-hover:text-black uppercase text-sm sm:text-base">
                  Standard (KYC)
                </span>
                <span className="text-[10px] sm:text-xs text-white/50 group-hover:text-black/70 font-mono">
                  Best limits & perks
                </span>
              </button>
              <button
                onClick={() => handleSelect("kyc", "Light")}
                className="w-full p-3 sm:p-4 border-4 border-white hover:border-lime-400 hover:bg-lime-400 text-left group transition-all"
              >
                <span className="font-black block text-white group-hover:text-black uppercase text-sm sm:text-base">
                  Light / No KYC
                </span>
                <span className="text-[10px] sm:text-xs text-white/50 group-hover:text-black/70 font-mono">
                  Higher privacy
                </span>
              </button>
              <button
                onClick={() => handleSelect("kyc", "Any")}
                className="w-full p-3 sm:p-4 border-4 border-white hover:border-lime-400 hover:bg-lime-400 text-left group transition-all"
              >
                <span className="font-black block text-white group-hover:text-black uppercase text-sm sm:text-base">
                  Don&apos;t Care
                </span>
              </button>
            </div>
          </div>
        )

      case "result":
        return (
          <div className="h-full flex flex-col">
            <h3 className="text-lg sm:text-xl font-black text-white mb-3 sm:mb-4 flex items-center gap-2 uppercase shrink-0">
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 text-lime-400" />
              {results.length} matches
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 sm:space-y-3 pr-2 -mr-2">
              {results.length > 0 ? (
                results.map((card) => (
                  <div
                    key={card.id}
                    className="p-3 sm:p-4 bg-white/5 border-4 border-white/30 hover:border-lime-400 flex items-center gap-3 sm:gap-4 group cursor-pointer transition-all"
                    onClick={() => {
                      onSelectCard(card.id)
                      onClose()
                    }}
                  >
                    <img
                      src={card.logo}
                      className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white shrink-0"
                      alt={card.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = "none"
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-white uppercase text-sm sm:text-base truncate">
                        {card.name}
                      </h4>
                      <p className="text-[10px] sm:text-xs text-white/50 font-mono truncate">
                        {card.issuer} &bull;{" "}
                        {card.kyc === "Required" ? "KYC" : "NO KYC"}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-white/30 group-hover:text-lime-400 shrink-0" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 sm:py-10 border-4 border-white/20">
                  <p className="text-white/50 font-mono text-sm">
                    No exact matches found.
                  </p>
                  <button
                    onClick={reset}
                    className="mt-4 text-lime-400 font-black hover:underline uppercase text-sm"
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={reset}
              className="mt-3 sm:mt-4 w-full py-3 sm:py-4 bg-white text-black border-4 border-white font-black uppercase hover:bg-lime-400 hover:border-lime-400 transition-all shrink-0 text-sm sm:text-base"
            >
              Start Over
            </button>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="absolute inset-0 bg-black/90" onClick={onClose} />
      <div className="relative w-full max-w-md bg-black border-4 border-white overflow-hidden flex flex-col max-h-[90vh] sm:max-h-[85vh] h-auto sm:h-[600px]">
        <div className="p-4 sm:p-6 border-b-4 border-white flex justify-between items-center bg-black shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-lime-400 flex items-center justify-center">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-lime-400" />
            </div>
            <span className="font-black text-white uppercase text-sm sm:text-base">
              Card Wizard
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-10 sm:h-10 border-4 border-white flex items-center justify-center hover:bg-white hover:text-black transition-all text-white"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        <div className="flex-1 p-4 sm:p-6 flex flex-col overflow-hidden">
          {renderStep()}
        </div>

        <div className="p-3 sm:p-4 bg-black border-t-4 border-white flex justify-center gap-2 shrink-0">
          {(["region", "currency", "kyc", "result"] as const).map((s) => (
            <div
              key={s}
              className={`h-2 w-6 sm:w-8 transition-colors ${
                step === s ? "bg-lime-400" : "bg-white/30"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
