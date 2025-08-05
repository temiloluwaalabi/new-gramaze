'use client';

// import { Input } from "@/components/ui/input"
import { Table } from '@tanstack/react-table';
import { SortDesc } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { FilterOption, FilterValue } from '../components/data-table-faceted-filter';

interface DataTableToolbarProps<TData, T extends FilterValue> {
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
  showResetButton?: boolean;
  className?: string;
}

export function NewDataTableToolbar<TData, T extends FilterValue>({
  table,
  tableTitle,
  tableDescription,
  searches,
  className,
}: DataTableToolbarProps<TData, T>) {
  return (
    <div
      className={cn(
        'flex flex-col lg:flex-row items-start lg:items-center gap-3 justify-between',
        className
      )}
    >
      <div className="flex flex-1 items-center space-x-2">
        <div className="flex flex-col gap-1">
          <span className="text-lg text-black font-medium"> {tableTitle}</span>{' '}
          <span className="text-sm text-[#66666b] font-normal">{tableDescription}</span>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Button className="!h-[40px] bg-transparent" variant="outline">
          <SortDesc /> Sort by
        </Button>
        {/* DYNAMIC SEARCH INPUT */}
        {searches?.map((search) => {
          const column = table.getColumn(search.columnKey);
          return column ? (
            <Input
              key={search.columnKey}
              placeholder={search.placeholder}
              value={(column.getFilterValue() as string) ?? ''}
              onChange={(e) => column.setFilterValue(e.target.value)}
              className="h-[40px] w-[150px] lg:w-[296px] pl-8"
            />
          ) : null;
        })}
      </div>
      {/* <DataTableViewOptions table={table} /> */}
    </div>
  );
}
