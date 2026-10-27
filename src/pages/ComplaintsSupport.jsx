import { useState, useRef } from 'react'
import { MessageSquare, Upload, CheckCircle, Clock, AlertTriangle, X, Eye, EyeOff } from 'lucide-react'
import { getComplaints, writeJSON, getProfileName } from '../utils/storage'

const CATEGORIES = [
  'Panel Fault',
  'Inverter Issue',
  'Battery Issue',
  'Installation Issue',
  'Maintenance Request',
  'Billing & Net Metering',
  'Other',
]

const STATUS_MAP = {
  'Open': 'badge-red',
  'In Progress': 'badge-yellow',
  'Resolved': 'badge-green',
}

function generateId(existing = []) {
  const used = new Set(existing.map(c => c.id))
  let id
  do { id = `SS-${Math.floor(1000 + Math.random() * 9000)}` } while (used.has(id))
  return id
}

/** Strip blob URLs before persisting — they die on page reload */
function serializeComplaint(c) {
  return { ...c, photo: null, photoName: c.photoName || '' }
}

const loadComplaints = getComplaints

function saveComplaints(list) {
  return writeJSON('ss_complaints', list.map(serializeComplaint))
}

const EMPTY_FORM = { name: '', category: CATEGORIES[0], location: '', description: '', photo: null, photoName: '' }

export default function ComplaintsSupport() {
  const [form, setForm] = useState(() => ({ ...EMPTY_FORM, name: getProfileName() }))
  const [submitted, setSubmitted] = useState(false)
  const [lastId, setLastId] = useState('')
  const [complaints, setComplaints] = useState(loadComplaints)
  const [viewComplaint, setViewComplaint] = useState(null)
  const [validationError, setValidationError] = useState('')
  const fileRef = useRef()

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }))
    if (validationError) setValidationError('')
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    // Validate size (5 MB max)
    if (file.size > 5 * 1024 * 1024) {
      setValidationError('Photo must be under 5 MB.')
      return
    }
    // Use a blob URL for in-session preview only; we won't persist it
    handleChange('photo', URL.createObjectURL(file))
    handleChange('photoName', file.name)
  }

  const removePhoto = () => {
    if (form.photo) URL.revokeObjectURL(form.photo)
    setForm(prev => ({ ...prev, photo: null, photoName: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Explicit validation with user-visible feedback
    if (!form.name.trim()) { setValidationError('Please enter your full name.'); return }
    if (!form.location.trim()) { setValidationError('Please enter your location / city.'); return }
    if (!form.description.trim() || form.description.trim().length < 10) {
      setValidationError('Please describe the issue (at least 10 characters).')
      return
    }

    const id = generateId(complaints)
    const now = new Date().toISOString()
    const complaint = {
      id,
      name: form.name.trim(),
      category: form.category,
      location: form.location.trim(),
      description: form.description.trim(),
      // Don't persist blob URL — store the name for display only
      photo: null,
      photoName: form.photoName,
      status: 'Open',
      createdAt: now,
    }

    const updated = [complaint, ...complaints]
    if (!saveComplaints(updated)) {
      setValidationError('Could not save to browser storage (it may be full or disabled). Your complaint was not saved.')
      return
    }
    setComplaints(updated)
    setLastId(id)
    setSubmitted(true)
    setViewComplaint(null) // reset expanded state
    setValidationError('')

    // Revoke the blob URL to free memory
    if (form.photo) URL.revokeObjectURL(form.photo)
    setForm({ ...EMPTY_FORM, name: getProfileName() })
    // Reset file input
    if (fileRef.current) fileRef.current.value = ''
  }

  const resetForm = () => {
    setSubmitted(false)
    setValidationError('')
  }

  const toggleView = (id) => setViewComplaint(prev => (prev === id ? null : id))

  const updateStatus = (id, status) => {
    const updated = complaints.map(c => (c.id === id ? { ...c, status } : c))
    saveComplaints(updated)
    setComplaints(updated)
  }

  return (
    <div>
      {/* Header */}
      <div className="card" style={{ marginBottom: '20px', background: 'linear-gradient(135deg, var(--c-fef2f2), var(--c-fee2e2))', border: '1px solid var(--c-fca5a5)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #dc2626, #ef4444)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={26} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Complaints &amp; Support</h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>Report solar system issues, track your complaints, and get support from our community.</p>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* ── Form ── */}
        <div className="card">
          {!submitted ? (
            <>
              <div className="section-title">File a New Complaint</div>
              <form onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label">Your Full Name *</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Priya Sharma"
                    value={form.name}
                    onChange={e => handleChange('name', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Issue Category *</label>
                  <select className="form-select" value={form.category} onChange={e => handleChange('category', e.target.value)}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Location / City *</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. Pune, Maharashtra"
                    value={form.location}
                    onChange={e => handleChange('location', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description of Issue *</label>
                  <textarea
                    className="form-textarea"
                    placeholder="Describe the issue in detail — when it started, what you observed, any error messages shown on the inverter, etc. (minimum 10 characters)"
                    value={form.description}
                    onChange={e => handleChange('description', e.target.value)}
                    rows={4}
                  />
                  <span className="form-hint">{form.description.length} characters typed</span>
                </div>

                <div className="form-group">
                  <label className="form-label">Attach Photo (Optional)</label>
                  <div
                    className="file-drop"
                    onClick={() => fileRef.current && fileRef.current.click()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={e => e.key === 'Enter' && fileRef.current && fileRef.current.click()}
                  >
                    <Upload size={22} color="#94a3b8" style={{ marginBottom: '6px' }} />
                    <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', fontWeight: 500 }}>
                      {form.photoName ? `✓ ${form.photoName}` : 'Click to upload a photo of the issue'}
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginTop: '4px' }}>PNG, JPG, JPEG • Max 5 MB</div>
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleFile}
                    />
                  </div>
                </div>

                {/* Photo preview */}
                {form.photo && (
                  <div style={{ marginBottom: '16px', position: 'relative', display: 'inline-block' }}>
                    <img
                      src={form.photo}
                      alt="Preview"
                      style={{ width: '120px', height: '90px', objectFit: 'cover', borderRadius: '8px', border: '2px solid var(--c-e2e8f0)' }}
                    />
                    <button
                      type="button"
                      title="Remove photo"
                      style={{ position: 'absolute', top: '-6px', right: '-6px', width: '22px', height: '22px', borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      onClick={removePhoto}
                    >
                      <X size={12} />
                    </button>
                  </div>
                )}

                {/* Validation error */}
                {validationError && (
                  <div className="alert alert-warning" style={{ marginBottom: '12px' }}>
                    <AlertTriangle size={15} style={{ flexShrink: 0 }} />
                    <span>{validationError}</span>
                  </div>
                )}

                <button type="submit" className="btn btn-primary btn-full btn-lg">
                  <MessageSquare size={16} /> Submit Complaint
                </button>
              </form>
            </>
          ) : (
            <div className="fade-in" style={{ textAlign: 'center', padding: '32px 16px' }}>
              <div
                style={{ width: '72px', height: '72px', background: 'var(--c-dcfce7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}
                className="pulse-green"
              >
                <CheckCircle size={36} color="var(--c-15803d)" />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px' }}>Complaint Submitted!</div>
              <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                Your complaint has been registered. You can track its status below.
              </div>
              <div style={{ background: 'var(--c-f0fdf4)', border: '1.5px solid var(--c-86efac)', borderRadius: '12px', padding: '20px', marginBottom: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>COMPLAINT ID</div>
                <div style={{ fontSize: '28px', fontWeight: 900, color: 'var(--forest-green)', fontFamily: 'monospace', letterSpacing: '2px' }}>{lastId}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>Please save this ID for future reference</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--c-fffbeb)', border: '1px solid var(--c-fcd34d)', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', textAlign: 'left' }}>
                <Clock size={15} color="#d97706" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '13px', color: 'var(--c-92400e)' }}>Typical resolution time: 2–5 business days. You'll receive an update from the support team.</span>
              </div>
              <button className="btn btn-primary" onClick={resetForm}>
                File Another Complaint
              </button>
            </div>
          )}
        </div>

        {/* ── Complaint History ── */}
        <div>
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div className="section-title" style={{ marginBottom: 0 }}>Your Complaints</div>
              <span className="badge badge-blue">{complaints.length} total</span>
            </div>

            {complaints.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)', fontSize: '13.5px' }}>
                No complaints filed yet. Submit one using the form on the left.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '520px', overflowY: 'auto' }}>
                {complaints.map(c => (
                  <div
                    key={c.id}
                    style={{
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '14px 16px',
                      cursor: 'pointer',
                      transition: 'var(--transition)',
                      background: viewComplaint === c.id ? 'var(--c-f8fafc)' : 'var(--bg-white)',
                    }}
                    onClick={() => toggleView(c.id)}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <code style={{ fontWeight: 700, fontSize: '13px', color: 'var(--forest-green)' }}>{c.id}</code>
                          <span className={`badge ${STATUS_MAP[c.status] || 'badge-gray'}`}>{c.status}</span>
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: 600 }}>{c.category}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                          {c.location} • {new Date(c.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </div>
                      </div>
                      {viewComplaint === c.id ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
                    </div>

                    {viewComplaint === c.id && (
                      <div
                        className="fade-in"
                        style={{ marginTop: '12px', padding: '12px', background: 'var(--c-f0fdf4)', borderRadius: '8px', fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, borderLeft: '3px solid var(--c-86efac)' }}
                        onClick={e => e.stopPropagation()}
                      >
                        <div><strong>Filed by:</strong> {c.name}</div>
                        <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <strong>Status:</strong>
                          <select className="form-select" style={{ width: 'auto', padding: '4px 8px' }} value={c.status} onChange={e => updateStatus(c.id, e.target.value)}>
                            {Object.keys(STATUS_MAP).map(s => <option key={s}>{s}</option>)}
                          </select>
                        </div>
                        <div style={{ marginTop: '4px' }}><strong>Description:</strong> {c.description}</div>
                        {c.photoName && (
                          <div style={{ marginTop: '6px', fontSize: '12px', color: 'var(--text-muted)' }}>
                            📎 Photo attached: {c.photoName} (preview not available after reload)
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
