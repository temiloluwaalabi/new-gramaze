"use client";

import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MessageProps {
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
  message,
  timestamp,
  unreadCount,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between border-b border-[#F1F1F1] py-4",
        className
      )}
    >
      <div className="flex items-center gap-3">
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

        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-[#303030]">{name}</h3>
          <p className="max-w-[150px] text-xs text-gray-600">{message}</p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span className="text-xs font-normal text-blue-500">{timestamp}</span>
        {unreadCount && unreadCount > 0 && (
          <Badge className="flex size-4 items-center justify-center rounded-full bg-red-500 p-0 hover:bg-red-600">
            {unreadCount}
          </Badge>
        )}
      </div>
    </div>
  );
};
