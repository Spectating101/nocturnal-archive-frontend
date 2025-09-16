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
        const response = await fetch('http://127.0.0.1:8002/api/auth/me', {
          credentials: 'include'
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
        }
      } catch (error) {
        console.log('No authenticated user')
      }
    }
    checkAuth()
  }, [])

  const handleAuthSuccess = (userData: any) => {
    setUser(userData)
    setShowAuthModal(false)
  }

  const handleLogout = async () => {
    try {
      await fetch('http://127.0.0.1:8002/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const handleResearchComplete = (results: any[]) => {
    setResearchResults(results)
  }

  const handleDocumentSelect = (document: any) => {
    console.log('Document selected:', document)
  }

  const handleDocumentDownload = (document: any) => {
    console.log('Document download:', document)
  }

  const handleSessionSelect = (session: any) => {
    console.log('Session selected:', session)
  }

  const handleSessionResume = (session: any) => {
    console.log('Session resume:', session)
  }

  const handleSynthesisSelect = (synthesis: any) => {
    console.log('Synthesis selected:', synthesis)
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
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <IconBrain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Nocturnal Archive</h1>
                <p className="text-sm text-gray-400">Academic Research Platform</p>
              </div>
            </div>
            <Link href="/" className="p-2 text-gray-400 hover:text-white transition-colors">
              <IconHome className="w-5 h-5" />
            </Link>
          </div>

          {/* User Authentication */}
          <div className="border-t border-gray-700 pt-4">
            {user ? (
              <UserProfile user={user} onLogout={handleLogout} onUpgrade={() => {}} />
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="w-full flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 hover:border-blue-500/50 transition-all"
              >
                <IconLogin className="w-5 h-5 text-blue-400" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Sign In</p>
                  <p className="text-xs text-gray-400">Access full features</p>
                </div>
              </button>
            )}
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Navigation</h3>
            
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
                  <p className="text-sm font-medium">Recent Research</p>
                  <p className="text-xs text-gray-400">View research history</p>
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
                  <p className="text-xs text-gray-400">Research insights & patterns</p>
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
                <IconTrendingUp className="w-5 h-5" />
                <div className="text-left">
                  <p className="text-sm font-medium">Knowledge Synthesis</p>
                  <p className="text-xs text-gray-400">AI-powered insights</p>
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
                  <p className="text-xs text-gray-400">Manage research papers</p>
                </div>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Quick Actions</h3>
            
            <div className="space-y-2">
              <button 
                onClick={() => window.location.reload()}
                className="w-full text-left p-3 rounded-lg bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/30 hover:border-blue-500/50 transition-all cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <IconRocket className="w-4 h-4 text-blue-400" />
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

          {/* Status */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">System Status</h3>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">AI Models</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-400">Online</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Database</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-400">Connected</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">Cache</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-xs text-green-400">Active</span>
                </div>
              </div>
            </div>
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
