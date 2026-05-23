'use client'
import { useState, useRef, useEffect } from 'react'


// ─── Simulated AI results pool ───────────────────────────────────────────────
const RESULTS = [
  {
    type: 'pcos',
    label: 'PCOS Detected',
    confidence: 87,
    severity: 'Moderate',
    color: '#f43f5e',
    bg: 'rgba(244,63,94,0.07)',
    border: 'rgba(244,63,94,0.35)',
    badge: { bg: 'rgba(244,63,94,0.15)', text: '#fb7185' },
    icon: '⚠️',
    findings: [
      { icon: '🔵', text: 'More than 12 small follicles detected per ovary' },
      { icon: '🔵', text: '"String of pearls" pattern clearly identified' },
      { icon: '🔵', text: 'Ovarian volume enlarged (>10 mL)' },
      { icon: '🔵', text: 'Increased stromal echogenicity observed' },
      { icon: '🔵', text: 'Peripheral follicle arrangement detected' },
    ],
    hormones: [
      { name: 'LH/FSH Ratio', value: 'Elevated (>2)', status: 'abnormal' },
      { name: 'Testosterone', value: 'Likely High', status: 'abnormal' },
      { name: 'Insulin Resistance', value: 'Possible', status: 'warning' },
    ],
    recommendation:
      'Consult a gynecologist or endocrinologist immediately. A hormone panel (LH, FSH, testosterone, AMH) and fasting insulin test are recommended. Lifestyle changes including low-GI diet and regular exercise can significantly help manage PCOS.',
    nextSteps: ['Book gynecologist appointment', 'Get hormone blood test', 'Start low-GI diet', 'Begin regular exercise'],
  },
  {
    type: 'pcod',
    label: 'PCOD Detected',
    confidence: 78,
    severity: 'Mild',
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.07)',
    border: 'rgba(168,85,247,0.35)',
    badge: { bg: 'rgba(168,85,247,0.15)', text: '#c084fc' },
    icon: '🟡',
    findings: [
      { icon: '🟣', text: 'Multiple cysts detected on ovary surface' },
      { icon: '🟣', text: 'Mild ovarian enlargement present' },
      { icon: '🟣', text: 'Irregular follicular distribution' },
      { icon: '🟣', text: 'Slight increase in stromal volume' },
      { icon: '🟣', text: 'Cyst size ranging 2–9 mm' },
    ],
    hormones: [
      { name: 'LH/FSH Ratio', value: 'Mildly Elevated', status: 'warning' },
      { name: 'Estrogen', value: 'Slightly Irregular', status: 'warning' },
      { name: 'Progesterone', value: 'Low-Normal', status: 'warning' },
    ],
    recommendation:
      'PCOD is a more common and milder condition than PCOS. Dietary changes (reduce sugar, processed foods), regular exercise and stress reduction can often reverse PCOD. A follow-up with a gynecologist for hormone evaluation is advised.',
    nextSteps: ['Consult gynecologist', 'Hormone evaluation test', 'Improve diet & reduce sugar', 'Manage stress levels'],
  },
  {
    type: 'normal',
    label: 'No PCOS / PCOD Detected',
    confidence: 94,
    severity: 'Normal',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.07)',
    border: 'rgba(34,197,94,0.35)',
    badge: { bg: 'rgba(34,197,94,0.15)', text: '#4ade80' },
    icon: '✅',
    findings: [
      { icon: '🟢', text: 'Follicle count within normal range (< 12)' },
      { icon: '🟢', text: 'Ovarian volume normal (< 10 mL)' },
      { icon: '🟢', text: 'No cystic patterns detected' },
      { icon: '🟢', text: 'Regular ovarian morphology observed' },
      { icon: '🟢', text: 'Stromal echogenicity appears normal' },
    ],
    hormones: [
      { name: 'LH/FSH Ratio', value: 'Normal', status: 'normal' },
      { name: 'Estrogen', value: 'Normal Range', status: 'normal' },
      { name: 'Ovarian Volume', value: 'Normal', status: 'normal' },
    ],
    recommendation:
      'No signs of PCOS or PCOD were detected in this scan. Continue regular annual gynecological checkups. Maintain a healthy lifestyle with balanced diet and regular exercise for long-term reproductive health.',
    nextSteps: ['Continue annual checkups', 'Maintain healthy diet', 'Regular exercise', 'Monitor menstrual cycle'],
  },
]

const ANALYSIS_STEPS = [
  'Preprocessing image...',
  'Detecting ovarian boundaries...',
  'Counting follicles...',
  'Analyzing morphology patterns...',
  'Generating diagnosis report...',
]

export default function DetectionPage() {
  const [preview, setPreview] = useState(null)
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [dragging, setDragging] = useState(false)
  const [loading, setLoading] = useState(false)
  const [analysisStep, setAnalysisStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [showReport, setShowReport] = useState(false)
  const fileRef = useRef(null)
  const resultRef = useRef(null)

  useEffect(() => {
    if (result) {
      setTimeout(() => setShowReport(true), 100)
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
    }
  }, [result])

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    setResult(null)
    setShowReport(false)
    setFileName(file.name)
    setFileSize((file.size / 1024).toFixed(1) + ' KB')
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(file)
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    handleFile(e.dataTransfer.files[0])
  }

  const analyze = async () => {
    if (!preview || loading) return
    setLoading(true)
    setResult(null)
    setShowReport(false)
    setProgress(0)
    setAnalysisStep(0)

    // Simulate 5 analysis steps
    for (let i = 0; i < ANALYSIS_STEPS.length; i++) {
      setAnalysisStep(i)
      const stepDuration = 600
      const steps = 20
      for (let j = 0; j <= steps; j++) {
        await new Promise((r) => setTimeout(r, stepDuration / steps))
        setProgress(Math.round(((i * steps + j) / (ANALYSIS_STEPS.length * steps)) * 100))
      }
    }

    setProgress(100)
    await new Promise((r) => setTimeout(r, 400))
    setResult(RESULTS[Math.floor(Math.random() * RESULTS.length)])
    setLoading(false)
  }

  const reset = () => {
    setPreview(null)
    setFileName('')
    setFileSize('')
    setResult(null)
    setShowReport(false)
    setProgress(0)
    setAnalysisStep(0)
    if (fileRef.current) fileRef.current.value = ''
  }

  const statusColor = { normal: '#22c55e', warning: '#f59e0b', abnormal: '#f43f5e' }
  const statusLabel = { normal: 'Normal', warning: 'Monitor', abnormal: 'Abnormal' }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg,#0d0718 0%,#150d2a 55%,#0d0718 100%)' }}>
     

      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '100px 20px 60px' }}>

        {/* ── Page Header ── */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '99px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)', marginBottom: '16px' }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f43f5e', display: 'inline-block' }} />
            <span style={{ color: '#fb7185', fontSize: '12px', fontWeight: 600 }}>AI Detection Module</span>
          </div>
          <h1 style={{ fontSize: '36px', fontWeight: 800, color: 'white', margin: '0 0 8px 0', lineHeight: 1.2 }}>
            Ultrasound Image{' '}
            <span style={{ background: 'linear-gradient(135deg,#f43f5e,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Analysis
            </span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '15px', margin: 0 }}>
            Upload an ovarian ultrasound scan — AI will detect PCOS or PCOD with detailed findings
          </p>
        </div>

        {/* ── Upload + Result Grid ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', alignItems: 'start' }}>

          {/* ── LEFT: Upload Panel ── */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg,#f43f5e,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: 'white' }}>1</div>
              <span style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>Upload Ultrasound Image</span>
            </div>

            {/* Drop zone */}
            {!preview ? (
              <div
                onClick={() => fileRef.current?.click()}
                onDrop={onDrop}
                onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
                onDragLeave={() => setDragging(false)}
                style={{
                  minHeight: '300px', borderRadius: '18px', cursor: 'pointer',
                  border: `2px dashed ${dragging ? '#f43f5e' : 'rgba(244,63,94,0.3)'}`,
                  background: dragging ? 'rgba(244,63,94,0.06)' : 'rgba(255,255,255,0.02)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '14px', padding: '40px', transition: 'all 0.25s',
                }}
              >
                <div style={{ width: '72px', height: '72px', borderRadius: '18px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '34px' }}>
                  🩻
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '15px', margin: '0 0 6px 0' }}>
                    {dragging ? 'Drop the image here!' : 'Drag & drop ultrasound image'}
                  </p>
                  <p style={{ color: '#475569', fontSize: '13px', margin: 0 }}>or click anywhere to browse files</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['JPG', 'PNG', 'WEBP'].map((f) => (
                    <span key={f} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#64748b', fontSize: '11px', fontWeight: 600 }}>{f}</span>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ borderRadius: '18px', overflow: 'hidden', border: '1px solid rgba(244,63,94,0.25)', background: '#0d0718', position: 'relative' }}>
                <img src={preview} alt="scan" style={{ width: '100%', maxHeight: '310px', objectFit: 'cover', display: 'block' }} />
                <button onClick={reset} style={{ position: 'absolute', top: '12px', right: '12px', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.15)', color: 'white', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
                <div style={{ padding: '12px 16px', background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ color: 'white', fontSize: '13px', fontWeight: 600, margin: 0, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fileName}</p>
                    <p style={{ color: '#64748b', fontSize: '11px', margin: '2px 0 0 0' }}>{fileSize}</p>
                  </div>
                  <span style={{ padding: '4px 10px', borderRadius: '8px', background: 'rgba(34,197,94,0.15)', color: '#4ade80', fontSize: '11px', fontWeight: 600 }}>✓ Ready</span>
                </div>
              </div>
            )}

            <input ref={fileRef} type="file" accept="image/*" onChange={(e) => handleFile(e.target.files[0])} style={{ display: 'none' }} />

            {/* Analyze Button */}
            {preview && !result && (
              <button
                onClick={analyze}
                disabled={loading}
                style={{
                  marginTop: '14px', width: '100%', padding: '15px',
                  borderRadius: '14px', border: 'none', color: 'white', fontWeight: 700,
                  fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer',
                  background: loading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg,#f43f5e,#a855f7)',
                  boxShadow: loading ? 'none' : '0 0 30px rgba(244,63,94,0.35)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                  transition: 'all 0.3s',
                }}
              >
                {loading ? (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                    </svg>
                    Analyzing...
                  </>
                ) : (
                  <>🔬 Analyze with AI</>
                )}
              </button>
            )}

            {result && (
              <button onClick={reset} style={{ marginTop: '14px', width: '100%', padding: '13px', borderRadius: '14px', border: '1px solid rgba(244,63,94,0.25)', background: 'rgba(244,63,94,0.06)', color: '#fb7185', fontWeight: 600, fontSize: '15px', cursor: 'pointer' }}>
                🔄 Analyze Another Image
              </button>
            )}

            {/* Info box */}
            <div style={{ marginTop: '16px', padding: '14px 16px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p style={{ color: '#64748b', fontSize: '12px', margin: 0, lineHeight: 1.7 }}>
                💡 <strong style={{ color: '#94a3b8' }}>Tip:</strong> For best results, upload a clear grayscale ovarian ultrasound image. The AI analyzes follicle count, ovarian volume, and morphology patterns.
              </p>
            </div>
          </div>

          {/* ── RIGHT: Result Panel ── */}
          <div ref={resultRef}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
              <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: 'linear-gradient(135deg,#f43f5e,#a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: 'white' }}>2</div>
              <span style={{ color: 'white', fontWeight: 600, fontSize: '16px' }}>Analysis Result</span>
            </div>

            {/* Empty */}
            {!result && !loading && (
              <div style={{ minHeight: '300px', borderRadius: '18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '14px', padding: '40px' }}>
                <div style={{ fontSize: '48px' }}>📊</div>
                <p style={{ color: '#475569', textAlign: 'center', fontSize: '14px', lineHeight: 1.7, margin: 0 }}>
                  Upload an ultrasound image<br />and click <strong style={{ color: '#94a3b8' }}>Analyze with AI</strong><br />to see your detailed report here
                </p>
              </div>
            )}

            {/* Loading / Progress */}
            {loading && (
              <div style={{ borderRadius: '18px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(244,63,94,0.15)', padding: '32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
                {/* Spinner */}
                <div style={{ position: 'relative', width: '80px', height: '80px' }}>
                  <svg width="80" height="80" viewBox="0 0 80 80" style={{ position: 'absolute', animation: 'spin 1.5s linear infinite' }}>
                    <circle cx="40" cy="40" r="34" fill="none" stroke="rgba(244,63,94,0.15)" strokeWidth="5" />
                    <path d="M40 6a34 34 0 0 1 34 34" fill="none" stroke="#f43f5e" strokeWidth="5" strokeLinecap="round" />
                  </svg>
                  <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '30px' }}>🧠</div>
                </div>

                {/* Step */}
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: 'white', fontWeight: 700, fontSize: '16px', margin: '0 0 6px 0' }}>Analyzing your scan...</p>
                  <p style={{ color: '#f43f5e', fontSize: '13px', margin: 0, minHeight: '20px' }}>{ANALYSIS_STEPS[analysisStep]}</p>
                </div>

                {/* Progress bar */}
                <div style={{ width: '100%' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>Progress</span>
                    <span style={{ color: '#f43f5e', fontSize: '12px', fontWeight: 700 }}>{progress}%</span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg,#f43f5e,#a855f7)', borderRadius: '99px', transition: 'width 0.1s ease' }} />
                  </div>
                </div>

                {/* Steps list */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {ANALYSIS_STEPS.map((step, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', background: i < analysisStep ? 'rgba(34,197,94,0.2)' : i === analysisStep ? 'rgba(244,63,94,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${i < analysisStep ? '#22c55e' : i === analysisStep ? '#f43f5e' : 'rgba(255,255,255,0.1)'}`, color: i < analysisStep ? '#22c55e' : i === analysisStep ? '#f43f5e' : '#475569', fontWeight: 700 }}>
                        {i < analysisStep ? '✓' : i + 1}
                      </div>
                      <span style={{ fontSize: '13px', color: i <= analysisStep ? '#e2e8f0' : '#475569' }}>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── RESULT REPORT ── */}
            {result && (
              <div style={{ opacity: showReport ? 1 : 0, transform: showReport ? 'translateY(0)' : 'translateY(16px)', transition: 'all 0.5s ease', borderRadius: '18px', overflow: 'hidden', border: `1px solid ${result.border}`, background: result.bg }}>

                {/* Result header */}
                <div style={{ padding: '20px 22px', borderBottom: `1px solid ${result.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '24px', marginBottom: '6px' }}>{result.icon}</div>
                      <h3 style={{ color: result.color, fontWeight: 800, fontSize: '22px', margin: '0 0 6px 0' }}>{result.label}</h3>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ padding: '3px 12px', borderRadius: '99px', background: result.badge.bg, color: result.badge.text, fontSize: '12px', fontWeight: 600 }}>Severity: {result.severity}</span>
                        <span style={{ padding: '3px 12px', borderRadius: '99px', background: 'rgba(255,255,255,0.06)', color: '#94a3b8', fontSize: '12px' }}>AI Scan Result</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '10px 16px', borderRadius: '14px', background: result.badge.bg, border: `1px solid ${result.border}` }}>
                      <div style={{ color: result.color, fontWeight: 900, fontSize: '32px', lineHeight: 1 }}>{result.confidence}%</div>
                      <div style={{ color: '#64748b', fontSize: '11px', marginTop: '2px' }}>Confidence</div>
                    </div>
                  </div>

                  {/* Confidence bar */}
                  <div style={{ marginTop: '14px' }}>
                    <div style={{ height: '7px', background: 'rgba(255,255,255,0.07)', borderRadius: '99px', overflow: 'hidden' }}>
                      <div style={{ width: `${result.confidence}%`, height: '100%', background: `linear-gradient(90deg,${result.color},${result.color}aa)`, borderRadius: '99px' }} />
                    </div>
                  </div>
                </div>

                {/* Findings */}
                <div style={{ padding: '18px 22px', borderBottom: `1px solid ${result.border}` }}>
                  <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.8px', margin: '0 0 12px 0' }}>KEY FINDINGS</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                    {result.findings.map((f, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: result.color, flexShrink: 0, marginTop: '6px' }} />
                        <span style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: 1.5 }}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Hormone indicators */}
                <div style={{ padding: '18px 22px', borderBottom: `1px solid ${result.border}` }}>
                  <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.8px', margin: '0 0 12px 0' }}>HORMONE INDICATORS</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {result.hormones.map((h, i) => (
                      <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.03)' }}>
                        <span style={{ color: '#94a3b8', fontSize: '13px' }}>{h.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ color: '#e2e8f0', fontSize: '13px', fontWeight: 600 }}>{h.value}</span>
                          <span style={{ padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, background: `${statusColor[h.status]}22`, color: statusColor[h.status] }}>{statusLabel[h.status]}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div style={{ padding: '18px 22px', borderBottom: `1px solid ${result.border}` }}>
                  <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.8px', margin: '0 0 10px 0' }}>RECOMMENDATION</p>
                  <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>{result.recommendation}</p>
                </div>

                {/* Next Steps */}
                <div style={{ padding: '18px 22px' }}>
                  <p style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700, letterSpacing: '0.8px', margin: '0 0 12px 0' }}>NEXT STEPS</p>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {result.nextSteps.map((step, i) => (
                      <div key={i} style={{ padding: '9px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: `1px solid ${result.border}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ color: result.color, fontSize: '13px', fontWeight: 700 }}>{i + 1}</span>
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>{step}</span>
                      </div>
                    ))}
                  </div>

                  <p style={{ color: '#374151', fontSize: '11px', textAlign: 'center', margin: '16px 0 0 0' }}>
                    ⚠️ This is a prototype for educational use only. Always consult a qualified medical professional.
                  </p>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 700px) {
          .detect-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  )
}
