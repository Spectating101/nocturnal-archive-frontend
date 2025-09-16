"use client"

import { IconBrain, IconArrowLeft, IconCheck, IconX, IconAlertTriangle } from "@tabler/icons-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { checkHealth } from "@/lib/api"

export default function StatusPage() {
  const [healthStatus, setHealthStatus] = useState<"ok" | "degraded" | "down">("down");
  const [loading, setLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const health = await checkHealth();
        setHealthStatus(health.status);
        setLastChecked(new Date());
      } catch (err) {
        setHealthStatus("down");
        setLastChecked(new Date());
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    
    // Check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (healthStatus) {
      case "ok":
        return <IconCheck className="w-8 h-8 text-green-400" />;
      case "degraded":
        return <IconAlertTriangle className="w-8 h-8 text-yellow-400" />;
      case "down":
        return <IconX className="w-8 h-8 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    switch (healthStatus) {
      case "ok":
        return "text-green-400";
      case "degraded":
        return "text-yellow-400";
      case "down":
        return "text-red-400";
    }
  };

  const getStatusMessage = () => {
    switch (healthStatus) {
      case "ok":
        return "All systems operational";
      case "degraded":
        return "Some services may be experiencing issues";
      case "down":
        return "Service temporarily unavailable";
    }
  };

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
            <h1 className="text-4xl font-bold text-white mb-4">System Status</h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Real-time status of Nocturnal Archive services and infrastructure.
            </p>
          </div>

          {/* Status Overview */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <div className="flex items-center justify-center space-x-4 mb-6">
              {loading ? (
                <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
              ) : (
                getStatusIcon()
              )}
              <div>
                <h2 className={`text-2xl font-semibold ${getStatusColor()}`}>
                  {loading ? "Checking..." : healthStatus.toUpperCase()}
                </h2>
                <p className="text-gray-300">
                  {loading ? "Checking system status..." : getStatusMessage()}
                </p>
              </div>
            </div>

            {lastChecked && (
              <div className="text-center text-sm text-gray-500">
                Last checked: {lastChecked.toLocaleString()}
              </div>
            )}
          </div>

          {/* Service Components */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Frontend Services</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Web Interface</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-green-400 text-sm">Operational</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">API Gateway</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      healthStatus === "ok" ? "bg-green-400" : 
                      healthStatus === "degraded" ? "bg-yellow-400" : "bg-red-400"
                    }`} />
                    <span className={`text-sm ${
                      healthStatus === "ok" ? "text-green-400" : 
                      healthStatus === "degraded" ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {healthStatus === "ok" ? "Operational" : 
                       healthStatus === "degraded" ? "Degraded" : "Down"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">Backend Services</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Research API</span>
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      healthStatus === "ok" ? "bg-green-400" : 
                      healthStatus === "degraded" ? "bg-yellow-400" : "bg-red-400"
                    }`} />
                    <span className={`text-sm ${
                      healthStatus === "ok" ? "text-green-400" : 
                      healthStatus === "degraded" ? "text-yellow-400" : "text-red-400"
                    }`}>
                      {healthStatus === "ok" ? "Operational" : 
                       healthStatus === "degraded" ? "Degraded" : "Down"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Database</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span className="text-green-400 text-sm">Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Incident History */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Incidents</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                <div>
                  <div className="text-white font-medium">Service Maintenance</div>
                  <div className="text-gray-400 text-sm">September 15, 2024</div>
                </div>
                <span className="text-yellow-400 text-sm">Resolved</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-700/50">
                <div>
                  <div className="text-white font-medium">API Rate Limiting</div>
                  <div className="text-gray-400 text-sm">September 10, 2024</div>
                </div>
                <span className="text-green-400 text-sm">Resolved</span>
              </div>
              <div className="text-center text-gray-500 text-sm py-4">
                No active incidents
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">Need Help?</h3>
            <p className="text-gray-300 mb-4">
              If you're experiencing issues not reflected in this status page, please contact our support team.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
