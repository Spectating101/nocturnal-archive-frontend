'use client'

import { useState, useEffect } from 'react'
import { IconSearch, IconBrain, IconDatabase, IconTrendingUp, IconFileText, IconUsers, IconClock, IconFilter, IconDownload, IconShare, IconBookmark, IconStar, IconChevronDown } from '@tabler/icons-react'

interface ResearchResult {
  id: string
  title: string
  authors: string[]
  abstract: string
  journal: string
  year: number
  citations: number
  doi: string
  url: string
  relevanceScore: number
  keywords: string[]
  methodology: string
  findings: string[]
  limitations: string[]
  futureWork: string[]
}

interface AcademicResearchInterfaceProps {
  onResearchComplete: (results: ResearchResult[]) => void
}

export default function AcademicResearchInterface({ onResearchComplete }: AcademicResearchInterfaceProps) {
  const [query, setQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<ResearchResult[]>([])
  const [filters, setFilters] = useState({
    yearRange: [2015, 2024],
    minCitations: 0,
    methodology: '',
    field: '',
    openAccess: false
  })
  const [sortBy, setSortBy] = useState<'relevance' | 'citations' | 'year' | 'recent'>('relevance')
  const [selectedResults, setSelectedResults] = useState<Set<string>>(new Set())

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch('http://127.0.0.1:8002/api/academic-research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          filters,
          sortBy,
          maxResults: 50
        })
      })

      const data = await response.json()
      setResults(data.results || [])
      onResearchComplete(data.results || [])
    } catch (error) {
      console.error('Research failed:', error)
    } finally {
      setIsSearching(false)
    }
  }

  const toggleResultSelection = (resultId: string) => {
    const newSelection = new Set(selectedResults)
    if (newSelection.has(resultId)) {
      newSelection.delete(resultId)
    } else {
      newSelection.add(resultId)
    }
    setSelectedResults(newSelection)
  }

  const exportSelectedResults = () => {
    const selected = results.filter(r => selectedResults.has(r.id))
    // Implementation for exporting to various formats
    console.log('Exporting:', selected)
  }

  const generateSynthesis = async () => {
    const selected = results.filter(r => selectedResults.has(r.id))
    if (selected.length === 0) return

    try {
      const response = await fetch('http://127.0.0.1:8002/api/synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          papers: selected,
          synthesisType: 'comprehensive'
        })
      })

      const data = await response.json()
      // Handle synthesis results
      console.log('Synthesis:', data)
    } catch (error) {
      console.error('Synthesis failed:', error)
    }
  }

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Search Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Enter your research query (e.g., 'machine learning applications in healthcare')"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            onClick={handleSearch}
            disabled={isSearching || !query.trim()}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2"
          >
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <IconBrain size={18} />
                <span>Research</span>
              </>
            )}
          </button>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <IconFilter size={16} className="text-gray-400" />
            <span className="text-gray-400">Filters:</span>
          </div>
          
          <select
            value={filters.field}
            onChange={(e) => setFilters(prev => ({ ...prev, field: e.target.value }))}
            className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
          >
            <option value="">All Fields</option>
            <option value="ai">Artificial Intelligence</option>
            <option value="ml">Machine Learning</option>
            <option value="nlp">Natural Language Processing</option>
            <option value="cv">Computer Vision</option>
            <option value="robotics">Robotics</option>
          </select>

          <select
            value={filters.methodology}
            onChange={(e) => setFilters(prev => ({ ...prev, methodology: e.target.value }))}
            className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
          >
            <option value="">All Methods</option>
            <option value="experimental">Experimental</option>
            <option value="theoretical">Theoretical</option>
            <option value="simulation">Simulation</option>
            <option value="survey">Survey</option>
          </select>

          <label className="flex items-center space-x-2 text-gray-300">
            <input
              type="checkbox"
              checked={filters.openAccess}
              onChange={(e) => setFilters(prev => ({ ...prev, openAccess: e.target.checked }))}
              className="rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
            />
            <span>Open Access</span>
          </label>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-hidden">
        {results.length > 0 ? (
          <div className="h-full flex">
            {/* Results List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">
                  {results.length} Research Papers Found
                </h3>
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-1 bg-gray-800 border border-gray-600 rounded text-white text-sm"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="citations">Citations</option>
                    <option value="year">Year</option>
                    <option value="recent">Most Recent</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className={`p-4 border rounded-lg transition-all duration-200 cursor-pointer ${
                      selectedResults.has(result.id)
                        ? 'border-blue-500 bg-blue-900/20'
                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                    }`}
                    onClick={() => toggleResultSelection(result.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={selectedResults.has(result.id)}
                        onChange={() => toggleResultSelection(result.id)}
                        className="mt-1 rounded border-gray-600 bg-gray-800 text-blue-600 focus:ring-blue-500"
                      />
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-semibold text-white hover:text-blue-400 transition-colors">
                            {result.title}
                          </h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-400">
                            <IconStar className="w-4 h-4" />
                            <span>{result.relevanceScore.toFixed(1)}</span>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                          <span className="flex items-center space-x-1">
                            <IconUsers size={14} />
                            <span>{result.authors.join(', ')}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <IconFileText size={14} />
                            <span>{result.journal}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <IconTrendingUp size={14} />
                            <span>{result.citations} citations</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <IconClock size={14} />
                            <span>{result.year}</span>
                          </span>
                        </div>

                        <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                          {result.abstract}
                        </p>

                        <div className="flex items-center space-x-4">
                          <div className="flex flex-wrap gap-1">
                            {result.keywords.slice(0, 3).map((keyword, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                          
                          <div className="flex items-center space-x-2 ml-auto">
                            <button className="p-1 text-gray-400 hover:text-white transition-colors">
                              <IconBookmark size={16} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-white transition-colors">
                              <IconShare size={16} />
                            </button>
                            <button className="p-1 text-gray-400 hover:text-white transition-colors">
                              <IconDownload size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selection Panel */}
            {selectedResults.size > 0 && (
              <div className="w-80 border-l border-gray-700 bg-gray-800/30 p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-white">
                    {selectedResults.size} Selected
                  </h4>
                  <button
                    onClick={() => setSelectedResults(new Set())}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={generateSynthesis}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <IconBrain size={16} />
                    <span>Generate Synthesis</span>
                  </button>

                  <button
                    onClick={exportSelectedResults}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    <IconDownload size={16} />
                    <span>Export Results</span>
                  </button>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-700">
                  <h5 className="text-sm font-medium text-gray-300 mb-2">Selected Papers</h5>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {results
                      .filter(r => selectedResults.has(r.id))
                      .map((result) => (
                        <div key={result.id} className="p-2 bg-gray-700/50 rounded text-sm">
                          <p className="text-white font-medium line-clamp-2">{result.title}</p>
                          <p className="text-gray-400 text-xs">{result.journal} ({result.year})</p>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <IconDatabase className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Research Results Yet
              </h3>
              <p className="text-gray-500">
                Enter a research query above to discover academic papers and insights
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
