'use client'

import { useState, useEffect } from 'react'
import { IconSearch, IconClock, IconEye, IconDownload, IconShare, IconTrash, IconStar, IconCalendar, IconTrendingUp, IconFileText, IconDatabase, IconFilter, IconSortAscending, IconSortDescending } from '@tabler/icons-react'

interface ResearchSession {
  id: string
  query: string
  timestamp: string
  resultsCount: number
  papersAnalyzed: number
  citationsGenerated: number
  duration: number
  status: 'completed' | 'in_progress' | 'failed'
  tags: string[]
  category: string
  isBookmarked: boolean
  results: {
    papers: any[]
    synthesis?: any
    analytics?: any
  }
}

interface ResearchHistoryProps {
  onSessionSelect: (session: ResearchSession) => void
  onSessionResume: (session: ResearchSession) => void
}

export default function ResearchHistory({ onSessionSelect, onSessionResume }: ResearchHistoryProps) {
  const [sessions, setSessions] = useState<ResearchSession[]>([])
  const [filteredSessions, setFilteredSessions] = useState<ResearchSession[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'timestamp' | 'query' | 'resultsCount' | 'duration'>('timestamp')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedStatus, setSelectedStatus] = useState('all')

  useEffect(() => {
    fetchResearchHistory()
  }, [])

  useEffect(() => {
    filterAndSortSessions()
  }, [sessions, searchQuery, selectedCategory, sortBy, sortOrder, selectedStatus])

  const fetchResearchHistory = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8002/api/research/history')
      const data = await response.json()
      setSessions(data.sessions || [])
    } catch (error) {
      console.error('Failed to fetch research history:', error)
      // Load sample sessions for demo
      setSessions(generateSampleSessions())
    } finally {
      setLoading(false)
    }
  }

  const generateSampleSessions = (): ResearchSession[] => {
    const sampleSessions: ResearchSession[] = []
    const queries = [
      'machine learning applications in healthcare',
      'quantum computing breakthroughs 2024',
      'artificial intelligence ethics and governance',
      'renewable energy storage solutions',
      'neuroscience and brain-computer interfaces',
      'climate change mitigation strategies',
      'biotechnology and gene editing',
      'space exploration and colonization',
      'cybersecurity and privacy protection',
      'sustainable agriculture innovations'
    ]

    for (let i = 0; i < 15; i++) {
      const query = queries[i % queries.length]
      const timestamp = new Date(Date.now() - i * 3600000 - Math.random() * 86400000)
      
      sampleSessions.push({
        id: `session_${i}`,
        query,
        timestamp: timestamp.toISOString(),
        resultsCount: 25 + Math.floor(Math.random() * 50),
        papersAnalyzed: 15 + Math.floor(Math.random() * 30),
        citationsGenerated: 8 + Math.floor(Math.random() * 15),
        duration: 45 + Math.floor(Math.random() * 120),
        status: i % 10 === 0 ? 'in_progress' : i % 15 === 0 ? 'failed' : 'completed',
        tags: [query.split(' ')[0], 'research', 'analysis'],
        category: query.split(' ')[0].toLowerCase(),
        isBookmarked: i % 4 === 0,
        results: {
          papers: [],
          synthesis: {},
          analytics: {}
        }
      })
    }
    return sampleSessions
  }

  const filterAndSortSessions = () => {
    let filtered = sessions

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(session =>
        session.query.toLowerCase().includes(searchQuery.toLowerCase()) ||
        session.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(session => session.category === selectedCategory)
    }

    // Status filter
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(session => session.status === selectedStatus)
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'timestamp':
          aValue = new Date(a.timestamp)
          bValue = new Date(b.timestamp)
          break
        case 'query':
          aValue = a.query
          bValue = b.query
          break
        case 'resultsCount':
          aValue = a.resultsCount
          bValue = b.resultsCount
          break
        case 'duration':
          aValue = a.duration
          bValue = b.duration
          break
        default:
          aValue = new Date(a.timestamp)
          bValue = new Date(b.timestamp)
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredSessions(filtered)
  }

  const toggleBookmark = async (sessionId: string) => {
    try {
      await fetch(`http://127.0.0.1:8002/api/research/history/${sessionId}/bookmark`, {
        method: 'POST'
      })
      
      setSessions(prev => prev.map(session =>
        session.id === sessionId ? { ...session, isBookmarked: !session.isBookmarked } : session
      ))
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }

  const deleteSession = async (sessionId: string) => {
    if (!confirm('Are you sure you want to delete this research session?')) return

    try {
      await fetch(`http://127.0.0.1:8002/api/research/history/${sessionId}`, {
        method: 'DELETE'
      })
      
      setSessions(prev => prev.filter(session => session.id !== sessionId))
    } catch (error) {
      console.error('Failed to delete session:', error)
    }
  }

  const exportSession = async (session: ResearchSession) => {
    try {
      const response = await fetch(`http://127.0.0.1:8002/api/research/history/${session.id}/export`, {
        method: 'POST'
      })
      const blob = await response.blob()
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `research_${session.id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Failed to export session:', error)
    }
  }

  const getCategories = () => {
    const categories = ['all', ...new Set(sessions.map(session => session.category))]
    return categories
  }

  const formatDuration = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`
    }
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    
    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400'
      case 'in_progress': return 'text-yellow-400'
      case 'failed': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <IconDatabase className="w-4 h-4" />
      case 'in_progress': return <IconTrendingUp className="w-4 h-4" />
      case 'failed': return <IconTrash className="w-4 h-4" />
      default: return <IconClock className="w-4 h-4" />
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading research history...</p>
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
            <h2 className="text-2xl font-bold text-white">Research History</h2>
            <p className="text-gray-400">{filteredSessions.length} research sessions</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search research sessions..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            >
              {getCategories().map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="in_progress">In Progress</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            >
              <option value="timestamp">Date</option>
              <option value="query">Query</option>
              <option value="resultsCount">Results</option>
              <option value="duration">Duration</option>
            </select>

            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
            >
              {sortOrder === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />}
              <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredSessions.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <IconClock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Research Sessions</h3>
              <p className="text-gray-500">Start a new research session to see your history here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredSessions.map((session) => (
              <div
                key={session.id}
                className="bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-white line-clamp-1">
                        {session.query}
                      </h3>
                      <div className={`flex items-center space-x-1 ${getStatusColor(session.status)}`}>
                        {getStatusIcon(session.status)}
                        <span className="text-sm capitalize">{session.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-400 mb-3">
                      <span className="flex items-center space-x-1">
                        <IconCalendar size={14} />
                        <span>{formatDate(session.timestamp)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <IconClock size={14} />
                        <span>{formatDuration(session.duration)}</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <IconFileText size={14} />
                        <span>{session.resultsCount} results</span>
                      </span>
                      <span className="flex items-center space-x-1">
                        <IconDatabase size={14} />
                        <span>{session.papersAnalyzed} papers</span>
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {session.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => onSessionSelect(session)}
                      className="p-2 text-gray-400 hover:text-white transition-colors"
                      title="View Details"
                    >
                      <IconEye size={16} />
                    </button>
                    
                    {session.status === 'completed' && (
                      <button
                        onClick={() => onSessionResume(session)}
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                        title="Resume Session"
                      >
                        <IconSearch size={16} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => exportSession(session)}
                      className="p-2 text-gray-400 hover:text-green-400 transition-colors"
                      title="Export Results"
                    >
                      <IconDownload size={16} />
                    </button>
                    
                    <button
                      onClick={() => toggleBookmark(session.id)}
                      className={`p-2 transition-colors ${
                        session.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                      }`}
                      title="Bookmark"
                    >
                      <IconStar size={16} fill={session.isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                    
                    <button
                      onClick={() => deleteSession(session.id)}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      title="Delete Session"
                    >
                      <IconTrash size={16} />
                    </button>
                  </div>
                </div>

                {/* Session Stats */}
                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-700">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-blue-400">{session.resultsCount}</div>
                    <div className="text-xs text-gray-400">Results Found</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-green-400">{session.papersAnalyzed}</div>
                    <div className="text-xs text-gray-400">Papers Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-purple-400">{session.citationsGenerated}</div>
                    <div className="text-xs text-gray-400">Citations Generated</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}