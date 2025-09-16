"use client"

import { useState } from "react"
import NocturnalChat from "@/components/chat/nocturnal-chat"

export default function ResearchPage() {
  const [activeTab, setActiveTab] = useState<'research'>('research')

  return (
    <div className="flex h-screen w-full bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 dark">
      <div className="flex-1 min-w-0">
        <NocturnalChat />
      </div>
    </div>
  )
}