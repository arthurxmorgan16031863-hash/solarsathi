import { useState } from 'react'
import { PERFORMANCE_RATIO, SQFT_PER_KW, ADVISOR_COST_PER_KW, BATTERY_COST_PER_KWH, HYBRID_INVERTER_EXTRA, INVERTER_SIZES_KW, suryaGharSubsidy } from '../utils/solar'
import { Lightbulb, Sun, Battery, Home, CheckCircle, Info, AlertTriangle } from 'lucide-react'

function getRecommendation({ consumption, roofArea, budget, backup }) {
  const needsBattery = backup === 'yes'
  const capacityByDemand = consumption / (5 * 30 * PERFORMANCE_RATIO) // 5 sun-hours/day assumed for all cities
  const capacityByRoof = roofArea / SQFT_PER_KW

  // Cost of a k-kW system, including battery + hybrid inverter when backup is requested
  const batteryFor = k => (needsBattery ? Math.max(5, Math.round(k * 2)) : 0) // ~2 hours of backup at full output
  const costFor = k => Math.round(k * ADVISOR_COST_PER_KW) + (needsBattery ? batteryFor(k) * BATTERY_COST_PER_KWH + HYBRID_INVERTER_EXTRA : 0)

  // Largest size (0.1 kW steps) that fits demand, roof AND budget
  let capacity = Math.floor(Math.min(capacityByDemand, capacityByRoof) * 10) / 10
  while (capacity > 0 && costFor(capacity) > budget) capacity = Math.round((capacity - 0.1) * 10) / 10
  const limitedBy = capacity >= Math.floor(Math.min(capacityByDemand, capacityByRoof) * 10) / 10
    ? (capacityByRoof < capacityByDemand ? 'your roof area' : 'your electricity usage') : 'your budget'
  if (capacity <= 0) return null

  const panels = Math.ceil(capacity / 0.4) // 400 W panels
  const inverterSize = INVERTER_SIZES_KW.find(sz => sz >= capacity) || Math.ceil(capacity)
  const batteryCapacity = needsBattery ? batteryFor(capacity) : null
  const totalCost = costFor(capacity)
  const batteryCost = batteryCapacity ? batteryCapacity * BATTERY_COST_PER_KWH + HYBRID_INVERTER_EXTRA : 0
  const systemCost = totalCost - batteryCost
  const subsidy = suryaGharSubsidy(capacity)

  const mounting = 'Flush mount on a sloped roof, or tilted structure on a flat roof (confirmed after a site visit)'

  let explanation = `Based on ${consumption} kWh/month and ${roofArea} sq ft of roof, a ${capacity} kW system fits your needs (size is limited by ${limitedBy}). `
  explanation += `It uses about ${panels} panels (400 W each) and a ${inverterSize} kW inverter. `
  explanation += needsBattery
    ? `A ${batteryCapacity} kWh battery (about ₹${BATTERY_COST_PER_KWH.toLocaleString('en-IN')}/kWh, LFP) and a hybrid inverter are included for backup. Batteries add a lot of cost and are not covered by the PM Surya Ghar subsidy. `
    : 'No battery is included (grid-tied), which keeps cost and complexity down. '
  explanation += 'Check with your DISCOM for net-metering rules; they differ by state.'

  return {
    capacity, panels, inverterSize, batteryCapacity, mounting, systemCost, batteryCost, totalCost,
    subsidy, netCost: Math.max(totalCost - subsidy, 0), budget, withinBudget: totalCost <= budget, explanation, limitedBy,
  }
}

export default function InstallationAdvisor() {
  const [form, setForm] = useState({
    consumption: 250,
    roofArea: 400,
    budget: 180000,
    backup: 'no',
  })
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    setResult(null)
    setError('')
  }

  const handleSubmit = () => {
    const consumption = Number(form.consumption), roofArea = Number(form.roofArea), budget = Number(form.budget)
    if ([consumption, roofArea, budget].some(v => !Number.isFinite(v) || v <= 0)) {
      setError('Please enter consumption, roof area and budget as numbers greater than zero.')
      return
    }
    const rec = getRecommendation({ consumption, roofArea, budget, backup: form.backup })
    if (!rec) {
      setError(`Your budget of ₹${budget.toLocaleString('en-IN')} is too low for a system${form.backup === 'yes' ? ' with battery backup' : ''}. Try a higher budget or choose no battery.`)
      return
    }
    setResult(rec)
  }

  return (
    <div>
      {/* Header */}
      <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, var(--c-fffbeb), var(--c-fef9c3))', border: '1px solid var(--c-fcd34d)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #d97706, #f59e0b)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lightbulb size={26} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Installation Advisor</h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>Get a rule-based solar system recommendation. Not a substitute for professional assessment.</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Form */}
        <div className="card">
          <div className="section-title">Tell Us About Your Setup</div>

          <div className="form-group">
            <label className="form-label">Monthly Electricity Consumption (kWh)</label>
            <input className="form-input" type="number" value={form.consumption} onChange={e => handleChange('consumption', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Available Roof Area (sq. ft.)</label>
            <input className="form-input" type="number" value={form.roofArea} onChange={e => handleChange('roofArea', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Total Budget (₹)</label>
            <input className="form-input" type="number" value={form.budget} step="5000" onChange={e => handleChange('budget', e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Do you need battery backup?</label>
            <div style={{ display: 'flex', gap: '12px', marginTop: '4px' }}>
              {['yes', 'no'].map(v => (
                <label key={v} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}>
                  <input type="radio" name="backup" value={v} checked={form.backup === v} onChange={() => handleChange('backup', v)} style={{ accentColor: '#1a7a4a' }} />
                  {v === 'yes' ? 'Yes (with battery)' : 'No (grid-tied only)'}
                </label>
              ))}
            </div>
          </div>

          {error && <div className="alert alert-warning" style={{ marginBottom: '12px' }}><AlertTriangle size={15} style={{ flexShrink: 0 }} /><span style={{ fontSize: '13px' }}>{error}</span></div>}

          <button className="btn btn-primary btn-full btn-lg" style={{ marginTop: '8px' }} onClick={handleSubmit}>
            <Lightbulb size={17} /> Get My Recommendation
          </button>

          <div className="alert alert-warning" style={{ marginTop: '16px' }}>
            <AlertTriangle size={15} style={{ flexShrink: 0 }} />
            <span style={{ fontSize: '12.5px' }}>This is a rule-based prototype estimate. Do not treat this as certified engineering advice. Always consult a MNRE-empanelled installer.</span>
          </div>
        </div>

        {/* Result */}
        <div>
          {!result ? (
            <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', textAlign: 'center', background: 'var(--c-f8fafc)', border: '2px dashed var(--c-e2e8f0)' }}>
              <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, var(--c-fef3c7), var(--c-fde68a))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lightbulb size={34} color="#d97706" />
              </div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)' }}>Your recommendation will appear here</div>
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '6px' }}>Fill the form on the left and click Get My Recommendation</div>
              </div>
            </div>
          ) : (
            <div className="advisor-result fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <CheckCircle size={22} color="var(--c-15803d)" />
                <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--c-15803d)' }}>Recommended Solar System</div>
              </div>

              <div className="spec-grid">
                <div className="spec-item">
                  <div className="spec-label">System Capacity</div>
                  <div className="spec-value">{result.capacity} kW</div>
                </div>
                <div className="spec-item">
                  <div className="spec-label">Solar Panels</div>
                  <div className="spec-value">{result.panels} × 400W</div>
                </div>
                <div className="spec-item">
                  <div className="spec-label">Inverter Size</div>
                  <div className="spec-value">{result.inverterSize} kW</div>
                </div>
                <div className="spec-item">
                  <div className="spec-label">Mounting Type</div>
                  <div className="spec-value" style={{ fontSize: '13px' }}>{result.mounting}</div>
                </div>
                {result.batteryCapacity && (
                  <div className="spec-item">
                    <div className="spec-label">Battery Backup</div>
                    <div className="spec-value">{result.batteryCapacity} kWh</div>
                  </div>
                )}
                <div className="spec-item">
                  <div className="spec-label">Est. Total Cost</div>
                  <div className="spec-value">₹{result.totalCost.toLocaleString('en-IN')}</div>
                </div>
                <div className="spec-item">
                  <div className="spec-label">PM Surya Ghar Subsidy</div>
                  <div className="spec-value">₹{result.subsidy.toLocaleString('en-IN')}</div>
                </div>
                <div className="spec-item">
                  <div className="spec-label">Cost After Subsidy</div>
                  <div className="spec-value">₹{result.netCost.toLocaleString('en-IN')}</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-white)', borderRadius: '10px', padding: '16px', marginTop: '16px', border: '1px solid var(--c-d1fae5)' }}>
                <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '13.5px' }}>Why this system?</div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{result.explanation}</p>
              </div>

              {!result.withinBudget && (
                <div className="alert alert-warning" style={{ marginTop: '14px' }}>
                  <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '13px' }}>Estimated cost (₹{result.totalCost.toLocaleString('en-IN')}) exceeds your stated budget of ₹{result.budget.toLocaleString('en-IN')}. Consider reducing capacity or battery size.</span>
                </div>
              )}

              <div className="card" style={{ marginTop: '14px', padding: '14px' }}>
                <div style={{ fontWeight: 600, fontSize: '13.5px', marginBottom: '6px' }}>Before you install</div>
                <ul style={{ fontSize: '12.5px', lineHeight: 1.8, paddingLeft: '18px', color: 'var(--text-secondary)' }}>
                  <li>Check the roof gets full sun from about 9 am to 3 pm, with no shadows from buildings or trees.</li>
                  <li>Have the roof's strength and waterproofing checked; panels add roughly 12–15 kg per m².</li>
                  <li>Use an installer registered with your DISCOM for the PM Surya Ghar subsidy, and apply on the national portal.</li>
                  <li>Ask for a written quote that lists panel brand, inverter, warranty and net-metering paperwork.</li>
                  <li>Subsidy is shown for a standard state. Special-category states get a higher amount.</li>
                </ul>
              </div>

              {result.withinBudget && (
                <div className="alert alert-success" style={{ marginTop: '14px' }}>
                  <CheckCircle size={15} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '13px' }}>This system fits within your budget of ₹{result.budget.toLocaleString('en-IN')}! You may have ₹{(result.budget - result.totalCost).toLocaleString('en-IN')} available for contingency or extras.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
