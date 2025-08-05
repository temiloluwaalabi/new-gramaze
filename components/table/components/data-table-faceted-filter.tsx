"use client";
import { Column } from "@tanstack/react-table";
import { Check, PlusCircle } from "lucide-react";
import React, { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
export type FilterValue = string | boolean | number;
export type FilterOption<T extends FilterValue> = {
  name: string;
  value: T;
  icon?: React.ComponentType<{ className?: string }>;
};
interface DataTableFacetedFilterProps<TData, TValue, T extends FilterValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options?: FilterOption<T>[];
  className?: string;

  variant?: "single" | "multiple"; // Add selection mode
  onFilterChange?: (values: T[]) => void;
}

export function DataTableFacetedFilter<TData, TValue, T extends FilterValue>({
  column,
  title,
  variant = "multiple",
  options,
  className,
  onFilterChange,
}: DataTableFacetedFilterProps<TData, TValue, T>) {
  const [openPopover, setOpenPopover] = useState(false);

  const facets = column?.getFacetedUniqueValues();

  // Convert column filter value to appropriate type
  const currentFilterValue = column?.getFilterValue();

  // Handle different types of filter values
  const selectedValues = useMemo(() => {
    if (!currentFilterValue) return new Set<T>();

    if (Array.isArray(currentFilterValue)) {
      return new Set(
        currentFilterValue.map((value) =>
          typeof value === "string"
            ? (value as T)
            : typeof value === "boolean"
              ? (value as T)
              : (value as T)
        )
      );
    }

    return new Set([currentFilterValue as T]);
  }, [currentFilterValue]);
  const handleOptionToggle = (value: T) => {
    const newSelectedValues = new Set(selectedValues);

    if (variant === "single") {
      // Single selection mode
      if (newSelectedValues.has(value)) {
        newSelectedValues.clear();
      } else {
        newSelectedValues.clear();
        newSelectedValues.add(value);
      }
    } else {
      // Multiple selection mode
      if (newSelectedValues.has(value)) {
        newSelectedValues.delete(value);
      } else {
        newSelectedValues.add(value);
      }
    }

    const filterValues = Array.from(newSelectedValues);

    // Update the column filter
    column?.setFilterValue(filterValues.length ? filterValues : undefined);

    // Call the optional change handler
    onFilterChange?.(filterValues);
  };
  // Helper to get display value
  const getDisplayValue = (option: FilterOption<T>) => {
    if (typeof option.value === "boolean") {
      return option.name;
    }
    return option.value.toString();
  };
  return (
    <Popover open={openPopover} onOpenChange={setOpenPopover}>
      <PopoverTrigger asChild>
        <Button
          aria-label={`Filter by ${title}`}
          aria-haspopup="listbox"
          aria-expanded={openPopover}
          variant={"outline"}
          size={"sm"}
          className={cn(
            "hover:bg-light-700 h-8 border-dashed dark:bg-transparent",
            className
          )}
        >
          <PlusCircle />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation={"vertical"} className="mx-2 h-4" />
              <Badge
                variant={"secondary"}
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > 2 ? (
                  <Badge
                    variant={"secondary"}
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options?.length &&
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        key={getDisplayValue(option)}
                        variant={"secondary"}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.name}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command className="dark:bg-dark-300">
          <CommandInput placeholder={`Search ${title?.toLowerCase()}...`} />
          <CommandList>
            <CommandEmpty>No results found</CommandEmpty>
            <CommandGroup>
              {options?.map((option) => {
                const isSelected = selectedValues.has(option.value);

                return (
                  <CommandItem
                    key={getDisplayValue(option)}
                    className="cursor-pointer"
                    onSelect={() => handleOptionToggle(option.value)}
                  >
                    <div
                      className={cn(
                        "border-primary mr-2 flex size-4 items-center justify-center rounded-sm border",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check />
                    </div>
                    {option.icon && (
                      <option.icon className="text-muted-foreground mr-2 size-4" />
                    )}
                    <span>{option.name}</span>
                    {facets?.get(option.value) && (
                      <span className="ml-auto flex size-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            {selectedValues.size > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="cursor-pointer justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
