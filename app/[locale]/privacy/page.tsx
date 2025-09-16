"use client"

import { IconBrain, IconArrowLeft, IconShield } from "@tabler/icons-react"
import Link from "next/link"

export default function PrivacyPage() {
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
            <Link href="/pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
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

        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <IconShield className="w-8 h-8 text-blue-400 mr-3" />
              <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Your privacy and data security are our top priorities. Learn how we protect your research data.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: September 2024
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Information We Collect</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-white">Research Queries:</strong> We collect and process your research questions 
                  to provide AI-powered analysis and literature reviews.
                </p>
                <p>
                  <strong className="text-white">Account Information:</strong> Email address, name, and institutional 
                  affiliation for account management and service delivery.
                </p>
                <p>
                  <strong className="text-white">Usage Data:</strong> Information about how you interact with our platform 
                  to improve our services and user experience.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">How We Use Your Information</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-white">Research Services:</strong> To provide AI-powered literature analysis, 
                  citation management, and research synthesis.
                </p>
                <p>
                  <strong className="text-white">Service Improvement:</strong> To enhance our algorithms and develop 
                  new features based on usage patterns.
                </p>
                <p>
                  <strong className="text-white">Communication:</strong> To send important updates about your account 
                  and our services.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Data Security</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-white">Encryption:</strong> All data is encrypted in transit and at rest 
                  using industry-standard encryption protocols.
                </p>
                <p>
                  <strong className="text-white">Access Controls:</strong> Strict access controls ensure only 
                  authorized personnel can access your data.
                </p>
                <p>
                  <strong className="text-white">Regular Audits:</strong> We conduct regular security audits and 
                  penetration testing to maintain the highest security standards.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Your Rights</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  <strong className="text-white">Access:</strong> You can request access to all personal data we hold about you.
                </p>
                <p>
                  <strong className="text-white">Correction:</strong> You can request correction of inaccurate or incomplete data.
                </p>
                <p>
                  <strong className="text-white">Deletion:</strong> You can request deletion of your personal data, 
                  subject to legal and operational requirements.
                </p>
                <p>
                  <strong className="text-white">Portability:</strong> You can request a copy of your data in a 
                  machine-readable format.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Us</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  If you have any questions about this Privacy Policy or our data practices, please contact us:
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p><strong className="text-white">Email:</strong> privacy@nocturnal-archive.com</p>
                  <p><strong className="text-white">Address:</strong> Nocturnal Archive Privacy Team</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
