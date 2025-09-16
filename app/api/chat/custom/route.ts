import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
  const { messages, user_id, workspace_id, chatSettings } = await req.json()

  try {
    // Forward request to our Nocturnal Archive API
    const response = await fetch(
      process.env.NEXT_PUBLIC_NOCTURNAL_API_URL ||
        "http://localhost:8000/api/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages, user_id, workspace_id, chatSettings })
      }
    )

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      {
        error: "An error occurred during your request."
      },
      { status: 500 }
    )
  }
}
