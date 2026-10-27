import { useState } from 'react'
import { Calculator, Sun, Zap, TrendingUp, Leaf, DollarSign, Clock, Info, Printer, Landmark } from 'lucide-react'

const DEFAULT_INPUTS = {
  consumption: 300,
  tariff: 8,
  roofArea: 500,
  budget: 200000,
  sunHours: 5,
  installCostPerKW: 50000,
}

/** PM Surya Ghar CFA: ₹30,000/kW (first 2 kW) + ₹18,000 (3rd kW), capped at 3 kW / ₹78,000.
 *  Special-category states/UTs: ₹33,000/kW and ₹19,800. Fractional kW is prorated (indicative). */
export function suryaGharSubsidy(kw, special = false) {
  const [first, third] = special ? [33000, 19800] : [30000, 18000]
  const k = Math.min(Math.max(kw, 0), 3)
  return Math.round(Math.min(k, 2) * first + Math.max(k - 2, 0) * third)
}

export default function SolarCalculator() {
  const [inputs, setInputs] = useState(DEFAULT_INPUTS)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [specialState, setSpecialState] = useState(false)

  const handleChange = (field, value) => {
    setInputs(prev => ({ ...prev, [field]: value }))
    setResult(null)
    setError('')
  }

  const calculate = () => {
    const n = k => Number(inputs[k])
    const consumption = n('consumption'), tariff = n('tariff'), roofArea = n('roofArea')
    const budget = n('budget'), sunHours = n('sunHours'), installCostPerKW = n('installCostPerKW')

    if ([consumption, tariff, roofArea, budget, sunHours, installCostPerKW].some(v => !Number.isFinite(v) || v <= 0)) {
      setError('Please fill in every field with a number greater than zero.')
      return
    }
    if (sunHours < 3 || sunHours > 8) {
      setError('Sunlight hours should be between 3 and 8 per day.')
      return
    }

    // System capacity based on energy demand
    // Assume 30-day month, 0.80 efficiency
    const capacityByDemand = consumption / (sunHours * 30 * 0.80)

    // Capacity limited by roof area (100 sq ft per kW)
    const capacityByRoof = roofArea / 100

    // Take smaller of demand & roof, then cap by budget
    const uncappedCapacity = Math.min(capacityByDemand, capacityByRoof)
    const maxCapacityByBudget = budget / installCostPerKW
    const systemCapacity = Math.min(uncappedCapacity, maxCapacityByBudget)

    const roundedKW = Math.round(systemCapacity * 10) / 10
    if (roundedKW <= 0) {
      setError(`Your budget is too low for any system. At ₹${installCostPerKW.toLocaleString('en-IN')}/kW you need at least ₹${Math.ceil(installCostPerKW / 20).toLocaleString('en-IN')}.`)
      return
    }

    // Monthly generation
    const monthlyGeneration = Math.round(roundedKW * sunHours * 30 * 0.80)

    // Monthly bill before solar
    const currentMonthlyBill = consumption * tariff

    // Savings limited to actual bill
    const monthlySavingsRaw = monthlyGeneration * tariff
    const monthlySavings = Math.min(monthlySavingsRaw, currentMonthlyBill)

    const annualSavings = monthlySavings * 12
    const totalInstallCost = Math.round(roundedKW * installCostPerKW)
    const payback = annualSavings > 0 ? (totalInstallCost / annualSavings).toFixed(1) : 'N/A'

    // CO₂: 0.82 kg CO₂ per kWh (India grid emission factor approx)
    const annualCO2 = Math.round((monthlyGeneration * 12 * 0.82) / 1000 * 10) / 10

    const subsidy = suryaGharSubsidy(roundedKW, specialState)
    const netCost = Math.max(totalInstallCost - subsidy, 0)
    const paybackNet = annualSavings > 0 ? (netCost / annualSavings).toFixed(1) : 'N/A'

    setResult({
      subsidy, netCost, paybackNet,
      systemCapacity: roundedKW,
      monthlyGeneration,
      installCost: totalInstallCost,
      monthlySavings: Math.round(monthlySavings),
      annualSavings: Math.round(annualSavings),
      payback,
      co2Reduction: annualCO2,
      currentBill: Math.round(currentMonthlyBill),
    })
  }

  return (
    <div>
      {/* Header */}
      <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, var(--c-f0fdf4), var(--c-ecfdf5))', border: '1px solid var(--c-bbf7d0)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #1a7a4a, #22a862)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calculator size={26} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-primary)' }}>Solar Savings Calculator</h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>Estimate your solar system requirements and potential savings. All values are indicative estimates only.</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Input Form */}
        <div className="card">
          <div className="section-title">Enter Your Details</div>
          <div className="alert alert-info" style={{ marginBottom: '20px' }}>
            <Info size={16} style={{ flexShrink: 0, marginTop: '1px' }} />
            <span>Results are estimates for educational purposes. Consult a certified solar installer for precise assessments.</span>
          </div>

          <FormField label="Monthly Electricity Consumption (kWh)" hint="Check your electricity bill for monthly units consumed">
            <input className="form-input" type="number" min="50" value={inputs.consumption} onChange={e => handleChange('consumption', e.target.value)} />
          </FormField>

          <FormField label="Electricity Tariff (₹/kWh)" hint="Per-unit rate from your electricity bill">
            <input className="form-input" type="number" min="1" step="0.5" value={inputs.tariff} onChange={e => handleChange('tariff', e.target.value)} />
          </FormField>

          <FormField label="Available Roof Area (sq. ft.)" hint="Usable shadow-free rooftop area (approx. 100 sq ft per kW)">
            <input className="form-input" type="number" min="100" value={inputs.roofArea} onChange={e => handleChange('roofArea', e.target.value)} />
          </FormField>

          <FormField label="Total Budget (₹)" hint="Your approximate budget for solar installation">
            <input className="form-input" type="number" min="10000" step="5000" value={inputs.budget} onChange={e => handleChange('budget', e.target.value)} />
          </FormField>

          <FormField label="Effective Sunlight Hours per Day" hint="India average: 4–6 hours. Use 5 if unsure.">
            <input className="form-input" type="number" min="3" max="8" step="0.5" value={inputs.sunHours} onChange={e => handleChange('sunHours', e.target.value)} />
          </FormField>

          <FormField label="Estimated Installation Cost per kW (₹)" hint="Typical range: ₹40,000–₹70,000 per kW">
            <input className="form-input" type="number" min="30000" step="1000" value={inputs.installCostPerKW} onChange={e => handleChange('installCostPerKW', e.target.value)} />
          </FormField>

          <label style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '13px', margin: '4px 0 12px' }}>
            <input type="checkbox" checked={specialState} onChange={e => { setSpecialState(e.target.checked); setResult(null) }} />
            I live in a special-category state/UT (higher PM Surya Ghar subsidy)
          </label>

          {error && (
            <div className="alert alert-warning">
              <Info size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <button className="btn btn-primary btn-full btn-lg" onClick={calculate} style={{ marginTop: '8px' }}>
            <Calculator size={17} /> Calculate Solar Savings
          </button>
        </div>

        {/* Results Panel */}
        <div>
          {!result ? (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center', background: 'var(--c-f8fafc)', border: '2px dashed var(--c-e2e8f0)' }}>
              <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, var(--c-dcfce7), var(--c-bbf7d0))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sun size={34} color="#1a7a4a" />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Your results will appear here</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>Fill in the details on the left and click Calculate</div>
              </div>
            </div>
          ) : (
            <div className="fade-in">
              <div className="result-panel">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <Sun size={20} color="#1a7a4a" />
                  <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--forest-green)' }}>Your Solar Estimate</div>
                </div>
                <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                  Current monthly bill: <strong>₹{result.currentBill.toLocaleString('en-IN')}</strong>
                </div>

                <div className="result-grid">
                  <ResultItem icon={<Zap size={18} color="#1a7a4a" />} value={`${result.systemCapacity} kW`} label="System Capacity" />
                  <ResultItem icon={<Sun size={18} color="#d97706" />} value={`${result.monthlyGeneration} kWh`} label="Monthly Generation" />
                  <ResultItem icon={<DollarSign size={18} color="#3b82f6" />} value={`₹${result.installCost.toLocaleString('en-IN')}`} label="Installation Cost" />
                  <ResultItem icon={<TrendingUp size={18} color="#22a862" />} value={`₹${result.monthlySavings.toLocaleString('en-IN')}`} label="Monthly Savings" />
                  <ResultItem icon={<TrendingUp size={18} color="#22a862" />} value={`₹${result.annualSavings.toLocaleString('en-IN')}`} label="Annual Savings" />
                  <ResultItem icon={<Clock size={18} color="#8b5cf6" />} value={`${result.payback} yrs`} label="Payback Period" />
                </div>

                <div style={{ background: 'var(--bg-white)', borderRadius: '12px', padding: '16px', marginTop: '14px', border: '1px solid var(--c-bbf7d0)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', background: 'var(--c-dcfce7)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Leaf size={20} color="var(--c-15803d)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--c-15803d)' }}>{result.co2Reduction} tonnes/year</div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-secondary)' }}>Estimated Annual CO₂ Reduction (using India grid factor: 0.82 kg/kWh)</div>
                  </div>
                </div>
              </div>

              <div className="tip-box" style={{ marginTop: '16px' }}>
                <strong>Assumptions:</strong> Panel efficiency 80%, sunlight hours as entered, installation cost as entered. Savings capped to your actual monthly bill. CO₂ based on India's average grid emission factor (0.82 kg CO₂/kWh). Savings figures are before subsidy; the subsidy card below shows the net effect. Consult a certified installer for exact figures.
              </div>

              <div className="card" style={{ marginTop: '16px', border: '1px solid var(--c-bbf7d0)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>
                  <Landmark size={16} color="#1a7a4a" /> PM Surya Ghar Subsidy (estimate)
                </div>
                <div style={{ fontSize: '13px', lineHeight: 1.9 }}>
                  Central subsidy: <strong>₹{result.subsidy.toLocaleString('en-IN')}</strong><br />
                  Cost after subsidy: <strong>₹{result.netCost.toLocaleString('en-IN')}</strong> (was ₹{result.installCost.toLocaleString('en-IN')})<br />
                  Payback after subsidy: <strong>{result.paybackNet} yrs</strong> (was {result.payback} yrs)
                </div>
                <div className="form-hint" style={{ marginTop: '8px' }}>
                  ₹30,000/kW for the first 2 kW + ₹18,000 for the 3rd kW, max ₹78,000 (₹33,000 / ₹19,800 in special-category states). Capped at 3 kW. Fractional kW is prorated. State top-ups are not included. Confirm on pmsuryaghar.gov.in.
                </div>
              </div>

              <button className="btn btn-secondary no-print" style={{ marginTop: '16px' }} onClick={() => window.print()}>
                <Printer size={15} /> Print / Save as PDF
              </button>

              <div className="card" style={{ marginTop: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Savings Breakdown</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ flex: 1, background: 'var(--c-f0fdf4)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>5-YEAR SAVINGS</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--forest-green)' }}>₹{(result.annualSavings * 5).toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ flex: 1, background: 'var(--c-f0fdf4)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>10-YEAR SAVINGS</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--forest-green)' }}>₹{(result.annualSavings * 10).toLocaleString('en-IN')}</div>
                  </div>
                  <div style={{ flex: 1, background: 'var(--c-f0fdf4)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '4px' }}>25-YEAR SAVINGS</div>
                    <div style={{ fontSize: '20px', fontWeight: 800, color: 'var(--forest-green)' }}>₹{(result.annualSavings * 25).toLocaleString('en-IN')}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function FormField({ label, hint, children }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
      {hint && <span className="form-hint">{hint}</span>}
    </div>
  )
}

function ResultItem({ icon, value, label }) {
  return (
    <div className="result-item">
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>{icon}</div>
      <div className="result-item-val">{value}</div>
      <div className="result-item-label">{label}</div>
    </div>
  )
}
