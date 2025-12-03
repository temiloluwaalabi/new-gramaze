"use client";
import { Mail, Loader2, MessageCircle } from "lucide-react";
import React from "react";

import { Button } from "@/components/ui/button";
import { useGetConversations } from "@/lib/queries/messaging-queries";
import { ConversationUser } from "@/types/new-messages";

interface MessageUserButtonProps {
  user: {
    id: number;
    first_name: string;
    last_name?: string;
    email?: string;
    image?: string | null;
  };
  label?: string; // "Message Caregiver" or "Message Patient"
  onMessageClick: (
    user: ConversationUser,
    hasExistingConversation: boolean
  ) => void;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
  disabled?: boolean;
  showIcon?: boolean;
  showConversationStatus?: boolean; // Show different label if conversation exists
}

/**
 * Reusable button to start a conversation with a user
 * Automatically checks if conversation exists and loads it
 */
export default function MessageUserButton({
  user,
  label,
  onMessageClick,
  className,
  variant = "outline",
  size = "default",
  disabled = false,
  showIcon = true,
  showConversationStatus = false,
}: MessageUserButtonProps) {
  const { data: conversationsData, isLoading } = useGetConversations();

  const handleClick = () => {
    // Check if we already have a conversation with this user
    const conversations = conversationsData || [];
    const existingConversation = conversations.find(
      (conv) => conv.user?.id === user.id
    );

    // Create ConversationUser object
    const conversationUser: ConversationUser = {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      image: user.image,
    };

    // Call the parent handler with the user
    // Parent will handle opening MessagesChatClient with this user selected
    onMessageClick(conversationUser, !!existingConversation);
  };

  // Determine if conversation exists
  const conversations = conversationsData || [];
  const hasConversation = conversations.some(
    (conv) => conv.user?.id === user.id
  );

  // Determine label based on user type or use provided label
  // Determine label based on conversation status
  let buttonLabel = label || "Message User";
  if (showConversationStatus && !isLoading) {
    buttonLabel = hasConversation ? "Continue Chat" : buttonLabel;
  }

  // Choose icon based on conversation status
  const Icon = hasConversation && showConversationStatus ? MessageCircle : Mail;

  return (
    <Button
      onClick={handleClick}
      disabled={disabled || isLoading}
      variant={variant}
      size={size}
      className={className}
    >
      {isLoading ? (
        <Loader2 className="size-4 animate-spin" />
      ) : (
        <>
          {showIcon && <Icon className="mr-2 size-4" />}
          <span>{buttonLabel}</span>
        </>
      )}
    </Button>
  );
}
