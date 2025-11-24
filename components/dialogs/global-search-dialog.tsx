// components/search/global-search-dialog.tsx
"use client";

import {
  Search,
  Clock,
  Calendar,
  MessageSquare,
  User,
  Activity,
  CreditCard,
  FileBarChart,
  StickyNote,
  LayoutDashboard,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SearchEngine } from "@/lib/search/search-engine";
import { cn } from "@/lib/utils";

import {
  SearchResult,
  SearchResultType,
  SearchableData,
} from "@/lib/search/search-types";

type GlobalSearchDialogProps = {
  searchData: SearchableData;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const RESULT_ICONS: Record<SearchResultType, typeof Search> = {
  appointment: Calendar,
  message: MessageSquare,
  caregiver: User,
  "health-tracker": Activity,
  "health-report": FileBarChart,
  "health-note": StickyNote,
  payment: CreditCard,
  page: LayoutDashboard,
};

const RESULT_COLORS: Record<SearchResultType, string> = {
  appointment: "text-blue-600 bg-blue-50",
  message: "text-green-600 bg-green-50",
  caregiver: "text-purple-600 bg-purple-50",
  "health-tracker": "text-red-600 bg-red-50",
  "health-report": "text-orange-600 bg-orange-50",
  "health-note": "text-yellow-600 bg-yellow-50",
  payment: "text-teal-600 bg-teal-50",
  page: "text-gray-600 bg-gray-50",
};

export function GlobalSearchDialog({
  searchData,
  open,
  onOpenChange,
}: GlobalSearchDialogProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  console.log("SEARCH data", searchData);
  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recent-searches");
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  // Perform search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const searchEngine = new SearchEngine(searchData);
    const searchResults = searchEngine.search(query, 10);

    console.log("Search RESULT", searchResults);
    setResults(searchResults);
  }, [query, searchData]);

  const saveRecentSearch = useCallback(
    (searchQuery: string) => {
      const updated = [
        searchQuery,
        ...recentSearches.filter((s) => s !== searchQuery),
      ].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem("recent-searches", JSON.stringify(updated));
    },
    [recentSearches]
  );

  const handleSelect = useCallback(
    (result: SearchResult) => {
      saveRecentSearch(query);
      router.push(result.url);
      onOpenChange(false);
      setQuery("");
    },
    [query, router, onOpenChange, saveRecentSearch]
  );

  const handleRecentSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery);
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange} modal={true}>
      <CommandInput
        placeholder="Search appointments, messages, caregivers..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {!query && recentSearches.length > 0 && (
          <CommandGroup heading="Recent Searches">
            {recentSearches.map((search, index) => (
              <CommandItem
                key={index}
                onSelect={() => handleRecentSearch(search)}
                className="cursor-pointer"
              >
                <Clock className="mr-2 h-4 w-4 text-gray-400" />
                <span>{search}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {query && results.length === 0 && (
          <CommandEmpty>No results found for &quot;{query}&quot;</CommandEmpty>
        )}

        {query && results.length > 0 && (
          <CommandGroup heading="Search Results">
            {results.map((result) => {
              const Icon = RESULT_ICONS[result.type];
              const colorClass = RESULT_COLORS[result.type];

              return (
                <CommandItem
                  key={result.id}
                  onSelect={() => handleSelect(result)}
                  className="cursor-pointer"
                  value={result.title}
                >
                  <div
                    className={cn(
                      "mr-3 flex h-8 w-8 items-center justify-center rounded-md",
                      colorClass
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate font-medium">{result.title}</div>
                    <div className="text-muted-foreground truncate text-sm">
                      {result.description}
                    </div>
                  </div>
                  {result.metadata?.status && (
                    <span
                      className={cn(
                        "ml-2 rounded-full px-2 py-0.5 text-xs",
                        result.metadata.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : result.metadata.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : result.metadata.status === "cancelled"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                      )}
                    >
                      {result.metadata.status}
                    </span>
                  )}
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
