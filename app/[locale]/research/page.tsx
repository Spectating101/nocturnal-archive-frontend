"use client"

import { useState, useEffect } from "react"
import { IconBrain, IconSend, IconLoader2, IconInfoCircle, IconHistory, IconSettings } from "@tabler/icons-react"
import CitationList from "@/components/CitationList"
import ErrorToast from "@/components/ErrorToast"
import { askResearch, checkHealth, type ResearchResponse, type Citation } from "@/lib/api"

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  timestamp: Date;
}

export default function ResearchPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [traceId, setTraceId] = useState<string | undefined>();
  const [healthStatus, setHealthStatus] = useState<"ok" | "degraded" | "down">("down");
  const [demoMode, setDemoMode] = useState(false);

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
  }, []);

  const demoResponses = {
    "machine learning": {
      answer: "Machine learning is a subset of artificial intelligence that focuses on algorithms that can learn from data. Here are key areas:\n\n1. **Supervised Learning**: Learning with labeled examples (classification, regression)\n2. **Unsupervised Learning**: Finding patterns in unlabeled data (clustering, dimensionality reduction)\n3. **Deep Learning**: Neural networks with multiple layers for complex pattern recognition\n\nRecent advances include transformer architectures, federated learning, and explainable AI.",
      citations: [
        {
          title: "The Elements of Statistical Learning",
          authors: ["Hastie, T.", "Tibshirani, R.", "Friedman, J."],
          venue: "Springer",
          year: 2017,
          doi: "10.1007/978-0-387-84858-7",
          url: "https://web.stanford.edu/~hastie/ElemStatLearn/"
        },
        {
          title: "Deep Learning",
          authors: ["Goodfellow, I.", "Bengio, Y.", "Courville, A."],
          venue: "MIT Press",
          year: 2016,
          url: "https://www.deeplearningbook.org/"
        }
      ]
    },
    "research": {
      answer: "I can help you with comprehensive academic research! Here's what I can do:\n\n• **Literature Reviews**: Find and synthesize relevant papers\n• **Citation Analysis**: Track research impact and connections\n• **Knowledge Synthesis**: Combine insights from multiple sources\n• **Research Gaps**: Identify areas needing further investigation\n\nWhat specific research topic would you like to explore?",
      citations: [
        {
          title: "How to Write a Literature Review",
          authors: ["Ridley, D."],
          venue: "SAGE Publications",
          year: 2020,
          url: "https://us.sagepub.com/en-us/nam/how-to-write-a-literature-review/book258154"
        }
      ]
    }
  };

  const handleSubmit = async () => {
    if (!query.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: query,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setError(null);

    try {
      let response: ResearchResponse;

      if (demoMode) {
        // Demo mode - use canned responses
        const lowerQuery = query.toLowerCase();
        let demoResponse = demoResponses["research"]; // default
        
        for (const [key, value] of Object.entries(demoResponses)) {
          if (lowerQuery.includes(key)) {
            demoResponse = value;
            break;
          }
        }

        response = {
          answer: demoResponse.answer,
          citations: demoResponse.citations,
          session_id: "demo-session",
          timestamp: new Date().toISOString()
        };
      } else {
        // Real backend call
        response = await askResearch({
          query,
          mode: "academic",
          history: messages.filter(m => m.type === 'user').map(m => m.content),
          session_id: "research-session",
          user_id: "demo-user"
        });
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: response.answer,
        citations: response.citations,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setQuery("");
    } catch (err: any) {
      setError(err.message || "Failed to get research response");
      setTraceId(err.traceId);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = messages.filter(m => m.type === 'user').pop();
      if (lastUserMessage) {
        setQuery(lastUserMessage.content);
        handleSubmit();
      }
    }
  };

  const handleDemoFallback = () => {
    setDemoMode(true);
    setError(null);
    handleSubmit();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <IconBrain className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">AI Research Assistant</h1>
            </div>
            <div className="flex items-center space-x-2">
              {demoMode && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <IconInfoCircle className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-yellow-300">Demo Mode</span>
                </div>
              )}
              <div className={`w-2 h-2 rounded-full ${
                healthStatus === "ok" ? "bg-green-400" : 
                healthStatus === "degraded" ? "bg-yellow-400" : "bg-red-400"
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex-1 flex">
        {/* Left Column - Chat Interface */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 flex flex-col p-6">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-4 pr-4">
              {messages.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <IconBrain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Start Your Research</h3>
                    <p className="text-gray-400 max-w-md">
                      Ask me anything about academic research. I can help with literature reviews, 
                      finding papers, and synthesizing information from multiple sources.
                    </p>
                  </div>
                </div>
              )}

              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                    {message.type === 'user' ? (
                      <div className="bg-blue-600 text-white rounded-lg p-3">
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                      </div>
                    ) : (
                      <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                        <div className="prose prose-invert max-w-none">
                          <div className="whitespace-pre-wrap text-white text-sm">{message.content}</div>
                        </div>
                        {message.citations && message.citations.length > 0 && (
                          <CitationList items={message.citations} />
                        )}
                      </div>
                    )}
                    <div className={`text-xs text-gray-500 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/10 max-w-[80%]">
                    <div className="flex items-center space-x-2 text-gray-300">
                      <IconLoader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm">Researching your question...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex-shrink-0 pt-4">
              <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                <div className="space-y-3">
                  <textarea
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a research question..."
                    className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={2}
                    disabled={loading}
                  />
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Press Enter to send • Shift+Enter for new line
                    </div>
                    <button
                      onClick={handleSubmit}
                      disabled={loading || !query.trim()}
                      className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? (
                        <IconLoader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <IconSend className="w-4 h-4" />
                      )}
                      <span>{loading ? "Researching..." : "Ask"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Tools & Info */}
        <div className="w-80 border-l border-gray-800 bg-gray-900/50 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <button className="w-full text-left px-3 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors text-sm">
                  <IconHistory className="w-4 h-4 inline mr-2" />
                  View History
                </button>
                <button className="w-full text-left px-3 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors text-sm">
                  <IconSettings className="w-4 h-4 inline mr-2" />
                  Settings
                </button>
              </div>
            </div>

            {/* Suggested Queries */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Suggested Queries</h3>
              <div className="space-y-2">
                {[
                  "Machine learning advances",
                  "Quantum computing research",
                  "AI in healthcare",
                  "Climate change solutions",
                  "Space exploration"
                ].map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setQuery(suggestion)}
                    className="w-full text-left px-3 py-2 bg-gray-800/50 text-gray-300 rounded-lg hover:bg-gray-700/50 transition-colors text-sm"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Backend</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      healthStatus === "ok" ? "bg-green-400" : 
                      healthStatus === "degraded" ? "bg-yellow-400" : "bg-red-400"
                    }`} />
                    <span className={`text-sm ${
                      healthStatus === "ok" ? "text-green-400" : 
                      healthStatus === "degraded" ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {healthStatus === "ok" ? "Online" : 
                       healthStatus === "degraded" ? "Degraded" : "Offline"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm">Mode</span>
                  <span className={`text-sm ${demoMode ? "text-yellow-400" : "text-green-400"}`}>
                    {demoMode ? "Demo" : "Live"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Error Toast */}
      {error && (
        <ErrorToast
          error={error}
          traceId={traceId}
          onRetry={handleRetry}
          onDemoFallback={handleDemoFallback}
          onDismiss={() => setError(null)}
        />
      )}
    </div>
  );
}