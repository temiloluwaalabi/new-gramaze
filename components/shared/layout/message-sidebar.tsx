"use client";
import { Search, SlidersVertical, SquarePen } from "lucide-react";
import Image from "next/image";
import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  online: boolean;
}

interface MessageSidebarProps {
  conversations: Conversation[];
  selectedId: number;
  onSelect: (id: number) => void;
}

export default function MessageSidebar({
  conversations,
  selectedId,
  onSelect,
}: MessageSidebarProps) {
  return (
    <div className="flex w-full flex-col overflow-y-hidden border-r border-[#E8E8E8] md:w-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <h2 className="flex items-center gap-1 text-base font-medium text-black">
          Messages
          <div className="flex size-4 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
            6
          </div>
        </h2>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="!size-8 !p-0 text-gray-500"
          >
            <SquarePen size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="!size-8 !p-0 text-gray-500"
          >
            <SlidersVertical size={18} />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="pr-2">
        <div className="relative">
          <Search className="absolute top-[16px] left-2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search Messages"
            className="h-[48px] border-[#E8E8E8] bg-transparent pl-8"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="custom-scrollbar mt-4 h-full flex-1 space-y-3 overflow-y-auto">
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`mr-2 flex cursor-pointer items-start rounded-md border-b border-b-blue-50 px-2 py-3 hover:bg-gray-50 ${selectedId === conversation.id ? "bg-blue-50" : ""}`}
            onClick={() => onSelect(conversation.id)}
          >
            <div className="relative mr-3 flex-shrink-0">
              <Image
                src={conversation.avatar}
                alt={conversation.name}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full"
              />
              {conversation.online && (
                <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white"></span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium">
                  {conversation.name}
                </p>
                <p className="text-xs text-gray-500">{conversation.time}</p>
              </div>
              <p className="truncate text-xs text-gray-500">
                {conversation.lastMessage}
              </p>
            </div>
            {conversation.unread && (
              <Badge className="ml-2 h-2 w-2 rounded-full bg-red-500 p-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
