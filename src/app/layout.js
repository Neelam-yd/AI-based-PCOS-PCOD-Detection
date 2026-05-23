import './globals.css'


export const metadata = {
  title: 'PCOS / PCOD AI Detection',
  description: 'AI-powered PCOS/PCOD detection from ultrasound images',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {/* Navbar is here in layout so it appears on EVERY page automatically */}
      
        <main>
          {children}
        </main>
      </body>
    </html>
  )
}
