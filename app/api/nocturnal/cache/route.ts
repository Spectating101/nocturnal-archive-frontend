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
    const topic = url.searchParams.get("topic") || ""
    const questions = url.searchParams.get("questions") || ""
    if (!topic) {
      return new Response(JSON.stringify({ message: "Missing topic" }), {
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

    const qs = new URLSearchParams()
    qs.set("topic", topic)
    if (questions) qs.set("questions", questions)

    const res = await fetch(`${backendUrl}/api/cache/lookup?${qs.toString()}`)
    const text = await res.text()
    return new Response(text, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("content-type") || "application/json"
      }
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({ message: error?.message || "Cache error" }),
      { status: 500 }
    )
  }
}
