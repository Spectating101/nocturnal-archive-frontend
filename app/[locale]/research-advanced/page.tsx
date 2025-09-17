"use client"

import { useState, useEffect, useCallback } from "react"
import { IconBrain, IconSettings, IconHistory, IconX, IconMaximize, IconMinimize } from "@tabler/icons-react"
import AdvancedChatInput from "@/components/AdvancedChatInput"
import StreamingMessage from "@/components/StreamingMessage"
import ResearchHistory from "@/components/ResearchHistory"
import CitationList from "@/components/CitationList"
import ErrorToast from "@/components/ErrorToast"
import SettingsPanel from "@/components/SettingsPanel"
import ShortcutsHelp from "@/components/ShortcutsHelp"
import { askResearch, checkHealth, type ResearchResponse, type Citation } from "@/lib/api"
import { streamResearch, type StreamingResponse } from "@/lib/streaming"
import { useKeyboardShortcuts, RESEARCH_SHORTCUTS } from "@/hooks/useKeyboardShortcuts"
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

interface ResearchSession {
  id: string;
  query: string;
  timestamp: Date;
  citations: number;
  bookmarked: boolean;
  summary?: string;
}

export default function AdvancedResearchPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ResearchSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [traceId, setTraceId] = useState<string | undefined>();
  const [healthStatus, setHealthStatus] = useState<"ok" | "degraded" | "down">("down");
  const [demoMode, setDemoMode] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

  // Load saved sessions from localStorage
  useEffect(() => {
    const savedSessions = localStorage.getItem('research-sessions');
    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        setSessions(parsed.map((s: any) => ({
          ...s,
          timestamp: new Date(s.timestamp)
        })));
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    }
  }, []);

  // Save sessions to localStorage
  const saveSessions = useCallback((newSessions: ResearchSession[]) => {
    setSessions(newSessions);
    localStorage.setItem('research-sessions', JSON.stringify(newSessions));
  }, []);

  // Check health on component mount
  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const health = await checkHealth();
        setHealthStatus(health.status);
        setDemoMode(false); // Always try real backend first
      } catch (err) {
        console.error('Health check failed:', err);
        setHealthStatus("down");
        setDemoMode(false); // Don't mask errors with demo mode
      }
    };

    checkBackendHealth();
    setSessionStartTime(new Date());
    analytics.trackSessionStart();
    performanceMonitor.measurePageLoad();
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    ...RESEARCH_SHORTCUTS,
    'ctrl+/': () => setShowShortcuts(!showShortcuts),
    'ctrl+h': () => setShowHistory(!showHistory),
    'ctrl+s': () => {
      // Save current session
      if (currentSessionId && messages.length > 0) {
        const session = sessions.find(s => s.id === currentSessionId);
        if (session) {
          handleToggleBookmark(session.id);
        }
      }
    },
  });

  const suggestions = [
    "Summarize recent advances in machine learning",
    "What are the latest findings in quantum computing?",
    "Compare different approaches to natural language processing",
    "Analyze the impact of AI on healthcare research",
    "Review current trends in renewable energy technology"
  ];

  const handleSend = async (query: string) => {
    if (!query.trim() || loading) return;

    const sessionId = currentSessionId || `session-${Date.now()}`;
    setCurrentSessionId(sessionId);

    // Track research query
    analytics.trackResearchQuery(query, 'academic');
    performanceMonitor.mark('research-start');

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
        await simulateStreamingResponse(assistantMessageId, query);
      } else {
        // Real streaming response
        await handleStreamingResponse(assistantMessageId, query, sessionId);
      }
    } catch (err: any) {
      setError(err.message || "Failed to get research response");
      setTraceId(err.traceId);
      
      // Track error
      analytics.trackError(err.message, 'research-query');
      
      // Update the assistant message to show error
      setMessages(prev => prev.map(msg => 
        msg.id === assistantMessageId 
          ? { ...msg, isStreaming: false, content: "Sorry, I encountered an error while processing your request." }
          : msg
      ));
    } finally {
      setLoading(false);
      // Track response time
      const responseTime = performanceMonitor.measure('research-response', 'research-start');
      analytics.trackResearchResponse(responseTime, 0, demoMode ? 'demo' : 'real');
    }
  };

  const simulateStreamingResponse = async (messageId: string, query: string) => {
    const demoResponses = {
      "machine learning": "Machine learning is a subset of artificial intelligence that focuses on algorithms that can learn from data. Recent advances include transformer architectures, federated learning, and explainable AI.",
      "quantum computing": "Quantum computing leverages quantum mechanical phenomena to process information. Current research focuses on error correction, quantum algorithms, and scalable quantum systems.",
      "natural language processing": "NLP combines computational linguistics with machine learning to enable computers to understand and generate human language. Recent breakthroughs include large language models and transformer architectures."
    };

    const lowerQuery = query.toLowerCase();
    let response = "I can help you with comprehensive academic research. Here's what I found based on your query...";
    
    for (const [key, value] of Object.entries(demoResponses)) {
      if (lowerQuery.includes(key)) {
        response = value;
        break;
      }
    }

    // Simulate streaming by updating content progressively
    let currentContent = "";
    for (let i = 0; i <= response.length; i++) {
      currentContent = response.slice(0, i);
      setMessages(prev => prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: currentContent }
          : msg
      ));
      await new Promise(resolve => setTimeout(resolve, 20));
    }

    // Add citations
    const citations = [
      {
        title: "Recent Advances in AI Research",
        authors: ["Smith, J.", "Doe, A."],
        venue: "Nature AI",
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

    // Save session
    const newSession: ResearchSession = {
      id: currentSessionId!,
      query,
      timestamp: new Date(),
      citations: citations.length,
      bookmarked: false,
      summary: response.slice(0, 100) + "..."
    };

    saveSessions([newSession, ...sessions]);
  };

  const handleStreamingResponse = async (messageId: string, query: string, sessionId: string) => {
    let fullContent = "";
    let citations: Citation[] = [];

    try {
      for await (const chunk of streamResearch({
        query,
        mode: "academic",
        history: messages.filter(m => m.type === 'user').map(m => m.content),
        session_id: sessionId,
        user_id: "demo-user"
      })) {
        if (chunk.delta) {
          fullContent += chunk.delta;
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, content: fullContent }
              : msg
          ));
        }

        if (chunk.citations) {
          citations = chunk.citations;
        }

        if (chunk.done) {
          setMessages(prev => prev.map(msg => 
            msg.id === messageId 
              ? { ...msg, isStreaming: false, citations }
              : msg
          ));

          // Save session
          const newSession: ResearchSession = {
            id: sessionId,
            query,
            timestamp: new Date(),
            citations: citations.length,
            bookmarked: false,
            summary: fullContent.slice(0, 100) + "..."
          };

          saveSessions([newSession, ...sessions]);
          break;
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const handleLoadSession = (session: ResearchSession) => {
    setCurrentSessionId(session.id);
    setShowHistory(false);
    
    // Load messages for this session (in a real app, you'd fetch from backend)
    const sessionMessages = messages.filter(m => m.sessionId === session.id);
    if (sessionMessages.length === 0) {
      // Create a user message for the session
      const userMessage: Message = {
        id: `user-${session.id}`,
        type: 'user',
        content: session.query,
        timestamp: session.timestamp,
        sessionId: session.id
      };
      setMessages(prev => [userMessage, ...prev]);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    saveSessions(sessions.filter(s => s.id !== sessionId));
    setMessages(prev => prev.filter(m => m.sessionId !== sessionId));
  };

  const handleToggleBookmark = (sessionId: string) => {
    saveSessions(sessions.map(s => 
      s.id === sessionId ? { ...s, bookmarked: !s.bookmarked } : s
    ));
  };

  const handleRetry = () => {
    if (messages.length > 0) {
      const lastUserMessage = messages.filter(m => m.type === 'user').pop();
      if (lastUserMessage) {
        handleSend(lastUserMessage.content);
      }
    }
  };

  const handleDemoFallback = () => {
    setDemoMode(true);
    setError(null);
    handleRetry();
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
              <h1 className="text-xl font-bold text-white">Advanced Research Assistant</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-2 rounded-lg transition-colors ${
                  showHistory ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
                title="Research History"
              >
                <IconHistory className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => setShowSettings(!showSettings)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition-colors"
                title="Settings"
              >
                <IconSettings className="w-5 h-5" />
              </button>
              
              {demoMode && (
                <div className="flex items-center space-x-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full" />
                  <span className="text-sm text-yellow-300">Demo Mode</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="flex h-[calc(100vh-80px)]">
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
                      <StreamingMessage
                        content={message.content}
                        isStreaming={message.isStreaming || false}
                        citations={message.citations}
                        onComplete={() => {
                          // Handle completion if needed
                        }}
                      />
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
                      <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm">Researching your question...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <div className="flex-shrink-0 pt-4">
              <AdvancedChatInput
                onSend={handleSend}
                loading={loading}
                suggestions={suggestions}
                placeholder="Ask a research question..."
              />
            </div>
          </div>
        </div>

        {/* Right Column - History & Tools */}
        <div className="w-80 border-l border-gray-800 bg-gray-900/50 flex flex-col">
          <div className="flex-1 overflow-y-auto p-4">
            <ResearchHistory
              sessions={sessions}
              onLoadSession={handleLoadSession}
              onDeleteSession={handleDeleteSession}
              onToggleBookmark={handleToggleBookmark}
            />
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

      {/* Settings Panel */}
      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* Shortcuts Help */}
      <ShortcutsHelp
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />
    </div>
  );
}
