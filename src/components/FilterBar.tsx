"use client"

import { useState } from "react"
import {
  Search,
  ChevronDown,
  SlidersHorizontal,
  X,
  Globe,
  DollarSign,
  Eye,
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
  const [showFilters, setShowFilters] = useState(false)

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
    <div className="w-full mb-6 sm:mb-8 py-4 sm:py-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-stretch sm:items-center mb-4 sm:mb-6">
        <div className="relative flex-1 sm:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-white/50" />
          </div>
          <input
            type="text"
            placeholder="SEARCH..."
            className="block w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-black border-4 border-white text-white placeholder-white/40 focus:outline-none focus:border-lime-400 text-xs sm:text-sm font-mono uppercase tracking-wider transition-colors"
            value={filters.search}
            onChange={handleSearch}
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <select
              value={sort}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="appearance-none w-full bg-black text-white py-3 sm:py-4 pl-3 sm:pl-5 pr-10 sm:pr-12 border-4 border-white text-xs sm:text-sm font-black uppercase tracking-wider focus:outline-none focus:border-lime-400 cursor-pointer transition-colors"
            >
              <option value="featured">&#9733; ALL</option>
              <option value="cashbackHigh">TOP CB</option>
              <option value="nameAZ">A-Z</option>
              <option value="newest">NEW</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 sm:px-4 text-white">
              <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5" />
            </div>
          </div>

          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-2 px-3 sm:px-4 py-3 sm:py-4 border-4 font-black uppercase text-xs sm:text-sm transition-all ${
              showFilters || hasActiveFilters
                ? "bg-lime-400 border-lime-400 text-black"
                : "bg-black border-white text-white"
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="hidden sm:inline">Filters</span>
            {hasActiveFilters && (
              <span className="w-5 h-5 bg-black text-lime-400 text-[10px] font-black flex items-center justify-center">
                !
              </span>
            )}
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="border-4 border-white p-3 sm:p-4 mb-4 sm:mb-6 space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Region */}
            <div className="relative">
              <label className="text-[10px] text-white/50 font-mono uppercase mb-1 block">
                Region
              </label>
              <div className="flex items-center gap-2 bg-black px-3 py-2 sm:py-3 border-4 border-white hover:border-lime-400 transition-colors cursor-pointer">
                <Globe className="w-4 h-4 text-lime-400 shrink-0" />
                <select
                  value={filters.region}
                  onChange={(e) =>
                    onFilterChange({ ...filters, region: e.target.value })
                  }
                  className="bg-transparent text-xs sm:text-sm font-black text-white focus:outline-none cursor-pointer w-full uppercase"
                >
                  <option value="">ALL</option>
                  <optgroup label="Americas">
                    <option value="United States">US</option>
                    <option value="Canada">CANADA</option>
                    <option value="Brazil">BRAZIL</option>
                    <option value="Argentina">ARGENTINA</option>
                    <option value="Mexico">MEXICO</option>
                    <option value="LATAM">LATAM</option>
                  </optgroup>
                  <optgroup label="Europe">
                    <option value="United Kingdom">UK</option>
                    <option value="Germany">GERMANY</option>
                    <option value="France">FRANCE</option>
                    <option value="EEA">EUROPE</option>
                  </optgroup>
                  <optgroup label="Asia Pacific">
                    <option value="India">INDIA</option>
                    <option value="Japan">JAPAN</option>
                    <option value="Singapore">SINGAPORE</option>
                    <option value="Australia">AUSTRALIA</option>
                    <option value="APAC">APAC</option>
                  </optgroup>
                  <optgroup label="Other">
                    <option value="Nigeria">NIGERIA</option>
                    <option value="UAE">UAE</option>
                    <option value="Global">GLOBAL</option>
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Currency */}
            <div className="relative">
              <label className="text-[10px] text-white/50 font-mono uppercase mb-1 block">
                Currency
              </label>
              <div className="flex items-center gap-2 bg-black px-3 py-2 sm:py-3 border-4 border-white hover:border-lime-400 transition-colors cursor-pointer">
                <DollarSign className="w-4 h-4 text-lime-400 shrink-0" />
                <select
                  value={filters.currency}
                  onChange={(e) =>
                    onFilterChange({ ...filters, currency: e.target.value })
                  }
                  className="bg-transparent text-xs sm:text-sm font-black text-white focus:outline-none cursor-pointer w-full uppercase"
                >
                  <option value="">ANY</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (&euro;)</option>
                  <option value="GBP">GBP (&pound;)</option>
                  <option value="INR">INR</option>
                  <option value="BRL">BRL (R$)</option>
                </select>
              </div>
            </div>

            {/* Privacy */}
            <div className="relative">
              <label className="text-[10px] text-white/50 font-mono uppercase mb-1 block">
                Privacy
              </label>
              <div className="flex items-center gap-2 bg-black px-3 py-2 sm:py-3 border-4 border-white hover:border-lime-400 transition-colors cursor-pointer">
                <Eye className="w-4 h-4 text-lime-400 shrink-0" />
                <select
                  value={filters.kyc}
                  onChange={(e) =>
                    onFilterChange({ ...filters, kyc: e.target.value })
                  }
                  className="bg-transparent text-xs sm:text-sm font-black text-white focus:outline-none cursor-pointer w-full uppercase"
                >
                  <option value="">ANY KYC</option>
                  <option value="Required">REQUIRED</option>
                  <option value="Light">LIGHT</option>
                  <option value="None">NONE</option>
                </select>
              </div>
            </div>

            {/* Custody */}
            <div className="relative">
              <label className="text-[10px] text-white/50 font-mono uppercase mb-1 block">
                Custody
              </label>
              <button
                onClick={toggleSelfCustody}
                className={`w-full px-3 py-2 sm:py-3 text-xs sm:text-sm font-black uppercase tracking-wider transition-all border-4 ${
                  isSelfCustodyActive()
                    ? "bg-lime-400 border-lime-400 text-black"
                    : "bg-black border-white text-white"
                }`}
              >
                Self-Custody
              </button>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 text-xs sm:text-sm font-black text-white hover:text-lime-400 px-3 py-2 border-4 border-white/50 hover:border-lime-400 transition-all uppercase w-full sm:w-auto justify-center"
            >
              <X className="w-4 h-4" />
              Clear Filters
            </button>
          )}
        </div>
      )}

      <div className="text-[10px] sm:text-[11px] text-white/40 font-mono uppercase">
        {hasActiveFilters
          ? `Filtered: ${resultsCount} cards`
          : "Showing all cards"}
      </div>
    </div>
  )
}
