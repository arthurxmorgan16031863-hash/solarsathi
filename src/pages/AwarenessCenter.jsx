import { useState } from 'react'
import { BookOpen, Sun, Wrench, Zap, CheckCircle, HelpCircle, ChevronDown, ChevronUp, Star } from 'lucide-react'

const CARDS = [
  {
    icon: <Sun size={22} color="#d97706" />,
    bg: 'var(--c-fef3c7)',
    title: 'How Solar Works',
    content: 'Solar photovoltaic (PV) panels convert sunlight directly into electricity using the photovoltaic effect. When photons from sunlight hit the silicon cells in a panel, they knock electrons loose, creating a direct current (DC). This DC is then converted to alternating current (AC) by an inverter for home or grid use.',
  },
  {
    icon: <Wrench size={22} color="#3b82f6" />,
    bg: 'var(--c-dbeafe)',
    title: 'Installation Steps',
    content: '1. Site Assessment — A certified installer evaluates your roof, shade, and orientation. 2. System Design — Capacity and layout are planned. 3. Permits & Approvals — DISCOM net-metering approval and local permits obtained. 4. Panel & Inverter Installation — Mounting, wiring, and inverter connection. 5. Inspection & Commissioning — Final checks and grid synchronization.',
  },
  {
    icon: <Zap size={22} color="#8b5cf6" />,
    bg: 'var(--c-ede9fe)',
    title: 'Maintenance Tips',
    content: 'Solar panels are largely maintenance-free. Key tips: Clean panels every 2–4 weeks (avoid abrasives). Inspect wiring annually. Monitor inverter performance via its app. Trim shading trees. Most panels last 25 years with <1% annual degradation. Inverters typically need replacement after 10–15 years.',
  },
  {
    icon: <CheckCircle size={22} color="#1a7a4a" />,
    bg: 'var(--c-dcfce7)',
    title: 'Benefits',
    content: '✔ Reduces electricity bills by 50–90%. ✔ Carbon-neutral electricity generation. ✔ Government subsidies (PM Surya Ghar Yojana). ✔ Net metering — sell excess power to grid. ✔ Increases property value. ✔ 25-year panel lifespan. ✔ Low maintenance costs after payback period.',
  },
  {
    icon: <HelpCircle size={22} color="#ef4444" />,
    bg: 'var(--c-fee2e2)',
    title: 'Limitations & Considerations',
    content: '✗ High upfront cost (₹40,000–₹70,000 per kW). ✗ Output drops on cloudy/rainy days. ✗ Roof must be shadow-free and structurally sound. ✗ Battery storage is expensive. ✗ Requires net-metering approval. ✗ Not suitable for homes with very little direct sunlight.',
  },
  {
    icon: <Star size={22} color="#f59e0b" />,
    bg: 'var(--c-fff7ed)',
    title: 'Government Schemes',
    content: 'PM Surya Ghar Muft Bijli Yojana: Subsidy for rooftop solar for residential consumers. ₹78,000 for 3 kW, ₹30,000/kW beyond 3 kW (up to 10 kW). Many states offer additional incentives. MNRE and state DISCOM portals provide application guidance. Check pmsuryaghar.gov.in for current details.',
  },
]

const FAQS = [
  { q: 'How long does solar panel installation take?', a: 'Typically 1–3 days for a residential system (3–10 kW), excluding permit approvals which can take 2–4 weeks.' },
  { q: 'Can I run AC units on solar?', a: 'Yes. A 1.5 TR AC consumes ~1.5 kW. A 5 kW solar system can comfortably run 2 ACs during the day along with other loads.' },
  { q: 'What happens during a power cut?', a: 'A grid-tied system (no battery) shuts down for safety during grid failures. Add battery storage for backup power during outages.' },
  { q: 'How much subsidy can I get?', a: 'Under PM Surya Ghar Muft Bijli Yojana, you can get ₹78,000 for up to 3 kW and ₹30,000/kW for 3–10 kW. Additional state subsidies may apply.' },
  { q: 'Do solar panels work in monsoon or winters?', a: 'Yes, but at reduced efficiency (typically 50–70% of peak capacity). Panels work on diffuse light too, not just direct sunlight.' },
]

const QUIZ = [
  {
    q: 'What does a solar inverter do?',
    options: ['Stores solar energy in batteries', 'Converts DC from panels to AC for home use', 'Measures sunlight intensity', 'Filters dust from panels'],
    answer: 1,
  },
  {
    q: 'Approximately how much roof area is needed per kW of solar capacity?',
    options: ['50 sq ft', '100 sq ft', '200 sq ft', '300 sq ft'],
    answer: 1,
  },
  {
    q: 'What does "net metering" mean?',
    options: ['Measuring CO₂ emissions', 'Selling excess solar power back to the grid', 'Monitoring battery levels', 'Calculating roof area'],
    answer: 1,
  },
]

export default function AwarenessCenter() {
  const [openFaq, setOpenFaq] = useState(null)
  const [quizAnswers, setQuizAnswers] = useState({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const handleQuizAnswer = (qi, oi) => {
    if (quizSubmitted) return
    setQuizAnswers(prev => ({ ...prev, [qi]: oi }))
  }

  const submitQuiz = () => {
    if (Object.keys(quizAnswers).length < QUIZ.length) return
    setQuizSubmitted(true)
  }

  const score = QUIZ.filter((q, i) => quizAnswers[i] === q.answer).length

  return (
    <div>
      {/* Header */}
      <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, var(--c-eff6ff), var(--c-dbeafe))', border: '1px solid var(--c-bfdbfe)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #2563eb, #3b82f6)', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={26} color="white" />
          </div>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: 800 }}>Solar Awareness Center</h2>
            <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)' }}>Learn about solar energy — how it works, how to install, maintain, and make the most of it.</p>
          </div>
        </div>
      </div>

      {/* Educational Cards */}
      <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Learn Solar Energy</div>
      <div className="grid-3" style={{ marginBottom: '32px' }}>
        {CARDS.map((card, i) => (
          <div key={i} className="edu-card">
            <div className="edu-card-icon" style={{ background: card.bg }}>{card.icon}</div>
            <h3>{card.title}</h3>
            <p>{card.content}</p>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Frequently Asked Questions</div>
      <div className="card" style={{ marginBottom: '32px' }}>
        {FAQS.map((faq, i) => (
          <div key={i}>
            <div
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', cursor: 'pointer' }}
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <div style={{ fontWeight: 600, fontSize: '14px' }}>{faq.q}</div>
              {openFaq === i ? <ChevronUp size={16} color="#9ca3af" /> : <ChevronDown size={16} color="#9ca3af" />}
            </div>
            {openFaq === i && (
              <div style={{ paddingBottom: '16px', fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: 1.7, background: 'var(--c-f8fafc)', padding: '14px', borderRadius: '8px', marginBottom: '8px' }}>
                {faq.a}
              </div>
            )}
            {i < FAQS.length - 1 && <div className="divider" style={{ margin: '0' }} />}
          </div>
        ))}
      </div>

      {/* Quiz */}
      <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>🧠 Quick Solar Quiz</div>
      <div className="card">
        {!quizSubmitted ? (
          <div>
            <div style={{ fontSize: '13.5px', color: 'var(--text-secondary)', marginBottom: '20px' }}>Test your solar knowledge! Answer all 3 questions, then click Submit.</div>
            {QUIZ.map((q, qi) => (
              <div key={qi} style={{ marginBottom: '24px' }}>
                <div style={{ fontWeight: 600, fontSize: '14.5px', marginBottom: '10px' }}>Q{qi + 1}. {q.q}</div>
                {q.options.map((opt, oi) => (
                  <div
                    key={oi}
                    className={`quiz-option ${quizAnswers[qi] === oi ? 'selected' : ''}`}
                    onClick={() => handleQuizAnswer(qi, oi)}
                  >
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${quizAnswers[qi] === oi ? '#1a7a4a' : 'var(--c-cbd5e1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {quizAnswers[qi] === oi && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#1a7a4a' }} />}
                    </div>
                    {opt}
                  </div>
                ))}
              </div>
            ))}
            <button
              className="btn btn-primary"
              onClick={submitQuiz}
              disabled={Object.keys(quizAnswers).length < QUIZ.length}
              style={{ opacity: Object.keys(quizAnswers).length < QUIZ.length ? 0.5 : 1 }}
            >
              Submit Quiz
            </button>
          </div>
        ) : (
          <div className="fade-in">
            {/* Score */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
              <div style={{ fontSize: '52px', fontWeight: 900, color: score === 3 ? 'var(--c-15803d)' : score === 2 ? '#d97706' : '#ef4444' }}>
                {score}/{QUIZ.length}
              </div>
              <div style={{ fontSize: '18px', fontWeight: 700, marginTop: '4px' }}>
                {score === 3 ? '🎉 Perfect Score! You\'re a Solar Expert!' : score === 2 ? '👍 Great job! Almost there!' : '📚 Keep learning — you\'ll get it!'}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '6px' }}>
                You answered {score} out of {QUIZ.length} correctly.
              </div>
            </div>
            {/* Review */}
            {QUIZ.map((q, qi) => {
              const correct = quizAnswers[qi] === q.answer
              return (
                <div key={qi} style={{ marginBottom: '18px' }}>
                  <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '8px' }}>Q{qi + 1}. {q.q}</div>
                  {q.options.map((opt, oi) => {
                    let cls = 'quiz-option'
                    if (oi === q.answer) cls += ' correct'
                    else if (oi === quizAnswers[qi]) cls += ' wrong'
                    return <div key={oi} className={cls}>{oi === q.answer ? '✓' : oi === quizAnswers[qi] ? '✗' : '○'} &nbsp;{opt}</div>
                  })}
                </div>
              )
            })}
            <button className="btn btn-secondary" onClick={() => { setQuizSubmitted(false); setQuizAnswers({}) }}>
              Retake Quiz
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
