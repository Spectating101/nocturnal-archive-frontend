import { ServerRuntime } from "next"
import dns from "node:dns"

export const runtime: ServerRuntime = "nodejs"

const ipv4Lookup = (host: string) =>
  new Promise<string>(resolve =>
    dns.lookup(host, { family: 4, all: false }, (err, address) => {
      if (err || !address) return resolve(host)
      resolve(address as unknown as string)
    })
  )

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const sessionId = url.searchParams.get("sessionId")
    if (!sessionId) {
      return new Response(JSON.stringify({ message: "Missing sessionId" }), {
        status: 400
      })
    }

    const rawApiUrl = process.env.NEXT_PUBLIC_NOCTURNAL_API_URL
    const baseUrl =
      process.env.NODE_ENV === "development"
        ? "http://127.0.0.1:8000"
        : rawApiUrl || "http://127.0.0.1:8000"
    const nocturnalApiUrl = baseUrl.replace("localhost", "127.0.0.1")

    const backendUrl = nocturnalApiUrl.includes("127.0.0.1")
      ? nocturnalApiUrl
      : `http://${await ipv4Lookup(nocturnalApiUrl.replace(/^https?:\/\//, ""))}`

    const res = await fetch(
      `${backendUrl}/api/session/${encodeURIComponent(sessionId)}/synthesis`
    )
    const text = await res.text()
    return new Response(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json"
      }
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error?.message || "Synthesis error" }),
      { status: 500 }
    )
  }
}
