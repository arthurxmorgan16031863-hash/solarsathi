// Shared solar assumptions so every page uses the same numbers.
export const PERFORMANCE_RATIO = 0.8      // real-world output vs. nameplate (losses, heat, dust, inverter)
export const DEGRADATION = 0.005          // ~0.5% output loss per year
export const GRID_CO2_KG_PER_KWH = 0.82   // approximate grid average; check latest CEA CO2 Baseline Database
export const SQFT_PER_KW = 100            // rooftop area rule of thumb
export const LIFETIME_YEARS = 25

/** Total savings after `years`, with panel degradation and a flat tariff (no escalation). */
export function cumulativeSavings(annual, years) {
  let total = 0
  for (let y = 0; y < years; y++) total += annual * Math.pow(1 - DEGRADATION, y)
  return total
}

// Advisor cost assumptions (approximate 2026 India ranges; actual quotes vary widely)
export const ADVISOR_COST_PER_KW = 55000       // installed rooftop system, before subsidy
export const BATTERY_COST_PER_KWH = 20000      // LFP battery, typical range ~₹15,000–25,000/kWh
export const HYBRID_INVERTER_EXTRA = 30000     // extra cost of a battery-capable hybrid inverter
export const INVERTER_SIZES_KW = [1, 2, 3, 4, 5, 6, 8, 10]

/** PM Surya Ghar CFA: ₹30,000/kW (first 2 kW) + ₹18,000 (3rd kW), capped at 3 kW / ₹78,000.
 *  Special-category states/UTs: ₹33,000/kW and ₹19,800. Fractional kW is prorated (indicative). */
export function suryaGharSubsidy(kw, special = false) {
  const [first, third] = special ? [33000, 19800] : [30000, 18000]
  const k = Math.min(Math.max(kw, 0), 3)
  return Math.round(Math.min(k, 2) * first + Math.max(k - 2, 0) * third)
}
