"use client";
import { format, isToday, isYesterday } from "date-fns";
import { Search, SquarePen, X } from "lucide-react";
import Image from "next/image";
import React, { useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetConversations } from "@/lib/queries/messaging-queries";
import { ConversationUser, Conversation } from "@/types/new-messages";

interface MessageSidebarProps {
  selectedUserId: number | null;
  onSelect: (user: ConversationUser) => void;
  onNewMessage: () => void;
}
export const formatTime = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    // If less than 1 hour, show "X mins ago" or "just now"
    if (diffInMinutes < 1) {
      return "just now";
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes === 1 ? "" : "s"} ago`;
    }

    // If today, show time
    if (isToday(date)) {
      return format(date, "h:mm a");
    }

    // If yesterday
    if (isYesterday(date)) {
      return `Yesterday ${format(date, "h:mm a")}`;
    }

    // Otherwise show date
    return format(date, "MMM d, h:mm a");
  } catch {
    return "";
  }
};
export default function MessageSidebar({
  selectedUserId,
  onSelect,
  onNewMessage,
}: MessageSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  // const [isSearching, setIsSearching] = useState(false);

  const { data: conversationsData, isLoading: isConversationsLoading } =
    useGetConversations();
  // const { data: searchData, isLoading: isSearchLoading } = useSearchUsers(
  //   searchQuery,
  //   isSearching && searchQuery.length > 2
  // );

  // Filter out conversations with null users and extract valid conversations
  const conversations: Conversation[] = conversationsData || [];
  const validConversations = conversations.filter((conv) => conv.user !== null);

  // Sort conversations by most recent message (newest first)
  const sortedConversations = useMemo(() => {
    return [...validConversations].sort((a, b) => {
      const dateA = new Date(a.last_message?.created_at || 0).getTime();
      const dateB = new Date(b.last_message?.created_at || 0).getTime();
      return dateB - dateA; // Newest first
    });
  }, [validConversations]);

  // Search through conversations (name and last message)
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) {
      return sortedConversations;
    }

    const query = searchQuery.toLowerCase().trim();
    return sortedConversations.filter((conv) => {
      const user = conv.user!;
      const fullName =
        `${user.first_name} ${user.last_name || ""}`.toLowerCase();
      const email = (user.email || "").toLowerCase();
      const lastMessage = (conv.last_message?.message || "").toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        lastMessage.includes(query)
      );
    });
  }, [sortedConversations, searchQuery]);

  // const searchUsers = searchData || [];
  // const displayItems = isSearching && searchQuery.length > 2 ? searchUsers : validConversations;

  // Calculate total unread count
  const totalUnreadCount = validConversations.reduce(
    (sum, conv) => sum + conv.unread_messages,
    0
  );

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  // const formatTime = (dateString: string | null) => {
  //   if (!dateString) return '';
  //   try {
  //     const date = new Date(dateString);
  //     // Use strict mode to get accurate "ago" time
  //     return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true });
  //   } catch {
  //     return '';
  //   }
  // };
  const truncateMessage = (message: string, maxLength: number = 35) => {
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + "...";
  };

  const handleSelectConversation = (conv: Conversation) => {
    if (conv.user) {
      onSelect(conv.user);
    }
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const isLoading = isConversationsLoading;
  const isEmpty = filteredConversations.length === 0;

  return (
    <div className="flex w-full flex-col overflow-y-hidden border-r border-[#E8E8E8] md:w-[300px]">
      {/* Header */}
      <div className="flex items-center justify-between py-3">
        <h2 className="flex items-center gap-1 text-base font-medium text-black">
          Messages
          {totalUnreadCount > 0 && (
            <div className="flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-xs text-white">
              {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
            </div>
          )}
        </h2>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="!size-8 cursor-pointer !p-0 text-gray-500"
            onClick={onNewMessage}
            title="New message"
          >
            <SquarePen size={18} />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="pr-2">
        <div className="relative">
          <Search className="absolute top-[16px] left-2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search conversations..."
            className="h-[48px] border-[#E8E8E8] bg-transparent pr-8 pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute top-[16px] right-2 h-4 w-4 text-gray-400 hover:text-gray-600"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Conversation List */}
      <div className="custom-scrollbar mt-4 h-full flex-1 space-y-3 overflow-y-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && isEmpty && (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <p className="text-sm text-gray-400">
              {searchQuery ? "No conversations found" : "No conversations yet"}
            </p>
            {searchQuery ? (
              <Button
                variant="link"
                className="mt-2 text-sm text-blue-600"
                onClick={handleClearSearch}
              >
                Clear search
              </Button>
            ) : (
              <Button
                variant="link"
                className="mt-2 text-sm text-blue-600"
                onClick={onNewMessage}
              >
                Start a conversation
              </Button>
            )}
          </div>
        )}

        {/* Conversations List */}
        {!isLoading &&
          filteredConversations.map((conversation) => {
            const user = conversation.user!;
            return (
              <div
                key={user.id}
                className={`mr-2 flex cursor-pointer items-start rounded-md border-b border-b-blue-50 px-2 py-3 transition-colors hover:bg-gray-50 ${
                  selectedUserId === user.id ? "bg-blue-50" : ""
                }`}
                onClick={() => handleSelectConversation(conversation)}
              >
                <div className="relative mr-3 flex-shrink-0">
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={`${user.first_name} ${user.last_name || ""}`}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                      {getInitials(
                        user?.first_name || "User",
                        user?.last_name || "User"
                      )}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center justify-between">
                    <p className="truncate text-sm font-medium">
                      {user.first_name} {user.last_name || ""}
                    </p>
                    {conversation.last_message?.created_at && (
                      <p className="ml-2 flex-shrink-0 text-xs text-gray-500">
                        {formatTime(conversation.last_message.created_at)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="flex-1 truncate text-xs text-gray-500">
                      {truncateMessage(
                        conversation.last_message?.message || "No messages yet"
                      )}
                    </p>
                    {conversation.unread_messages > 0 && (
                      <Badge className="ml-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-[10px] font-medium">
                        {conversation.unread_messages > 9
                          ? "9+"
                          : conversation.unread_messages}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {/* Search results count */}
      {searchQuery && !isLoading && (
        <div className="border-t px-2 py-2 text-center text-xs text-gray-500">
          {filteredConversations.length === 0
            ? "No results found"
            : `${filteredConversations.length} conversation${filteredConversations.length === 1 ? "" : "s"} found`}
        </div>
      )}
    </div>
  );
}
