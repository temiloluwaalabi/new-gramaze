
"use client";

import { Search, SlidersVertical, SquarePen, RefreshCw } from "lucide-react";
import Image from "next/image";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ChatUser } from "@/types";

interface MessageSidebarProps {
  conversations: ChatUser[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  loading?: boolean;
  onSearch?: (term: string) => void;
  onRefresh?: () => void;
}

export default function MessageSidebar({
  conversations,
  selectedId,
  onSelect,
  loading = false,
  onSearch,
  onRefresh,
}: MessageSidebarProps) {
  const [term, setTerm] = React.useState("");

  const submitSearch = () => {
    if (onSearch && term.trim()) onSearch(term.trim());
  };

  const clearSearch = () => {
    setTerm("");
    // optionally you could call onRefresh to re-load the full list
    if (onRefresh) onRefresh();
  };

  return (
    <div className="flex w-full flex-col overflow-y-hidden border-r border-[#E8E8E8] md:w-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between py-3 px-2">
        <h2 className="flex items-center gap-1 text-base font-medium text-black">
          Messages
          <div className="flex size-4 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
            {conversations.length}
          </div>
        </h2>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="!size-8 !p-0 text-gray-500 cursor-pointer"
            onClick={() => {
              if (onRefresh) onRefresh();
            }}
            title="Refresh conversations"
          >
            <RefreshCw size={18} />
          </Button>

          <Button variant="ghost" size="icon" className="!size-8 !p-0 text-gray-500">
            <SquarePen size={18} />
          </Button>
          <Button variant="ghost" size="icon" className="!size-8 !p-0 text-gray-500">
            <SlidersVertical size={18} />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="pr-2 px-2">
        <div className="relative">
          <Search className="absolute top-[16px] left-2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Messages"
            className="h-[48px] border-[#E8E8E8] bg-transparent pl-8"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                submitSearch();
              }
            }}
          />
        </div>
      </div>

      {/* Search Buttons (Search + Clear) */}
      <div className="px-2 pt-2">
        <div className="flex gap-2">
          <button
            onClick={submitSearch}
            className="rounded-md px-3 py-1 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 cursor-pointer"
          >
            Search
          </button>
          <button
            onClick={clearSearch}
            className="rounded-md px-3 py-1 text-sm text-gray-700 border border-gray-200 hover:bg-gray-50 cursor-pointer"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="custom-scrollbar mt-4 h-full flex-1 space-y-3 overflow-y-auto px-2">
        {loading ? (
          // Skeleton list for conversations
          <>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 rounded-md px-2 py-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 animate-pulse" />
                <div className="flex-1">
                  <div className="h-3 w-32 rounded bg-gray-200 animate-pulse mb-2" />
                  <div className="h-2 w-24 rounded bg-gray-200 animate-pulse" />
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`mr-2 flex cursor-pointer items-start rounded-md border-b border-b-blue-50 px-2 py-3 hover:bg-gray-50 ${
                  selectedId === conversation.id ? "bg-blue-50" : ""
                }`}
                onClick={() => onSelect(conversation.id)}
              >
                <div className="relative mr-3 flex-shrink-0">
                  <Image
                    src={conversation.avatar ?? "/avatar-placeholder.png"}
                    alt={conversation.name}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="truncate text-sm font-medium">{conversation.name}</p>
                    <p className="text-xs text-gray-500"></p>
                  </div>
                  <p className="truncate text-xs text-gray-500"></p>
                </div>
                {conversation.message_notification && (
                  <Badge className="ml-2 h-6 w-6 rounded-full bg-red-500 p-0 text-white">!</Badge>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
