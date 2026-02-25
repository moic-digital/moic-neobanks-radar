import { fetchCards } from "@/lib/sheets"
import HomePage from "@/components/HomePage"

export default async function Page() {
  const cards = await fetchCards()

  return <HomePage cards={cards} />
}
