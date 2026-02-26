export const REGION_ALIASES: Readonly<Record<string, readonly string[]>> = {
  india: ["apac", "asia", "global", "worldwide"],
  nigeria: ["africa", "global", "worldwide"],
  japan: ["apac", "asia", "global", "worldwide"],
  singapore: ["apac", "asia", "global", "worldwide"],
  australia: ["apac", "oceania", "global", "worldwide"],
  brazil: ["latam", "south america", "global", "worldwide"],
  argentina: ["latam", "south america", "global", "worldwide"],
  mexico: ["latam", "north america", "global", "worldwide"],
  canada: ["north america", "global", "worldwide"],
  "united kingdom": ["uk", "europe", "global", "worldwide"],
  germany: ["eea", "europe", "global", "worldwide"],
  france: ["eea", "europe", "global", "worldwide"],
  uae: ["mena", "global", "worldwide"],
  "united states": ["us", "usa"],
  usa: ["us", "usa"],
}

export function matchesRegion(
  cardRegions: string,
  selectedRegion: string
): boolean {
  if (!selectedRegion || selectedRegion === "Global") return true
  const regions = cardRegions.toLowerCase()
  const selected = selectedRegion.toLowerCase()

  if (regions.includes(selected)) return true

  const aliases = REGION_ALIASES[selected]
  if (aliases) {
    return aliases.some((a) => regions.includes(a))
  }

  return false
}
