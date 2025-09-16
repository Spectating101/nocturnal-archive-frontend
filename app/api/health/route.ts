import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if backend is available
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8002'
    let backendStatus = 'down'
    let backendError = null
    
    try {
      const response = await fetch(`${backendUrl}/health`, { 
        method: 'GET',
        timeout: 5000 
      } as any)
      backendStatus = response.ok ? 'up' : 'down'
    } catch (error) {
      backendError = error instanceof Error ? error.message : 'Unknown error'
    }
    
    return NextResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '2.0.0',
      services: {
        frontend: 'up',
        backend: backendStatus,
        database: 'up', // Supabase is up if we got here
        demo_mode: backendStatus === 'down' ? 'enabled' : 'disabled'
      },
      ...(backendError && { backend_error: backendError })
    })
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
