'use client';

import { Table } from '@tanstack/react-table';
import { format } from 'date-fns';
import { Calendar, ChevronDown } from 'lucide-react';
import { useCallback, useState } from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

// Import the Calendar component - using shadcn/ui calendar

interface DateRangeFilterProps<TData> {
  table: Table<TData>;
  columnKey: string; // The date column to filter
  title?: string;
  className?: string;
}

export function DateRangeFilter<TData>({
  table,
  columnKey,
  className,
}: DateRangeFilterProps<TData>) {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 7)), // Default to 7 days ago
    to: new Date(), // Default to today
  });
  const [open, setOpen] = useState(false);

  const column = table.getColumn(columnKey);

  // Apply the filter to the table
  const applyFilter = useCallback(
    (range: DateRange | undefined) => {
      if (!column) return;

      if (!range || (!range.from && !range.to)) {
        column.setFilterValue(undefined);
        return;
      }

      // Create start and end dates for filtering
      const filterValue: [string, string | undefined] = [
        range.from ? new Date(range.from).toISOString() : new Date(0).toISOString(),
        range.to ? new Date(range.to).toISOString() : undefined,
      ];

      column.setFilterValue(filterValue);
    },
    [column]
  );

  // Handle date selection
  const handleDateSelect = useCallback(
    (range: DateRange | undefined) => {
      setDate(range);

      if (range?.from && range?.to) {
        applyFilter(range);
        // Optionally close the popover when a complete range is selected
        // setOpen(false);
      } else if (!range) {
        applyFilter(undefined);
      }
    },
    [applyFilter]
  );

  // Clear the filter
  const handleClear = useCallback(() => {
    setDate({
      from: new Date(new Date().setDate(new Date().getDate() - 7)), // Default to 7 days ago
      to: new Date(), // Default to today
    });
    applyFilter(undefined);
    setOpen(false);
  }, [applyFilter]);

  // Format date range for display
  const formattedDateRange = useCallback(() => {
    if (!date?.from) return '';

    if (date.to) {
      return `${format(date.from, 'MMM d, yyyy')} - ${format(date.to, 'MMM d, yyyy')}`;
    }

    return format(date.from, 'MMM d, yyyy');
  }, [date]);

  // Check if filter is active
  const isActive = date?.from !== undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          size="sm"
          className={cn(
            '!h-[45px] cursor-pointer text-[#6B7280]  flex items-center gap-1',
            isActive && '',
            className
          )}
        >
          <Calendar className="h-4 w-4" />
          {/* {title} */}
          {isActive && (
            <>
              <span className="hidden md:inline-flex ml-1">{formattedDateRange()}</span>
            </>
          )}
          <ChevronDown className="h-4 w-4 ml-1" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 flex flex-col gap-2">
          <CalendarComponent
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateSelect}
            numberOfMonths={2}
            className="rounded-md border"
          />
          <div className="flex justify-between mt-2">
            <Button
              variant="outline"
              className="!h-10 text-sm cursor-pointer"
              size="sm"
              onClick={handleClear}
              disabled={!isActive}
            >
              Clear
            </Button>
            <Button size="sm" onClick={() => setOpen(false)} className="text-sm !h-[40px]">
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
