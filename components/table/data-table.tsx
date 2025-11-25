/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnResizeDirection,
  ColumnResizeMode,
  flexRender,
  getCoreRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Table as TableT,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { ReactNode, useState } from "react";

import { cn } from "@/lib/utils";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  FilterOption,
  FilterValue,
} from "./components/data-table-faceted-filter";
import { DataTablePagination } from "./components/pagination-comp";
import { NewDataTableToolbar } from "./toolbars/new-table-toolbar";
import { DataTableToolbar } from "./toolbars/transaction-table-toolbar";

interface DataTableProps<
  TData,
  TValue extends FilterValue,
  T extends FilterValue,
> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  newToolbar?: {
    tableTitle?: string;
    tableDescription?: string;
    show?: boolean;
    search?: {
      columnKey: string;
      placeholder: string;
    }[];
    filters?: {
      columnKey: string;
      title: string;
      options?: FilterOption<FilterValue>[];
    }[];
    // Custom elements to render in the toolbar
    customElements?: ReactNode | ((table: TableT<TData>) => ReactNode);
    // Action buttons (like export, add new, etc.)
    actionButtons?: ReactNode | ((table: TableT<TData>) => ReactNode);
    showUpcoming?: boolean;
    showExport?: boolean;
    upcomingKey?: string;
    showDateRange?: boolean;
    dateRangeKey?: string;
    showBulkDelete?: boolean; // Add this line
    bulkDeleteConfig?: {
      onDeleteSuccess?: () => void;
      confirmMessage?: string;
    };
  };
  // Toolbar configuration
  toolbar?: {
    show?: boolean;
    filters?: {
      columnKey: string;
      title: string;
      options?: FilterOption<FilterValue>[];
    }[];
    search?: {
      columnKey: string;
      placeholder: string;
    }[];
    showResetButton?: boolean;
  };
  // Pagination configuration
  pagination?: {
    show?: boolean;
    defaultPageSize?: number;
  };

  className?: string;
  tableClassname?: string;
  bodyRowClassname?: string;
  bodyCellClassname?: string;
  headerCellClassName?: string;

  showPagination?: boolean;

  // Features
  //   enableRowSelection?: boolean;
  enableColumnResizing?: boolean;
  enableSorting?: boolean;

  // Debug options
  debug?: {
    table?: boolean;
    headers?: boolean;
    columns?: boolean;
  };
}

export function DataTable<
  TData extends { id: string | number },
  TValue extends FilterValue,
  T extends FilterValue,
>({
  columns,
  data,
  tableClassname,
  bodyCellClassname,
  headerCellClassName,
  bodyRowClassname,
  enableColumnResizing = false,
  enableSorting = true,
  debug = {},
  //   className,
  toolbar = { show: true },
  newToolbar = { show: false },
  pagination = { show: true, defaultPageSize: 10 },
}: DataTableProps<TData, TValue, T>) {
  //   const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnResizeMode, setColumnResizeMode] = useState<ColumnResizeMode>(
    enableColumnResizing
      ? ("onChange" as ColumnResizeMode)
      : ("none" as ColumnResizeMode)
  );
  const [columnResizeDirection, setColumnResizeDirection] =
    useState<ColumnResizeDirection>("ltr");

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data,
    columns,

    initialState: {
      pagination: {
        pageSize: pagination.defaultPageSize,
      },
    },

    columnResizeMode,
    columnResizeDirection,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,

    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),

    onGlobalFilterChange: setGlobalFilter,
    getFacetedMinMaxValues: getFacetedMinMaxValues(),

    state: {
      globalFilter,
      columnFilters,
      rowSelection,
      sorting,
      columnVisibility: {
        ...columnVisibility,
        assignedCaregiver: false, // Hide from display
        role: false,
      },
    },

    debugTable: debug.table,
    debugHeaders: debug.headers,
    debugColumns: debug.columns,
  });

  return (
    <div className="space-y-4 !pt-0">
      {toolbar.show && (
        <DataTableToolbar
          table={table}
          searches={toolbar.search}
          filters={toolbar.filters}
          showResetButton={toolbar.showResetButton}
        />
      )}
      {newToolbar.show && (
        <NewDataTableToolbar<TData, TValue>
          tableTitle={newToolbar.tableTitle || ""}
          tableDescription={newToolbar.tableDescription}
          table={table}
          searches={newToolbar.search}
          filters={
            newToolbar.filters as {
              columnKey: string;
              title: string;
              options?: FilterOption<TValue>[];
            }[]
          }
          customElements={newToolbar.customElements}
          actionButtons={newToolbar.actionButtons}
          showUpcoming={newToolbar.showUpcoming}
          showExport={newToolbar.showExport}
          upcomingKey={newToolbar.upcomingKey}
          showDateRange={newToolbar.showDateRange}
          dateRangeKey={newToolbar.dateRangeKey}
          // showResetButton={newToolbar.showResetButton}
        />
      )}
      <div className="!custom-scrollbar">
        <Table
          className={cn(
            "!custom-scrollbar !rounded-lg !border",
            tableClassname
          )}
          // style={{ width: table.getCenterTotalSize() }}
        >
          <TableHeader className="bg-[#F3F4F6] text-black">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="text-white">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "border px-4 py-3 font-semibold text-[#1F2937]",
                        {
                          "cursor-pointer select-none":
                            enableSorting && header.column.getCanSort(),
                          "resize-handle": enableColumnResizing,
                        },
                        headerCellClassName
                      )}
                      style={
                        enableColumnResizing
                          ? { width: header.getSize() }
                          : undefined
                      }
                      colSpan={header.colSpan}
                      // style={{ width: header.getSize() }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "group hover:bg-muted/50 bg- cursor-pointer",
                    {
                      "bg-muted/50": row.getIsSelected(),
                    },
                    bodyRowClassname
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cn(
                        "px-4 py-4 text-xs md:text-sm lg:text-base",
                        bodyCellClassname
                      )}
                      style={
                        enableColumnResizing
                          ? { width: cell.column.getSize() }
                          : undefined
                      }
                      // style={{ width: cell.column.getSize() }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No Results
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {pagination.show && <DataTablePagination table={table} />}
    </div>
  );
}
