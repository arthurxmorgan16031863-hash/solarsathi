import { readJSON, writeJSON } from '../utils/storage'
import { useState } from 'react'
import { Users, CheckCircle, BarChart2, ChevronRight } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const SURVEYS = [
  {
    id: 'survey_1',
    title: 'Community Solar Interest Survey',
    desc: 'Help us understand how many residents are interested in solar adoption.',
    questions: [
      {
        q: 'Are you considering installing solar panels in the next 12 months?',
        options: ['Definitely Yes', 'Maybe', 'Not planning yet', 'Already Installed'],
        key: 'interest',
      },
      {
        q: 'What is your biggest barrier to solar adoption?',
        options: ['High upfront cost', 'Lack of information', 'Rented property', 'No suitable roof'],
        key: 'barrier',
      },
      {
        q: 'How did you hear about solar energy?',
        options: ['Government campaigns', 'Social media', 'Friends/Neighbours', 'News/Media'],
        key: 'source',
      },
    ],
  },
  {
    id: 'survey_2',
    title: 'Solar Satisfaction Survey',
    desc: 'Already installed solar? Tell us about your experience.',
    questions: [
      {
        q: 'How satisfied are you with your solar installation?',
        options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied'],
        key: 'satisfaction',
      },
      {
        q: 'Are your actual savings matching your expected savings?',
        options: ['Exceeding expectations', 'As expected', 'Slightly below', 'Much lower'],
        key: 'savings_match',
      },
      {
        q: 'Would you recommend solar to friends?',
        options: ['Definitely', 'Probably', 'Not sure', 'No'],
        key: 'recommend',
      },
    ],
  },
]

const COLORS = ['#1a7a4a', '#22a862', 'var(--c-86efac)', 'var(--c-bbf7d0)']

export default function CommunitySurveys() {
  const [activeSurvey, setActiveSurvey] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [results, setResults] = useState(() => readJSON('ss_survey_results', {}))

  const handleSelect = (key, opt) => setAnswers(prev => ({ ...prev, [key]: opt }))

  const handleSubmit = () => {
    if (!activeSurvey) return
    const survey = SURVEYS.find(s => s.id === activeSurvey)
    const allAnswered = survey.questions.every(q => answers[q.key])
    if (!allAnswered) return

    // Store results as vote counts
    const stored = readJSON('ss_survey_results', {})
    survey.questions.forEach(q => {
      const key = `${activeSurvey}_${q.key}`
      if (!stored[key]) stored[key] = {}
      stored[key][answers[q.key]] = (stored[key][answers[q.key]] || 0) + 1
    })
    writeJSON('ss_survey_results', stored)
    setResults(stored)
    setSubmitted(true)
  }

  const reset = () => {
    setActiveSurvey(null)
    setAnswers({})
    setSubmitted(false)
  }

  if (submitted) {
    const survey = SURVEYS.find(s => s.id === activeSurvey)
    return (
      <div>
        <SurveyHeader />
        <div className="card fade-in" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', padding: '40px' }}>
          <div style={{ width: '72px', height: '72px', background: 'var(--c-dcfce7)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
            <CheckCircle size={36} color="var(--c-15803d)" />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px' }}>Thank You! 🎉</div>
          <div style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '28px' }}>Your responses have been recorded. Here's how the community voted:</div>

          {survey.questions.map(q => {
            const key = `${activeSurvey}_${q.key}`
            const votes = results[key] || {}
            const total = Object.values(votes).reduce((a, b) => a + b, 0) || 1
            const chartData = q.options.map(opt => ({ name: opt, votes: votes[opt] || 0 }))
            return (
              <div key={q.key} style={{ marginBottom: '24px', textAlign: 'left' }}>
                <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '10px' }}>{q.q}</div>
                <ResponsiveContainer width="100%" height={120}>
                  <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 8 }}>
                    <XAxis type="number" hide />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={140} />
                    <Tooltip formatter={(v) => [`${v} votes`, '']} />
                    <Bar dataKey="votes" radius={4}>
                      {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )
          })}

          <button className="btn btn-secondary" onClick={reset}>Back to Surveys</button>
        </div>
      </div>
    )
  }

  if (activeSurvey) {
    const survey = SURVEYS.find(s => s.id === activeSurvey)
    const allAnswered = survey.questions.every(q => answers[q.key])
    return (
      <div>
        <SurveyHeader />
        <div className="card" style={{ maxWidth: '680px', margin: '0 auto' }}>
          <button className="btn btn-secondary btn-sm" style={{ marginBottom: '20px' }} onClick={reset}>← Back</button>
          <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '6px' }}>{survey.title}</div>
          <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '24px' }}>{survey.desc}</div>

          {survey.questions.map((q, qi) => (
            <div key={qi} style={{ marginBottom: '24px' }}>
              <div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '10px' }}>Q{qi + 1}. {q.q}</div>
              {q.options.map(opt => (
                <div
                  key={opt}
                  className={`survey-option ${answers[q.key] === opt ? 'selected' : ''}`}
                  onClick={() => handleSelect(q.key, opt)}
                >
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${answers[q.key] === opt ? '#1a7a4a' : 'var(--c-cbd5e1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {answers[q.key] === opt && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#1a7a4a' }} />}
                  </div>
                  {opt}
                </div>
              ))}
            </div>
          ))}

          <button
            className="btn btn-primary btn-full"
            onClick={handleSubmit}
            disabled={!allAnswered}
            style={{ opacity: allAnswered ? 1 : 0.5, marginTop: '8px' }}
          >
            Submit Survey
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <SurveyHeader />

      {/* Survey Cards */}
      <div className="grid-2" style={{ maxWidth: '900px' }}>
        {SURVEYS.map(s => (
          <div key={s.id} className="card" style={{ cursor: 'pointer', transition: 'var(--transition)', border: '1.5px solid var(--border)' }}
            onClick={() => { setActiveSurvey(s.id); setAnswers({}); setSubmitted(false) }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ width: '44px', height: '44px', background: 'var(--c-dcfce7)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} color="#1a7a4a" />
              </div>
              <div style={{ fontWeight: 700, fontSize: '15px' }}>{s.title}</div>
            </div>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '16px' }}>{s.desc}</p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{s.questions.length} questions • ~2 mins</div>
              <button className="btn btn-primary btn-sm">
                Start Survey <ChevronRight size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Community Stats */}
      <div className="card" style={{ marginTop: '24px', maxWidth: '900px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <BarChart2 size={18} color="var(--forest-green)" />
          <div className="section-title" style={{ marginBottom: 0 }}>Community Participation Stats</div>
        </div>
        <div className="grid-3">
          {[
            { label: 'Surveys Completed', value: '1,240', icon: '📋', color: 'var(--c-dcfce7)', textColor: 'var(--c-15803d)' },
            { label: 'Avg. Response Time', value: '2.3 min', icon: '⏱️', color: 'var(--c-dbeafe)', textColor: '#1d4ed8' },
            { label: 'Participants This Month', value: '184', icon: '👥', color: 'var(--c-ede9fe)', textColor: '#7c3aed' },
          ].map((s, i) => (
            <div key={i} style={{ background: s.color, borderRadius: '12px', padding: '18px', textAlign: 'center' }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>{s.icon}</div>
              <div style={{ fontSize: '22px', fontWeight: 800, color: s.textColor }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SurveyHeader() {
  return (
    <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--c-ede9fe), var(--c-f5f3ff))', border: '1px solid var(--c-c4b5fd)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #7c3aed, #8b5cf6)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Users size={26} color="white" />
        </div>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Community Surveys</h2>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>Share your views and help shape solar policy in your community.</p>
        </div>
      </div>
    </div>
  )
}
