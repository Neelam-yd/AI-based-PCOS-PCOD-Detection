'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { href: '/', label: '🏠 Home' },
    { href: '/detection', label: '🔬 Detection' },
    { href: '/chatbot', label: '💬 AI Chatbot' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'rgba(13, 7, 24, 0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(244, 63, 94, 0.18)',
        boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 24px', height: '66px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

          {/* LOGO */}
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '11px', background: 'linear-gradient(135deg, #f43f5e, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(244,63,94,0.4)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <circle cx="12" cy="12" r="3" />
                <path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" />
              </svg>
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '19px', color: 'white', letterSpacing: '-0.5px' }}>
                PCOS<span style={{ background: 'linear-gradient(135deg,#f43f5e,#a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
              </span>
              <div style={{ fontSize: '10px', color: '#6b7280', letterSpacing: '0.5px', marginTop: '-3px' }}>Detection System</div>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }} className="nav-desktop">
            {links.map((link) => {
              const isActive = pathname === link.href
              return (
                <Link key={link.href} href={link.href} style={{
                  textDecoration: 'none',
                  padding: '9px 18px',
                  borderRadius: '11px',
                  fontSize: '14px',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  background: isActive ? 'rgba(244, 63, 94, 0.18)' : 'transparent',
                  color: isActive ? '#fb7185' : '#9ca3af',
                  border: isActive ? '1px solid rgba(244, 63, 94, 0.35)' : '1px solid transparent',
                }}>
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* HAMBURGER (mobile) */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="nav-hamburger"
            style={{ background: 'none', border: '1px solid rgba(244,63,94,0.2)', cursor: 'pointer', padding: '8px 10px', borderRadius: '10px', display: 'none', flexDirection: 'column', gap: '5px' }}>
            <div style={{ width: '20px', height: '2px', background: menuOpen ? '#f43f5e' : 'white', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }} />
            <div style={{ width: '20px', height: '2px', background: menuOpen ? '#f43f5e' : 'white', borderRadius: '2px', transition: 'all 0.3s', opacity: menuOpen ? 0 : 1 }} />
            <div style={{ width: '20px', height: '2px', background: menuOpen ? '#f43f5e' : 'white', borderRadius: '2px', transition: 'all 0.3s', transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }} />
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div style={{ background: 'rgba(13, 7, 24, 0.98)', borderTop: '1px solid rgba(244,63,94,0.1)', padding: '10px 24px 20px' }}>
            {links.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}
                style={{ display: 'block', padding: '14px 0', textDecoration: 'none', color: pathname === link.href ? '#fb7185' : '#9ca3af', fontSize: '15px', fontWeight: 500, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                {link.label}
              </Link>
            ))}
          </div>
        )}

        <style>{`
          @media (max-width: 640px) {
            .nav-desktop { display: none !important; }
            .nav-hamburger { display: flex !important; }
          }
        `}</style>
      </nav>
    </>
  )
}
