"use client"

import { IconBrain, IconSearch, IconChartBar, IconDatabase, IconRocket, IconArrowRight, IconBook, IconFlask, IconTrendingUp, IconShield, IconUsers, IconAward, IconMicroscope } from "@tabler/icons-react"
import Link from "next/link"

export default function HomePage() {

  return (
    <div className="flex size-full flex-col bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      {/* Navigation Header */}
      <nav className="w-full p-6 border-b border-gray-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <IconBrain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">Nocturnal Archive</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </Link>
            <Link href="/status" className="text-gray-300 hover:text-white transition-colors">
              Status
            </Link>
            <Link href="/research" className="text-gray-300 hover:text-white transition-colors">
              Research
            </Link>
            <Link href="/research-advanced" className="text-gray-300 hover:text-white transition-colors">
              Pro
            </Link>
            <Link href="/research" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <div className="text-center space-y-8 max-w-4xl mx-auto px-6 py-12">
        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                <IconBrain className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <IconRocket className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-white via-gray-200 to-blue-200 bg-clip-text text-transparent">
            Nocturnal Archive
          </h1>
          
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Professional Academic Research Platform
            <br />
            <span className="text-lg text-blue-400">Powered by Advanced AI and Machine Learning</span>
          </p>
          
          <div className="flex items-center justify-center space-x-8 text-sm text-gray-400 mt-6">
            <div className="flex items-center space-x-2">
              <IconShield className="w-4 h-4" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <IconDatabase className="w-4 h-4" />
              <span>Academic Databases</span>
            </div>
            <div className="flex items-center space-x-2">
              <IconBrain className="w-4 h-4" />
              <span>AI-Powered Analysis</span>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300">
            <IconMicroscope className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Academic Research</h3>
            <p className="text-gray-400 text-sm">Comprehensive literature review with peer-reviewed sources and citation management.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-blue-500/50 transition-all duration-300">
            <IconAward className="w-8 h-8 text-blue-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Research Excellence</h3>
            <p className="text-gray-400 text-sm">Peer review integration, impact analysis, and publication quality metrics.</p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-green-500/50 transition-all duration-300">
            <IconUsers className="w-8 h-8 text-green-400 mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Collaborative Research</h3>
            <p className="text-gray-400 text-sm">Team collaboration, peer review workflows, and institutional integration.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex justify-center space-x-8 mt-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">50M+</div>
            <div className="text-sm text-gray-400">Academic Papers</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400">1000+</div>
            <div className="text-sm text-gray-400">Institutions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">99.9%</div>
            <div className="text-sm text-gray-400">Uptime SLA</div>
          </div>
        </div>

        {/* Chat Preview */}
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4 text-center">Professional Research Interface</h3>
            <div className="space-y-3">
              <div className="bg-gray-800/50 rounded-lg p-3">
                <p className="text-sm text-gray-300">Enter your research query for comprehensive academic analysis...</p>
              </div>
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  placeholder="e.g., machine learning applications in healthcare research"
                  className="flex-1 px-3 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="px-6 py-3 min-h-[44px] min-w-[44px] bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg text-white text-sm hover:from-blue-700 hover:to-indigo-700 transition-all">
                  Ask
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl font-semibold text-white hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            href="/research"
          >
            <IconRocket className="mr-2" size={20} />
            Start Researching
            <IconArrowRight className="ml-2" size={20} />
          </Link>
          
          <Link
            className="flex items-center justify-center px-8 py-4 bg-white/10 backdrop-blur-sm rounded-xl font-semibold text-white border border-white/20 hover:bg-white/20 transition-all duration-300"
            href="/research"
          >
            <IconBook className="mr-2" size={20} />
            View Demo
          </Link>
        </div>

        {/* Footer */}
        <footer className="mt-16 border-t border-gray-800 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-indigo-600 rounded flex items-center justify-center">
                  <IconBrain className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">Nocturnal Archive</span>
              </div>
              <p className="text-gray-400 text-sm">
                AI-powered research platform for academic discovery and knowledge synthesis.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/research" className="text-gray-400 hover:text-white transition-colors">Research Assistant</Link></li>
                <li><Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</Link></li>
                <li><Link href="/status" className="text-gray-400 hover:text-white transition-colors">Status</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition-colors">About</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
                <li><Link href="/careers" className="text-gray-400 hover:text-white transition-colors">Careers</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-6 text-center">
            <p className="text-gray-500 text-sm">
              © 2024 Nocturnal Archive. All rights reserved. • Powered by advanced AI • Built for researchers • Designed for discovery
            </p>
          </div>
        </footer>
      </div>
      </div>
    </div>
  )
}
