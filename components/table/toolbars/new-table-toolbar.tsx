"use client";

// import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table";
import { ReactNode } from "react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { BulkDelete } from "./bulk-delete-appointment";
import {
  DataTableFacetedFilter,
  FilterOption,
  FilterValue,
} from "../components/data-table-faceted-filter";
import { DateRangeFilter } from "../components/date-range-filter";
import { UpcomingFilter, ExportButton } from "../components/upcoming-filter";

interface DataTableToolbarProps<
  TData extends { id: string | number },
  T extends FilterValue,
> {
  tableTitle: string;
  tableDescription?: string;
  table: Table<TData>;
  // Allow multiple search inputs
  searches?: {
    columnKey: string;
    placeholder: string;
  }[];

  // Replace filterOne/filterTwo with dynamic filters
  filters?: {
    columnKey: string;
    title: string;
    options?: FilterOption<T>[];
  }[];
  bulkDeleteConfig?: {
    onDeleteSuccess: () => void;
    confirmMessage: string;
  };
  // Custom elements to render in the toolbar
  customElements?: ReactNode | ((table: Table<TData>) => ReactNode);
  showUpcoming?: boolean;
  showExport?: boolean;
  showDateRange?: boolean;
  dateRangeKey?: string;
  upcomingKey?: string;

  // Action buttons (like export, add new, etc.)
  actionButtons?: ReactNode | ((table: Table<TData>) => ReactNode);
  showResetButton?: boolean;
  className?: string;

  showBulkDelete?: boolean; // Add this prop
}

export function NewDataTableToolbar<
  TData extends { id: string | number },
  T extends FilterValue,
>({
  table,
  tableTitle,
  tableDescription,
  filters,
  searches,
  customElements,
  actionButtons,
  showUpcoming,
  showExport,
  showDateRange,
  dateRangeKey,
  upcomingKey,
  showBulkDelete = true, // Default to true
  bulkDeleteConfig,
  className,
}: DataTableToolbarProps<TData, T>) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-start justify-between gap-3 lg:flex-row lg:items-center",
        className
      )}
    >
      <div className="flex w-full items-center space-x-2">
        {showDateRange && dateRangeKey ? (
          <DateRangeFilter table={table} columnKey={dateRangeKey} />
        ) : (
          <div className="flex w-full flex-col gap-1">
            <span className="text-lg font-medium text-black">
              {" "}
              {tableTitle}
            </span>{" "}
            <span className="text-sm font-normal text-[#66666b]">
              {tableDescription}
            </span>
          </div>
        )}
      </div>
      {/* Bulk Delete Button */}

      <div className="flex w-full flex-wrap items-center justify-start gap-3 lg:justify-end">
        {showBulkDelete && (
          <>
            <BulkDelete<TData>
              table={table}
              // onDelete={bulkDeleteConfig?.onDeleteSuccess}
              confirmMessage={bulkDeleteConfig?.confirmMessage}
            />
          </>
        )}
        {showUpcoming && upcomingKey && (
          <UpcomingFilter table={table} columnKey={upcomingKey} />
        )}
        {showExport && <ExportButton table={table} />}
        {filters?.map((filter) => {
          const column = table.getColumn(filter.columnKey);

          return column ? (
            <DataTableFacetedFilter
              column={column}
              key={filter.columnKey}
              title={filter.title}
              options={filter.options}
            />
          ) : null;
        })}

        {typeof customElements === "function"
          ? customElements(table)
          : customElements}
        {typeof actionButtons === "function"
          ? actionButtons(table)
          : actionButtons}

        {/* DYNAMIC SEARCH INPUT */}
        {searches?.map((search) => {
          const column = table.getColumn(search.columnKey);
          return column ? (
            <Input
              key={search.columnKey}
              placeholder={search.placeholder}
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="!h-[45px] w-fit pl-4 lg:w-[296px]"
            />
          ) : null;
        })}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
