'use client'

import { useState, useEffect } from 'react'
import { IconTrendingUp, IconUsers, IconFileText, IconBrain, IconDatabase, IconClock, IconTarget, IconChartBar, IconChartPie, IconChartLine } from '@tabler/icons-react'

interface AnalyticsData {
  overview: {
    totalQueries: number
    papersAnalyzed: number
    citationsGenerated: number
    researchHours: number
    avgResponseTime: number
  }
  trends: {
    dailyQueries: Array<{ date: string; count: number }>
    fieldDistribution: Array<{ field: string; count: number; percentage: number }>
    citationTrends: Array<{ month: string; citations: number }>
    methodologyBreakdown: Array<{ method: string; count: number }>
  }
  insights: {
    topPerformingFields: string[]
    emergingTopics: string[]
    collaborationOpportunities: string[]
    researchGaps: string[]
  }
  performance: {
    querySuccessRate: number
    avgRelevanceScore: number
    userSatisfactionScore: number
    systemUptime: number
  }
}

export default function ResearchAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d')
  const [activeTab, setActiveTab] = useState<'overview' | 'trends' | 'insights' | 'performance'>('overview')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`http://127.0.0.1:8002/api/analytics?timeRange=${timeRange}`)
      const data = await response.json()
      setAnalyticsData(data)
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <IconChartBar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">No Analytics Data</h3>
          <p className="text-gray-500">Start researching to see your analytics</p>
        </div>
      </div>
    )
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
              <IconBrain className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{analyticsData.overview.totalQueries}</p>
              <p className="text-sm text-gray-400">Research Queries</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <IconFileText className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{analyticsData.overview.papersAnalyzed}</p>
              <p className="text-sm text-gray-400">Papers Analyzed</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <IconDatabase className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{analyticsData.overview.citationsGenerated}</p>
              <p className="text-sm text-gray-400">Citations Generated</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
              <IconClock className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{analyticsData.overview.researchHours}</p>
              <p className="text-sm text-gray-400">Research Hours</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Research Performance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Query Success Rate</span>
                <span className="text-white">{analyticsData.performance.querySuccessRate}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${analyticsData.performance.querySuccessRate}%` }}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Avg Relevance Score</span>
                <span className="text-white">{analyticsData.performance.avgRelevanceScore.toFixed(1)}/10</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${analyticsData.performance.avgRelevanceScore * 10}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">User Satisfaction</span>
                <span className="text-white">{analyticsData.performance.userSatisfactionScore}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${analyticsData.performance.userSatisfactionScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">System Performance</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Avg Response Time</span>
              <span className="text-white">{analyticsData.overview.avgResponseTime}ms</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">System Uptime</span>
              <span className="text-white">{analyticsData.performance.systemUptime}%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Data Processing</span>
              <span className="text-green-400">Optimal</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-400">API Health</span>
              <span className="text-green-400">Healthy</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderTrends = () => (
    <div className="space-y-6">
      {/* Daily Queries Chart */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Research Activity Trends</h3>
        <div className="h-64 flex items-end space-x-2">
          {analyticsData.trends.dailyQueries.map((day, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t"
                style={{ height: `${(day.count / Math.max(...analyticsData.trends.dailyQueries.map(d => d.count))) * 200}px` }}
              />
              <span className="text-xs text-gray-400 mt-2">{day.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Field Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Research Field Distribution</h3>
          <div className="space-y-3">
            {analyticsData.trends.fieldDistribution.map((field, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300">{field.field}</span>
                  <span className="text-white">{field.count} ({field.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                    style={{ width: `${field.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Methodology Breakdown</h3>
          <div className="space-y-3">
            {analyticsData.trends.methodologyBreakdown.map((method, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-gray-300">{method.method}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full"
                      style={{ width: `${(method.count / Math.max(...analyticsData.trends.methodologyBreakdown.map(m => m.count))) * 100}%` }}
                    />
                  </div>
                  <span className="text-white text-sm">{method.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderInsights = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Top Performing Fields</h3>
          <div className="space-y-3">
            {analyticsData.insights.topPerformingFields.map((field, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                  <span className="text-blue-400 font-semibold text-sm">{idx + 1}</span>
                </div>
                <span className="text-gray-300">{field}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Emerging Topics</h3>
          <div className="space-y-3">
            {analyticsData.insights.emergingTopics.map((topic, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-gray-300">{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Collaboration Opportunities</h3>
          <div className="space-y-3">
            {analyticsData.insights.collaborationOpportunities.map((opportunity, idx) => (
              <div key={idx} className="p-3 bg-gray-700/50 rounded-lg">
                <p className="text-gray-300 text-sm">{opportunity}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Research Gaps</h3>
          <div className="space-y-3">
            {analyticsData.insights.researchGaps.map((gap, idx) => (
              <div key={idx} className="p-3 bg-orange-900/20 border border-orange-500/30 rounded-lg">
                <p className="text-orange-300 text-sm">{gap}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Header */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Research Analytics</h2>
            <p className="text-gray-400">Comprehensive insights into your research activities</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mt-4 bg-gray-800 p-1 rounded-lg">
          {[
            { id: 'overview', label: 'Overview', icon: IconChartBar },
            { id: 'trends', label: 'Trends', icon: IconChartLine },
            { id: 'insights', label: 'Insights', icon: IconBrain },
            { id: 'performance', label: 'Performance', icon: IconTarget }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'trends' && renderTrends()}
        {activeTab === 'insights' && renderInsights()}
        {activeTab === 'performance' && renderOverview()}
      </div>
    </div>
  )
}
