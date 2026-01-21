import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal,  XCircle, RotateCcw, Trash2 } from "lucide-react";
import { useAuthStore } from "@/store/AuthStore";
// import Role from "@/pages/Role";
import { Roles } from "@/constants/role.constant";

interface BulkActionsDropdownProps {
  selectedCount: number;
  canAssign: boolean;
  canDelete: boolean;

  onClear: () => void;
  onUnassignTeamLeads: () => void;
  onUnassignTeamMemberLeads: () => void;
//   onUnassignAll: () => void;
  onDeleteAll: () => void;
}

export function BulkActionsDropdown({
  selectedCount,
  canAssign,
  canDelete,
  onClear,
  onUnassignTeamLeads,
  onUnassignTeamMemberLeads,
  onDeleteAll,
}: BulkActionsDropdownProps) {
  const isDisabled = selectedCount === 0;
  const {user} = useAuthStore();
  console.log("BOOLEN", canDelete)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          disabled={isDisabled}
          className="flex items-center gap-2"
        >
          <MoreHorizontal className="h-4 w-4" />
          Actions
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-48">
        {/* Clear selection */}
        <DropdownMenuItem
          onClick={onClear}
          className="cursor-pointer"
        >
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear selection
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Unassign all */}
        <DropdownMenuItem
          disabled={user?.role !== Roles.LEAD_GEN_MANAGER || canAssign === false }
          onClick={onUnassignTeamLeads}
          className="cursor-pointer"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Unassign Team Leads({selectedCount})
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={user?.role !== Roles.EXECUTIVE || canAssign === false }
          onClick={onUnassignTeamMemberLeads}
          className="cursor-pointer"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Unassign Members Leads({selectedCount})
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Delete all */}
        <DropdownMenuItem
          disabled={canDelete  === false}
          onClick={onDeleteAll}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
           all ({selectedCount})
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
