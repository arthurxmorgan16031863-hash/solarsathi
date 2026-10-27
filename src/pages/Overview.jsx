import { getComplaints, SEED_OPEN } from '../utils/storage'
import { useState, useEffect } from 'react'
import {
  TrendingUp, Zap, MessageSquare, Users, Sun, ArrowRight,
  Calculator, Lightbulb, BookOpen, PlusCircle, ChevronUp, ChevronDown
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts'

const MONTHLY_DATA = [
  { month: 'Jan', generation: 280, savings: 1680 },
  { month: 'Feb', generation: 320, savings: 1920 },
  { month: 'Mar', generation: 390, savings: 2340 },
  { month: 'Apr', generation: 440, savings: 2640 },
  { month: 'May', generation: 510, savings: 3060 },
  { month: 'Jun', generation: 480, savings: 2880 },
  { month: 'Jul', generation: 460, savings: 2760 },
  { month: 'Aug', generation: 495, savings: 2970 },
  { month: 'Sep', generation: 420, savings: 2520 },
  { month: 'Oct', generation: 370, savings: 2220 },
  { month: 'Nov', generation: 310, savings: 1860 },
  { month: 'Dec', generation: 260, savings: 1560 },
]

const ADOPTION_DATA = [
  { name: 'Residential', value: 58, color: '#1a7a4a' },
  { name: 'Commercial', value: 28, color: '#22a862' },
  { name: 'Industrial', value: 14, color: 'var(--c-86efac)' },
]

const COMPLAINTS_DATA = [
  { id: 'SS-0041', type: 'Panel Fault', location: 'Pune, MH', date: '24 Oct 2026', status: 'Open' },
  { id: 'SS-0040', type: 'Inverter Issue', location: 'Mumbai, MH', date: '22 Oct 2026', status: 'In Progress' },
  { id: 'SS-0039', type: 'Maintenance Req.', location: 'Nashik, MH', date: '19 Oct 2026', status: 'Resolved' },
  { id: 'SS-0038', type: 'Installation Issue', location: 'Nagpur, MH', date: '17 Oct 2026', status: 'Resolved' },
]

const STATUS_COLORS = {
  'Open': 'badge-red',
  'In Progress': 'badge-yellow',
  'Resolved': 'badge-green',
}

export default function Overview({ setActivePage }) {
  const [adoption, setAdoption] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAdoption(62), 400)
    return () => clearTimeout(timer)
  }, [])

  // Load complaints from localStorage
  const localComplaints = getComplaints()
  const allComplaints = [...localComplaints.slice(0, 2).map(c => ({
    id: c.id,
    type: c.category,
    location: c.location,
    date: new Date(c.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }),
    status: c.status,
  })), ...COMPLAINTS_DATA].slice(0, 5)

  const openCount = localComplaints.filter(c => c.status === 'Open').length + SEED_OPEN

  return (
    <div>
      {/* Welcome Banner */}
      <div className="welcome-banner">
        <div>
          <h1>Power your future with solar energy ☀️</h1>
          <p>Welcome back, Arjun! Your community has saved 4.2 tonnes of CO₂ this month. Keep inspiring!</p>
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
            <div className="banner-stat-val">4.2T</div>
            <div className="banner-stat-label">CO₂ Saved</div>
          </div>
          <div className="banner-stat">
            <div className="banner-stat-val">1,240</div>
            <div className="banner-stat-label">Active Users</div>
          </div>
          <div className="banner-stat">
            <div className="banner-stat-val">₹2.8L</div>
            <div className="banner-stat-label">Community Savings</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <StatCard
          label="Est. Monthly Savings"
          value="₹2,640"
          change="+12% vs last month"
          positive
          icon={<TrendingUp size={20} color="#1a7a4a" />}
          iconBg="var(--c-dcfce7)"
        />
        <StatCard
          label="Recommended Capacity"
          value="4.4 kW"
          change="Based on avg usage"
          positive
          icon={<Zap size={20} color="#d97706" />}
          iconBg="var(--c-fef3c7)"
        />
        <StatCard
          label="Open Complaints"
          value={openCount}
          change={openCount > SEED_OPEN ? `${openCount - SEED_OPEN} new this week` : "No change"}
          positive={false}
          icon={<MessageSquare size={20} color="#ef4444" />}
          iconBg="var(--c-fee2e2)"
        />
        <StatCard
          label="Community Participation"
          value="1,240"
          change="+8 new this week"
          positive
          icon={<Users size={20} color="#3b82f6" />}
          iconBg="var(--c-dbeafe)"
        />
      </div>

      {/* Charts Row */}
      <div className="grid-2" style={{ marginBottom: '20px' }}>
        {/* Monthly Generation Chart */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div className="section-title" style={{ marginBottom: '2px' }}>Monthly Solar Generation</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>kWh generated per month (demo data)</div>
            </div>
            <span className="tag"><Sun size={12} /> 2026</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={MONTHLY_DATA}>
              <defs>
                <linearGradient id="genGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1a7a4a" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1a7a4a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-f1f5f9)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} />
              <Tooltip
                contentStyle={{ borderRadius: '10px', border: '1px solid var(--c-e2e8f0)', fontSize: '13px' }}
                formatter={(v) => [`${v} kWh`, 'Generation']}
              />
              <Area type="monotone" dataKey="generation" stroke="#1a7a4a" strokeWidth={2.5} fill="url(#genGrad)" dot={{ r: 3, fill: '#1a7a4a' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Adoption Pie + Progress */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div className="section-title" style={{ marginBottom: '2px' }}>Solar Adoption by Sector</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Community distribution</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={ADOPTION_DATA} cx="50%" cy="50%" outerRadius={62} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false} fontSize={11}>
                {ADOPTION_DATA.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, 'Share']} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>Overall Adoption Progress</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--forest-green)' }}>{adoption}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${adoption}%` }} />
            </div>
            <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '6px' }}>Target: 80% community adoption by Dec 2027</div>
          </div>
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
