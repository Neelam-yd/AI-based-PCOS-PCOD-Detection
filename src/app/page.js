import Link from 'next/link'

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #0d0718 0%, #150d2a 50%, #0d0718 100%)' }}>

      {/* HERO */}
      <section style={{ paddingTop: '120px', paddingBottom: '80px', textAlign: 'center', padding: '120px 24px 80px' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>

          {/* Badge 
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '6px 16px', borderRadius: '99px',
            background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.25)',
            marginBottom: '28px',
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#f43f5e', display: 'inline-block', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#f87171', fontSize: '13px', fontWeight: 500 }}>AI-Powered Medical Detection System</span>
          </div>*/}

          <h1 style={{ fontSize: 'clamp(36px, 7vw, 64px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '20px' }}>
            Detect{' '}
            <span className="gradient-text">PCOS / PCOD</span>
            <br />with AI Precision
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '18px', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto 40px' }}>
            Upload your ultrasound scan and get an instant AI analysis.
            Ask our intelligent chatbot any PCOS/PCOD health questions.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/assessment" className="px-8 py-4 rounded-xl text-white font-semibold text-lg inline-flex items-center gap-2 glass border border-rose-500/20 hover:border-rose-500/50 transition-all">
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
  Take Assessment
</Link>
            <Link href="/detection" className="btn-glow" style={{
              textDecoration: 'none', color: 'white', fontWeight: 600,
              padding: '14px 32px', borderRadius: '12px', fontSize: '16px',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
            }}>
              🔬 Start Detection
            </Link>
            <Link href="/chatbot" style={{
              textDecoration: 'none', color: '#e2e8f0', fontWeight: 600,
              padding: '14px 32px', borderRadius: '12px', fontSize: '16px',
              background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(244,63,94,0.25)',
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              transition: 'all 0.25s',
            }}>
              💬 Ask AI Chatbot
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {[
            { val: '95%', label: 'Accuracy' },
            { val: '< 3s', label: 'Analysis Time' },
            { val: '24/7', label: 'AI Chatbot' },
          ].map((s) => (
            <div key={s.label} className="glass" style={{ padding: '24px 16px', textAlign: 'center' }}>
              <div className="gradient-text" style={{ fontSize: '28px', fontWeight: 800, marginBottom: '4px' }}>{s.val}</div>
              <div style={{ color: '#64748b', fontSize: '13px' }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '0 24px 60px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '30px', fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: '8px' }}>How It Works</h2>
          <p style={{ color: '#64748b', textAlign: 'center', marginBottom: '40px' }}>3 simple steps to get your analysis</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
            {[
              { icon: '📤', step: '01', title: 'Upload Image', desc: 'Upload your ovarian ultrasound scan in JPG or PNG format.' },
              { icon: '🧠', step: '02', title: 'AI Analyzes', desc: 'Our model scans for follicle patterns, cyst indicators, and ovarian morphology.' },
              { icon: '📋', step: '03', title: 'Get Report', desc: 'Receive a detailed report with confidence score, findings, and recommendations.' },
            ].map((f) => (
              <div key={f.step} className="glass" style={{ padding: '28px 24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{f.icon}</div>
                <div style={{ color: '#374151', fontSize: '36px', fontWeight: 800, lineHeight: 1, marginBottom: '8px' }}>{f.step}</div>
                <h3 style={{ color: 'white', fontWeight: 600, fontSize: '16px', marginBottom: '8px' }}>{f.title}</h3>
                <p style={{ color: '#64748b', fontSize: '14px', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHATBOT BANNER */}
      <section style={{ padding: '0 24px 80px' }}>
        <div style={{
          maxWidth: '800px', margin: '0 auto', textAlign: 'center',
          padding: '48px 32px', borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(244,63,94,0.12), rgba(168,85,247,0.12))',
          border: '1px solid rgba(244,63,94,0.25)',
        }}>
          <h2 style={{ fontSize: '26px', fontWeight: 700, color: 'white', marginBottom: '10px' }}>Have Questions About PCOS / PCOD?</h2>
          <p style={{ color: '#94a3b8', marginBottom: '24px' }}>Our AI chatbot is available 24/7 to answer your health questions</p>
          <Link href="/chatbot" className="btn-glow" style={{
            textDecoration: 'none', color: 'white', fontWeight: 600,
            padding: '12px 28px', borderRadius: '10px', fontSize: '15px', display: 'inline-block',
          }}>
            Chat with AI →
          </Link>
        </div>
      </section>

     
    </div>
  )
}
