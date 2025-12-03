"use client";

import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useMessagingNavigation } from "@/hooks/use-messaging-navigation";
import { cn } from "@/lib/utils";
import { ConversationUser } from "@/types/new-messages";

import { formatTime } from "./layout/message-sidebar";
import MessageUserButton from "./message-user-button-node";

interface MessageProps {
  user: ConversationUser | null;
  avatar: string;
  name: string;
  message: string;
  timestamp: string;
  unreadCount?: number;
  className?: string;
}

export const Message: React.FC<MessageProps> = ({
  avatar,
  name,
  user,
  message,
  timestamp,
  unreadCount,
  className,
}) => {
  const { openMessaging } = useMessagingNavigation({
    messagesPageUrl: "/dashboard/message", // or wherever your messages page is
  });
  return (
    <MessageUserButton
      user={{
        id: user?.id || 0,
        first_name: user?.first_name || "",
        last_name: user?.last_name,
        email: user?.email,
        image: user?.image,
      }}
      label={
        <div
          className={cn(
            "mt-3 flex w-full items-center justify-between py-2",
            className
          )}
        >
          <div className="flex items-start gap-3">
            <Avatar className="size-[40px] border-2 border-amber-200 bg-amber-100">
              <AvatarImage src={avatar} alt={name} />
              <AvatarFallback className="bg-amber-200 text-amber-800">
                {typeof name === "string"
                  ? name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                  : (name ?? "User")}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col items-start">
              <h3 className="text-sm font-medium text-[#303030]">{name}</h3>
              <p className="max-w-[150px] text-xs text-gray-600">{message}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-normal text-blue-500">
              {formatTime(timestamp)}
            </span>
            {unreadCount && unreadCount > 0 && unreadCount !== 0 && (
              <Badge className="flex size-4 items-center justify-center rounded-full bg-red-500 p-0 hover:bg-red-600">
                {unreadCount}
              </Badge>
            )}
          </div>
        </div>
      }
      onMessageClick={openMessaging}
      className=""
      variant="outline"
      disabled={!user}
    />
  );
};
