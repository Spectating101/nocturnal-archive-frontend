export interface ResearchRequest {
  query: string;
  mode?: string;
  history?: any[];
  session_id?: string;
  user_id?: string;
}

export interface Citation {
  title: string;
  authors?: string[];
  venue?: string;
  year?: number;
  doi?: string;
  url?: string;
}

export interface ResearchResponse {
  answer: string;
  citations: Citation[];
  traceId?: string;
  session_id?: string;
  timestamp?: string;
  metadata?: any;
}

export async function askResearch(payload: ResearchRequest): Promise<ResearchResponse> {
  const base = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  const r = await fetch(`${base}/api/research`, {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify(payload),
  });
  
  const traceId = r.headers.get("x-trace-id") ?? undefined;
  
  if (!r.ok) {
    const error = new Error(`HTTP ${r.status}: ${r.statusText}`);
    (error as any).traceId = traceId;
    (error as any).status = r.status;
    throw error;
  }
  
  const json = await r.json();
  return { ...json, traceId };
}

export async function checkHealth(): Promise<{status: "ok" | "degraded" | "down"}> {
  const base = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  try {
    const r = await fetch(`${base}/api/health`, {
      method: "GET",
      headers: {"Content-Type": "application/json"},
    });
    
    if (!r.ok) {
      return { status: "down" };
    }
    
    const json = await r.json();
    return { status: json.status || "down" };
  } catch (error) {
    return { status: "down" };
  }
}
