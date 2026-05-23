'use client'
import { useState, useRef, useEffect } from 'react'

const SUGGESTED_QUESTIONS = [
  'What is the difference between PCOS and PCOD?',
  'What are common symptoms of PCOS?',
  'Can PCOS affect fertility?',
  'What diet is best for PCOS?',
  'How is PCOS diagnosed?',
  'What exercises help with PCOD?',
]

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Hello! 👋 I'm your PCOS/PCOD AI health assistant. I can answer your questions about symptoms, diagnosis, diet, lifestyle, and more. Remember — I'm here to educate, not replace a doctor. How can I help you today?",
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const chatEndRef = useRef(null)

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async (text) => {
    const userText = (text || input).trim()
    if (!userText || loading) return

    const userMsg = { role: 'user', content: userText }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
        }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Failed to get response')

      setMessages((prev) => [...prev, { role: 'assistant', content: data.message }])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: '⚠️ Error: ' + (err.message || 'Check your API key in .env.local') },
      ])
    }

    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0f0a1e 0%, #1a0f2e 50%, #0f0a1e 100%)', display: 'flex', flexDirection: 'column' }}>
   

      <div style={{ flex: 1, paddingTop: '90px', paddingBottom: '24px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '780px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'linear-gradient(135deg, #f43f5e, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <div>
            <h1 style={{ color: 'white', fontWeight: 700, fontSize: '22px', margin: 0 }}>PCOS/PCOD AI Assistant</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              <span style={{ color: '#4ade80', fontSize: '12px' }}>AI Online</span>
            </div>
          </div>
        </div>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div style={{ marginBottom: '16px' }}>
            <p style={{ color: '#6b7280', fontSize: '12px', marginBottom: '8px' }}>💡 Tap a question to get started:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {SUGGESTED_QUESTIONS.map((q) => (
                <button key={q} onClick={() => sendMessage(q)}
                  style={{ padding: '7px 14px', borderRadius: '20px', border: '1px solid rgba(244, 63, 94, 0.25)', background: 'rgba(244, 63, 94, 0.06)', color: '#d1d5db', fontSize: '12px', cursor: 'pointer' }}>
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Window */}
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(244, 63, 94, 0.12)', borderRadius: '20px', padding: '20px', overflowY: 'auto', marginBottom: '16px', minHeight: '360px', maxHeight: 'calc(100vh - 400px)', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ display: 'flex', gap: '10px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row', alignItems: 'flex-start' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, background: msg.role === 'user' ? 'linear-gradient(135deg, #f43f5e, #a855f7)' : 'rgba(255,255,255,0.07)', border: msg.role === 'user' ? 'none' : '1px solid rgba(244, 63, 94, 0.2)', color: msg.role === 'user' ? 'white' : '#f87171' }}>
                {msg.role === 'user' ? 'You' : 'AI'}
              </div>
              <div style={{ maxWidth: '75%', padding: '12px 16px', borderRadius: msg.role === 'user' ? '18px 4px 18px 18px' : '4px 18px 18px 18px', fontSize: '14px', lineHeight: '1.6', background: msg.role === 'user' ? 'linear-gradient(135deg, #f43f5e, #a855f7)' : 'rgba(255,255,255,0.05)', border: msg.role === 'user' ? 'none' : '1px solid rgba(244, 63, 94, 0.15)', color: 'white', whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(244, 63, 94, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700, color: '#f87171', flexShrink: 0 }}>AI</div>
              <div style={{ padding: '14px 18px', borderRadius: '4px 18px 18px 18px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(244, 63, 94, 0.15)', display: 'flex', gap: '5px', alignItems: 'center' }}>
                {[0, 1, 2].map((i) => (
                  <span key={i} style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#f43f5e', display: 'inline-block', animation: 'typingDot 1.4s infinite ease-in-out', animationDelay: `${i * 0.2}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ display: 'flex', gap: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(244, 63, 94, 0.2)', borderRadius: '16px', padding: '10px 12px', alignItems: 'flex-end' }}>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown}
            placeholder="Ask anything about PCOS or PCOD..." rows={1}
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'white', fontSize: '14px', resize: 'none', lineHeight: '1.5', padding: '4px 0', maxHeight: '100px', fontFamily: 'inherit' }} />
          <button onClick={() => sendMessage()} disabled={!input.trim() || loading}
            style={{ width: '40px', height: '40px', borderRadius: '12px', background: input.trim() && !loading ? 'linear-gradient(135deg, #f43f5e, #a855f7)' : 'rgba(255,255,255,0.08)', border: 'none', cursor: input.trim() && !loading ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>

        <p style={{ textAlign: 'center', color: '#374151', fontSize: '11px', marginTop: '10px' }}>⚠️ For educational purposes only — not a substitute for medical advice.</p>
      </div>

      <style>{`
        @keyframes typingDot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
