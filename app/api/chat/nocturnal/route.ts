import { checkApiKey, getServerProfile } from "@/lib/server/server-chat-helpers"
import { ChatSettings } from "@/types"
import { StreamingTextResponse } from "ai"
import { ServerRuntime } from "next"
import dns from "node:dns"

export const runtime: ServerRuntime = "nodejs"

// Force IPv4 to avoid ::1 resolution issues in some environments (best-effort)
const ipv4Lookup = (host: string) =>
  new Promise<string>(resolve =>
    dns.lookup(host, { family: 4, all: false }, (err, address) => {
      if (err || !address) return resolve(host)
      resolve(address as unknown as string)
    })
  )

export async function POST(request: Request) {
  const json = await request.json()
  const { chatSettings, messages } = json as {
    chatSettings: ChatSettings
    messages: any[]
  }

  try {
    const isDev = process.env.NODE_ENV === "development"
    let profile
    if (isDev) {
      // Always use a mock profile in development to avoid Supabase dependency
      profile = {
        id: "dev-user",
        user_id: "dev-user",
        email: "dev@example.com",
        full_name: "Development User",
        avatar_url: null,
        created_at: "2024-01-01T00:00:00.000Z",
        updated_at: "2024-01-01T00:00:00.000Z"
      }
    } else {
      profile = await getServerProfile()
    }

    // Check if we have the Nocturnal API configured
    const rawApiUrl = process.env.NEXT_PUBLIC_NOCTURNAL_API_URL
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:8000"
        : rawApiUrl || "http://127.0.0.1:8000"
    const nocturnalApiUrl = baseUrl.replace("localhost", "127.0.0.1")
    const nocturnalApiKey = process.env.NOCTURNAL_API_KEY

    // Prepare the request for your research backend
    const researchRequest = {
      messages: messages,
      chatSettings: chatSettings,
      user_id: profile.id,
      workspace_id: profile.id // You might want to pass actual workspace ID
    }

    console.log("Calling research backend with:", researchRequest)

    // Call your research backend
    // Resolve IPv4 best-effort if a hostname is used
    const backendUrl = nocturnalApiUrl.includes("127.0.0.1")
      ? nocturnalApiUrl
      : `http://${await ipv4Lookup(nocturnalApiUrl.replace(/^https?:\/\//, ""))}`

    const response = await fetch(`${backendUrl}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(nocturnalApiKey && { Authorization: `Bearer ${nocturnalApiKey}` })
      },
      body: JSON.stringify(researchRequest)
    })

    console.log("Research backend response status:", response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Research backend error:", errorText)
      throw new Error(
        `Research backend error: ${response.status} ${response.statusText}`
      )
    }

    // In Node.js runtime, just pass through the backend JSON/text (avoid Web Streams incompatibility)
    const text = await response.text()
    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "application/json"
      }
    })
  } catch (error: any) {
    console.error("Nocturnal API route error:", error)
    let errorMessage = error.message || "An unexpected error occurred"
    const errorCode = error.status || 500

    if (errorMessage.toLowerCase().includes("api key not found")) {
      errorMessage =
        "Nocturnal API Key not found. Please set it in your environment variables."
    } else if (errorMessage.toLowerCase().includes("connection refused")) {
      errorMessage =
        "Cannot connect to research backend. Please ensure it's running on the configured URL."
    }

    return new Response(JSON.stringify({ message: errorMessage }), {
      status: errorCode
    })
  }
}
