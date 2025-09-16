'use client'

import { useState, useEffect } from 'react'
import { IconBrain, IconFileText, IconTrendingUp, IconShare, IconDownload, IconPlus, IconTrash, IconEye, IconEdit, IconSave, IconX, IconChartBar, IconDatabase, IconUsers, IconTarget, IconBulb } from '@tabler/icons-react'

interface SynthesisProject {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  status: 'draft' | 'processing' | 'completed' | 'failed'
  documents: any[]
  synthesis: {
    summary: string
    keyFindings: string[]
    researchGaps: string[]
    recommendations: string[]
    confidence: number
  }
  analytics: {
    totalDocuments: number
    totalCitations: number
    averageRelevance: number
  }
  tags: string[]
}

interface KnowledgeSynthesisProps {
  onSynthesisSelect: (synthesis: SynthesisProject) => void
  onSynthesisCreate: (title: string, description: string) => void
}

export default function KnowledgeSynthesis({ onSynthesisSelect, onSynthesisCreate }: KnowledgeSynthesisProps) {
  const [syntheses, setSyntheses] = useState<SynthesisProject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newSynthesis, setNewSynthesis] = useState({ title: '', description: '' })

  useEffect(() => {
    fetchSyntheses()
  }, [])

  const fetchSyntheses = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8002/api/synthesis/projects')
      const data = await response.json()
      setSyntheses(data.syntheses || [])
    } catch (error) {
      console.error('Failed to fetch syntheses:', error)
      setSyntheses(generateSampleSyntheses())
    } finally {
      setLoading(false)
    }
  }

  const generateSampleSyntheses = (): SynthesisProject[] => {
    const topics = [
      'Machine Learning in Healthcare',
      'Quantum Computing Applications',
      'Artificial Intelligence Ethics',
      'Renewable Energy Technologies'
    ]

    return topics.map((topic, i) => ({
      id: `synthesis_${i}`,
      title: `Analysis: ${topic}`,
      description: `Comprehensive synthesis of research in ${topic.toLowerCase()}`,
      createdAt: new Date(Date.now() - i * 86400000).toISOString(),
      updatedAt: new Date(Date.now() - i * 86400000).toISOString(),
      status: 'completed' as const,
      documents: [],
      synthesis: {
        summary: `Analysis of ${topic.toLowerCase()} reveals significant trends and opportunities.`,
        keyFindings: [
          `Growing adoption of ${topic.toLowerCase()}`,
          'Significant improvements in performance',
          'Emerging challenges in implementation'
        ],
        researchGaps: [
          'Limited long-term studies',
          'Need for standardized metrics'
        ],
        recommendations: [
          'Focus on collaboration',
          'Develop frameworks'
        ],
        confidence: 85 + Math.floor(Math.random() * 15)
      },
      analytics: {
        totalDocuments: 25 + Math.floor(Math.random() * 50),
        totalCitations: 150 + Math.floor(Math.random() * 300),
        averageRelevance: 8.2 + Math.random() * 1.5
      },
      tags: [topic.split(' ')[0].toLowerCase(), 'synthesis']
    }))
  }

  const createSynthesis = async () => {
    if (!newSynthesis.title.trim()) return

    try {
      const response = await fetch('http://127.0.0.1:8002/api/synthesis/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSynthesis)
      })

      const data = await response.json()
      setSyntheses(prev => [data.synthesis, ...prev])
      setNewSynthesis({ title: '', description: '' })
      setShowCreateModal(false)
    } catch (error) {
      console.error('Failed to create synthesis:', error)
    }
  }

  const deleteSynthesis = async (synthesisId: string) => {
    if (!confirm('Are you sure you want to delete this synthesis project?')) return

    try {
      await fetch(`http://127.0.0.1:8002/api/synthesis/projects/${synthesisId}`, {
        method: 'DELETE'
      })
      
      setSyntheses(prev => prev.filter(s => s.id !== synthesisId))
    } catch (error) {
      console.error('Failed to delete synthesis:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/20'
      case 'processing': return 'text-yellow-400 bg-yellow-400/20'
      case 'failed': return 'text-red-400 bg-red-400/20'
      case 'draft': return 'text-gray-400 bg-gray-400/20'
      default: return 'text-gray-400 bg-gray-400/20'
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading knowledge syntheses...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white">Knowledge Synthesis</h2>
            <p className="text-gray-400">{syntheses.length} synthesis projects</p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-lg transition-all duration-200"
          >
            <IconPlus size={18} />
            <span>New Synthesis</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <IconBrain className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search synthesis projects..."
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Syntheses Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        {syntheses.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <IconBrain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Synthesis Projects</h3>
              <p className="text-gray-500">Create your first knowledge synthesis project</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {syntheses.map((synthesis) => (
              <div
                key={synthesis.id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all cursor-pointer"
                onClick={() => onSynthesisSelect(synthesis)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2">
                      {synthesis.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-3 mb-3">
                      {synthesis.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSynthesis(synthesis.id)
                      }}
                      className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>

                {/* Status and Stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(synthesis.status)}`}>
                      {synthesis.status.charAt(0).toUpperCase() + synthesis.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-400">
                      {synthesis.synthesis.confidence}% confidence
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-blue-400">
                        {synthesis.analytics.totalDocuments}
                      </div>
                      <div className="text-xs text-gray-400">Documents</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-green-400">
                        {synthesis.analytics.totalCitations}
                      </div>
                      <div className="text-xs text-gray-400">Citations</div>
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-purple-400">
                        {synthesis.analytics.averageRelevance.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-400">Relevance</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {synthesis.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Create New Synthesis</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <IconX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  value={newSynthesis.title}
                  onChange={(e) => setNewSynthesis(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter synthesis project title..."
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newSynthesis.description}
                  onChange={(e) => setNewSynthesis(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe your synthesis project..."
                  rows={3}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  onClick={createSynthesis}
                  disabled={!newSynthesis.title.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
                >
                  Create Project
                </button>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}