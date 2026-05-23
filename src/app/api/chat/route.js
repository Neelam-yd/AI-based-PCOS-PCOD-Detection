import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are a compassionate and knowledgeable AI health assistant specializing in PCOS (Polycystic Ovary Syndrome) and PCOD (Polycystic Ovarian Disease).

You help users understand:
- The difference between PCOS and PCOD
- Symptoms, causes, and risk factors
- Diagnosis methods including ultrasound and blood tests
- Treatment options (medical and lifestyle)
- Diet and nutrition advice for managing PCOS/PCOD
- Exercise recommendations
- Hormonal imbalances and how to manage them
- Fertility concerns and options
- Mental health and emotional support
- When to see a doctor

Always be empathetic, warm, and supportive. Use simple language that anyone can understand.
Keep responses clear and helpful — around 3-5 sentences unless a detailed answer is needed.
IMPORTANT: Always remind users to consult a qualified gynecologist or endocrinologist for actual diagnosis and treatment. Never diagnose anyone yourself.`

export async function POST(request) {
  try {
    const { messages } = await request.json()

    const apiKey = process.env.ANTHROPIC_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured. Please add ANTHROPIC_API_KEY to your .env.local file.' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: messages,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Anthropic API error:', errorData)
      return NextResponse.json(
        { error: 'Failed to get response from AI. Check your API key.' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const aiMessage = data.content?.[0]?.text || 'Sorry, I could not generate a response.'

    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Server error. Please try again.' },
      { status: 500 }
    )
  }
}
