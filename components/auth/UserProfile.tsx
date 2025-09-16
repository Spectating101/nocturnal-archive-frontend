'use client'

import { useState } from 'react'
import { IconUser, IconSettings, IconLogout, IconCrown, IconTrendingUp, IconDatabase, IconBrain, IconChevronDown } from '@tabler/icons-react'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  institution: string
  researchField: string
  academicLevel: string
  subscriptionTier: 'free' | 'pro' | 'enterprise'
  usageStats: {
    researchQueries: number
    papersAnalyzed: number
    citationsGenerated: number
    monthlyLimit: number
  }
}

interface UserProfileProps {
  user: User
  onLogout: () => void
  onUpgrade: () => void
}

export default function UserProfile({ user, onLogout, onUpgrade }: UserProfileProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'pro': return 'text-blue-400'
      case 'enterprise': return 'text-purple-400'
      default: return 'text-gray-400'
    }
  }

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'pro': return <IconCrown className="w-4 h-4" />
      case 'enterprise': return <IconCrown className="w-4 h-4" />
      default: return <IconUser className="w-4 h-4" />
    }
  }

  const usagePercentage = (user.usageStats.researchQueries / user.usageStats.monthlyLimit) * 100

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-800/50 transition-colors"
      >
        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
          <IconUser className="w-5 h-5 text-white" />
        </div>
        <div className="text-left">
          <p className="text-sm font-medium text-white">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-400">{user.institution}</p>
        </div>
        <IconChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-50">
          {/* Header */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <IconUser className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-white">
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-sm text-gray-400">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getTierIcon(user.subscriptionTier)}
                  <span className={`text-xs font-medium ${getTierColor(user.subscriptionTier)}`}>
                    {user.subscriptionTier.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Usage Stats */}
          <div className="p-4 border-b border-gray-700">
            <h4 className="text-sm font-medium text-gray-300 mb-3">Usage This Month</h4>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-400">Research Queries</span>
                  <span className="text-white">{user.usageStats.researchQueries}/{user.usageStats.monthlyLimit}</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600/20 rounded-lg mx-auto mb-1">
                    <IconBrain className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-xs text-gray-400">Papers</p>
                  <p className="text-sm font-medium text-white">{user.usageStats.papersAnalyzed}</p>
                </div>
                <div>
                  <div className="flex items-center justify-center w-8 h-8 bg-green-600/20 rounded-lg mx-auto mb-1">
                    <IconDatabase className="w-4 h-4 text-green-400" />
                  </div>
                  <p className="text-xs text-gray-400">Citations</p>
                  <p className="text-sm font-medium text-white">{user.usageStats.citationsGenerated}</p>
                </div>
                <div>
                  <div className="flex items-center justify-center w-8 h-8 bg-purple-600/20 rounded-lg mx-auto mb-1">
                    <IconTrendingUp className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-xs text-gray-400">Field</p>
                  <p className="text-sm font-medium text-white">{user.researchField}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-2">
            {user.subscriptionTier === 'free' && (
              <button
                onClick={onUpgrade}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors mb-2"
              >
                <IconCrown className="w-5 h-5 text-yellow-400" />
                <div className="text-left">
                  <p className="text-sm font-medium text-white">Upgrade to Pro</p>
                  <p className="text-xs text-gray-400">Unlock advanced features</p>
                </div>
              </button>
            )}

            <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors mb-2">
              <IconSettings className="w-5 h-5 text-gray-400" />
              <span className="text-sm text-gray-300">Settings</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-red-900/20 transition-colors text-red-400"
            >
              <IconLogout className="w-5 h-5" />
              <span className="text-sm">Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
