"use client"

import { useState, useEffect } from 'react'
import { IconTrendingUp, IconUsers, IconClock, IconDatabase, IconChartBar, IconBrain, IconSearch } from '@tabler/icons-react'

interface AnalyticsData {
  totalQueries: number
  totalSources: number
  avgResponseTime: number
  topTopics: Array<{ topic: string; count: number }>
  dailyUsage: Array<{ date: string; queries: number }>
  sourceTypes: Array<{ type: string; count: number; percentage: number }>
  researchQuality: {
    academic: number
    web: number
    mixed: number
  }
}

export default function AdvancedAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    // Simulate loading analytics data
    const mockAnalytics: AnalyticsData = {
      totalQueries: 247,
      totalSources: 1843,
      avgResponseTime: 2.3,
      topTopics: [
        { topic: 'Machine Learning', count: 45 },
        { topic: 'Climate Change', count: 32 },
        { topic: 'Quantum Computing', count: 28 },
        { topic: 'Biotechnology', count: 24 },
        { topic: 'Renewable Energy', count: 19 }
      ],
      dailyUsage: [
        { date: '2024-01-01', queries: 12 },
        { date: '2024-01-02', queries: 18 },
        { date: '2024-01-03', queries: 15 },
        { date: '2024-01-04', queries: 22 },
        { date: '2024-01-05', queries: 19 },
        { date: '2024-01-06', queries: 25 },
        { date: '2024-01-07', queries: 21 }
      ],
      sourceTypes: [
        { type: 'Academic Papers', count: 892, percentage: 48.4 },
        { type: 'Web Articles', count: 567, percentage: 30.8 },
        { type: 'Reports', count: 234, percentage: 12.7 },
        { type: 'News', count: 150, percentage: 8.1 }
      ],
      researchQuality: {
        academic: 65,
        web: 25,
        mixed: 10
      }
    }
    
    setTimeout(() => {
      setAnalytics(mockAnalytics)
      setIsLoading(false)
    }, 1500)
  }, [timeRange])

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-800/50 rounded-lg p-4">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="bg-gray-800/50 rounded-lg p-4 h-64"></div>
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-2">Advanced Analytics</h2>
            <p className="text-sm text-gray-400">Research insights and usage patterns</p>
          </div>
          <div className="flex space-x-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 text-sm rounded ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <IconSearch className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Total Queries</span>
            </div>
            <div className="text-2xl font-bold text-white">{analytics.totalQueries.toLocaleString()}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <IconDatabase className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Sources Analyzed</span>
            </div>
            <div className="text-2xl font-bold text-white">{analytics.totalSources.toLocaleString()}</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <IconClock className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Avg Response</span>
            </div>
            <div className="text-2xl font-bold text-white">{analytics.avgResponseTime}s</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <IconBrain className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-400">Research Quality</span>
            </div>
            <div className="text-2xl font-bold text-white">{analytics.researchQuality.academic}%</div>
          </div>
        </div>

        {/* Top Research Topics */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <IconTrendingUp className="w-5 h-5 mr-2 text-blue-400" />
            Top Research Topics
          </h3>
          <div className="space-y-3">
            {analytics.topTopics.map((topic, index) => (
              <div key={topic.topic} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {index + 1}
                  </div>
                  <span className="text-white">{topic.topic}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(topic.count / analytics.topTopics[0].count) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400 w-8 text-right">{topic.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Source Types Distribution */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <IconChartBar className="w-5 h-5 mr-2 text-green-400" />
            Source Types Distribution
          </h3>
          <div className="space-y-3">
            {analytics.sourceTypes.map((source) => (
              <div key={source.type} className="flex items-center justify-between">
                <span className="text-white">{source.type}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-400 w-12 text-right">{source.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Research Quality Breakdown */}
        <div className="bg-gray-800/50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Research Quality Breakdown</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-1">{analytics.researchQuality.academic}%</div>
              <div className="text-sm text-gray-400">Academic Sources</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400 mb-1">{analytics.researchQuality.web}%</div>
              <div className="text-sm text-gray-400">Web Sources</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-1">{analytics.researchQuality.mixed}%</div>
              <div className="text-sm text-gray-400">Mixed Sources</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

