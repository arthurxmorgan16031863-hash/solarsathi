import { cumulativeSavings } from '../utils/solar'
import { getComplaints, SEED_OPEN, getLastCalc, getSurveyCount } from '../utils/storage'
import {
  TrendingUp, Zap, MessageSquare, Users, Sun, ArrowRight,
  Calculator, Lightbulb, BookOpen, PlusCircle, ChevronUp, ChevronDown
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts'

const STATUS_COLORS = {
  'Open': 'badge-red',
  'In Progress': 'badge-yellow',
  'Resolved': 'badge-green',
}

export default function Overview({ setActivePage }) {
  // Load complaints from localStorage
  const localComplaints = getComplaints()
  const allComplaints = localComplaints.slice(0, 5).map(c => ({
    id: c.id,
    type: c.category,
    location: c.location,
    date: new Date(c.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
    status: c.status,
  }))
  const lastCalc = getLastCalc()
  const surveyCount = getSurveyCount()
  const paybackCost = lastCalc ? (lastCalc.netCost ?? lastCalc.cost ?? 0) : 0
  const paybackData = lastCalc ? Array.from({ length: 26 }, (_, y) => ({ year: y, 'Cumulative savings': Math.round(cumulativeSavings(lastCalc.annual, y)), 'Cost after subsidy': paybackCost })) : []
  const STATUS_COLOR = { 'Open': '#ef4444', 'In Progress': '#f59e0b', 'Resolved': '#1a7a4a' }
  const statusData = Object.keys(STATUS_COLOR).map(k => ({ name: k, value: localComplaints.filter(c => c.status === k).length, color: STATUS_COLOR[k] })).filter(d => d.value > 0)

  const openCount = localComplaints.filter(c => c.status === 'Open').length + SEED_OPEN

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <h1>Power your future with solar energy ☀️</h1>
          <p>Estimate your savings, check your rooftop and report issues. Figures below come from what you enter in this app.</p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
            <button className="btn btn-secondary" style={{ background: 'rgba(255,255,255,0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(4px)' }} onClick={() => setActivePage('calculator')}>
              <Calculator size={15} /> Calculate Savings
            </button>
            <button className="btn" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)', backdropFilter: 'blur(4px)' }} onClick={() => setActivePage('advisor')}>
              <Lightbulb size={15} /> Get Recommendation
            </button>
          </div>
        </div>
        <div className="banner-stats">
          <div className="banner-stat">
            <div className="banner-stat-val">{lastCalc ? `${lastCalc.co2} T` : "—"}</div>
            <div className="banner-stat-label">CO₂ / yr (your estimate)</div>
          </div>
          <div className="banner-stat">
            <div className="banner-stat-val">{localComplaints.length}</div>
            <div className="banner-stat-label">Complaints Filed</div>
          </div>
          <div className="banner-stat">
            <div className="banner-stat-val">{lastCalc ? `₹${lastCalc.annual.toLocaleString("en-IN")}` : "—"}</div>
            <div className="banner-stat-label">Annual Savings (estimate)</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          label="Est. Monthly Savings"
          value={lastCalc ? `₹${lastCalc.monthly.toLocaleString("en-IN")}` : "—"}
          change={lastCalc ? "From your last calculation" : "Run the Solar Calculator"}
          positive
          icon={<TrendingUp size={20} color="#1a7a4a" />}
          iconBg="var(--c-dcfce7)"
        />
        <StatCard
          label="Recommended Capacity"
          value={lastCalc ? `${lastCalc.kw} kW` : "—"}
          change={lastCalc ? "From your last calculation" : "Run the Solar Calculator"}
          positive
          icon={<Zap size={20} color="#d97706" />}
          iconBg="var(--c-fef3c7)"
        />
        <StatCard
          label="Open Complaints"
          value={openCount}
          change={`${localComplaints.length} filed in total`}
          positive={false}
          icon={<MessageSquare size={20} color="#ef4444" />}
          iconBg="var(--c-fee2e2)"
        />
        <StatCard
          label="Surveys Completed"
          value={surveyCount}
          change="In this browser"
          positive
          icon={<Users size={20} color="#3b82f6" />}
          iconBg="var(--c-dbeafe)"
        />
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: '20px' }}>
        {/* Payback chart (from your last calculator run) */}
        <div className="card">
          <div style={{ marginBottom: '20px' }}>
            <div className="section-title" style={{ marginBottom: '2px' }}>Savings vs. Cost</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Cumulative savings over 25 years (with 0.5%/yr panel degradation) from your last calculation</div>
          </div>
          {!lastCalc ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px' }}>
              <div>Run the Solar Calculator to see your payback chart.<br /><button className="btn btn-primary btn-sm" style={{ marginTop: 12 }} onClick={() => setActivePage('calculator')}>Open Calculator</button></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={paybackData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--c-f1f5f9)" />
                <XAxis dataKey="year" tick={{ fontSize: 11, fill: '#94a3b8' }} label={{ value: 'Years', position: 'insideBottomRight', offset: -4, fontSize: 11, fill: '#94a3b8' }} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} tickFormatter={v => `₹${Math.round(v / 1000)}k`} />
                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '13px' }} formatter={(v, n) => [`₹${Math.round(v).toLocaleString('en-IN')}`, n]} />
                <Area type="monotone" dataKey="Cumulative savings" stroke="#1a7a4a" strokeWidth={2.5} fill="#1a7a4a" fillOpacity={0.15} />
                <Area type="monotone" dataKey="Cost after subsidy" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" fill="none" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Complaints by status (real) */}
        <div className="card">
          <div style={{ marginBottom: '20px' }}>
            <div className="section-title" style={{ marginBottom: '2px' }}>Complaints by Status</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Tickets filed in this browser</div>
          </div>
          {statusData.length === 0 ? (
            <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13.5px' }}>
              <div>No complaints filed yet.<br /><button className="btn btn-secondary btn-sm" style={{ marginTop: 12 }} onClick={() => setActivePage('complaints')}>File a Complaint</button></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} isAnimationActive={false} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name} ${value}`} labelLine={false} fontSize={12}>
                  {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div className="section-title">Quick Actions</div>
        <div className="quick-actions">
          <QuickBtn icon={<Calculator size={18} color="#1a7a4a" />} bg="var(--c-dcfce7)" label="Calculate Savings" onClick={() => setActivePage('calculator')} />
          <QuickBtn icon={<Lightbulb size={18} color="#d97706" />} bg="var(--c-fef3c7)" label="Get Advice" onClick={() => setActivePage('advisor')} />
          <QuickBtn icon={<MessageSquare size={18} color="#ef4444" />} bg="var(--c-fee2e2)" label="File Complaint" onClick={() => setActivePage('complaints')} />
          <QuickBtn icon={<BookOpen size={18} color="#3b82f6" />} bg="var(--c-dbeafe)" label="Learn Solar" onClick={() => setActivePage('awareness')} />
          <QuickBtn icon={<Users size={18} color="#8b5cf6" />} bg="var(--c-ede9fe)" label="Join Survey" onClick={() => setActivePage('surveys')} />
        </div>
      </div>

      {/* Recent Complaints */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div className="section-title" style={{ marginBottom: 0 }}>Recent Complaints</div>
          <button className="btn btn-secondary btn-sm" onClick={() => setActivePage('complaints')}>
            View All <ArrowRight size={13} />
          </button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Complaint ID</th>
                <th>Type</th>
                <th>Location</th>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
                {allComplaints.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No complaints filed yet.</td></tr>}
              {allComplaints.map((c, i) => (
                <tr key={i}>
                  <td><code style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '13px' }}>{c.id}</code></td>
                  <td>{c.type}</td>
                  <td>{c.location}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.date}</td>
                  <td><span className={`badge ${STATUS_COLORS[c.status] || 'badge-gray'}`}>{c.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, change, positive, icon, iconBg }) {
  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-label">{label}</div>
        <div className="stat-icon" style={{ background: iconBg }}>{icon}</div>
      </div>
      <div className="stat-value">{value}</div>
      <div className={`stat-change ${positive ? 'positive' : 'negative'}`}>
        {positive ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        {change}
      </div>
    </div>
  )
}

function QuickBtn({ icon, bg, label, onClick }) {
  return (
    <button className="quick-btn" onClick={onClick}>
      <div className="quick-btn-icon" style={{ background: bg }}>{icon}</div>
      <span>{label}</span>
    </button>
  )
}
