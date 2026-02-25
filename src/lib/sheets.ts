import { CardData } from "@/types/card"
import { getCardStyle } from "@/data/gradients"
import { getCardLogo } from "@/data/logos"

const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/17TiduyQc48IbZkDK0o5o1Sv4ndTbt_qPGyn6DsFTmaA/export?format=csv&gid=1350568727"

function parseCSVLine(line: string): readonly string[] {
  const fields: string[] = []
  let current = ""
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (inQuotes) {
      if (char === '"' && line[i + 1] === '"') {
        current += '"'
        i++
      } else if (char === '"') {
        inQuotes = false
      } else {
        current += char
      }
    } else {
      if (char === '"') {
        inQuotes = true
      } else if (char === ",") {
        fields.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }
  }

  fields.push(current.trim())
  return fields
}

function parseCSV(csv: string): readonly Record<string, string>[] {
  const lines = csv.split("\n").filter((line) => line.trim().length > 0)

  if (lines.length < 2) {
    return []
  }

  const headers = parseCSVLine(lines[0])

  return lines.slice(1).map((line) => {
    const values = parseCSVLine(line)
    const record: Record<string, string> = {}

    headers.forEach((header, index) => {
      record[header] = values[index] ?? ""
    })

    return record
  })
}

function parseCashback(value: string): number | string {
  const cleaned = value.replace("%", "").trim()
  const num = parseFloat(cleaned)
  if (!isNaN(num)) {
    return num
  }
  return value || "N/A"
}

function parseCustody(
  value: string
): "Custodial" | "Self-Custody" | "Non-Custodial" | "Hybrid" {
  const normalized = value.trim().toLowerCase()
  if (normalized === "custodial") return "Custodial"
  if (normalized === "self-custody") return "Self-Custody"
  if (normalized === "non-custodial") return "Non-Custodial"
  if (normalized === "hybrid") return "Hybrid"
  return "Custodial"
}

function parseKyc(value: string): "Required" | "Light" | "None" {
  const normalized = value.trim().toLowerCase()
  if (normalized === "light") return "Light"
  if (normalized === "no" || normalized === "none") return "None"
  return "Required"
}

function parseType(value: string): "Credit" | "Debit" | "Prepaid" {
  const normalized = value.trim().toLowerCase()
  if (normalized === "credit") return "Credit"
  if (normalized === "prepaid") return "Prepaid"
  return "Debit"
}

function parseNetwork(
  value: string
): "Visa" | "Mastercard" | "Visa/Mastercard" {
  const normalized = value.trim().toLowerCase()
  if (normalized.includes("visa") && normalized.includes("mastercard"))
    return "Visa/Mastercard"
  if (normalized === "mastercard") return "Mastercard"
  return "Visa"
}

function parseBoolean(value: string): boolean {
  return value.trim().toLowerCase() === "yes"
}

function parseCurrencies(value: string): readonly string[] {
  return value
    .split("|")
    .map((c) => c.trim())
    .filter((c) => c.length > 0)
}

function parsePerks(
  cashbackRewards: string,
  yieldInterest: string,
  lifestyleTravel: string
): readonly string[] {
  return [cashbackRewards, yieldInterest, lifestyleTravel]
    .filter((section) => section.trim().length > 0)
    .flatMap((section) =>
      section
        .split("|")
        .map((p) => p.trim())
        .filter((p) => p.length > 0)
    )
}

function rowToCard(row: Record<string, string>): CardData {
  const id = row["id"] ?? ""
  const style = getCardStyle(id)

  return {
    id,
    name: row["name"] ?? "",
    issuer: row["issuer"] ?? "",
    logo: getCardLogo(id),
    type: parseType(row["type"] ?? ""),
    network: parseNetwork(row["network"] ?? ""),
    cashbackMax: parseCashback(row["maxCashback"] ?? ""),
    cashbackMin: row["minCashback"] ?? "",
    annualFee: row["annualFee"] ?? "Free",
    fxFee: row["fxFee"] ?? "Not specified",
    perks: parsePerks(
      row["Cashback & Rewards"] ?? "",
      row["Yield / Interest / APY"] ?? "",
      row["Lifestyle & Travel"] ?? ""
    ),
    signupBonus: row["signupBonus"] ?? "None",
    custody: parseCustody(row["custody"] ?? ""),
    regions: row["regions"] ?? "",
    officialLink: row["officialLink"] ?? "",
    cardGradient: style.cardGradient,
    tierColor: style.tierColor,
    metal: parseBoolean(row["metal"] ?? ""),
    supportedAssets: row["supportedAssets"] ?? "",
    kyc: parseKyc(row["KYC"] ?? ""),
    supportedCurrencies: parseCurrencies(row["supportedCurrencies"] ?? ""),
    age: row["Age"] ?? "",
    airdropFarming: row["Airdrop Farming"] ?? "",
  }
}

export async function fetchCards(): Promise<readonly CardData[]> {
  try {
    const response = await fetch(SHEET_CSV_URL, {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.status}`)
    }

    const csv = await response.text()
    const rows = parseCSV(csv)

    return rows.map(rowToCard)
  } catch (error) {
    console.error("Failed to fetch cards from Google Sheets:", error)
    const { cards } = await import("@/data/cards")
    return cards
  }
}
