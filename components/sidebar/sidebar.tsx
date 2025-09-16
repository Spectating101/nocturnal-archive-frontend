import { ChatbotUIContext } from "@/context/context"
import { Tables } from "@/supabase/types"
import { ContentType } from "@/types"
import { FC, useContext } from "react"
import { SIDEBAR_WIDTH } from "../ui/dashboard"
import { TabsContent } from "../ui/tabs"
import { WorkspaceSwitcher } from "../utility/workspace-switcher"
import { WorkspaceSettings } from "../workspace/workspace-settings"
import { SidebarContent } from "./sidebar-content"
import { Button } from "../ui/button"
import { IconBrain, IconFileText, IconChartLine } from "@tabler/icons-react"

// Import the missing sidebar components
const ChatsSidebar = SidebarContent
const FilesSidebar = SidebarContent  
const SettingsSidebar = SidebarContent

interface SidebarProps {
  contentType: ContentType
  showSidebar: boolean
}

export const Sidebar: FC<SidebarProps> = ({ contentType, showSidebar }) => {
  return (
    <div className="flex h-full w-full flex-col">
      {contentType === "chats" && <ChatsSidebar />}
      {contentType === "research" && <ResearchSidebar />}
      {contentType === "files" && <FilesSidebar />}
      {contentType === "settings" && <SettingsSidebar />}
    </div>
  )
}

const ResearchSidebar: FC = () => {
  return (
    <div className="flex h-full flex-col space-y-4 p-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold">Research Automation</h3>
        <p className="text-sm text-muted-foreground">
          AI-powered research synthesis
        </p>
      </div>

      <div className="space-y-2">
        <Button className="w-full" variant="outline">
          <IconBrain className="mr-2 h-4 w-4" />
          New Research
        </Button>
        <Button className="w-full" variant="outline">
          <IconFileText className="mr-2 h-4 w-4" />
          Research History
        </Button>
        <Button className="w-full" variant="outline">
          <IconChartLine className="mr-2 h-4 w-4" />
          Analytics
        </Button>
      </div>
    </div>
  )
}
