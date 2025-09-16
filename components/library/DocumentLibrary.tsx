'use client'

import { useState, useEffect } from 'react'
import { IconSearch, IconFilter, IconDownload, IconEye, IconTrash, IconStar, IconTag, IconCalendar, IconFileText, IconBookmark, IconShare, IconLayoutGrid, IconList, IconSortAscending, IconSortDescending, IconFolder, IconPlus } from '@tabler/icons-react'

interface Document {
  id: string
  title: string
  authors: string[]
  abstract: string
  journal: string
  year: number
  citations: number
  doi: string
  url: string
  pdfUrl?: string
  downloadedAt: string
  tags: string[]
  category: string
  isBookmarked: boolean
  isRead: boolean
  relevanceScore: number
  fileSize?: number
  pages?: number
  keywords: string[]
  methodology: string
  findings: string[]
  limitations: string[]
  futureWork: string[]
}

interface DocumentLibraryProps {
  onDocumentSelect: (document: Document) => void
  onDocumentDownload: (document: Document) => void
}

export default function DocumentLibrary({ onDocumentSelect, onDocumentDownload }: DocumentLibraryProps) {
  const [documents, setDocuments] = useState<Document[]>([])
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState<'title' | 'year' | 'citations' | 'relevance' | 'downloaded'>('downloaded')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    fetchDocuments()
  }, [])

  useEffect(() => {
    filterAndSortDocuments()
  }, [documents, searchQuery, selectedCategory, sortBy, sortOrder, selectedTags])

  const fetchDocuments = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://127.0.0.1:8002/api/documents')
      const data = await response.json()
      setDocuments(data.documents || [])
    } catch (error) {
      console.error('Failed to fetch documents:', error)
      // Load sample documents for demo
      setDocuments(generateSampleDocuments())
    } finally {
      setLoading(false)
    }
  }

  const generateSampleDocuments = (): Document[] => {
    const sampleDocs: Document[] = []
    const topics = ['machine learning', 'artificial intelligence', 'quantum computing', 'biotechnology', 'neuroscience', 'climate science']
    const journals = ['Nature', 'Science', 'Cell', 'PNAS', 'IEEE Transactions', 'Journal of Machine Learning Research']
    const methodologies = ['experimental', 'theoretical', 'simulation', 'survey', 'case study']

    for (let i = 0; i < 25; i++) {
      const topic = topics[i % topics.length]
      const journal = journals[i % journals.length]
      const methodology = methodologies[i % methodologies.length]
      
      sampleDocs.push({
        id: `doc_${i}`,
        title: `Advanced ${topic} Applications in Modern Research: A Comprehensive Analysis`,
        authors: [`Dr. ${String.fromCharCode(65 + i)} Smith`, `Prof. ${String.fromCharCode(66 + i)} Johnson`, `Dr. ${String.fromCharCode(67 + i)} Brown`],
        abstract: `This paper presents novel approaches to ${topic} with significant implications for the field. Our methodology demonstrates improved performance metrics and opens new research directions. The study provides comprehensive analysis of current trends and future opportunities in ${topic} research.`,
        journal,
        year: 2023 - (i % 4),
        citations: 50 + (i * 15),
        doi: `10.1000/example.${i}`,
        url: `https://example.com/paper/${i}`,
        pdfUrl: `https://example.com/pdf/${i}.pdf`,
        downloadedAt: new Date(Date.now() - i * 86400000).toISOString(),
        tags: [topic, methodology, 'research', 'analysis'],
        category: topic.replace(' ', '-'),
        isBookmarked: i % 3 === 0,
        isRead: i % 2 === 0,
        relevanceScore: 8.5 - (i * 0.1),
        fileSize: 2.5 + (i * 0.3),
        pages: 15 + (i % 20),
        keywords: [topic, 'research', 'methodology', 'analysis', 'innovation'],
        methodology,
        findings: [
          `Significant improvement in ${topic} performance`,
          'Novel methodology demonstrates effectiveness',
          'Opens new research directions'
        ],
        limitations: [
          'Limited to specific domain',
          'Requires further validation'
        ],
        futureWork: [
          'Extend to broader applications',
          'Validate with larger datasets'
        ]
      })
    }
    return sampleDocs
  }

  const filterAndSortDocuments = () => {
    let filtered = documents

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.authors.some(author => author.toLowerCase().includes(searchQuery.toLowerCase())) ||
        doc.abstract.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(doc => doc.category === selectedCategory)
    }

    // Tag filter
    if (selectedTags.length > 0) {
      filtered = filtered.filter(doc =>
        selectedTags.some(tag => doc.tags.includes(tag))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      let aValue: any, bValue: any
      
      switch (sortBy) {
        case 'title':
          aValue = a.title
          bValue = b.title
          break
        case 'year':
          aValue = a.year
          bValue = b.year
          break
        case 'citations':
          aValue = a.citations
          bValue = b.citations
          break
        case 'relevance':
          aValue = a.relevanceScore
          bValue = b.relevanceScore
          break
        case 'downloaded':
          aValue = new Date(a.downloadedAt)
          bValue = new Date(b.downloadedAt)
          break
        default:
          aValue = a.title
          bValue = b.title
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredDocuments(filtered)
  }

  const toggleBookmark = async (docId: string) => {
    try {
      await fetch(`http://127.0.0.1:8002/api/documents/${docId}/bookmark`, {
        method: 'POST'
      })
      
      setDocuments(prev => prev.map(doc =>
        doc.id === docId ? { ...doc, isBookmarked: !doc.isBookmarked } : doc
      ))
    } catch (error) {
      console.error('Failed to toggle bookmark:', error)
    }
  }

  const deleteDocument = async (docId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return

    try {
      await fetch(`http://127.0.0.1:8002/api/documents/${docId}`, {
        method: 'DELETE'
      })
      
      setDocuments(prev => prev.filter(doc => doc.id !== docId))
    } catch (error) {
      console.error('Failed to delete document:', error)
    }
  }

  const getCategories = () => {
    const categories = ['all', ...new Set(documents.map(doc => doc.category))]
    return categories
  }

  const getTags = () => {
    const allTags = documents.flatMap(doc => doc.tags)
    return [...new Set(allTags)]
  }

  const formatFileSize = (size?: number) => {
    if (!size) return 'Unknown'
    return `${size.toFixed(1)} MB`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading document library...</p>
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
            <h2 className="text-2xl font-bold text-white">Document Library</h2>
            <p className="text-gray-400">{filteredDocuments.length} documents in your library</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {viewMode === 'grid' ? <IconList size={18} /> : <IconLayoutGrid size={18} />}
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <IconFilter size={18} />
            </button>
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
              placeholder="Search documents by title, author, or keywords..."
              className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              >
                {getCategories().map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category.replace('-', ' ')}
                  </option>
                ))}
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
              >
                <option value="downloaded">Download Date</option>
                <option value="title">Title</option>
                <option value="year">Year</option>
                <option value="citations">Citations</option>
                <option value="relevance">Relevance</option>
              </select>

              <button
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="flex items-center justify-center space-x-2 px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors"
              >
                {sortOrder === 'asc' ? <IconSortAscending size={16} /> : <IconSortDescending size={16} />}
                <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
              </button>

              <div className="flex flex-wrap gap-2">
                {getTags().slice(0, 5).map(tag => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (selectedTags.includes(tag)) {
                        setSelectedTags(selectedTags.filter(t => t !== tag))
                      } else {
                        setSelectedTags([...selectedTags, tag])
                      }
                    }}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Document Grid/List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredDocuments.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <IconFileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">No Documents Found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or download some research papers</p>
            </div>
          </div>
        ) : (
          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
            : 'space-y-4'
          }>
            {filteredDocuments.map((doc) => (
              <div
                key={doc.id}
                className={`bg-gray-800/50 border border-gray-700 rounded-lg p-4 hover:border-gray-600 transition-all cursor-pointer ${
                  viewMode === 'list' ? 'flex space-x-4' : ''
                }`}
                onClick={() => onDocumentSelect(doc)}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white line-clamp-2 mb-2">
                          {doc.title}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                          <span className="flex items-center space-x-1">
                            <IconCalendar size={14} />
                            <span>{doc.year}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <IconFileText size={14} />
                            <span>{doc.pages} pages</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <IconDownload size={14} />
                            <span>{formatFileSize(doc.fileSize)}</span>
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleBookmark(doc.id)
                          }}
                          className={`p-1 rounded transition-colors ${
                            doc.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                          }`}
                        >
                          <IconStar size={16} fill={doc.isBookmarked ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            deleteDocument(doc.id)
                          }}
                          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <IconTrash size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm text-gray-300 line-clamp-3">
                        {doc.abstract}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {doc.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="text-xs text-gray-400">
                          Downloaded {formatDate(doc.downloadedAt)}
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-20 bg-gray-700 rounded flex items-center justify-center flex-shrink-0">
                      <IconFileText className="w-8 h-8 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-white line-clamp-1">
                          {doc.title}
                        </h3>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleBookmark(doc.id)
                            }}
                            className={`p-1 rounded transition-colors ${
                              doc.isBookmarked ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                            }`}
                          >
                            <IconStar size={16} fill={doc.isBookmarked ? 'currentColor' : 'none'} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteDocument(doc.id)
                            }}
                            className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <IconTrash size={16} />
                          </button>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-400 mb-2">
                        {doc.authors.join(', ')} • {doc.journal} • {doc.year}
                      </p>
                      
                      <p className="text-sm text-gray-300 line-clamp-2 mb-3">
                        {doc.abstract}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>{doc.citations} citations</span>
                          <span>{doc.pages} pages</span>
                          <span>{formatFileSize(doc.fileSize)}</span>
                        </div>
                        <span className="text-xs text-gray-400">
                          {formatDate(doc.downloadedAt)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
