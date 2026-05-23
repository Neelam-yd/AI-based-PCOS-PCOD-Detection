'use client'
import { useState } from 'react'

import Link from 'next/link'

// ─── Scoring engine built from real dataset averages ────────────────────────
// Base PCOS rate in dataset: 32.7% (177/541 patients)
// All thresholds derived from actual patient averages

function calculatePCOSRisk(answers) {
  let score = 0
  let maxScore = 0
  const flags = []
  const details = []

  // 1. CYCLE REGULARITY — strongest predictor
  // Irregular: 62.7% PCOS rate | Regular: 21.0% PCOS rate
  maxScore += 25
  if (answers.cycle === 'irregular') {
    score += 25
    flags.push('Irregular menstrual cycle')
    details.push({ label: 'Irregular periods', weight: 'Very high', points: 25 })
  } else {
    details.push({ label: 'Regular periods', weight: 'Low risk', points: 0 })
  }

  // 2. LH LEVEL — PCOS avg: 14.40 | Non-PCOS avg: 2.61
  maxScore += 20
  const lh = parseFloat(answers.lh)
  if (!isNaN(lh)) {
    if (lh > 10) { score += 20; flags.push('Elevated LH'); details.push({ label: 'High LH (>10)', weight: 'Very high', points: 20 }) }
    else if (lh > 5) { score += 10; details.push({ label: 'Mildly elevated LH', weight: 'Moderate', points: 10 }) }
    else { details.push({ label: 'Normal LH', weight: 'Low risk', points: 0 }) }
  }

  // 3. AMH — PCOS avg: 7.84 | Non-PCOS avg: 4.54
  maxScore += 18
  const amh = parseFloat(answers.amh)
  if (!isNaN(amh)) {
    if (amh > 6) { score += 18; flags.push('High AMH'); details.push({ label: 'High AMH (>6 ng/mL)', weight: 'Very high', points: 18 }) }
    else if (amh > 3.5) { score += 9; details.push({ label: 'Mildly elevated AMH', weight: 'Moderate', points: 9 }) }
    else { details.push({ label: 'Normal AMH', weight: 'Low risk', points: 0 }) }
  }

  // 4. FOLLICLE COUNT — PCOS avg L:9.79, R:10.76 | Non-PCOS avg L:4.35, R:4.64
  maxScore += 18
  const fL = parseFloat(answers.follicleL)
  const fR = parseFloat(answers.follicleR)
  const maxF = Math.max(isNaN(fL) ? 0 : fL, isNaN(fR) ? 0 : fR)
  if (maxF > 0) {
    if (maxF >= 12) { score += 18; flags.push('High follicle count'); details.push({ label: 'High follicle count (≥12)', weight: 'Very high', points: 18 }) }
    else if (maxF >= 8) { score += 9; details.push({ label: 'Borderline follicle count', weight: 'Moderate', points: 9 }) }
    else { details.push({ label: 'Normal follicle count', weight: 'Low risk', points: 0 }) }
  }

  // 5. SYMPTOMS (from dataset correlation rates)
  // Hair growth: 68.2% PCOS rate when present
  maxScore += 8
  if (answers.hairGrowth === 'yes') { score += 8; flags.push('Excessive hair growth'); details.push({ label: 'Excessive hair growth', weight: 'High', points: 8 }) }
  else { details.push({ label: 'No excess hair growth', weight: 'Low risk', points: 0 }) }

  // Skin darkening: 66.3% PCOS rate
  maxScore += 7
  if (answers.skinDark === 'yes') { score += 7; flags.push('Skin darkening'); details.push({ label: 'Skin darkening', weight: 'High', points: 7 }) }
  else { details.push({ label: 'No skin darkening', weight: 'Low risk', points: 0 }) }

  // Weight gain: 59.3% PCOS rate
  maxScore += 7
  if (answers.weightGain === 'yes') { score += 7; flags.push('Unexplained weight gain'); details.push({ label: 'Unexplained weight gain', weight: 'High', points: 7 }) }
  else { details.push({ label: 'No weight gain', weight: 'Low risk', points: 0 }) }

  // Pimples: 46.4% PCOS rate
  maxScore += 4
  if (answers.pimples === 'yes') { score += 4; details.push({ label: 'Acne/pimples', weight: 'Moderate', points: 4 }) }
  else { details.push({ label: 'No acne', weight: 'Low risk', points: 0 }) }

  // Hair loss: 41.6% PCOS rate
  maxScore += 4
  if (answers.hairLoss === 'yes') { score += 4; details.push({ label: 'Hair thinning/loss', weight: 'Moderate', points: 4 }) }
  else { details.push({ label: 'No hair loss', weight: 'Low risk', points: 0 }) }

  // 6. BMI — PCOS avg: 25.47 | Non-PCOS avg: 23.74
  maxScore += 6
  const bmi = parseFloat(answers.bmi)
  if (!isNaN(bmi)) {
    if (bmi > 27) { score += 6; details.push({ label: 'High BMI (>27)', weight: 'Moderate', points: 6 }) }
    else if (bmi > 25) { score += 3; details.push({ label: 'Slightly elevated BMI', weight: 'Low-moderate', points: 3 }) }
    else { details.push({ label: 'Normal BMI', weight: 'Low risk', points: 0 }) }
  }

  // 7. FAST FOOD — 50% PCOS rate when yes vs 14.5% when no
  maxScore += 5
  if (answers.fastFood === 'yes') { score += 5; details.push({ label: 'Frequent fast food', weight: 'Moderate', points: 5 }) }
  else { details.push({ label: 'Healthy diet', weight: 'Low risk', points: 0 }) }

  // 8. EXERCISE — 38.1% with exercise vs 31% without (small delta)
  maxScore += 3
  if (answers.exercise === 'no') { score += 3; details.push({ label: 'No regular exercise', weight: 'Low', points: 3 }) }
  else { details.push({ label: 'Regular exercise', weight: 'Positive', points: 0 }) }

  // FSH — PCOS avg: 5.17 (LOW) | Non-PCOS avg: 19.19 (HIGH)
  // Low FSH is a PCOS marker
  maxScore += 6
  const fsh = parseFloat(answers.fsh)
  if (!isNaN(fsh)) {
    if (fsh < 4) { score += 6; flags.push('Low FSH'); details.push({ label: 'Low FSH (<4)', weight: 'High', points: 6 }) }
    else if (fsh < 7) { score += 3; details.push({ label: 'Borderline FSH', weight: 'Moderate', points: 3 }) }
    else { details.push({ label: 'Normal/High FSH', weight: 'Low risk', points: 0 }) }
  }

  // Convert to percentage
  const rawPercent = maxScore > 0 ? (score / maxScore) * 100 : 0

  // Apply base rate calibration (dataset: 32.7% base rate)
  // Scale so 0 raw = ~5% and 100% raw = ~92%
  const calibrated = Math.min(92, Math.max(5, rawPercent * 0.87 + 5))

  return {
    percent: Math.round(calibrated),
    raw: Math.round(rawPercent),
    score,
    maxScore,
    flags,
    details,
    risk: calibrated >= 65 ? 'high' : calibrated >= 40 ? 'moderate' : 'low',
  }
}

// ─── Questions config ────────────────────────────────────────────────────────
const STEPS = [
  {
    id: 'basic',
    title: 'Basic Information',
    subtitle: 'Tell us a little about yourself',
    icon: '👤',
    questions: [
      { key: 'age', label: 'How old are you?', type: 'number', unit: 'years', placeholder: 'e.g. 28', min: 12, max: 60 },
      { key: 'weight', label: 'What is your weight?', type: 'number', unit: 'kg', placeholder: 'e.g. 60', min: 30, max: 150 },
      { key: 'height', label: 'What is your height?', type: 'number', unit: 'cm', placeholder: 'e.g. 162', min: 100, max: 220 },
    ],
  },
  {
    id: 'cycle',
    title: 'Menstrual Health',
    subtitle: 'About your periods',
    icon: '🗓️',
    questions: [
      {
        key: 'cycle', label: 'How are your periods?', type: 'choice',
        options: [
          { value: 'regular', label: 'Regular', desc: 'Every 21–35 days, predictable' },
          { value: 'irregular', label: 'Irregular', desc: 'Unpredictable, skip months, or very frequent' },
        ],
      },
      { key: 'cycleLen', label: 'Average cycle length?', type: 'number', unit: 'days', placeholder: 'e.g. 28', min: 10, max: 90 },
    ],
  },
  {
    id: 'symptoms',
    title: 'Physical Symptoms',
    subtitle: 'Select all that apply to you',
    icon: '🔍',
    questions: [
      {
        key: 'weightGain', label: 'Unexplained weight gain recently?', type: 'yesno',
      },
      {
        key: 'hairGrowth', label: 'Excessive hair on face, chest, or back?', type: 'yesno',
      },
      {
        key: 'skinDark', label: 'Skin darkening (neck, underarms, groin)?', type: 'yesno',
      },
      {
        key: 'hairLoss', label: 'Hair thinning or loss from scalp?', type: 'yesno',
      },
      {
        key: 'pimples', label: 'Frequent acne or pimples?', type: 'yesno',
      },
    ],
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle',
    subtitle: 'Your daily habits',
    icon: '🥗',
    questions: [
      {
        key: 'fastFood', label: 'Do you eat fast food regularly (3+ times/week)?', type: 'yesno',
      },
      {
        key: 'exercise', label: 'Do you exercise regularly (3+ times/week)?', type: 'yesno',
      },
    ],
  },
  {
    id: 'hormones',
    title: 'Hormone Tests',
    subtitle: 'Enter your blood test results if you have them (optional)',
    icon: '🧪',
    optional: true,
    questions: [
      { key: 'lh', label: 'LH level', type: 'number', unit: 'mIU/mL', placeholder: 'e.g. 8.5', min: 0, max: 100 },
      { key: 'fsh', label: 'FSH level', type: 'number', unit: 'mIU/mL', placeholder: 'e.g. 6.2', min: 0, max: 100 },
      { key: 'amh', label: 'AMH level', type: 'number', unit: 'ng/mL', placeholder: 'e.g. 4.5', min: 0, max: 50 },
    ],
  },
  {
    id: 'ultrasound',
    title: 'Ultrasound Results',
    subtitle: 'Enter follicle counts from your scan (optional)',
    icon: '🔬',
    optional: true,
    questions: [
      { key: 'follicleL', label: 'Follicle count — left ovary', type: 'number', unit: 'follicles', placeholder: 'e.g. 6', min: 0, max: 40 },
      { key: 'follicleR', label: 'Follicle count — right ovary', type: 'number', unit: 'follicles', placeholder: 'e.g. 7', min: 0, max: 40 },
    ],
  },
]

// ─── UI Components ───────────────────────────────────────────────────────────

function YesNo({ questionKey, value, onChange }) {
  return (
    <div className="flex gap-3">
      {['yes', 'no'].map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(questionKey, opt)}
          className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
            value === opt
              ? opt === 'yes'
                ? 'bg-rose-500/20 border-rose-500/60 text-rose-300'
                : 'bg-white/10 border-white/30 text-white'
              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300'
          }`}
        >
          {opt === 'yes' ? 'Yes' : 'No'}
        </button>
      ))}
    </div>
  )
}

function Choice({ questionKey, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-3">
      {options.map(opt => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(questionKey, opt.value)}
          className={`w-full text-left px-5 py-4 rounded-xl border transition-all duration-200 ${
            value === opt.value
              ? 'bg-rose-500/15 border-rose-500/50 text-white'
              : 'bg-white/5 border-white/10 text-gray-400 hover:border-white/20 hover:text-gray-300'
          }`}
        >
          <div className={`font-medium text-sm ${value === opt.value ? 'text-rose-300' : ''}`}>{opt.label}</div>
          <div className="text-xs text-gray-500 mt-0.5">{opt.desc}</div>
        </button>
      ))}
    </div>
  )
}

function NumberInput({ questionKey, value, onChange, unit, placeholder, min, max }) {
  return (
    <div className="relative">
      <input
        type="number"
        value={value || ''}
        onChange={e => onChange(questionKey, e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 outline-none focus:border-rose-500/50 transition-colors text-sm pr-20"
      />
      {unit && (
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-500 pointer-events-none">{unit}</span>
      )}
    </div>
  )
}

// ─── Risk Result Card ─────────────────────────────────────────────────────────
function ResultCard({ result, answers, onRetake }) {
  const { percent, risk, flags, details } = result

  const bmi = answers.height && answers.weight
    ? (parseFloat(answers.weight) / Math.pow(parseFloat(answers.height) / 100, 2)).toFixed(1)
    : null

  const riskConfig = {
    low: {
      label: 'Low Risk',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/30',
      bar: 'bg-emerald-500',
      desc: 'Your responses suggest a low likelihood of PCOS/PCOD. Maintain a healthy lifestyle and consult a doctor for routine checkups.',
    },
    moderate: {
      label: 'Moderate Risk',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/30',
      bar: 'bg-amber-400',
      desc: 'Some indicators suggest a moderate risk. We recommend consulting a gynecologist for a proper evaluation including blood tests and ultrasound.',
    },
    high: {
      label: 'High Risk',
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
      borderColor: 'border-rose-500/30',
      bar: 'bg-rose-500',
      desc: 'Multiple indicators suggest a high likelihood of PCOS/PCOD. Please consult a gynecologist or endocrinologist for diagnosis and treatment.',
    },
  }

  const cfg = riskConfig[risk]

  return (
    <div className="animate-fade-in">
      {/* Hero result */}
      <div className={`rounded-2xl border ${cfg.borderColor} ${cfg.bgColor} p-6 mb-5 text-center`}>
        <div className="text-5xl font-bold text-white mb-1">{percent}%</div>
        <div className={`text-lg font-semibold ${cfg.color} mb-3`}>{cfg.label} of PCOS/PCOD</div>

        {/* Progress bar */}
        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden mb-4">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${cfg.bar}`}
            style={{ width: `${percent}%` }}
          />
        </div>

        <p className="text-gray-400 text-sm leading-relaxed">{cfg.desc}</p>
      </div>

      {/* Disclaimer */}
      <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-5 text-xs text-gray-500 text-center">
        ⚠️ This is an educational screening tool based on a clinical dataset of 541 patients. It is <strong className="text-gray-400">not a medical diagnosis</strong>. Always consult a qualified doctor.
      </div>

      {/* Key flags */}
      {flags.length > 0 && (
        <div className="mb-5">
          <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Key risk indicators found</div>
          <div className="flex flex-wrap gap-2">
            {flags.map(f => (
              <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-300">
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* BMI */}
      {bmi && (
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-5 flex items-center justify-between">
          <span className="text-sm text-gray-400">Your BMI</span>
          <span className={`text-sm font-semibold ${parseFloat(bmi) > 25 ? 'text-amber-400' : 'text-emerald-400'}`}>
            {bmi} — {parseFloat(bmi) > 30 ? 'Obese' : parseFloat(bmi) > 25 ? 'Overweight' : parseFloat(bmi) > 18.5 ? 'Normal' : 'Underweight'}
          </span>
        </div>
      )}

      {/* Score breakdown */}
      <div className="mb-5">
        <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Assessment breakdown</div>
        <div className="space-y-2">
          {details.map((d, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5">
              <span className="text-sm text-gray-300">{d.label}</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                d.weight === 'Very high' ? 'bg-rose-500/15 text-rose-400' :
                d.weight === 'High' ? 'bg-orange-500/15 text-orange-400' :
                d.weight === 'Moderate' ? 'bg-amber-500/15 text-amber-400' :
                d.weight === 'Positive' ? 'bg-emerald-500/15 text-emerald-400' :
                'bg-white/5 text-gray-500'
              }`}>
                {d.weight}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Next steps */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
        <div className="text-sm font-semibold text-white mb-3">Recommended next steps</div>
        <div className="space-y-2 text-sm text-gray-400">
          {risk === 'high' && (
            <>
              <div className="flex gap-2"><span className="text-rose-400">→</span> Book an appointment with a gynecologist or endocrinologist</div>
              <div className="flex gap-2"><span className="text-rose-400">→</span> Request blood tests: LH, FSH, AMH, prolactin, testosterone</div>
              <div className="flex gap-2"><span className="text-rose-400">→</span> Ask for a pelvic ultrasound to check follicle counts</div>
              <div className="flex gap-2"><span className="text-rose-400">→</span> Begin tracking your menstrual cycle with an app</div>
            </>
          )}
          {risk === 'moderate' && (
            <>
              <div className="flex gap-2"><span className="text-amber-400">→</span> Schedule a checkup with your gynecologist</div>
              <div className="flex gap-2"><span className="text-amber-400">→</span> Consider getting hormone levels tested</div>
              <div className="flex gap-2"><span className="text-amber-400">→</span> Adopt a low-GI diet and increase physical activity</div>
              <div className="flex gap-2"><span className="text-amber-400">→</span> Track your cycle length and symptoms</div>
            </>
          )}
          {risk === 'low' && (
            <>
              <div className="flex gap-2"><span className="text-emerald-400">→</span> Continue routine annual gynecological checkups</div>
              <div className="flex gap-2"><span className="text-emerald-400">→</span> Maintain a balanced diet and regular exercise</div>
              <div className="flex gap-2"><span className="text-emerald-400">→</span> Monitor any changes in your cycle</div>
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onRetake}
          className="flex-1 py-3 rounded-xl border border-white/20 text-gray-300 text-sm font-medium hover:border-white/30 hover:text-white transition-all"
        >
          Retake Assessment
        </button>
        <Link
          href="/chatbot"
          className="flex-1 py-3 rounded-xl btn-primary text-white text-sm font-semibold text-center flex items-center justify-center gap-2"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Ask AI about your result
        </Link>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [animDir, setAnimDir] = useState('forward')

  const totalSteps = STEPS.length
  const step = STEPS[currentStep]

  const setAnswer = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }))
  }

  const isStepValid = () => {
    if (step.optional) return true
    for (const q of step.questions) {
      if (q.type === 'number') continue // optional numbers
      if (!answers[q.key]) return false
    }
    return true
  }

  const goNext = () => {
    if (currentStep < totalSteps - 1) {
      setAnimDir('forward')
      setCurrentStep(s => s + 1)
    } else {
      // Calculate result
      setResult(calculatePCOSRisk(answers))
    }
  }

  const goBack = () => {
    if (currentStep > 0) {
      setAnimDir('back')
      setCurrentStep(s => s - 1)
    }
  }

  const retake = () => {
    setCurrentStep(0)
    setAnswers({})
    setResult(null)
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg, #0f0a1e 0%, #1a0f2e 50%, #0f0a1e 100%)' }}
    >
      

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">

          {result ? (
            <ResultCard result={result} answers={answers} onRetake={retake} />
          ) : (
            <>
              {/* Header */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-rose-500/20 text-xs text-rose-400 mb-4">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                  PCOS/PCOD Risk Assessment
                </div>
                <h1 className="text-2xl font-bold text-white mb-1">
                  Step {currentStep + 1} of {totalSteps}
                </h1>
                <p className="text-gray-500 text-sm">Based on clinical data from 541 real patients</p>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-8">
                <div
                  className="h-full btn-primary rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                />
              </div>

              {/* Step card */}
              <div className="glass rounded-2xl p-6 border border-rose-500/10 animate-fade-in">
                {/* Step header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-xl btn-primary flex items-center justify-center text-xl shadow-lg shadow-rose-500/20">
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-base">{step.title}</div>
                    <div className="text-gray-500 text-xs">{step.subtitle}</div>
                  </div>
                  {step.optional && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-gray-500">Optional</span>
                  )}
                </div>

                {/* Questions */}
                <div className="space-y-5">
                  {step.questions.map(q => (
                    <div key={q.key}>
                      <label className="block text-sm text-gray-300 mb-2 font-medium">{q.label}</label>
                      {q.type === 'yesno' && (
                        <YesNo questionKey={q.key} value={answers[q.key]} onChange={setAnswer} />
                      )}
                      {q.type === 'choice' && (
                        <Choice questionKey={q.key} value={answers[q.key]} onChange={setAnswer} options={q.options} />
                      )}
                      {q.type === 'number' && (
                        <NumberInput
                          questionKey={q.key}
                          value={answers[q.key]}
                          onChange={setAnswer}
                          unit={q.unit}
                          placeholder={q.placeholder}
                          min={q.min}
                          max={q.max}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex gap-3 mt-5">
                {currentStep > 0 && (
                  <button
                    onClick={goBack}
                    className="px-5 py-3 rounded-xl border border-white/20 text-gray-400 text-sm font-medium hover:text-white hover:border-white/30 transition-all flex items-center gap-2"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                    Back
                  </button>
                )}
                <button
                  onClick={goNext}
                  disabled={!isStepValid()}
                  className="flex-1 py-3 rounded-xl btn-primary text-white text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                >
                  {currentStep === totalSteps - 1 ? (
                    <>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                      Calculate My Risk
                    </>
                  ) : (
                    <>
                      Continue
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"/></svg>
                    </>
                  )}
                </button>
              </div>

              {/* Step dots */}
              <div className="flex justify-center gap-1.5 mt-6">
                {STEPS.map((_, i) => (
                  <div
                    key={i}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentStep ? 'w-5 h-1.5 bg-rose-500' :
                      i < currentStep ? 'w-1.5 h-1.5 bg-rose-500/50' :
                      'w-1.5 h-1.5 bg-white/15'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}