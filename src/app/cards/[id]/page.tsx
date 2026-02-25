import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, ExternalLink } from "lucide-react"
import { fetchCards } from "@/lib/sheets"
import type { CardData } from "@/types/card"

interface CardPageProps {
  readonly params: Promise<{ id: string }>
}

function buildInsights(card: CardData): readonly string[] {
  const insights: string[] = []

  if (typeof card.cashbackMax === "number") {
    if (card.cashbackMax >= 10) {
      insights.push("Extremely high cashback – best suited for heavy spenders who can maximize rewards.")
    } else if (card.cashbackMax >= 5) {
      insights.push("Strong cashback profile for everyday spending across multiple categories.")
    } else if (card.cashbackMax > 0) {
      insights.push("Moderate cashback – interesting as a secondary card or niche use case.")
    } else {
      insights.push("No direct cashback – evaluate mainly for features, regions and custody model.")
    }
  }

  if (card.custody === "Self-Custody" || card.custody === "Non-Custodial") {
    insights.push("Non‑custodial / self‑custody design – better for power users who prefer holding their own keys.")
  } else {
    insights.push("Custodial model – closer to a traditional fintech experience with simpler UX.")
  }

  if (card.kyc === "None" || card.kyc === "Light") {
    insights.push("Reduced KYC requirements – attractive for privacy‑focused users, but may come with lower limits.")
  } else {
    insights.push("Full KYC – typical for regulated neobanks, usually enabling higher limits and broader coverage.")
  }

  if (card.airdropFarming) {
    insights.push("Marked for airdrop farming – might be interesting for users farming ecosystem or protocol rewards.")
  }

  if (!card.age) {
    insights.push("Newer product – monitor stability and community feedback before routing large volumes.")
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
  const kycLabel = card.kyc === "Required" ? "YES" : "NO"

  return (
    <div className="min-h-screen bg-black text-white font-mono selection:bg-lime-400 selection:text-black">
      <header className="border-b-4 border-white px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-black uppercase tracking-widest border-2 border-white px-2.5 py-1.5 hover:bg-white hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back
          </Link>
          <div className="min-w-0">
            <p className="text-[10px] text-white/60 uppercase tracking-widest">
              {card.issuer}
            </p>
            <h1 className="text-lg sm:text-2xl md:text-3xl font-black uppercase tracking-tight truncate">
              {card.name}
            </h1>
          </div>
        </div>

        <a
          href={card.officialLink}
          target="_blank"
          rel="noreferrer"
          className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border-2 border-lime-400 bg-lime-400 text-black text-xs font-black uppercase tracking-widest hover:bg-black hover:text-lime-400 transition-colors"
        >
          Official page
          <ExternalLink className="w-4 h-4" />
        </a>
      </header>

      <main className="px-4 sm:px-8 py-6 sm:py-10 max-w-6xl mx-auto space-y-8 sm:space-y-10">
        {/* Hero card summary */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-stretch">
          <article className="md:col-span-2 rounded-2xl border-4 border-white bg-gradient-to-br from-black via-slate-900 to-black p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-12 h-12 rounded-full bg-black/40 border-2 border-white/40 overflow-hidden flex items-center justify-center">
                  <img
                    src={card.logo}
                    alt={card.issuer}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-white/60 uppercase tracking-widest">
                    {card.issuer}
                  </p>
                  <h2 className="text-lg sm:text-xl font-black uppercase tracking-tight truncate">
                    {card.name}
                  </h2>
                  <p className="text-[11px] text-white/50 uppercase tracking-widest mt-1">
                    {card.type} · {card.network} · {card.custody}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center text-[11px] uppercase tracking-widest">
              <div className="border-2 border-white bg-black px-3 py-3 rounded-xl flex flex-col items-center justify-center">
                <span className="text-white/60 text-[9px]">Time in market</span>
                <span className="text-white font-black text-sm mt-1">
                  {ageLabel}
                </span>
              </div>
              <div className="border-2 border-lime-400 bg-black px-3 py-3 rounded-xl flex flex-col items-center justify-center">
                <span className="text-lime-300 text-[9px]">Max Cashback</span>
                <span className="text-lime-400 font-black text-lg mt-1">
                  {cashbackLabel}
                </span>
              </div>
              <div className="border-2 border-white bg-black px-3 py-3 rounded-xl flex flex-col items-center justify-center">
                <span className="text-white/60 text-[9px]">KYC</span>
                <span
                  className={`mt-1 inline-flex items-center gap-1 text-xs font-black ${
                    card.kyc === "Required"
                      ? "text-amber-300"
                      : "text-lime-300"
                  }`}
                >
                  {kycLabel}
                </span>
              </div>
            </div>

            {card.perks.length > 0 && (
              <div className="border-t border-white/20 pt-3 text-[11px] leading-relaxed text-white/80">
                <p className="uppercase text-[10px] text-white/50 mb-1 tracking-widest">
                  Highlights
                </p>
                <ul className="list-disc list-inside space-y-1">
                  {card.perks.slice(0, 3).map((perk, idx) => (
                    <li key={idx}>{perk}</li>
                  ))}
                </ul>
              </div>
            )}
          </article>

          <aside className="space-y-3 text-[11px] uppercase tracking-widest">
            <div className="border-4 border-white bg-black p-4 rounded-2xl space-y-2">
              <p className="text-white/60 text-[10px]">Key Facts</p>
              <div className="space-y-1.5">
                <div className="flex justify-between gap-2">
                  <span className="text-white/50">Annual fee</span>
                  <span className="font-black">{card.annualFee}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-white/50">FX fees</span>
                  <span className="font-black">{card.fxFee}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-white/50">Regions</span>
                  <span className="font-black text-right">
                    {card.regions || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            <a
              href={card.officialLink}
              target="_blank"
              rel="noreferrer"
              className="sm:hidden inline-flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-lime-400 bg-lime-400 text-black text-xs font-black uppercase tracking-widest hover:bg-black hover:text-lime-400 transition-colors rounded-xl"
            >
              Official page
              <ExternalLink className="w-4 h-4" />
            </a>
          </aside>
        </section>

        {/* Insights section */}
        <section className="border-4 border-white bg-black p-4 sm:p-6 rounded-2xl">
          <h2 className="text-sm sm:text-base font-black uppercase tracking-widest mb-3 sm:mb-4">
            Insights
          </h2>
          <ul className="space-y-2 text-[11px] sm:text-sm leading-relaxed">
            {insights.map((insight, idx) => (
              <li key={idx} className="text-white/85">
                • {insight}
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  )
}

