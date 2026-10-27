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
