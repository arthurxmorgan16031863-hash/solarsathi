import { useState } from 'react'
import { Lightbulb, Sun, Battery, Home, CheckCircle, Info, AlertTriangle } from 'lucide-react'

const LOCATIONS = ['Mumbai, MH', 'Pune, MH', 'Delhi, NCR', 'Bangalore, KA', 'Chennai, TN', 'Hyderabad, TS', 'Jaipur, RJ', 'Ahmedabad, GJ', 'Kolkata, WB', 'Other']

function getRecommendation({ consumption, roofArea, budget, location, backup }) {
  // Rule-based system
  const capacityByDemand = consumption / (5 * 30 * 0.80)
  const capacityByRoof = roofArea / 100
  const raw = Math.min(capacityByDemand, capacityByRoof)
  const costPerKW = 55000
  const maxByBudget = budget / costPerKW
  const capacity = Math.min(raw, maxByBudget)
  const roundedKW = Math.round(capacity * 10) / 10

  const inverterSize = roundedKW <= 1 ? 1 : roundedKW <= 3 ? 3 : roundedKW <= 5 ? 5 : 10
  const panels = Math.ceil(roundedKW / 0.4) // 400W per panel
  const needsBattery = backup === 'yes'
  const batteryCapacity = needsBattery ? Math.max(5, Math.round(roundedKW * 2)) : null // ~2 hrs backup

  // Mounting type
  const mounting = roofArea >= 600 ? 'Ground Mount or Flat Roof (Ballasted)' : 'Rooftop Flush Mount'

  // Location-based note
  const locationNotes = {
    'Jaipur, RJ': 'Rajasthan receives excellent solar radiation (~6 hrs/day). A great location for solar.',
    'Chennai, TN': 'Tamil Nadu has strong solar potential and state subsidies available.',
    'Mumbai, MH': 'Maharashtra offers PM Surya Ghar scheme subsidies. Urban shading may reduce output.',
    'Pune, MH': 'Pune is ideal for solar with good irradiance and MSEDCL net metering options.',
    'Delhi, NCR': 'Delhi offers capital subsidy under PM Surya Ghar Muft Bijli Yojana.',
    'Bangalore, KA': 'Bangalore has moderate solar potential. BESCOM offers net metering.',
    'Hyderabad, TS': 'Telangana has good solar resources. TSSPDCL net metering is available.',
  }

  const locNote = locationNotes[location] || 'Check with your state DISCOM for net metering and subsidy policies.'

  let explanation = `Based on your monthly consumption of ${consumption} kWh and available roof area of ${roofArea} sq ft, a ${roundedKW} kW rooftop solar system is recommended. `
  explanation += `This system uses approximately ${panels} solar panels (400W each) and a ${inverterSize} kW string inverter. `
  if (needsBattery) {
    explanation += `A ${batteryCapacity} kWh battery bank is included for power backup as requested. `
  } else {
    explanation += `No battery backup is included (grid-tied system), which reduces cost and complexity. `
  }
  explanation += locNote

  const systemCost = Math.round(roundedKW * costPerKW)
  const batteryCost = batteryCapacity ? batteryCapacity * 10000 : 0
  const totalCost = systemCost + batteryCost
  const withinBudget = totalCost <= budget

  return {
    capacity: roundedKW,
    panels,
    inverterSize,
    batteryCapacity,
    mounting,
    systemCost,
    batteryCost,
    totalCost,
    withinBudget,
    explanation,
    locNote,
  }
}

export default function InstallationAdvisor() {
  const [form, setForm] = useState({
    consumption: 250,
    roofArea: 400,
    budget: 180000,
    location: 'Pune, MH',
    backup: 'no',
  })
  const [result, setResult] = useState(null)

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: field === 'location' || field === 'backup' ? value : parseFloat(value) || 0 }))
    setResult(null)
  }

  const handleSubmit = () => {
    if (!form.consumption || !form.roofArea || !form.budget) return
    setResult(getRecommendation(form))
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
            <label className="form-label">Location / City</label>
            <select className="form-select" value={form.location} onChange={e => handleChange('location', e.target.value)}>
              {LOCATIONS.map(l => <option key={l}>{l}</option>)}
            </select>
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
              </div>

              <div style={{ background: 'var(--bg-white)', borderRadius: '10px', padding: '16px', marginTop: '16px', border: '1px solid var(--c-d1fae5)' }}>
                <div style={{ fontWeight: 600, marginBottom: '8px', fontSize: '13.5px' }}>Why this system?</div>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{result.explanation}</p>
              </div>

              {!result.withinBudget && (
                <div className="alert alert-warning" style={{ marginTop: '14px' }}>
                  <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '13px' }}>Estimated cost (₹{result.totalCost.toLocaleString('en-IN')}) exceeds your stated budget of ₹{form.budget.toLocaleString('en-IN')}. Consider reducing capacity or battery size.</span>
                </div>
              )}

              {result.withinBudget && (
                <div className="alert alert-success" style={{ marginTop: '14px' }}>
                  <CheckCircle size={15} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '13px' }}>This system fits within your budget of ₹{form.budget.toLocaleString('en-IN')}! You may have ₹{(form.budget - result.totalCost).toLocaleString('en-IN')} available for contingency or extras.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
