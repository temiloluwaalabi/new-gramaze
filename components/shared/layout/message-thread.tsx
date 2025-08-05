"use client";
import { Send, Paperclip, Smile, Search, EllipsisVertical } from "lucide-react";
import Image from "next/image";
import React, { useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  sender: string;
  message: string;
  time: string;
  isUserMessage: boolean;
}

interface Conversation {
  id: number;
  name: string;
  avatar: string;
  unread: boolean;
  online: boolean;
  time: string;
  lastMessage: string;
}

interface MessageThreadProps {
  messages: Message[];
  currentConversation?: Conversation;
}

export default function MessageThread({
  messages,
  currentConversation,
}: MessageThreadProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!currentConversation) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-gray-400">
          Select a conversation to start messaging
        </p>
      </div>
    );
  }

  return (
    <div className="hidden w-full flex-1 flex-col md:flex">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 p-4">
        <div className="flex items-center">
          <div className="relative">
            <Image
              src={currentConversation.avatar}
              alt={currentConversation.name}
              width={40}
              height={40}
              className="h-10 w-10 rounded-full"
            />
            {currentConversation.online && (
              <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-white"></span>
            )}
          </div>
          <div className="ml-3">
            <h2 className="text-sm font-medium">{currentConversation.name}</h2>
            <p className="text-xs text-gray-500">
              {currentConversation.online ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto !size-8 bg-blue-50 !p-0 text-gray-500"
          >
            <Search size={18} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ml-2 !size-8 bg-blue-50 !p-0 text-gray-500"
          >
            <EllipsisVertical size={18} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 space-y-4 overflow-y-auto bg-gray-50 p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isUserMessage ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-md rounded-lg px-4 py-2 ${
                message.isUserMessage
                  ? "rounded-br-none bg-blue-500 text-white"
                  : "rounded-bl-none border border-gray-200 bg-white text-gray-800"
              }`}
            >
              <p className="text-sm">{message.message}</p>
              <span
                className={`text-xs ${message.isUserMessage ? "text-blue-100" : "text-gray-400"} mt-1 block text-right`}
              >
                {message.time}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500">
            <Paperclip size={18} />
          </Button>
          <Input placeholder="Enter message..." className="mx-2 h-10 flex-1" />
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 h-8 w-8 text-gray-500"
          >
            <Smile size={18} />
          </Button>
          <Button
            size="icon"
            className="!size-8 rounded-full bg-blue-500 hover:bg-blue-600"
          >
            <Send size={16} className="text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
