import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSidebar } from "@/components/ui/sidebar"

type Props = {
  to: string
  label: string
  icon: React.ElementType
  onClick?: () => void
}

export function SidebarNavItem({ to, label, icon: Icon, onClick }: Props) {
  const { open } = useSidebar()

  const button = (
    <Button
      variant="ghost"
      className="w-full justify-start gap-3 px-3 text-gray-700 hover:bg-gray-100"
    >
      <Icon className="h-4 w-4 shrink-0" />
      {open && <span className="truncate">{label}</span>}
    </Button>
  )

  return (
    <Link to={to} onClick={onClick}>
      {open ? (
        button
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      )}
    </Link>
  )
}
