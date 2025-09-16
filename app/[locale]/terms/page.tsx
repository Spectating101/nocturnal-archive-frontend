"use client"

import { IconBrain, IconArrowLeft, IconFileText } from "@tabler/icons-react"
import Link from "next/link"

export default function TermsPage() {
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
              <IconFileText className="w-8 h-8 text-blue-400 mr-3" />
              <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
            </div>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Please read these terms carefully before using Nocturnal Archive.
            </p>
            <p className="text-sm text-gray-500 mt-4">
              Last updated: September 2024
            </p>
          </div>

          {/* Content */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Acceptance of Terms</h2>
              <p className="text-gray-300">
                By accessing and using Nocturnal Archive, you accept and agree to be bound by the terms 
                and provision of this agreement. If you do not agree to abide by the above, please do 
                not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Use License</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  Permission is granted to temporarily use Nocturnal Archive for personal, non-commercial 
                  transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>modify or copy the materials</li>
                  <li>use the materials for any commercial purpose or for any public display</li>
                  <li>attempt to reverse engineer any software contained on the website</li>
                  <li>remove any copyright or other proprietary notations from the materials</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Service Availability</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  We strive to maintain high service availability, but we do not guarantee uninterrupted 
                  access to our services. We reserve the right to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>modify or discontinue the service at any time</li>
                  <li>perform maintenance that may temporarily interrupt service</li>
                  <li>implement usage limits to ensure fair access for all users</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">User Responsibilities</h2>
              <div className="space-y-4 text-gray-300">
                <p>As a user of Nocturnal Archive, you agree to:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Use the service only for legitimate academic and research purposes</li>
                  <li>Respect intellectual property rights and cite sources appropriately</li>
                  <li>Not attempt to circumvent any security measures or usage limits</li>
                  <li>Not use the service for any illegal or unauthorized purpose</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Intellectual Property</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  The service and its original content, features, and functionality are and will remain 
                  the exclusive property of Nocturnal Archive and its licensors. The service is protected 
                  by copyright, trademark, and other laws.
                </p>
                <p>
                  You retain ownership of your research queries and any original content you create. 
                  However, you grant us a license to use this information to provide and improve our services.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Limitation of Liability</h2>
              <p className="text-gray-300">
                In no event shall Nocturnal Archive, nor its directors, employees, partners, agents, 
                suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, 
                or punitive damages, including without limitation, loss of profits, data, use, goodwill, 
                or other intangible losses, resulting from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Governing Law</h2>
              <p className="text-gray-300">
                These Terms shall be interpreted and governed by the laws of the jurisdiction in which 
                Nocturnal Archive operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Changes to Terms</h2>
              <p className="text-gray-300">
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
                If a revision is material, we will try to provide at least 30 days notice prior to any new 
                terms taking effect.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">Contact Information</h2>
              <div className="space-y-4 text-gray-300">
                <p>
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <div className="bg-gray-800/50 rounded-lg p-4">
                  <p><strong className="text-white">Email:</strong> legal@nocturnal-archive.com</p>
                  <p><strong className="text-white">Address:</strong> Nocturnal Archive Legal Team</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
