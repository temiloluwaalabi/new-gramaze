'use client';

import { Table } from '@tanstack/react-table';
import { Download, ExternalLink, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

// Component for filtering upcoming appointments
interface UpcomingFilterProps<TData> {
  table: Table<TData>;
  columnKey: string; // The date column to filter
}

export function UpcomingFilter<TData>({ table, columnKey }: UpcomingFilterProps<TData>) {
  const [showUpcoming, setShowUpcoming] = useState(false);
  const column = table.getColumn(columnKey);

  const handleUpcomingToggle = useCallback(
    (checked: boolean) => {
      setShowUpcoming(checked);

      if (!column) return;

      if (checked) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // reset to start of today
        column.setFilterValue(today.toISOString()); // pass ISO date to filter
      } else {
        column.setFilterValue(undefined); // clear filter
      }
    },
    [column]
  );

  return (
    <div className="space-x-2 border rounded-[6px] !h-[45px] w-[131px] px-4 flex items-center justify-center">
      <Checkbox id="upcoming" checked={showUpcoming} onCheckedChange={handleUpcomingToggle} />
      <label htmlFor="upcoming" className="text-base text-[#4B5563] font-medium cursor-pointer">
        Upcoming
      </label>
    </div>
  );
}

// Export button component
interface ExportButtonProps<TData> {
  table: Table<TData>;
  exportFunction?: (data: TData[]) => void;
}

export function ExportButton<TData>({ table, exportFunction }: ExportButtonProps<TData>) {
  const handleExport = useCallback(() => {
    // Get the filtered rows data
    const filteredData = table.getFilteredRowModel().rows.map((row) => row.original);

    if (exportFunction) {
      exportFunction(filteredData);
    } else {
      // Default export - can be CSV, Excel, etc.
      console.log('Exporting data:', filteredData);

      // Example: Download as JSON
      const dataStr = JSON.stringify(filteredData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

      const exportFileDefaultName = 'export.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      linkElement.remove();

      toast('Exported successfully');
    }
  }, [table, exportFunction]);

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      className="flex !h-[45px] cursor-pointer items-center gap-2"
    >
      <Download className="h-4 w-4" />
      Export
    </Button>
  );
}

// Add new button/link component
interface AddNewButtonProps {
  href?: string;
  onClick?: () => void;
  text?: string;
}

export function AddNewButton({ href, onClick, text = 'Add New' }: AddNewButtonProps) {
  if (href) {
    return (
      <Button asChild className="flex items-center gap-2 !h-[45px] text-sm">
        <a href={href} className="text-sm">
          <Plus className="h-4 w-4" />
          {text}
        </a>
      </Button>
    );
  }

  return (
    <Button onClick={onClick} className="flex items-center gap-2">
      <Plus className="h-4 w-4" />
      {text}
    </Button>
  );
}

// Navigate to details button
interface NavigateButtonProps {
  href: string;
  text: string;
}

export function NavigateButton({ href, text }: NavigateButtonProps) {
  return (
    <Button variant="outline" asChild className="flex items-center gap-2">
      <a href={href}>
        <ExternalLink className="h-4 w-4" />
        {text}
      </a>
    </Button>
  );
}
