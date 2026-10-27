import { getComplaints } from '../utils/storage'
import { useState } from 'react'
import { BarChart3, Users, MessageSquare, TrendingUp, Zap, Leaf } from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area
} from 'recharts'

const COMPLAINTS_BY_CATEGORY = [
  { name: 'Panel Fault', count: 42, color: '#1a7a4a' },
  { name: 'Inverter Issue', count: 31, color: '#22a862' },
  { name: 'Battery Issue', count: 18, color: 'var(--c-86efac)' },
  { name: 'Installation', count: 24, color: '#f59e0b' },
  { name: 'Maintenance', count: 15, color: '#3b82f6' },
  { name: 'Billing', count: 9, color: '#8b5cf6' },
]

const MONTHLY_SIGNUPS = [
  { month: 'Apr', users: 80 },
  { month: 'May', users: 120 },
  { month: 'Jun', users: 145 },
  { month: 'Jul', users: 190 },
  { month: 'Aug', users: 230 },
  { month: 'Sep', users: 270 },
  { month: 'Oct', users: 310 },
]

const RESOLUTION_DATA = [
  { name: 'Resolved', value: 68, color: '#1a7a4a' },
  { name: 'In Progress', value: 19, color: '#f59e0b' },
  { name: 'Open', value: 13, color: '#ef4444' },
]

const CO2_DATA = [
  { month: 'Apr', tonnes: 0.6 },
  { month: 'May', tonnes: 0.9 },
  { month: 'Jun', tonnes: 1.4 },
  { month: 'Jul', tonnes: 1.8 },
  { month: 'Aug', tonnes: 2.5 },
  { month: 'Sep', tonnes: 3.1 },
  { month: 'Oct', tonnes: 4.2 },
]

const METRICS = [
  { label: 'Total Registered Users', value: '1,240', icon: <Users size={20} color="#1a7a4a" />, bg: 'var(--c-dcfce7)', change: '+8 this week', positive: true },
  { label: 'Total Complaints Filed', value: '139', icon: <MessageSquare size={20} color="#ef4444" />, bg: 'var(--c-fee2e2)', change: '+3 today', positive: false },
  { label: 'Resolution Rate', value: '68%', icon: <TrendingUp size={20} color="#3b82f6" />, bg: 'var(--c-dbeafe)', change: '+2% this month', positive: true },
  { label: 'Total CO₂ Saved (T)', value: '4.2 T', icon: <Leaf size={20} color="#22a862" />, bg: 'var(--c-d1fae5)', change: '+0.8T this month', positive: true },
  { label: 'Avg. Monthly Savings', value: '₹2,340', icon: <Zap size={20} color="#d97706" />, bg: 'var(--c-fef3c7)', change: 'Per active user', positive: true },
  { label: 'Survey Responses', value: '1,240', icon: <BarChart3 size={20} color="#8b5cf6" />, bg: 'var(--c-ede9fe)', change: '+184 this month', positive: true },
]

export default function AdminAnalytics() {
  const localComplaints = getComplaints()
  const totalComplaints = 139 + localComplaints.length
  const openLocal = localComplaints.filter(c => c.status === 'Open').length

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
              <div className="admin-metric-val">{i === 1 ? totalComplaints : m.value}</div>
              <div className="admin-metric-label">{m.label}</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 600, color: m.positive ? 'var(--c-15803d)' : 'var(--c-b91c1c)', background: m.positive ? 'var(--c-dcfce7)' : 'var(--c-fee2e2)', padding: '2px 8px', borderRadius: '20px' }}>
              {m.change}
            </span>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: '20px' }}>
        {/* Complaints by Category */}
        <div className="card">
          <div className="section-title">Complaints by Category</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>Distribution of all reported issues</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={COMPLAINTS_BY_CATEGORY} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-f1f5f9)" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {COMPLAINTS_BY_CATEGORY.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Resolution Status */}
        <div className="card">
          <div className="section-title">Complaint Resolution Status</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>Overall resolution breakdown</div>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={RESOLUTION_DATA} cx="50%" cy="50%" outerRadius={70} dataKey="value" label={({ name, value }) => `${name} ${value}%`} labelLine={false} fontSize={11}>
                {RESOLUTION_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip formatter={(v) => [`${v}%`, '']} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '8px' }}>
            {RESOLUTION_DATA.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Monthly User Signups */}
        <div className="card">
          <div className="section-title">Monthly Community Signups</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>New users registered per month</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_SIGNUPS}>
              <defs>
                <linearGradient id="usersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-f1f5f9)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} />
              <Area type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2.5} fill="url(#usersGrad)" dot={{ r: 3, fill: '#3b82f6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* CO2 Reduction Trend */}
        <div className="card">
          <div className="section-title">Cumulative CO₂ Saved (Tonnes)</div>
          <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginBottom: '16px' }}>Community-wide CO₂ reduction over time</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={CO2_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--c-f1f5f9)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: '10px', fontSize: '12px' }} formatter={(v) => [`${v} T`, 'CO₂ Saved']} />
              <Line type="monotone" dataKey="tonnes" stroke="#1a7a4a" strokeWidth={3} dot={{ r: 4, fill: '#1a7a4a' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Demo Note */}
      <div className="tip-box" style={{ marginTop: '20px' }}>
        <strong>📌 Note:</strong> All metrics shown are illustrative demo data for prototype purposes. In a production system, these would be populated from a real backend database.
      </div>
    </div>
  )
}
