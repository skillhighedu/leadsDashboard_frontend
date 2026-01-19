import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2, XCircle, RotateCcw } from "lucide-react";

interface BulkActionsDropdownProps {
  selectedCount: number;
  canAssign: boolean;
  canDelete: boolean;

  onClear: () => void;
  onUnassignAll: () => void;
  onDeleteAll: () => void;
}

export function BulkActionsDropdown({
  selectedCount,
  canAssign,
  canDelete,
  onClear,
  onUnassignAll,
  onDeleteAll,
}: BulkActionsDropdownProps) {
  const isDisabled = selectedCount === 0;

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
          disabled={!canAssign}
          onClick={onUnassignAll}
          className="cursor-pointer"
        >
          <XCircle className="mr-2 h-4 w-4" />
          Unassign all ({selectedCount})
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Delete all */}
        <DropdownMenuItem
          disabled={!canDelete}
          onClick={onDeleteAll}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete all ({selectedCount})
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
