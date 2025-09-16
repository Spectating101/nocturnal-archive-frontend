import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { message, sessionId } = await req.json()
  
  try {
    // Call our Nocturnal Archive backend with real research capabilities
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000'
    const response = await fetch(`${backendUrl}/api/research`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: message,
        session_id: sessionId,
        user_id: "demo-user", // TODO: Get from auth
        research_type: "comprehensive"
      })
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    return NextResponse.json({
      response: data.research_summary || data.response,
      sources: data.sources || [],
      citations: data.citations || [],
      session_id: data.session_id,
      timestamp: data.timestamp,
      mode: "real_research",
      metadata: data.metadata || {}
    })

  } catch (error) {
    console.error('Nocturnal Archive chat error:', error)
    
    // Fallback to demo mode if real research fails
    try {
      const fallbackResponse = await fetch(`${backendUrl}/api/chat`, {
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
    
    // Demo mode with canned responses
    const demoResponses = {
      "hello": {
        response: "Hello! I'm the Nocturnal Archive research assistant. I can help you with academic research, literature reviews, and knowledge synthesis. Try asking me about a specific research topic!",
        sources: [
          { title: "Welcome to Nocturnal Archive", url: "#", year: "2024" }
        ]
      },
      "machine learning": {
        response: "Machine learning is a subset of artificial intelligence that focuses on algorithms that can learn from data. Here are some key areas:\n\n1. **Supervised Learning**: Learning with labeled examples (classification, regression)\n2. **Unsupervised Learning**: Finding patterns in unlabeled data (clustering, dimensionality reduction)\n3. **Deep Learning**: Neural networks with multiple layers for complex pattern recognition\n\nRecent advances include transformer architectures, federated learning, and explainable AI.",
        sources: [
          { title: "The Elements of Statistical Learning", url: "#", year: "2017" },
          { title: "Deep Learning", url: "#", year: "2016" },
          { title: "Attention Is All You Need", url: "#", year: "2017" }
        ]
      },
      "research": {
        response: "I can help you with comprehensive academic research! Here's what I can do:\n\n• **Literature Reviews**: Find and synthesize relevant papers\n• **Citation Analysis**: Track research impact and connections\n• **Knowledge Synthesis**: Combine insights from multiple sources\n• **Research Gaps**: Identify areas needing further investigation\n\nWhat specific research topic would you like to explore?",
        sources: [
          { title: "How to Write a Literature Review", url: "#", year: "2020" },
          { title: "Research Methods in Education", url: "#", year: "2018" }
        ]
      }
    }
    
    // Check for demo responses
    const lowerMessage = message.toLowerCase()
    let demoResponse = null
    
    for (const [key, response] of Object.entries(demoResponses)) {
      if (lowerMessage.includes(key)) {
        demoResponse = response
        break
      }
    }
    
    if (!demoResponse) {
      demoResponse = {
        response: "I'm currently in demo mode. Here's what I can help you with:\n\n• Academic research and literature reviews\n• Machine learning and AI topics\n• Scientific knowledge synthesis\n• Citation analysis and research gaps\n\nTry asking about 'machine learning', 'research methods', or any academic topic!",
        sources: [
          { title: "Nocturnal Archive Demo", url: "#", year: "2024" }
        ]
      }
    }
    
    return NextResponse.json({
      response: demoResponse.response,
      sources: demoResponse.sources,
      session_id: sessionId || 'demo-session',
      timestamp: new Date().toISOString(),
      mode: "demo_mode",
      note: "Demo mode - Backend connection unavailable"
    })
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
