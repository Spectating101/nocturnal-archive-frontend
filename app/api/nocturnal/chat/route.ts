import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message, sessionId } = await req.json()
  
  try {
    // Call our Nocturnal Archive backend with real research capabilities
    const response = await fetch('http://127.0.0.1:8002/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        session_id: sessionId
      })
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      response: data.response,
      session_id: data.session_id,
      timestamp: data.timestamp,
      mode: data.mode || "real_research"
    })

  } catch (error) {
    console.error('Nocturnal Archive chat error:', error)
    
    // Fallback to demo mode if real research fails
    try {
      const fallbackResponse = await fetch('http://127.0.0.1:8002/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          session_id: sessionId
        })
      })

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json()
        return NextResponse.json({
          response: fallbackData.response,
          session_id: fallbackData.session_id,
          timestamp: fallbackData.timestamp,
          mode: "demo_fallback"
        })
      }
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError)
    }
    
    return NextResponse.json(
      {
        error: 'Failed to process message',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'Nocturnal Archive Chat API',
    version: '2.0.0',
    endpoints: {
      POST: '/api/nocturnal/chat - Send a message to the research assistant (Real Research Mode)'
    }
  })
}
