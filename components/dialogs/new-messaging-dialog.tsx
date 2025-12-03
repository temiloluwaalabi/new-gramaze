"use client";
import { Loader2, Search, X } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useSearchUsers } from "@/lib/queries/messaging-queries";
import { useUserStore } from "@/store/user-store";
import { ConversationUser } from "@/types/new-messages";

interface NewMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectUser: (user: ConversationUser) => void;
}

export default function NewMessageDialog({
  open,
  onOpenChange,
  onSelectUser,
}: NewMessageDialogProps) {
  const { user: currentUser } = useUserStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Get all available users (for when not searching)
  //   const { data: chatListData, isLoading: isChatListLoading } = useGetChatList();
  // const { data: conversationsData, isLoading } = useGetConversations();

  // Search users when query is long enough
  const { data: searchData, isLoading: isSearchLoading } = useSearchUsers(
    debouncedQuery,
    debouncedQuery.length > 2
  );

  // Determine which data to show
  const isSearching = debouncedQuery.length > 2;
  // const allUsers = conversationsData || [];
  const searchUsers = searchData || [];

  console.log("searchUser", searchUsers);

  const displayUsers = searchUsers.filter(
    (user) => user.user_role !== "admin" || user.id !== currentUser?.id
  );

  const isLoading = isSearchLoading;

  const handleSelectUser = (user: ConversationUser) => {
    onSelectUser(user);
    setSearchQuery(""); // Clear search on select
  };

  const handleClose = () => {
    setSearchQuery(""); // Clear search on close
    onOpenChange(false);
  };

  const getInitials = (firstName: string, lastName?: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };

  // Clear search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="flex max-h-[600px] flex-col p-0 sm:max-w-[500px]">
        <DialogHeader className="border-b px-6 pt-6 pb-4">
          <DialogTitle className="text-xl">New Message</DialogTitle>
          <DialogDescription>
            Search for someone to start a conversation with
          </DialogDescription>
        </DialogHeader>

        {/* Search Input */}
        <div className="border-b px-6 py-4">
          <div className="relative">
            <Search className="absolute top-3 left-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or email..."
              className="h-10 pr-9 pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          {isSearching && searchQuery.length < 3 && (
            <p className="mt-2 text-xs text-gray-500">
              Type at least 3 characters to search
            </p>
          )}
        </div>

        {/* User List */}
        <div className="max-h-[400px] min-h-[300px] flex-1 overflow-y-auto px-4 py-2">
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          )}

          {/* Empty State - No Users */}
          {!isLoading && displayUsers.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-3">
                <svg
                  className="mx-auto h-12 w-12 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-gray-500">
                {isSearching ? "No users found" : "No users available"}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {isSearching
                  ? "Try a different search term"
                  : "There are no users to message at the moment"}
              </p>
            </div>
          )}

          {/* User List */}
          {!isLoading && displayUsers.length > 0 && (
            <div className="space-y-1">
              {displayUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="group flex w-full cursor-pointer items-center rounded-lg p-3 text-left transition-colors hover:bg-gray-50"
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
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600 transition-colors group-hover:bg-blue-200">
                        {getInitials(user.first_name, user.last_name)}
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-900">
                      {user.first_name} {user.last_name || ""}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {user.email || "No email available"}
                    </p>
                  </div>
                  <div className="ml-2 opacity-0 transition-opacity group-hover:opacity-100">
                    <svg
                      className="h-5 w-5 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>
              {!isLoading && displayUsers.length > 0
                ? `${displayUsers.length} ${displayUsers.length === 1 ? "user" : "users"} ${isSearching ? "found" : "available"}`
                : ""}
            </span>
            <Button variant="ghost" size="sm" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
