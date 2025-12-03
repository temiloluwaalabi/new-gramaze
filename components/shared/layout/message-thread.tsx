"use client";
import { format, isToday, isYesterday } from "date-fns";
import {
  Send,
  Paperclip,
  Smile,
  Search,
  EllipsisVertical,
  Loader2,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React, { useRef, useEffect, useState, useMemo } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  useGetMessages,
  useSendMessage,
} from "@/lib/queries/messaging-queries";
import { ConversationUser } from "@/types/new-messages";

// interface Message {
//   id: number;
//   sender: string;
//   message: string;
//   time: string;
//   isUserMessage: boolean;
// }

// interface Conversation {
//   id: number;
//   name: string;
//   avatar: string;
//   unread: boolean;
//   online: boolean;
//   time: string;
//   lastMessage: string;
// }

interface MessageThreadProps {
  selectedUser: ConversationUser | null;
  currentUserId: number; // The logged-in user's ID
}
// Popular emojis to show
const EMOJI_LIST = [
  "😀",
  "😃",
  "😄",
  "😁",
  "😅",
  "😂",
  "🤣",
  "😊",
  "😇",
  "🙂",
  "🙃",
  "😉",
  "😌",
  "😍",
  "🥰",
  "😘",
  "😗",
  "😙",
  "😚",
  "😋",
  "😛",
  "😝",
  "😜",
  "🤪",
  "🤨",
  "🧐",
  "🤓",
  "😎",
  "🤩",
  "🥳",
  "😏",
  "😒",
  "😞",
  "😔",
  "😟",
  "😕",
  "🙁",
  "☹️",
  "😣",
  "😖",
  "😫",
  "😩",
  "🥺",
  "😢",
  "😭",
  "😤",
  "😠",
  "😡",
  "🤬",
  "🤯",
  "😳",
  "🥵",
  "🥶",
  "😱",
  "😨",
  "😰",
  "😥",
  "😓",
  "🤗",
  "🤔",
  "🤭",
  "🤫",
  "🤥",
  "😶",
  "😐",
  "😑",
  "😬",
  "🙄",
  "😯",
  "😦",
  "😧",
  "😮",
  "😲",
  "🥱",
  "😴",
  "🤤",
  "😪",
  "😵",
  "🤐",
  "🥴",
  "🤢",
  "🤮",
  "🤧",
  "😷",
  "🤒",
  "🤕",
  "👍",
  "👎",
  "👌",
  "✌️",
  "🤞",
  "🤟",
  "🤘",
  "🤙",
  "👈",
  "👉",
  "👆",
  "👇",
  "☝️",
  "✋",
  "🤚",
  "🖐",
  "🖖",
  "👋",
  "🤙",
  "💪",
  "🦾",
  "🖕",
  "✍️",
  "🙏",
  "🦶",
  "🦵",
  "👂",
  "🦻",
  "👃",
  "👀",
  "👁",
  "🧠",
  "❤️",
  "🧡",
  "💛",
  "💚",
  "💙",
  "💜",
  "🖤",
  "🤍",
  "🤎",
  "💔",
  "❣️",
  "💕",
  "💞",
  "💓",
  "💗",
  "💖",
  "💘",
  "💝",
  "💟",
  "☮️",
  "✝️",
  "☪️",
  "🕉",
  "☸️",
  "✡️",
  "🔯",
  "🕎",
  "☯️",
  "☦️",
  "🛐",
  "⛎",
  "♈",
  "♉",
  "♊",
  "♋",
  "♌",
  "♍",
  "♎",
  "♏",
  "♐",
  "♑",
  "♒",
  "♓",
  "🆔",
  "⚛️",
  "🉑",
  "☢️",
  "☣️",
  "📴",
  "📳",
  "🈶",
  "🈚",
  "🈸",
  "🈺",
  "🈷️",
  "✴️",
  "🆚",
  "💮",
  "🉐",
  "㊙️",
  "㊗️",
  "🈴",
  "🈵",
  "🈹",
  "🈲",
  "🅰️",
  "🅱️",
  "🆎",
  "🆑",
  "🅾️",
  "🆘",
  "❌",
  "⭕",
  "🛑",
  "⛔",
  "📛",
  "🚫",
  "💯",
  "💢",
  "♨️",
  "🚷",
  "🚯",
  "🚳",
  "🚱",
  "🔞",
  "📵",
  "🚭",
  "❗",
  "❕",
  "❓",
  "❔",
  "‼️",
  "⁉️",
  "🔅",
  "🔆",
  "〽️",
  "⚠️",
  "🚸",
  "🔱",
  "⚜️",
  "🔰",
  "♻️",
  "✅",
  "🈯",
  "💹",
  "❇️",
  "✳️",
  "❎",
  "🌐",
  "💠",
  "🔠",
  "🔡",
  "🔢",
  "🔣",
  "🔤",
  "🅿️",
  "🆗",
  "🆙",
  "🆒",
  "🆕",
  "🆓",
  "0️⃣",
  "1️⃣",
  "2️⃣",
  "3️⃣",
  "4️⃣",
  "5️⃣",
  "6️⃣",
  "7️⃣",
  "8️⃣",
  "9️⃣",
  "🔟",
  "🔴",
  "🟠",
  "🟡",
  "🟢",
  "🔵",
  "🟣",
  "🟤",
  "⚫",
  "⚪",
  "🟥",
  "🟧",
  "🟨",
  "🟩",
  "🟦",
  "🟪",
  "🟫",
  "⬛",
  "⬜",
  "◼️",
  "◻️",
  "◾",
  "◽",
  "▪️",
  "▫️",
  "🔶",
  "🔷",
  "🔸",
  "🔹",
  "🔺",
  "🔻",
  "💧",
  "💦",
  "🌊",
];

export default function MessageThread({
  selectedUser,
  currentUserId,
}: MessageThreadProps) {
  const [messageInput, setMessageInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const messageRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const pathname = usePathname();
  const { data: messagesData, isLoading: isMessagesLoading } = useGetMessages(
    selectedUser?.id || 0,
    !!selectedUser
  );
  const sendMessageMutation = useSendMessage(pathname);

  const messages = React.useMemo(() => {
    if (!messagesData) return [];

    // Sort by created_at in ascending order (oldest first for display)
    return [...messagesData].sort((a, b) => {
      return (
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });
  }, [messagesData]);

  // Search through messages
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return messages
      .map((msg, index) => ({ message: msg, originalIndex: index }))
      .filter(({ message }) => message.message.toLowerCase().includes(query));
  }, [messages, searchQuery]);

  // Get IDs of matching messages for highlighting
  const matchingMessageIds = useMemo(() => {
    return new Set(searchResults.map((result) => result.message.id));
  }, [searchResults]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Focus input when conversation changes
    if (selectedUser) {
      inputRef.current?.focus();
    }
  }, [selectedUser]);

  // Focus search input when search opens
  useEffect(() => {
    if (showSearch) {
      searchInputRef.current?.focus();
    }
  }, [showSearch]);
  // Scroll to current match when navigating
  useEffect(() => {
    if (searchResults.length > 0 && searchResults[currentMatchIndex]) {
      const messageId = searchResults[currentMatchIndex].message.id;
      const messageElement = messageRefs.current[messageId];

      if (messageElement) {
        messageElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [currentMatchIndex, searchResults]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!messageInput.trim() || !selectedUser) return;

    const messageToSend = messageInput.trim();
    setMessageInput(""); // Clear input immediately for better UX

    try {
      await sendMessageMutation.mutateAsync({
        receiver_id: selectedUser.id,
        message: messageToSend,
      });
    } catch (error) {
      console.error("Error", error);
      // Error is handled by the mutation
      setMessageInput(messageToSend); // Restore message on error
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessageInput((prev) => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const handleSearchToggle = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      // Reset search when closing
      setSearchQuery("");
      setCurrentMatchIndex(0);
    }
  };

  const handleNextMatch = () => {
    if (searchResults.length > 0) {
      setCurrentMatchIndex((prev) =>
        prev < searchResults.length - 1 ? prev + 1 : 0
      );
    }
  };

  const handlePreviousMatch = () => {
    if (searchResults.length > 0) {
      setCurrentMatchIndex((prev) =>
        prev > 0 ? prev - 1 : searchResults.length - 1
      );
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase();
  };
  const formatMessageTime = (dateString: string) => {
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

  const highlightText = (text: string, query: string, messageId: number) => {
    if (!query) return text;

    const isCurrentMatch =
      searchResults[currentMatchIndex]?.message.id === messageId;
    const parts = text.split(new RegExp(`(${query})`, "gi"));

    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark
              key={index}
              className={`${isCurrentMatch ? "bg-yellow-400" : "bg-yellow-200"} rounded px-0.5`}
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  if (!selectedUser) {
    return isMessagesLoading ? (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    ) : (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium text-gray-400">
            Select a conversation
          </p>
          <p className="mt-1 text-sm text-gray-400">
            Choose someone to start messaging
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden w-full flex-1 flex-col md:flex">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 bg-white p-4">
        <div className="flex items-center">
          <div className="relative">
            {selectedUser.image ? (
              <Image
                src={selectedUser.image}
                alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
                width={40}
                height={40}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600">
                {getInitials(
                  selectedUser.first_name || "USER",
                  selectedUser.last_name || "USER"
                )}
              </div>
            )}
          </div>
          <div className="ml-3">
            <h2 className="text-sm font-medium">
              {selectedUser.first_name} {selectedUser.last_name}
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="!size-8 cursor-pointer bg-blue-50 !p-0 text-gray-500"
            onClick={handleSearchToggle}
            title="Search in conversation"
          >
            <Search size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="!size-8 bg-blue-50 !p-0 text-gray-500"
            title="More options"
          >
            <EllipsisVertical size={18} />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {showSearch && (
        <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 p-3">
          <div className="relative flex-1">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              ref={searchInputRef}
              placeholder="Search in conversation..."
              className="h-9 bg-white pr-3 pl-9"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentMatchIndex(0);
              }}
            />
          </div>

          {searchResults.length > 0 && (
            <div className="flex items-center gap-1">
              <span className="min-w-[60px] text-center text-xs text-gray-600">
                {currentMatchIndex + 1} of {searchResults.length}
              </span>
              <Button
                variant="ghost"
                size="icon"
                className="!size-8 cursor-pointer"
                onClick={handlePreviousMatch}
                disabled={searchResults.length === 0}
                title="Previous match"
              >
                <ChevronUp size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="!size-8 cursor-pointer"
                onClick={handleNextMatch}
                disabled={searchResults.length === 0}
                title="Next match"
              >
                <ChevronDown size={16} />
              </Button>
            </div>
          )}

          {searchQuery && searchResults.length === 0 && (
            <span className="text-xs whitespace-nowrap text-gray-500">
              No matches
            </span>
          )}

          <Button
            variant="ghost"
            size="icon"
            className="!size-8 cursor-pointer"
            onClick={handleSearchToggle}
            title="Close search"
          >
            <X size={16} />
          </Button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
        {isMessagesLoading && (
          <div className="flex h-full flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <div className="text-center">
              <p className="text-sm text-gray-400">Loading Messages</p>
            </div>
          </div>
        )}

        {!isMessagesLoading && messages?.length === 0 && (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <p className="text-sm text-gray-400">No messages yet</p>
              <p className="mt-1 text-xs text-gray-400">
                Send a message to start the conversation
              </p>
            </div>
          </div>
        )}

        {!isMessagesLoading &&
          messages?.map((message) => {
            const isUserMessage = message.sender_id === currentUserId;
            const isMatch = matchingMessageIds.has(message.id);
            const isCurrentMatch =
              searchResults[currentMatchIndex]?.message.id === message.id;

            return (
              <div
                key={message.id}
                ref={(el) => {
                  messageRefs.current[message.id] = el;
                }}
                className={`flex ${isUserMessage ? "justify-end" : "justify-start"} transition-all ${
                  isCurrentMatch ? "rounded-lg ring-2 ring-yellow-400" : ""
                }`}
              >
                <div
                  className={`max-w-md rounded-lg px-4 py-2 ${
                    isUserMessage
                      ? "rounded-br-none bg-blue-500 text-white"
                      : "rounded-bl-none border border-gray-200 bg-white text-gray-800"
                  }`}
                >
                  <p className="text-sm break-words whitespace-pre-wrap">
                    {searchQuery && isMatch
                      ? highlightText(message.message, searchQuery, message.id)
                      : message.message}
                  </p>
                  <span
                    className={`text-xs ${isUserMessage ? "text-blue-100" : "text-gray-400"} mt-1 block text-right`}
                  >
                    {formatMessageTime(message.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 bg-white p-4">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-500"
            disabled={sendMessageMutation.isPending}
            title="Attach file (coming soon)"
          >
            <Paperclip size={18} />
          </Button>
          <Input
            ref={inputRef}
            placeholder="Enter message..."
            className="mx-2 h-10 flex-1"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            disabled={sendMessageMutation.isPending || isMessagesLoading}
          />
          <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="mr-2 h-8 w-8 cursor-pointer text-gray-500"
                disabled={sendMessageMutation.isPending || isMessagesLoading}
                title="Add emoji"
              >
                <Smile size={18} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-2" align="end">
              <div className="grid max-h-64 grid-cols-8 gap-1 overflow-y-auto">
                {EMOJI_LIST.map((emoji, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleEmojiSelect(emoji)}
                    className="cursor-pointer rounded p-1 text-2xl transition-colors hover:bg-gray-100"
                    title={emoji}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
          <Button
            type="submit"
            size="icon"
            className="!size-8 rounded-full bg-blue-500 hover:bg-blue-600"
            disabled={
              !messageInput.trim() ||
              sendMessageMutation.isPending ||
              isMessagesLoading
            }
          >
            {sendMessageMutation.isPending ? (
              <Loader2 size={16} className="animate-spin text-white" />
            ) : (
              <Send size={16} className="text-white" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
