"use client";

// import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import {
  DataTableFacetedFilter,
  FilterOption,
  FilterValue,
} from "../components/data-table-faceted-filter";

interface DataTableToolbarProps<TData, T extends FilterValue> {
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
  showResetButton?: boolean;
  className?: string;
}

export function DataTableToolbar<TData, T extends FilterValue>({
  table,

  searches,
  filters,
  showResetButton = true,
  className,
}: DataTableToolbarProps<TData, T>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex flex-1 items-center space-x-2">
        {/* DYNAMIC SEARCH INPUT */}
        {searches?.map((search) => {
          const column = table.getColumn(search.columnKey);
          return column ? (
            <Input
              key={search.columnKey}
              placeholder={search.placeholder}
              value={(column.getFilterValue() as string) ?? ""}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="h-8 w-[150px] lg:w-[250px]"
            />
          ) : null;
        })}

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

        {/* {table.getColumn("testType") && (
          <DataTableFacetedFilter
            column={table.getColumn("testType")}
            title="Type"
            options={testTypes}
          />
        )} */}
        {isFiltered && showResetButton && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
