import Image from "next/image"

export default function HeroSection() {
  return (
    <section className="flex flex-col items-center py-12 sm:py-16 md:py-20 px-4">
      <h1
        className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight text-center"
        style={{ fontFamily: "'Clash Grotesk', sans-serif" }}
      >
        Neobank Radar
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
    </section>
  )
}
