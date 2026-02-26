import { notFound } from "next/navigation"
import Link from "next/link"
import {
  ArrowLeft,
  ExternalLink,
  TrendingUp,
  Shield,
  Eye,
  Sparkles,
  Clock,
  Check,
  CreditCard,
  Wallet,
  Globe,
  Coins,
  DollarSign,
  Repeat,
  Gift,
  type LucideIcon,
} from "lucide-react"
import { fetchCards } from "@/lib/sheets"
import type { CardData } from "@/types/card"

interface CardPageProps {
  readonly params: Promise<{ id: string }>
}

interface Insight {
  readonly icon: LucideIcon
  readonly label: string
  readonly description: string
}

function isAirdropFarming(value: string): boolean {
  return value.toLowerCase() === "true"
}

function buildInsights(card: CardData): readonly Insight[] {
  const insights: Insight[] = []

  if (typeof card.cashbackMax === "number") {
    if (card.cashbackMax >= 10) {
      insights.push({
        icon: TrendingUp,
        label: "Elite Cashback",
        description: "Extremely high cashback - best suited for heavy spenders who can maximize rewards.",
      })
    } else if (card.cashbackMax >= 5) {
      insights.push({
        icon: TrendingUp,
        label: "Strong Cashback",
        description: "Strong cashback profile for everyday spending across multiple categories.",
      })
    } else if (card.cashbackMax > 0) {
      insights.push({
        icon: TrendingUp,
        label: "Moderate Cashback",
        description: "Moderate cashback - interesting as a secondary card or niche use case.",
      })
    } else {
      insights.push({
        icon: TrendingUp,
        label: "No Direct Cashback",
        description: "No direct cashback - evaluate mainly for features, regions and custody model.",
      })
    }
  }

  if (card.custody === "Self-Custody" || card.custody === "Non-Custodial") {
    insights.push({
      icon: Shield,
      label: "Self-Custody",
      description: "Non-custodial design - better for power users who prefer holding their own keys.",
    })
  } else {
    insights.push({
      icon: Shield,
      label: "Custodial Model",
      description: "Custodial model - closer to a traditional fintech experience with simpler UX.",
    })
  }

  if (card.kyc === "None" || card.kyc === "Light") {
    insights.push({
      icon: Eye,
      label: "Privacy-Friendly",
      description: "Reduced KYC requirements - attractive for privacy-focused users, may come with lower limits.",
    })
  } else {
    insights.push({
      icon: Eye,
      label: "Full KYC Required",
      description: "Full KYC - typical for regulated neobanks, usually enabling higher limits and broader coverage.",
    })
  }

  if (card.airdropFarming && isAirdropFarming(card.airdropFarming)) {
    insights.push({
      icon: Sparkles,
      label: "Airdrop Farming",
      description: "Marked for airdrop farming - interesting for users farming ecosystem or protocol rewards.",
    })
  }

  if (!card.age) {
    insights.push({
      icon: Clock,
      label: "Newer Product",
      description: "Newer product - monitor stability and community feedback before routing large volumes.",
    })
  }

  return insights
}

export default async function CardPage({ params }: CardPageProps) {
  const { id } = await params
  const cards = await fetchCards()
  const card = cards.find((c) => c.id === id)

  if (!card) {
    notFound()
  }

  const insights = buildInsights(card)
  const ageLabel = card.age || "N/A"
  const cashbackLabel =
    typeof card.cashbackMax === "number"
      ? `${card.cashbackMax}%`
      : card.cashbackMax || "N/A"
  const kycLabel = card.kyc === "Required" ? "Required" : card.kyc === "Light" ? "Light" : "None"
  const showAirdrop = card.airdropFarming && isAirdropFarming(card.airdropFarming)

  const keyFacts = [
    { label: "Annual Fee", value: card.annualFee, icon: DollarSign },
    { label: "FX Fees", value: card.fxFee, icon: Repeat },
    { label: "Network", value: card.network, icon: CreditCard },
    { label: "Custody", value: card.custody, icon: Wallet },
    { label: "Regions", value: card.regions || "N/A", icon: Globe },
    { label: "Assets", value: card.supportedAssets || "N/A", icon: Coins },
    { label: "Metal", value: card.metal ? "Yes" : "No", icon: CreditCard },
    { label: "Signup Bonus", value: card.signupBonus || "None", icon: Gift },
  ]

  return (
    <div className="min-h-screen bg-moic-navy text-white selection:bg-moic-blue selection:text-white">
      {/* Block 1 - Header */}
      <header className="border-b border-white/10 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold border border-white/20 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors shrink-0"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back
          </Link>
          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight truncate" style={{ fontFamily: "'Clash Grotesk', sans-serif" }}>
            {card.name}
          </h1>
        </div>

        <a
          href={card.officialLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-moic-blue text-white text-xs font-semibold rounded-lg hover:bg-moic-blue-light transition-colors shrink-0"
        >
          <span className="hidden sm:inline">Official page</span>
          <ExternalLink className="w-4 h-4" />
        </a>
      </header>

      <main className="px-4 sm:px-8 py-6 sm:py-10 max-w-6xl mx-auto space-y-8 sm:space-y-10">
        {/* Block 2 - Identity */}
        <section className="flex items-start gap-4 sm:gap-6">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/5 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
            <img
              src={card.logo}
              alt={card.issuer}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] sm:text-[11px] text-white/40 uppercase tracking-widest">
              {card.issuer}
            </p>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight truncate" style={{ fontFamily: "'Clash Grotesk', sans-serif" }}>
              {card.name}
            </h2>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              <span className="text-[10px] font-medium bg-white/5 text-white/60 px-2 py-0.5 rounded border border-white/10">
                {card.type}
              </span>
              <span className="text-[10px] font-medium bg-white/5 text-white/60 px-2 py-0.5 rounded border border-white/10">
                {card.network}
              </span>
              <span className="text-[10px] font-medium bg-white/5 text-white/60 px-2 py-0.5 rounded border border-white/10">
                {card.custody}
              </span>
              {showAirdrop && (
                <span className="text-[10px] font-semibold bg-moic-green text-black px-2 py-0.5 rounded-sm">
                  Airdrop
                </span>
              )}
            </div>
          </div>
        </section>

        {/* Block 3 - Metrics grid */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="border border-moic-blue/40 bg-moic-surface rounded-xl p-4 flex flex-col items-center justify-center text-center shadow-[0_0_24px_rgba(42,96,251,0.2),0_0_48px_rgba(42,96,251,0.08)]">
            <span className="text-moic-blue text-[9px] sm:text-[10px] uppercase tracking-widest mb-1">
              Max Cashback
            </span>
            <span className="text-moic-blue font-bold text-xl sm:text-2xl">
              {cashbackLabel}
            </span>
          </div>
          <div className="border border-white/[0.08] bg-moic-surface rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-widest mb-1">
              Annual Fee
            </span>
            <span className="text-white font-bold text-sm sm:text-base">
              {card.annualFee}
            </span>
          </div>
          <div className="border border-white/[0.08] bg-moic-surface rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-widest mb-1">
              Time in Market
            </span>
            <span className="text-white font-bold text-sm sm:text-base">
              {ageLabel}
            </span>
          </div>
          <div className="border border-white/[0.08] bg-moic-surface rounded-xl p-4 flex flex-col items-center justify-center text-center">
            <span className="text-white/40 text-[9px] sm:text-[10px] uppercase tracking-widest mb-1">
              KYC
            </span>
            <span
              className={`font-bold text-sm sm:text-base ${
                card.kyc === "Required" ? "text-amber-400" : "text-moic-green"
              }`}
            >
              {kycLabel}
            </span>
          </div>
        </section>

        {/* Block 4 - Insights */}
        {insights.length > 0 && (
          <section className="border border-white/[0.08] bg-moic-surface p-4 sm:p-6 rounded-2xl">
            <h2 className="text-sm sm:text-base font-bold tracking-wide mb-4 sm:mb-6" style={{ fontFamily: "'Clash Grotesk', sans-serif" }}>
              Insights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {insights.map((insight, idx) => {
                const Icon = insight.icon
                return (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 border border-white/10 bg-moic-blue/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-moic-blue" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-semibold text-white">
                        {insight.label}
                      </p>
                      <p className="text-[11px] sm:text-xs text-white/50 leading-relaxed mt-0.5">
                        {insight.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Block 5 - Key Facts */}
        <section className="border border-white/[0.08] bg-moic-surface p-4 sm:p-6 rounded-2xl">
          <h2 className="text-sm sm:text-base font-bold tracking-wide mb-4" style={{ fontFamily: "'Clash Grotesk', sans-serif" }}>
            Key Facts
          </h2>
          <div className="space-y-3">
            {keyFacts.map((fact) => {
              const Icon = fact.icon
              return (
                <div
                  key={fact.label}
                  className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-white/30" />
                    <span className="text-[11px] sm:text-xs text-white/40 uppercase tracking-widest">
                      {fact.label}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white text-right max-w-[50%] truncate">
                    {fact.value}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* Block 6 - Highlights */}
        {card.perks.length > 0 && (
          <section className="border border-white/[0.08] bg-moic-surface p-4 sm:p-6 rounded-2xl">
            <h2 className="text-sm sm:text-base font-bold tracking-wide mb-4" style={{ fontFamily: "'Clash Grotesk', sans-serif" }}>
              Highlights
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {card.perks.map((perk, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-moic-green mt-0.5 shrink-0" />
                  <span className="text-[11px] sm:text-xs text-white/70 leading-relaxed">
                    {perk}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
