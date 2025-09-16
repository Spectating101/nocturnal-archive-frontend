"use client"

import { useState } from "react"
import { IconHistory, IconSearch, IconTrash, IconBookmark, IconClock } from "@tabler/icons-react"

interface ResearchSession {
  id: string;
  query: string;
  timestamp: Date;
  citations: number;
  bookmarked: boolean;
  summary?: string;
}

interface ResearchHistoryProps {
  sessions: ResearchSession[];
  onLoadSession: (session: ResearchSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onToggleBookmark: (sessionId: string) => void;
}

export default function ResearchHistory({ 
  sessions, 
  onLoadSession, 
  onDeleteSession, 
  onToggleBookmark 
}: ResearchHistoryProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<'all' | 'bookmarked' | 'recent'>('all');

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.query.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || 
                         (filter === 'bookmarked' && session.bookmarked) ||
                         (filter === 'recent' && isRecent(session.timestamp));
    
    return matchesSearch && matchesFilter;
  });

  const isRecent = (timestamp: Date) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return timestamp > oneWeekAgo;
  };

  const formatDate = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return timestamp.toLocaleDateString();
  };

  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center space-x-2 mb-6">
        <IconHistory className="w-5 h-5 text-blue-400" />
        <h3 className="text-lg font-semibold text-white">Research History</h3>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 mb-6">
        <div className="relative">
          <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search research history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex space-x-2">
          {(['all', 'bookmarked', 'recent'] as const).map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                filter === filterType
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredSessions.length === 0 ? (
          <div className="text-center py-8">
            <IconHistory className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No research sessions found</p>
            {searchTerm && (
              <p className="text-gray-500 text-sm mt-2">
                Try adjusting your search terms
              </p>
            )}
          </div>
        ) : (
          filteredSessions.map((session) => (
            <div
              key={session.id}
              className="bg-gray-800/30 rounded-lg p-4 hover:bg-gray-800/50 transition-colors cursor-pointer group"
              onClick={() => onLoadSession(session)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium mb-1 line-clamp-2">
                    {session.query}
                  </h4>
                  
                  {session.summary && (
                    <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                      {session.summary}
                    </p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <IconClock className="w-3 h-3" />
                      <span>{formatDate(session.timestamp)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <IconBookmark className="w-3 h-3" />
                      <span>{session.citations} citations</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(session.id);
                    }}
                    className={`p-1 rounded transition-colors ${
                      session.bookmarked
                        ? 'text-yellow-400 hover:text-yellow-300'
                        : 'text-gray-400 hover:text-yellow-400'
                    }`}
                    title={session.bookmarked ? 'Remove bookmark' : 'Bookmark'}
                  >
                    <IconBookmark className={`w-4 h-4 ${session.bookmarked ? 'fill-current' : ''}`} />
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete session"
                  >
                    <IconTrash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      {sessions.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700/50">
          <div className="flex items-center justify-between text-sm text-gray-400">
            <span>{sessions.length} total sessions</span>
            <span>{sessions.filter(s => s.bookmarked).length} bookmarked</span>
          </div>
        </div>
      )}
    </div>
  );
}
