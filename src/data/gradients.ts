interface CardStyle {
  readonly cardGradient: string
  readonly tierColor: string
}

export const cardStyles: Readonly<Record<string, CardStyle>> = {
  "nexo-card": {
    cardGradient: "from-[#1E2329] to-[#000000]",
    tierColor: "text-blue-400",
  },
  "coinbase-card": {
    cardGradient: "from-blue-600 to-blue-700",
    tierColor: "text-white",
  },
  "binance-card": {
    cardGradient: "from-[#F0B90B] to-[#F8D33A]",
    tierColor: "text-black",
  },
  "Kripicard": {
    cardGradient: "from-[#121214] to-[#1F1F1F]",
    tierColor: "text-orange-400",
  },
  "cdc-visa": {
    cardGradient: "from-slate-900 to-slate-950",
    tierColor: "text-white",
  },
  "bybit-card": {
    cardGradient: "from-[#121214] to-[#1F1F1F]",
    tierColor: "text-orange-400",
  },
  "kast-card": {
    cardGradient: "from-purple-600 to-indigo-700",
    tierColor: "text-white",
  },
  "gemini-card": {
    cardGradient: "from-slate-200 to-slate-900",
    tierColor: "text-black",
  },
  "metamask-card": {
    cardGradient: "from-orange-400 to-orange-500",
    tierColor: "text-white",
  },
  "etherfi-card": {
    cardGradient: "from-violet-900 to-purple-900",
    tierColor: "text-violet-200",
  },
  "wirex-card": {
    cardGradient: "from-[#00A58B] to-[#008670]",
    tierColor: "text-white",
  },
  "bitpay-card": {
    cardGradient: "from-blue-800 to-blue-900",
    tierColor: "text-white",
  },
  "coca-card": {
    cardGradient: "from-pink-500 to-rose-600",
    tierColor: "text-white",
  },
  "brighty-card": {
    cardGradient: "from-[#D1F866] to-[#A3D928]",
    tierColor: "text-black",
  },
  "cypher-card": {
    cardGradient: "from-neutral-900 to-black",
    tierColor: "text-yellow-500",
  },
  "venmo-card": {
    cardGradient: "from-blue-400 to-blue-500",
    tierColor: "text-white",
  },
  "bitrefill-card": {
    cardGradient: "from-red-500 to-red-700",
    tierColor: "text-white",
  },
  "whitebit-card": {
    cardGradient: "from-yellow-400 to-orange-400",
    tierColor: "text-black",
  },
  "wayex-card": {
    cardGradient: "from-emerald-500 to-emerald-700",
    tierColor: "text-white",
  },
  "gnosis-card": {
    cardGradient: "from-[#058c49] to-[#046c38]",
    tierColor: "text-white",
  },
  "fold-card": {
    cardGradient: "from-[#FFD700] to-[#E6C200]",
    tierColor: "text-black",
  },
  "bleap-card": {
    cardGradient: "from-[#6366f1] to-[#4f46e5]",
    tierColor: "text-white",
  },
  "bitpanda-card": {
    cardGradient: "from-[#23d186] to-[#1a9f66]",
    tierColor: "text-white",
  },
  "zypto-card": {
    cardGradient: "from-gray-800 to-gray-900",
    tierColor: "text-white",
  },
  "ledger-card": {
    cardGradient: "from-[#000000] to-[#1a1a1a]",
    tierColor: "text-[#bc5603]",
  },
  "tuyo-card": {
    cardGradient: "from-fuchsia-600 to-purple-600",
    tierColor: "text-white",
  },
  "redotpay-card": {
    cardGradient: "from-red-600 to-red-700",
    tierColor: "text-white",
  },
  "tria-card": {
    cardGradient: "from-violet-600 to-fuchsia-600",
    tierColor: "text-white",
  },
  "avici-card": {
    cardGradient: "from-[#000000] to-[#222]",
    tierColor: "text-white",
  },
  "oobit-card": {
    cardGradient: "from-zinc-800 to-zinc-900",
    tierColor: "text-lime-400",
  },
  "plutus-card": {
    cardGradient: "from-blue-700 to-indigo-800",
    tierColor: "text-blue-200",
  },
  "deblock-card": {
    cardGradient: "from-red-600 to-red-700",
    tierColor: "text-white",
  },
  "ready-lite": {
    cardGradient: "from-[#F36A3D] to-[#FF875B]",
    tierColor: "text-black",
  },
  "tapx-card": {
    cardGradient: "from-black to-neutral-800",
    tierColor: "text-white",
  },
  "fiat24-card": {
    cardGradient: "from-violet-700 to-indigo-800",
    tierColor: "text-white",
  },
  "thorwallet-card": {
    cardGradient: "from-emerald-900 via-teal-800 to-slate-900",
    tierColor: "text-white",
  },
  "safepal-card": {
    cardGradient: "from-blue-800 to-indigo-700",
    tierColor: "text-white",
  },
  "ur-card": {
    cardGradient: "from-black to-gray-900",
    tierColor: "text-white",
  },
  "savepay-card": {
    cardGradient: "from-green-300 to-green-400",
    tierColor: "text-black",
  },
  "imtoken-card": {
    cardGradient: "from-blue-400 to-blue-900",
    tierColor: "text-white",
  },
  "tokenpocket-card": {
    cardGradient: "from-neutral-950 to-black",
    tierColor: "text-white",
  },
  "bitgetwallet-card": {
    cardGradient: "from-cyan-600 to-blue-700",
    tierColor: "text-white",
  },
}

const defaultStyle: CardStyle = {
  cardGradient: "from-slate-800 to-slate-900",
  tierColor: "text-white",
}

export function getCardStyle(cardId: string): CardStyle {
  return cardStyles[cardId] ?? defaultStyle
}
