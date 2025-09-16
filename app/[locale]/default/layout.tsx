"use client"
import { useEffect, useState } from "react"
import { GlobalState } from "@/components/utility/global-state"

export default function DefaultLayout({ children }) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const mockWorkspace = {
    id: "default",
    name: "Default Workspace",
    description: "Development workspace",
    is_home: true,
    user_id: "dev-user",
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  }

  const mockProfile = {
    id: "dev-user",
    user_id: "dev-user",
    email: "dev@example.com",
    full_name: "Development User",
    avatar_url: null,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z"
  }

  return (
    <GlobalState
      workspace={mockWorkspace}
      profile={mockProfile}
      assistants={[]}
      chats={[]}
      files={[]}
      collections={[]}
      tools={[]}
      models={[]}
      folders={[]}
      prompts={[]}
    >
      {children}
    </GlobalState>
  )
}
