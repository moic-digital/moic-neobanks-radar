import Image from "next/image"
import LogoColumn, { getLogoColumns } from "@/components/LogoColumn"

const COLUMNS = getLogoColumns(12)
const LEFT_COLUMNS = COLUMNS.slice(0, 6)
const RIGHT_COLUMNS = COLUMNS.slice(6)

const LANE_CONFIG: readonly {
  readonly animation: string
  readonly delay: string
}[] = [
  { animation: "animate-scroll-down-1", delay: "0s" },
  { animation: "animate-scroll-up-2", delay: "-6s" },
  { animation: "animate-scroll-down-3", delay: "-3s" },
  { animation: "animate-scroll-up-1", delay: "-10s" },
  { animation: "animate-scroll-down-2", delay: "-1s" },
  { animation: "animate-scroll-up-3", delay: "-8s" },
  { animation: "animate-scroll-up-1", delay: "-5s" },
  { animation: "animate-scroll-down-3", delay: "-12s" },
  { animation: "animate-scroll-up-2", delay: "-2s" },
  { animation: "animate-scroll-down-1", delay: "-9s" },
  { animation: "animate-scroll-down-2", delay: "-4s" },
  { animation: "animate-scroll-up-3", delay: "-11s" },
]

function LogoPanel({ columns, offset, side }: {
  readonly columns: readonly { id: string; src: string }[][]
  readonly offset: number
  readonly side: "left" | "right"
}) {
  return (
    <div className="relative overflow-hidden h-full">
      <div className={`flex h-full gap-2 ${side === "left" ? "justify-end" : "justify-start"}`}>
        {columns.map((col, i) => (
          <LogoColumn
            key={`${side}-${i}`}
            logos={col}
            animation={LANE_CONFIG[offset + i].animation}
            delay={LANE_CONFIG[offset + i].delay}
          />
        ))}
      </div>

      {/* Fade toward center */}
      {side === "left" && (
        <div className="absolute inset-y-0 right-0 w-16 lg:w-24 bg-gradient-to-l from-moic-navy to-transparent pointer-events-none" />
      )}
      {side === "right" && (
        <div className="absolute inset-y-0 left-0 w-16 lg:w-24 bg-gradient-to-r from-moic-navy to-transparent pointer-events-none" />
      )}

      {/* Top/bottom fade */}
      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-moic-navy to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-moic-navy to-transparent pointer-events-none" />
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative grid grid-cols-1 md:grid-cols-[25%_50%_25%] h-auto md:h-[420px] overflow-hidden gap-0">
      {/* Left panel */}
      <div className="hidden md:block h-full overflow-hidden">
        <LogoPanel columns={LEFT_COLUMNS} offset={0} side="left" />
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center justify-center py-14 sm:py-18 md:py-0 px-4">
        <h1
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight text-center"
          style={{ fontFamily: "'Clash Grotesk', sans-serif" }}
        >
          Neobanks Radar
        </h1>

        <div className="flex items-center gap-2.5 mt-3">
          <span className="text-white/50 text-xs sm:text-sm">Powered by</span>
          <Image
            src="/logos/moic-logo.png"
            alt="MOIC"
            width={80}
            height={32}
            className="opacity-90"
          />
        </div>

        <p className="text-white/40 text-sm sm:text-base text-center max-w-xl mx-auto mt-4 leading-relaxed">
          Compare fees, perks and find the perfect digital bank for your financial moment.
        </p>
      </div>

      {/* Right panel */}
      <div className="hidden md:block h-full overflow-hidden">
        <LogoPanel columns={RIGHT_COLUMNS} offset={6} side="right" />
      </div>
    </section>
  )
}
