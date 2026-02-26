import { cardLogos } from "@/data/logos"

const ALL_LOGOS = Object.entries(cardLogos).map(([id, src]) => ({ id, src }))

function seededShuffle<T>(arr: readonly T[], seed: number): T[] {
  const result = [...arr]
  let s = seed
  for (let i = result.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647
    const j = s % (i + 1)
    const temp = result[i]
    result[i] = result[j]
    result[j] = temp
  }
  return result
}

export function getLogoColumns(count: number): { id: string; src: string }[][] {
  return Array.from({ length: count }, (_, i) =>
    seededShuffle(ALL_LOGOS, (i + 1) * 7919)
  )
}

const CONTAINER_HEIGHT = 420
const ITEM_HEIGHT_LG = 56 + 8

function repeatToFill(logos: readonly { id: string; src: string }[]): { id: string; src: string }[] {
  const oneSetHeight = logos.length * ITEM_HEIGHT_LG
  if (oneSetHeight >= CONTAINER_HEIGHT) return [...logos]
  const reps = Math.ceil(CONTAINER_HEIGHT / oneSetHeight) + 1
  return Array.from({ length: reps }, () => logos).flat()
}

interface LogoColumnProps {
  readonly logos: readonly { id: string; src: string }[]
  readonly animation: string
  readonly delay: string
}

export default function LogoColumn({ logos, animation, delay }: LogoColumnProps) {
  const oneSet = repeatToFill(logos)
  const items = [...oneSet, ...oneSet]

  return (
    <div className="overflow-hidden h-full shrink-0">
      <div
        className={`flex flex-col items-center gap-2 will-change-transform ${animation}`}
        style={{ animationDelay: delay }}
      >
        {items.map((logo, i) => (
          <img
            key={`${logo.id}-${i}`}
            src={logo.src}
            alt=""
            width={48}
            height={48}
            loading="eager"
            className="w-14 h-14 rounded-xl object-cover border border-white/10 shrink-0"
          />
        ))}
      </div>
    </div>
  )
}
