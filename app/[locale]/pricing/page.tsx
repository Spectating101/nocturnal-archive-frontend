"use client"

import { IconBrain, IconCheck, IconArrowLeft, IconStar } from "@tabler/icons-react"
import Link from "next/link"

export default function PricingPage() {
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
            <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/research" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link 
          href="/" 
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-8"
        >
          <IconArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Choose the plan that fits your research needs. All plans include our core AI-powered research tools.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Free Plan */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Free</h3>
              <div className="text-3xl font-bold text-white mb-2">$0</div>
              <p className="text-gray-400 text-sm">Perfect for getting started</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <IconCheck className="w-5 h-5 text-green-400 mr-3" />
                10 research queries per month
              </li>
              <li className="flex items-center text-gray-300">
                <IconCheck className="w-5 h-5 text-green-400 mr-3" />
                Basic citation formatting
              </li>
              <li className="flex items-center text-gray-300">
                <IconCheck className="w-5 h-5 text-green-400 mr-3" />
                Access to public databases
              </li>
              <li className="flex items-center text-gray-300">
                <IconCheck className="w-5 h-5 text-green-400 mr-3" />
                Community support
              </li>
            </ul>
            <Link
              href="/research"
              className="w-full block text-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Get Started Free
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-blue-500/50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center">
                <IconStar className="w-4 h-4 mr-1" />
                Most Popular
              </span>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Pro</h3>
              <div className="text-3xl font-bold text-white mb-2">$29</div>
              <p className="text-gray-400 text-sm">per month</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <IconCheck className="w-5 h-5 text-green-400 mr-3" />
                Unlimited research queries
              </li>
              <li className="flex items-center text-gray-300">
                <IconCheck className="w-5 h-5 text-green-400 mr-3" />
                Advanced citation management
              </li>
              <li className="flex items-center text-gray-300">
                <IconCheck className="w-5 h-5 text-green-400 mr-3" />
                Access to premium databases
              </li>
              <li className="flex items-center text-gray-300">
                <IconCheck className="w-5 h-5 text-green-400 mr-3" />
                Export to multiple formats
              </li>
              <li className="flex items-center text-gray-300">
                <IconCheck className="w-5 h-5 text-green-400 mr-3" />
                Priority support
              </li>
            </ul>
            <Link
              href="/research"
              className="w-full block text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Pro Trial
            </Link>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">Enterprise</h3>
              <div className="text-3xl font-bold text-white mb-2">Custom</div>
              <p className="text-gray-400 text-sm">For institutions and teams</p>
            </div>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <IconCheck className="w-5 h-5 text-green-400 mr-3" />
                Everything in Pro
              </li>
              <li className="flex items-center text-gray-300">
                <IconCheck className="w-5 h-5 text-green-400 mr-3" />
                Team collaboration tools
              </li>
              <li className="flex items-center text-gray-300">
                <IconCheck className="w-5 h-5 text-green-400 mr-3" />
                Custom integrations
              </li>
              <li className="flex items-center text-gray-300">
                <IconCheck className="w-5 h-5 text-green-400 mr-3" />
                Dedicated support
              </li>
              <li className="flex items-center text-gray-300">
                <IconCheck className="w-5 h-5 text-green-400 mr-3" />
                On-premise deployment
              </li>
            </ul>
            <Link
              href="/contact"
              className="w-full block text-center px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Contact Sales
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-lg font-medium text-white mb-2">Can I change plans anytime?</h4>
              <p className="text-gray-400">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-2">What databases do you support?</h4>
              <p className="text-gray-400">We integrate with arXiv, PubMed, Google Scholar, IEEE Xplore, and many more academic databases.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-2">Is my data secure?</h4>
              <p className="text-gray-400">Absolutely. We use enterprise-grade encryption and comply with academic privacy standards.</p>
            </div>
            <div>
              <h4 className="text-lg font-medium text-white mb-2">Do you offer student discounts?</h4>
              <p className="text-gray-400">Yes! Students and researchers can get 50% off Pro plans with valid academic email.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
