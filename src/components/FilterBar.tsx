"use client"

import {
  Search,
  X,
  Globe,
  DollarSign,
  Shield,
  KeyRound,
  ArrowDownAZ,
} from "lucide-react"
import { Filters, SortOption } from "@/types/card"
import FilterDropdown from "@/components/FilterDropdown"

const REGION_ITEMS = [
  {
    groupLabel: "Americas",
    options: [
      { value: "United States", label: "US" },
      { value: "Canada", label: "Canada" },
      { value: "Brazil", label: "Brazil" },
      { value: "Argentina", label: "Argentina" },
      { value: "Mexico", label: "Mexico" },
      { value: "LATAM", label: "LATAM" },
    ],
  },
  {
    groupLabel: "Europe",
    options: [
      { value: "United Kingdom", label: "UK" },
      { value: "Germany", label: "Germany" },
      { value: "France", label: "France" },
      { value: "EEA", label: "Europe" },
    ],
  },
  {
    groupLabel: "Asia Pacific",
    options: [
      { value: "India", label: "India" },
      { value: "Japan", label: "Japan" },
      { value: "Singapore", label: "Singapore" },
      { value: "Australia", label: "Australia" },
      { value: "APAC", label: "APAC" },
    ],
  },
  {
    groupLabel: "Other",
    options: [
      { value: "Nigeria", label: "Nigeria" },
      { value: "UAE", label: "UAE" },
      { value: "Global", label: "Global" },
    ],
  },
] as const

const CURRENCY_ITEMS = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "INR", label: "INR" },
  { value: "BRL", label: "BRL (R$)" },
] as const

const SORT_ITEMS = [
  { value: "nameAZ", label: "A-Z" },
  { value: "featured", label: "All" },
  { value: "cashbackHigh", label: "Top Cashback" },
  { value: "newest", label: "Newest" },
] as const

interface FilterBarProps {
  readonly filters: Filters
  readonly sort: SortOption
  readonly onFilterChange: (filters: Filters) => void
  readonly onSortChange: (sort: SortOption) => void
  readonly resultsCount: number
}

type TriState = "none" | "with" | "without"

const SELF_CUSTODY_VALUES = ["Self-Custody", "Non-Custodial"]
const CUSTODIAL_VALUES = ["Custodial", "Hybrid"]

function getTriStateClasses(state: TriState): string {
  if (state === "with") {
    return "bg-moic-blue/15 border-moic-blue text-white shadow-[0_0_12px_rgba(42,96,251,0.15)]"
  }
  if (state === "without") {
    return "bg-amber-500/10 border-amber-500/50 text-white shadow-[0_0_12px_rgba(245,158,11,0.1)]"
  }
  return "bg-white/5 border-white/10 text-white hover:border-white/20"
}

function getTriStateIconClasses(state: TriState): string {
  if (state === "with") return "text-moic-blue"
  if (state === "without") return "text-amber-400"
  return "text-moic-blue"
}

const TRI_STATES: readonly TriState[] = ["none", "with", "without"]

function getDotColor(dotState: TriState, activeState: TriState): string {
  if (dotState !== activeState) return "bg-white/20"
  if (activeState === "with") return "bg-moic-blue"
  if (activeState === "without") return "bg-amber-400"
  return "bg-white/50"
}

function TriStateDots({ state }: { readonly state: TriState }) {
  return (
    <div className="flex items-center gap-1">
      {TRI_STATES.map((s) => (
        <span
          key={s}
          className={`w-1.5 h-1.5 rounded-full transition-colors ${getDotColor(s, state)}`}
        />
      ))}
    </div>
  )
}

export default function FilterBar({
  filters,
  sort,
  onFilterChange,
  onSortChange,
  resultsCount,
}: FilterBarProps) {
  const hasActiveFilters =
    filters.region !== "" ||
    filters.kyc !== "" ||
    filters.currency !== "" ||
    filters.custody.length > 0

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    onFilterChange({ ...filters, search: e.target.value })
  }

  function getKycState(): TriState {
    if (filters.kyc === "") return "none"
    if (filters.kyc === "required") return "with"
    return "without"
  }

  function getSelfCustodyState(): TriState {
    if (filters.custody.length === 0) return "none"
    if (SELF_CUSTODY_VALUES.some((v) => filters.custody.includes(v))) return "with"
    return "without"
  }

  function cycleKyc() {
    const state = getKycState()
    const newKyc = state === "none" ? "required" : state === "with" ? "None" : ""
    onFilterChange({ ...filters, kyc: newKyc })
  }

  function cycleSelfCustody() {
    const state = getSelfCustodyState()
    const newCustody =
      state === "none"
        ? [...SELF_CUSTODY_VALUES]
        : state === "with"
          ? [...CUSTODIAL_VALUES]
          : []
    onFilterChange({ ...filters, custody: newCustody })
  }

  function clearFilters() {
    onFilterChange({
      search: filters.search,
      cardType: [],
      network: [],
      custody: [],
      minCashback: 0,
      annualFee: "all",
      fxFee: "all",
      region: "",
      kyc: "",
      currency: "",
    })
  }

  const kycState = getKycState()
  const selfCustodyState = getSelfCustodyState()

  return (
    <div className="w-full mb-6 sm:mb-8 py-4 sm:py-6 space-y-4">
      {/* Row 1: Search */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-4 sm:pl-5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 sm:h-5 sm:w-5 text-white/30" />
        </div>
        <input
          type="text"
          placeholder="Search neobanks..."
          className="block w-full pl-11 sm:pl-13 pr-4 py-3.5 sm:py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-moic-blue focus:shadow-[0_0_12px_rgba(42,96,251,0.2)] text-sm sm:text-base tracking-wide transition-all"
          value={filters.search}
          onChange={handleSearch}
        />
      </div>

      {/* Row 2: KYC + Self-Custody (prominent tri-state) + other filters */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* KYC tri-state */}
        <button
          onClick={cycleKyc}
          className={`flex items-center justify-center gap-2 px-3 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-wide transition-all border rounded-xl cursor-pointer ${getTriStateClasses(kycState)}`}
        >
          <Shield className={`w-4 h-4 shrink-0 ${getTriStateIconClasses(kycState)}`} />
          <span>
            {kycState === "none" && "KYC"}
            {kycState === "with" && "With KYC"}
            {kycState === "without" && "No KYC"}
          </span>
          <TriStateDots state={kycState} />
        </button>

        {/* Self-Custody tri-state */}
        <button
          onClick={cycleSelfCustody}
          className={`flex items-center justify-center gap-2 px-3 py-3 sm:py-3.5 text-xs sm:text-sm font-semibold tracking-wide transition-all border rounded-xl cursor-pointer ${getTriStateClasses(selfCustodyState)}`}
        >
          <KeyRound className={`w-4 h-4 shrink-0 ${getTriStateIconClasses(selfCustodyState)}`} />
          <span>
            {selfCustodyState === "none" && "Custody"}
            {selfCustodyState === "with" && "Self-Custody"}
            {selfCustodyState === "without" && "Custodial"}
          </span>
          <TriStateDots state={selfCustodyState} />
        </button>

        {/* Region */}
        <FilterDropdown
          icon={<Globe className="w-4 h-4 text-moic-blue shrink-0" />}
          value={filters.region}
          placeholder="Region"
          items={REGION_ITEMS}
          onChange={(val) => onFilterChange({ ...filters, region: val })}
        />

        {/* Currency */}
        <FilterDropdown
          icon={<DollarSign className="w-4 h-4 text-moic-blue shrink-0" />}
          value={filters.currency}
          placeholder="Currency"
          items={CURRENCY_ITEMS}
          onChange={(val) => onFilterChange({ ...filters, currency: val })}
        />

        {/* Sort */}
        <FilterDropdown
          icon={<ArrowDownAZ className="w-4 h-4 text-moic-blue shrink-0" />}
          value={sort}
          placeholder="Sort"
          items={SORT_ITEMS}
          onChange={(val) => onSortChange(val as SortOption)}
        />
      </div>

      {/* Row 3: Results count + clear */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] sm:text-[11px] text-white/30">
          {hasActiveFilters
            ? `Filtered: ${resultsCount} cards`
            : `Showing all ${resultsCount} cards`}
        </span>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 text-xs font-medium text-white/50 hover:text-moic-blue transition-colors"
          >
            <X className="w-3 h-3" />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
