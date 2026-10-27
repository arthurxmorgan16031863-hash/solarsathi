import { getComplaints, getLastCalc, getSurveyCount } from '../utils/storage'
import { useState } from 'react'
import { BarChart3, Users, MessageSquare, TrendingUp, Zap, Leaf } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts'


export default function AdminAnalytics() {
  const localComplaints = getComplaints()
  const total = localComplaints.length
  const resolved = localComplaints.filter(c => c.status === 'Resolved').length
  const openLocal = localComplaints.filter(c => c.status === 'Open').length
  const lastCalc = getLastCalc()
  const CAT_COLORS = ['#1a7a4a', '#22a862', '#86efac', '#f59e0b', '#3b82f6', '#8b5cf6', '#94a3b8']
  const categoryData = [...new Set(localComplaints.map(c => c.category))].map((name, i) => ({ name, count: localComplaints.filter(c => c.category === name).length, color: CAT_COLORS[i % CAT_COLORS.length] }))
  const STATUS_COLOR = { 'Open': '#ef4444', 'In Progress': '#f59e0b', 'Resolved': '#1a7a4a' }
  const statusData = Object.keys(STATUS_COLOR).map(k => ({ name: k, value: localComplaints.filter(c => c.status === k).length, color: STATUS_COLOR[k] })).filter(d => d.value > 0)
  const METRICS = [
    { label: 'Complaints Filed', value: String(total), icon: <MessageSquare size={20} color="#ef4444" />, bg: 'var(--c-fee2e2)', change: 'This browser', positive: false },
    { label: 'Open Complaints', value: String(openLocal), icon: <MessageSquare size={20} color="#d97706" />, bg: 'var(--c-fef3c7)', change: 'Awaiting action', positive: false },
    { label: 'Resolution Rate', value: total ? `${Math.round((resolved / total) * 100)}%` : '—', icon: <TrendingUp size={20} color="#3b82f6" />, bg: 'var(--c-dbeafe)', change: `${resolved} resolved`, positive: true },
    { label: 'Est. CO₂ Saved / yr', value: lastCalc ? `${lastCalc.co2} T` : '—', icon: <Leaf size={20} color="#22a862" />, bg: 'var(--c-d1fae5)', change: 'Last calculator run', positive: true },
    { label: 'Est. Monthly Savings', value: lastCalc ? `₹${lastCalc.monthly.toLocaleString('en-IN')}` : '—', icon: <Zap size={20} color="#d97706" />, bg: 'var(--c-fef3c7)', change: 'Last calculator run', positive: true },
    { label: 'Surveys Completed', value: String(getSurveyCount()), icon: <BarChart3 size={20} color="#8b5cf6" />, bg: 'var(--c-ede9fe)', change: 'This browser', positive: true },
  ]

  return (
    <div>
      {/* Header */}
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, #1a1a2e, #16213e)', border: 'none', color: 'white' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BarChart3 size={26} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Admin Analytics</h2>
            <p style={{ fontSize: '13.5px', opacity: 0.7 }}>Community-wide metrics, complaint analysis, and solar adoption insights.</p>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '24px' }}>
        {METRICS.map((m, i) => (
          <div key={i} className="admin-metric">
            <div className="admin-metric-icon" style={{ background: m.bg }}>{m.icon}</div>
            <div className="admin-metric-info">
              <div className="admin-metric-val">{m.value}</div>
              <div className="admin-metric-label">{m.label}</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: m.positive ? 'var(--c-15803d)' : 'var(--c-b91c1c)', background: m.positive ? 'var(--c-dcfce7)' : 'var(--c-fee2e2)', padding: '2px 8px', borderRadius: '20px' }}>
              {m.change}
            </span>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: '20px' }}>
        {/* Complaints by Category (real) */}
        <div className="card">
          <div className="section-title">Complaints by Category</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>Tickets filed in this browser</div>
          {total === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--c-f1f5f9)" />
                <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} />
                <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
                <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  {categoryData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Resolution Status (real) */}
        <div className="card">
          <div className="section-title">Complaint Resolution Status</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>Open vs. in progress vs. resolved</div>
          {total === 0 ? <EmptyChart /> : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" outerRadius={80} dataKey="value" isAnimationActive={false} label={({ name, value }) => `${name} ${value}`} labelLine={false} fontSize={12}>
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="tip-box" style={{ marginTop: '20px' }}>
        <strong>📌 Note:</strong> Solar Sathi has no accounts or backend, so everything here comes from this browser (<code>localStorage</code>). Figures like user signups need a real database and are not shown.
      </div>
    </div>
  )
}

function EmptyChart() {
  return <div style={{ height: 220, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '13.5px' }}>No complaints filed yet.</div>
}
