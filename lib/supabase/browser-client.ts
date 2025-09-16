import { createBrowserClient } from "@supabase/ssr"
import { Database } from "@/supabase/types"

const isDev = process.env.NODE_ENV === "development"

export const supabase = createBrowserClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mock.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "mock-anon-key"
)
