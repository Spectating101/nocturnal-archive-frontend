"use client"

import { useState, useEffect, useCallback } from "react"
import MobileOptimizedChat from "@/components/MobileOptimizedChat"
import { askResearch, checkHealth, type ResearchResponse, type Citation } from "@/lib/api"
import { analytics, performanceMonitor } from "@/lib/analytics"

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
  isStreaming?: boolean;
  sessionId?: string;
}

export default function MobileResearchPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<"ok" | "degraded" | "down">("down");
  const [demoMode, setDemoMode] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  // Check health on component mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const health = await checkHealth();
        setHealthStatus(health.status);
        setDemoMode(health.status !== "ok");
      } catch (err) {
        setHealthStatus("down");
        setDemoMode(true);
      }
    };

    checkBackendHealth();
    analytics.trackSessionStart();
    performanceMonitor.measurePageLoad();
  }, []);

  const suggestions = [
    "Machine learning advances",
    "Quantum computing research",
    "AI in healthcare",
    "Climate change solutions",
    "Space exploration"
  ];

  const handleSend = async (query: string) => {
    if (!query.trim() || loading) return;

    const sessionId = currentSessionId || `mobile-session-${Date.now()}`;
    setCurrentSessionId(sessionId);

    // Track research query
    analytics.trackResearchQuery(query, 'mobile');
    performanceMonitor.mark('mobile-research-start');

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      type: 'user',
      content: query,
      timestamp: new Date(),
      sessionId
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    const assistantMessageId = `assistant-${Date.now()}`;
    const assistantMessage: Message = {
      id: assistantMessageId,
      type: 'assistant',
      content: '',
      citations: [],
      timestamp: new Date(),
      isStreaming: true,
      sessionId
    };

    setMessages(prev => [...prev, assistantMessage]);

    try {
      if (demoMode) {
        // Demo mode with simulated streaming
        await simulateMobileResponse(assistantMessageId, query);
      } else {
        // Real API call
        const response = await askResearch({
          query,
          mode: "academic",
          history: messages.filter(m => m.type === 'user').map(m => m.content),
          session_id: sessionId,
          user_id: "mobile-user"
        });

        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: response.answer, citations: response.citations, isStreaming: false }
            : msg
        ));
      }
    } catch (err: any) {
      setError(err.message || "Failed to get research response");
      analytics.trackError(err.message, 'mobile-research-query');
      
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, isStreaming: false, content: "Sorry, I encountered an error. Please try again." }
          : msg
      ));
    } finally {
      setLoading(false);
      const responseTime = performanceMonitor.measure('mobile-research-response', 'mobile-research-start');
      analytics.trackResearchResponse(responseTime, 0, demoMode ? 'demo' : 'real');
    }
  };

  const simulateMobileResponse = async (messageId: string, query: string) => {
    const demoResponses = {
      "machine learning": "Machine learning is transforming how we process data and make decisions. Recent advances include transformer architectures, federated learning, and explainable AI systems.",
      "quantum computing": "Quantum computing represents a paradigm shift in computational power. Current research focuses on error correction, quantum algorithms, and building scalable quantum systems.",
      "ai in healthcare": "AI is revolutionizing healthcare through diagnostic imaging, drug discovery, and personalized treatment plans. Key areas include medical imaging analysis and predictive analytics.",
      "climate change": "Climate change research encompasses renewable energy, carbon capture, and sustainable technologies. Recent focus areas include green hydrogen, battery storage, and climate modeling.",
      "space exploration": "Space exploration is advancing through private companies and international collaboration. Key developments include reusable rockets, Mars missions, and space-based solar power."
    };

    const lowerQuery = query.toLowerCase();
    let response = "I can help you with comprehensive academic research. Here's what I found based on your query...";
    
    for (const [key, value] of Object.entries(demoResponses)) {
      if (lowerQuery.includes(key)) {
        response = value;
        break;
      }
    }

    // Simulate streaming for mobile
    let currentContent = "";
    for (let i = 0; i <= response.length; i++) {
      currentContent = response.slice(0, i);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: currentContent }
          : msg
      ));
      await new Promise(resolve => setTimeout(resolve, 30)); // Slightly slower for mobile
    }

    // Add citations
    const citations = [
      {
        title: "Recent Advances in Research",
        authors: ["Smith, J.", "Doe, A."],
        venue: "Nature",
        year: 2024,
        doi: "10.1038/s41586-024-00000-0",
        url: "https://example.com/paper1"
      }
    ];

    setMessages(prev => prev.map(msg => 
      msg.id === messageId 
        ? { ...msg, isStreaming: false, citations }
        : msg
    ));
  };

  return (
    <div className="h-screen md:hidden">
      <MobileOptimizedChat
        messages={messages}
        onSend={handleSend}
        loading={loading}
        suggestions={suggestions}
      />
      
      {/* Error Toast for Mobile */}
      {error && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-red-900/90 backdrop-blur-sm border border-red-500/50 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1">
              <h4 className="text-sm font-medium text-red-100">Research Error</h4>
              <p className="text-sm text-red-200 mt-1">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-300 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Demo Mode Banner */}
      {demoMode && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-yellow-500/20 border-b border-yellow-500/30 p-2">
          <div className="text-center">
            <span className="text-sm text-yellow-300">Demo Mode - Backend unavailable</span>
          </div>
        </div>
      )}
    </div>
  );
}
