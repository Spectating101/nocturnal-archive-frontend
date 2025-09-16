export interface StreamingResponse {
  delta: string;
  done?: boolean;
  citations?: any[];
  metadata?: any;
  traceId?: string;
}

export class StreamingReader {
  private reader: ReadableStreamDefaultReader<Uint8Array>;
  private decoder: TextDecoder;
  private buffer: string = '';

  constructor(stream: ReadableStream<Uint8Array>) {
    this.reader = stream.getReader();
    this.decoder = new TextDecoder();
  }

  async *read(): AsyncGenerator<StreamingResponse> {
    try {
      while (true) {
        const { done, value } = await this.reader.read();
        
        if (done) break;
        
        this.buffer += this.decoder.decode(value, { stream: true });
        
        // Process complete lines
        const lines = this.buffer.split('\n');
        this.buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = line.slice(6); // Remove 'data: ' prefix
              if (data === '[DONE]') {
                yield { delta: '', done: true };
                return;
              }
              
              const parsed = JSON.parse(data);
              yield parsed;
            } catch (error) {
              console.warn('Failed to parse SSE data:', error);
            }
          }
        }
      }
    } finally {
      this.reader.releaseLock();
    }
  }
}

export async function* streamResearch(payload: {
  query: string;
  mode?: string;
  history?: any[];
  session_id?: string;
  user_id?: string;
}): AsyncGenerator<StreamingResponse> {
  const base = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
  
  try {
    const response = await fetch(`${base}/api/research/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Cache-Control': 'no-cache',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('No response body');
    }

    const streamReader = new StreamingReader(response.body);
    
    for await (const chunk of streamReader.read()) {
      yield chunk;
    }
  } catch (error) {
    console.error('Streaming error:', error);
    throw error;
  }
}
