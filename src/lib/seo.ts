import type { CardData } from "@/types/card"

export function safeJsonLdStringify(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
}

export const BASE_URL = "https://neobanksradar.com"
export const SITE_NAME = "Neobanks Radar"
export const DEFAULT_DESCRIPTION =
  "Compare fees, cashback, perks and custody models across 40+ crypto debit and credit cards. Find the best neobank card for your needs."

export const DEFAULT_KEYWORDS = [
  "crypto card",
  "crypto debit card",
  "crypto credit card",
  "neobank",
  "neobank comparison",
  "crypto cashback",
  "bitcoin card",
  "crypto visa",
  "crypto mastercard",
  "self-custody card",
  "DeFi card",
  "Web3 card",
  "crypto rewards",
  "digital bank",
  "fintech card",
]

export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
    logo: `${BASE_URL}/logos/moic-logo.png`,
    description: DEFAULT_DESCRIPTION,
  }
}

export function buildWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    description: DEFAULT_DESCRIPTION,
  }
}

export function buildItemListJsonLd(cards: readonly CardData[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Crypto Card Comparison",
    description:
      "Compare the best crypto debit and credit cards by cashback, fees, custody and regions.",
    numberOfItems: cards.length,
    itemListElement: cards.map((card, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: card.name,
      url: `${BASE_URL}/cards/${card.id}`,
    })),
  }
}

function formatCashback(card: CardData): string {
  if (typeof card.cashbackMax === "number") {
    return card.cashbackMax > 0 ? `Up to ${card.cashbackMax}%` : "No cashback"
  }
  return card.cashbackMax || "N/A"
}

export function buildCardDescription(card: CardData): string {
  const cashback = formatCashback(card)
  const custodyLabel =
    card.custody === "Custodial"
      ? "Custodial model"
      : `${card.custody} model`

  const parts = [
    `${card.name} by ${card.issuer}`,
    `${card.type} card on ${card.network}`,
    cashback !== "No cashback" && cashback !== "N/A"
      ? `with ${cashback} cashback`
      : null,
    custodyLabel,
    card.regions ? `Available in ${card.regions}` : null,
  ]

  return parts.filter(Boolean).join(". ") + "."
}

function parseAnnualFeePrice(annualFee: string): string {
  if (annualFee === "Free" || annualFee === "0") return "0"
  const match = annualFee.match(/[\d.]+/)
  return match ? match[0] : "0"
}

export function buildFinancialProductJsonLd(card: CardData) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: card.name,
    description: buildCardDescription(card),
    brand: {
      "@type": "Organization",
      name: card.issuer,
    },
    category: `Crypto ${card.type} Card`,
    offers: {
      "@type": "Offer",
      price: parseAnnualFeePrice(card.annualFee),
      priceCurrency: "USD",
      description: `Annual fee: ${card.annualFee}`,
    },
    feesAndCommissionsSpecification: `FX Fee: ${card.fxFee}`,
    ...(card.regions ? { areaServed: card.regions } : {}),
  }
}

export function buildBreadcrumbJsonLd(cardName: string, cardId: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: cardName,
        item: `${BASE_URL}/cards/${cardId}`,
      },
    ],
  }
}

export function buildFAQJsonLd(card: CardData) {
  const cashback = formatCashback(card)

  const faqs = [
    {
      question: `What is the annual fee for ${card.name}?`,
      answer: `The annual fee for ${card.name} is ${card.annualFee}.`,
    },
    {
      question: `What cashback does ${card.name} offer?`,
      answer:
        typeof card.cashbackMax === "number" && card.cashbackMax > 0
          ? `${card.name} offers up to ${card.cashbackMax}% cashback on spending.`
          : `${card.name} does not offer direct cashback rewards.`,
    },
    {
      question: `Does ${card.name} require KYC verification?`,
      answer:
        card.kyc === "Required"
          ? `Yes, ${card.name} requires full KYC verification.`
          : card.kyc === "Light"
            ? `${card.name} requires light KYC verification with reduced documentation.`
            : `${card.name} does not require KYC verification.`,
    },
    {
      question: `What regions does ${card.name} support?`,
      answer: card.regions
        ? `${card.name} is available in ${card.regions}.`
        : `Regional availability for ${card.name} has not been specified.`,
    },
    {
      question: `Is ${card.name} custodial or self-custody?`,
      answer: `${card.name} uses a ${card.custody.toLowerCase()} model${
        card.custody === "Self-Custody" || card.custody === "Non-Custodial"
          ? ", meaning you hold your own keys."
          : card.custody === "Hybrid"
            ? ", combining elements of both custodial and self-custody approaches."
            : ", where the provider manages your assets."
      }`,
    },
    {
      question: `What payment network does ${card.name} use?`,
      answer: `${card.name} is a ${card.type.toLowerCase()} card on the ${card.network} network.`,
    },
    {
      question: `What are the FX fees for ${card.name}?`,
      answer: `The foreign exchange fee for ${card.name} is ${card.fxFee}.`,
    },
  ]

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }
}
