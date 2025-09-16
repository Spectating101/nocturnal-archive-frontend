"use client"

import { useState, useRef, useEffect } from 'react'
import { IconSend, IconBrain, IconSearch, IconChartBar, IconDatabase, IconRocket, IconLoader2, IconMessageCircle, IconUser } from '@tabler/icons-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  isTyping?: boolean
  isThinking?: boolean
  isProcessing?: boolean
  progress?: number
  status?: 'searching' | 'analyzing' | 'synthesizing' | 'complete'
}

interface ChatResponse {
  response: string
  session_id: string
  timestamp: string
  mode?: string
}

export default function NocturnalChat({ className = '' }: { className?: string }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [researchMode, setResearchMode] = useState<'real' | 'demo' | 'unknown'>('unknown')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

    const simulateTyping = async (finalContent: string) => {
    // Enhanced processing states with progress
    const processingStages = [
      { status: 'searching', content: '🔍 Searching academic databases...', progress: 25 },
      { status: 'analyzing', content: '🧠 Analyzing research findings...', progress: 50 },
      { status: 'synthesizing', content: '📝 Synthesizing comprehensive response...', progress: 75 },
      { status: 'complete', content: '✅ Research complete!', progress: 100 }
    ]

    const processingMessage: Message = {
      id: Date.now().toString(),
      role: 'assistant',
      content: processingStages[0].content,
      timestamp: new Date(),
      isProcessing: true,
      status: 'searching',
      progress: 0
    }

    setMessages(prev => [...prev, processingMessage])
    
    // Simulate processing stages
    for (let i = 0; i < processingStages.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800))
      setMessages(prev => prev.map(msg => 
        msg.id === processingMessage.id 
          ? { ...msg, ...processingStages[i] }
          : msg
      ))
    }
    
    await new Promise(resolve => setTimeout(resolve, 500)) // Brief pause before typing

    // Replace processing with actual content
    setMessages(prev =>
      prev.map(msg =>
        msg.id === processingMessage.id
          ? { ...msg, content: finalContent, isProcessing: false, isThinking: false, progress: undefined, status: undefined }
          : msg
      )
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/nocturnal/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          sessionId: 'web_session'
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ChatResponse = await response.json()
      
      // Update research mode based on response
      if (data.mode === 'real_research') {
        setResearchMode('real')
      } else if (data.mode === 'demo_fallback') {
        setResearchMode('demo')
      }

      await simulateTyping(data.response)

    } catch (error) {
      console.error('Error sending message:', error)
      await simulateTyping('Sorry, I encountered an error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
            <IconBrain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">Nocturnal Archive</h2>
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-400">AI Research Assistant</p>
              {researchMode === 'real' && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400 font-medium">Real Research</span>
                </div>
              )}
              {researchMode === 'demo' && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-yellow-400 font-medium">Demo Mode</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm text-gray-400">Online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-400 mt-8">
            <IconBrain className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Welcome to Nocturnal Archive</p>
            <p className="text-sm mt-2">Ask me about any research topic to get started</p>
            {researchMode === 'real' && (
              <p className="text-xs mt-2 text-green-400">✓ Connected to academic databases</p>
            )}
          </div>
        )}
        
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex items-start space-x-3 max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.role === 'user'
                  ? 'bg-blue-600'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600'
              }`}>
                {message.role === 'user' ? (
                  <IconUser className="w-4 h-4 text-white" />
                ) : (
                  <IconBrain className="w-4 h-4 text-white" />
                )}
              </div>

              <div className={`rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800/80 backdrop-blur-sm text-white border border-gray-700'
              }`}>
                                                <div className="prose prose-invert max-w-none">
                                  {message.isProcessing ? (
                                    <div className="space-y-3">
                                      <div className="flex items-center space-x-2">
                                        <IconLoader2 className="w-4 h-4 animate-spin text-blue-400" />
                                        <span className="text-sm text-gray-300">{message.content}</span>
                                      </div>
                                      {message.progress !== undefined && (
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                          <div 
                                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
                                            style={{ width: `${message.progress}%` }}
                                          ></div>
                                        </div>
                                      )}
                                      {message.status && (
                                        <div className="text-xs text-gray-400 capitalize">
                                          {message.status}... {message.progress}%
                                        </div>
                                      )}
                                    </div>
                                  ) : message.isThinking ? (
                                    <div className="flex items-center space-x-1">
                                      <IconLoader2 className="w-4 h-4 animate-spin" />
                                      <span className="text-sm text-gray-400">{message.content}</span>
                                    </div>
                                  ) : (
                                    <div className="whitespace-pre-wrap">{message.content}</div>
                                  )}
                                </div>
                {isClient && (
                  <div className={`text-xs mt-2 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-400'
                  }`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700 bg-gray-800/50 backdrop-blur-sm">
        <form onSubmit={handleSubmit} className="flex items-end space-x-3">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me about any research topic..."
              required
              minLength={1}
              maxLength={1000}
              className="w-full min-h-[44px] max-h-32 px-4 py-3 bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-200 transform ${
              !inputValue.trim() || isLoading
                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:scale-105 shadow-lg hover:shadow-blue-500/25'
            }`}
            title={!inputValue.trim() ? 'Enter a research question' : isLoading ? 'Processing...' : 'Send message'}
          >
            {isLoading ? (
              <IconLoader2 className="w-5 h-5 text-white animate-spin" />
            ) : (
              <IconSend className="w-5 h-5 text-white" />
            )}
          </button>
        </form>

        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center space-x-4">
            <span>Press Enter to send</span>
            <span className={`${inputValue.length > 800 ? 'text-yellow-400' : 'text-gray-400'}`}>
              {inputValue.length}/1000 characters
            </span>
            <span>Shift+Enter for new line</span>
          </div>
          <div className="flex items-center space-x-2">
            <IconSearch className="w-3 h-3" />
            <span>Research Mode</span>
          </div>
        </div>
      </div>
    </div>
  )
}
