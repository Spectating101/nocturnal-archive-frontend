import { FC } from "react"
import {
  IconBrain,
  IconMessage,
  IconFiles,
  IconSettings
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { ContentType } from "@/types"

// Export the icon size constant used by other components
export const SIDEBAR_ICON_SIZE = 20

interface SidebarSwitcherProps {
  onContentTypeChange: (contentType: ContentType) => void
}

export const SidebarSwitcher: FC<SidebarSwitcherProps> = ({
  onContentTypeChange
}) => {
  return (
    <div className="flex flex-col space-y-1 p-2">
      <Button
        className="justify-start"
        variant="ghost"
        size="sm"
        onClick={() => onContentTypeChange("chats")}
      >
        <IconMessage className="mr-2" size={20} />
        Chats
      </Button>

      <Button
        className="justify-start"
        variant="ghost"
        size="sm"
        onClick={() => onContentTypeChange("research")}
      >
        <IconBrain className="mr-2" size={20} />
        Research
      </Button>

      <Button
        className="justify-start"
        variant="ghost"
        size="sm"
        onClick={() => onContentTypeChange("files")}
      >
        <IconFiles className="mr-2" size={20} />
        Files
      </Button>

      <Button
        className="justify-start"
        variant="ghost"
        size="sm"
        onClick={() => onContentTypeChange("settings")}
      >
        <IconSettings className="mr-2" size={20} />
        Settings
      </Button>
    </div>
  )
}
