"use client"

import {
  Search,
  ChevronDown,
  X,
  Globe,
  DollarSign,
  Shield,
} from "lucide-react"
import { Filters, SortOption } from "@/types/card"

interface FilterBarProps {
  readonly filters: Filters
  readonly sort: SortOption
  readonly onFilterChange: (filters: Filters) => void
  readonly onSortChange: (sort: SortOption) => void
  readonly resultsCount: number
}

const SELF_CUSTODY_VALUES = ["Self-Custody", "Non-Custodial"]

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

  function isSelfCustodyActive() {
    return SELF_CUSTODY_VALUES.some((v) => filters.custody.includes(v))
  }

  function toggleSelfCustody() {
    const newCustody = isSelfCustodyActive()
      ? filters.custody.filter((v) => !SELF_CUSTODY_VALUES.includes(v))
      : [...filters.custody, ...SELF_CUSTODY_VALUES.filter((v) => !filters.custody.includes(v))]
    onFilterChange({ ...filters, custody: newCustody })
  }

  function handleKycChange(value: string) {
    onFilterChange({ ...filters, kyc: value })
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

  return (
    <div className="w-full mb-6 sm:mb-8 py-4 sm:py-6 space-y-4">
      {/* Row 1: Search — full width */}
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

      {/* Row 2: All filters + sort */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {/* Region */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-2.5 sm:py-3 border border-white/10 rounded-lg hover:border-moic-blue/50 transition-colors cursor-pointer">
            <Globe className="w-4 h-4 text-moic-blue shrink-0" />
            <select
              value={filters.region}
              onChange={(e) =>
                onFilterChange({ ...filters, region: e.target.value })
              }
              className="bg-transparent text-xs sm:text-sm font-medium text-white focus:outline-none cursor-pointer w-full"
            >
              <option value="">Region</option>
              <optgroup label="Americas">
                <option value="United States">US</option>
                <option value="Canada">Canada</option>
                <option value="Brazil">Brazil</option>
                <option value="Argentina">Argentina</option>
                <option value="Mexico">Mexico</option>
                <option value="LATAM">LATAM</option>
              </optgroup>
              <optgroup label="Europe">
                <option value="United Kingdom">UK</option>
                <option value="Germany">Germany</option>
                <option value="France">France</option>
                <option value="EEA">Europe</option>
              </optgroup>
              <optgroup label="Asia Pacific">
                <option value="India">India</option>
                <option value="Japan">Japan</option>
                <option value="Singapore">Singapore</option>
                <option value="Australia">Australia</option>
                <option value="APAC">APAC</option>
              </optgroup>
              <optgroup label="Other">
                <option value="Nigeria">Nigeria</option>
                <option value="UAE">UAE</option>
                <option value="Global">Global</option>
              </optgroup>
            </select>
          </div>
        </div>

        {/* Currency */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-2.5 sm:py-3 border border-white/10 rounded-lg hover:border-moic-blue/50 transition-colors cursor-pointer">
            <DollarSign className="w-4 h-4 text-moic-blue shrink-0" />
            <select
              value={filters.currency}
              onChange={(e) =>
                onFilterChange({ ...filters, currency: e.target.value })
              }
              className="bg-transparent text-xs sm:text-sm font-medium text-white focus:outline-none cursor-pointer w-full"
            >
              <option value="">Currency</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR</option>
              <option value="GBP">GBP</option>
              <option value="INR">INR</option>
              <option value="BRL">BRL (R$)</option>
            </select>
          </div>
        </div>

        {/* KYC */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-white/5 px-3 py-2.5 sm:py-3 border border-white/10 rounded-lg hover:border-moic-blue/50 transition-colors cursor-pointer">
            <Shield className="w-4 h-4 text-moic-blue shrink-0" />
            <select
              value={filters.kyc}
              onChange={(e) => handleKycChange(e.target.value)}
              className="bg-transparent text-xs sm:text-sm font-medium text-white focus:outline-none cursor-pointer w-full"
            >
              <option value="">KYC</option>
              <option value="required">With KYC</option>
              <option value="None">No KYC</option>
            </select>
          </div>
        </div>

        {/* Self-Custody toggle */}
        <button
          onClick={toggleSelfCustody}
          className={`px-3 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold tracking-wide transition-all border rounded-lg ${
            isSelfCustodyActive()
              ? "bg-moic-blue border-moic-blue text-white"
              : "bg-white/5 border-white/10 text-white/70 hover:border-moic-blue/50"
          }`}
        >
          Self-Custody
        </button>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="appearance-none w-full bg-white/5 text-white py-2.5 sm:py-3 pl-3 sm:pl-4 pr-9 border border-white/10 rounded-lg text-xs sm:text-sm font-semibold focus:outline-none focus:border-moic-blue cursor-pointer transition-all"
          >
            <option value="nameAZ">A-Z</option>
            <option value="featured">All</option>
            <option value="cashbackHigh">Top Cashback</option>
            <option value="newest">Newest</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-white/40">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
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
