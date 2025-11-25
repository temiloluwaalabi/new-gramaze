/* eslint-disable @typescript-eslint/no-unused-vars */
import { Table } from "@tanstack/react-table";
import { Trash2, Loader2 } from "lucide-react";
// import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface BulkDeleteProps<TData> {
  table: Table<TData>;
  // onDelete: (item: TData) => Promise<void>;
  // onSuccess?: (deletedItems: TData[]) => void;
  entityName?: string; // e.g., "appointment", "user", "task"
  confirmMessage?: string;
  showProgress?: boolean;
}

export function BulkDelete<TData extends { id: string | number }>({
  table,

  entityName = "item",
  confirmMessage,
  showProgress = true,
}: BulkDeleteProps<TData>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionProgress, setDeletionProgress] = useState({
    current: 0,
    total: 0,
  });
  // const pathname = usePathname();

  const selectedRows = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original);
  const selectedCount = selectedRows.length;

  // Parallel deletion (all at once)
  const handleBulkDelete = async () => {
    setIsDeleting(true);
    setDeletionProgress({ current: 0, total: selectedCount });
    const results = {
      successful: [] as TData[],
      failed: [] as { item: TData; error: unknown }[],
    };

    const deletePromises = selectedRows.map(async (item, index) => {
      const itemId = typeof item.id === "string" ? Number(item.id) : item.id;

      try {
        // await deleteAppointment(
        //   {
        //     id: itemId,
        //   },
        //   pathname
        // );

        results.successful.push(item);

        // Update progress
        setDeletionProgress((prev) => ({ ...prev, current: prev.current + 1 }));

        return { success: true, item };
      } catch (error) {
        console.error(`❌ Failed to delete ${entityName} ID ${itemId}:`, error);
        results.failed.push({ item, error });

        // Update progress even on failure
        setDeletionProgress((prev) => ({ ...prev, current: prev.current + 1 }));

        return { success: false, item, error };
      }
    });

    await Promise.all(deletePromises);
    return results;
  };
  if (selectedCount === 0) return null;

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="destructive"
        size="sm"
        className="flex !h-[41px] cursor-pointer items-center gap-2"
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="me-2 size-4 animate-spin" />
        ) : (
          <Trash2 className="size-4" />
        )}
        Delete Selected ({selectedCount})
      </Button>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmMessage || (
                <>
                  You are about to delete <strong>{selectedCount}</strong>{" "}
                  {entityName}
                  {selectedCount !== 1 ? "s" : ""}. This action cannot be
                  undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {isDeleting && showProgress && deletionProgress.total > 0 && (
            <div className="py-2">
              <div className="text-muted-foreground mb-2 flex items-center justify-between text-sm">
                <span>Deleting {entityName}s...</span>
                <span>
                  {deletionProgress.current} / {deletionProgress.total}
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-red-600 transition-all duration-300"
                  style={{
                    width: `${(deletionProgress.current / deletionProgress.total) * 100}%`,
                  }}
                />
              </div>
            </div>
          )}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
