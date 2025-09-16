"use client"

import { useState, useEffect } from "react"
import NocturnalChat from "@/components/chat/nocturnal-chat"
import AcademicResearchInterface from "@/components/research/AcademicResearchInterface"
import ResearchAnalytics from "@/components/analytics/ResearchAnalytics"
import ResearchHistory from "@/components/research/ResearchHistory"
import KnowledgeSynthesis from "@/components/synthesis/KnowledgeSynthesis"
import DocumentLibrary from "@/components/library/DocumentLibrary"
import AuthModal from "@/components/auth/AuthModal"
import UserProfile from "@/components/auth/UserProfile"
import { IconBrain, IconSearch, IconChartBar, IconDatabase, IconRocket, IconHome, IconClock, IconTrendingUp, IconUser, IconLogin, IconBooks } from "@tabler/icons-react"
import Link from "next/link"

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<'research' | 'history' | 'analytics' | 'synthesis' | 'library'>('research')
  const [user, setUser] = useState<any>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [researchResults, setResearchResults] = useState<any[]>([])

  useEffect(() => {
    // Check for existing user session
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.log('No existing session')
      }
    }
    checkAuth()
  }, [])

  const handleAuthSuccess = (userData: any) => {
    setUser(userData)
    setShowAuthModal(false)
  }

  const handleLogout = () => {
    setUser(null)
  }

  const handleResearchComplete = (results: any[]) => {
    setResearchResults(results)
  }

  const handleSessionSelect = (sessionId: string) => {
    console.log('Session selected:', sessionId)
  }

  const handleSessionResume = (sessionId: string) => {
    console.log('Session resumed:', sessionId)
  }

  const handleDocumentSelect = (documentId: string) => {
    console.log('Document selected:', documentId)
  }

  const handleDocumentDownload = (documentId: string) => {
    console.log('Document download:', documentId)
  }

  const handleSynthesisSelect = (synthesisId: string) => {
    console.log('Synthesis selected:', synthesisId)
  }

  const handleSynthesisCreate = (title: string, description: string) => {
    console.log('Synthesis create:', title, description)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'research':
        return <NocturnalChat />
      case 'history':
        return <ResearchHistory onSessionSelect={handleSessionSelect} onSessionResume={handleSessionResume} />
      case 'analytics':
        return <ResearchAnalytics />
      case 'synthesis':
        return <KnowledgeSynthesis onSynthesisSelect={handleSynthesisSelect} onSynthesisCreate={handleSynthesisCreate} />
      case 'library':
        return <DocumentLibrary onDocumentSelect={handleDocumentSelect} onDocumentDownload={handleDocumentDownload} />
      default:
        return <NocturnalChat />
    }
  }

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 dark">
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 bg-gray-800/50 backdrop-blur-sm border-r border-gray-700 p-6">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Nocturnal Archive</h1>
            <p className="text-sm text-gray-400">AI Research Platform</p>
          </div>

          {/* User Authentication */}
          <div className="space-y-3">
            {user ? (
              <UserProfile user={user} onLogout={handleLogout} />
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-colors"
              >
                <IconLogin className="w-5 h-5" />
                <span className="text-sm font-medium">Sign In</span>
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="space-y-2">
            <button
              onClick={() => setActiveTab('research')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'research'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
              }`}
            >
              <IconSearch className="w-5 h-5" />
              <div className="text-left">
                <p className="text-sm font-medium">Academic Research</p>
                <p className="text-xs text-gray-400">Professional research interface</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'history'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
              }`}
            >
              <IconClock className="w-5 h-5" />
              <div className="text-left">
                <p className="text-sm font-medium">Research History</p>
                <p className="text-xs text-gray-400">View past research sessions</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
              }`}
            >
              <IconChartBar className="w-5 h-5" />
              <div className="text-left">
                <p className="text-sm font-medium">Advanced Analytics</p>
                <p className="text-xs text-gray-400">Research insights and trends</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('synthesis')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'synthesis'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
              }`}
            >
              <IconBrain className="w-5 h-5" />
              <div className="text-left">
                <p className="text-sm font-medium">Knowledge Synthesis</p>
                <p className="text-xs text-gray-400">AI-powered knowledge synthesis</p>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('library')}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                activeTab === 'library'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'bg-gray-700/50 hover:bg-gray-700/70 text-gray-300'
              }`}
            >
              <IconBooks className="w-5 h-5" />
              <div className="text-left">
                <p className="text-sm font-medium">Document Library</p>
                <p className="text-xs text-gray-400">Manage research documents</p>
              </div>
            </button>
          </div>

          {/* Quick Actions */}
          <div className="space-y-2 pt-4 border-t border-gray-700">
            <button 
              onClick={() => alert(&apos;New research feature coming soon!&apos;)}
              className="w-full cursor-pointer rounded-lg bg-gray-700/50 p-3 text-left transition-colors hover:bg-gray-700/70"
            >
              <div className="flex items-center space-x-3">
                <IconRocket className="w-5 h-5 text-green-400" />
                <span className="text-sm text-white">Start New Research</span>
              </div>
            </button>
            
            <button 
              onClick={() => alert(&apos;Recent research feature coming soon!&apos;)}
              className="w-full cursor-pointer rounded-lg bg-gray-700/50 p-3 text-left transition-colors hover:bg-gray-700/70"
            >
              <span className="text-sm text-gray-300">View Recent Research</span>
            </button>
            
            <button 
              onClick={() => alert(&apos;Export feature coming soon!&apos;)}
              className="w-full cursor-pointer rounded-lg bg-gray-700/50 p-3 text-left transition-colors hover:bg-gray-700/70"
            >
              <span className="text-sm text-gray-300">Export Results</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0">
        {renderContent()}
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  )
}