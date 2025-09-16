"use client"

import { IconBrain, IconShield, IconDatabase, IconUsers, IconArrowLeft } from "@tabler/icons-react"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
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
            <Link href="/" className="text-gray-300 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/research" className="text-gray-300 hover:text-white transition-colors">
              Research
            </Link>
            <Link href="/research" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8"
        >
          <IconArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="space-y-12">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">About Nocturnal Archive</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Revolutionizing academic research through AI-powered knowledge synthesis and intelligent discovery.
            </p>
          </div>

          {/* Mission */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
            <p className="text-gray-300 leading-relaxed">
              Nocturnal Archive is designed to accelerate academic research by providing intelligent tools for 
              literature discovery, citation analysis, and knowledge synthesis. We believe that researchers should 
              spend more time on breakthrough insights and less time on manual information gathering.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <IconBrain className="w-8 h-8 text-blue-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">AI-Powered Research</h3>
              <p className="text-gray-300">
                Advanced machine learning models analyze academic papers, identify key insights, 
                and synthesize information across multiple sources.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <IconDatabase className="w-8 h-8 text-green-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Comprehensive Database</h3>
              <p className="text-gray-300">
                Access to millions of academic papers from arXiv, PubMed, Google Scholar, 
                and other leading research databases.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <IconShield className="w-8 h-8 text-purple-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Enterprise Security</h3>
              <p className="text-gray-300">
                Bank-grade security with end-to-end encryption, secure authentication, 
                and compliance with academic privacy standards.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <IconUsers className="w-8 h-8 text-orange-400 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-3">Collaborative Research</h3>
              <p className="text-gray-300">
                Share research sessions, collaborate on literature reviews, 
                and build knowledge repositories with your team.
              </p>
            </div>
          </div>

          {/* Technology */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h2 className="text-2xl font-semibold text-white mb-6">Technology Stack</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Frontend</h4>
                <p className="text-gray-400 text-sm">Next.js, React, TypeScript, Tailwind CSS</p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-2">Backend</h4>
                <p className="text-gray-400 text-sm">FastAPI, Python, PostgreSQL, Redis</p>
              </div>
              <div>
                <h4 className="text-lg font-medium text-white mb-2">AI/ML</h4>
                <p className="text-gray-400 text-sm">OpenAI GPT, Claude, Custom Models</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-white mb-4">Get in Touch</h2>
            <p className="text-gray-300 mb-6">
              Have questions about Nocturnal Archive? We'd love to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
