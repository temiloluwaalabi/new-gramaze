"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConversationUser } from "@/types/new-messages";

interface UseMessagingNavigationOptions {
  messagesPageUrl?: string; // URL to messages page, default: '/messages'
  onOpenMessaging?: (user: ConversationUser) => void; // Custom handler if not using navigation
}

/**
 * Hook to handle messaging navigation and state
 * Can either navigate to messages page or use custom handler
 */
export function useMessagingNavigation(
  options: UseMessagingNavigationOptions = {}
) {
  const { messagesPageUrl = "/dashboard/message", onOpenMessaging } = options;
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState<ConversationUser | null>(
    null
  );
  const [isMessagingOpen, setIsMessagingOpen] = useState(false);

  /**
   * Open messaging with a specific user
   * Either navigates to messages page or calls custom handler
   */
  const openMessaging = (user: ConversationUser) => {
    if (onOpenMessaging) {
      // Use custom handler (e.g., open modal/sheet)
      onOpenMessaging(user);
    } else {
      // Navigate to messages page with user state
      // Store user in sessionStorage so messages page can pick it up
      if (typeof window !== "undefined") {
        sessionStorage.setItem("messageUser", JSON.stringify(user));
      }
      router.push(messagesPageUrl);
    }

    setSelectedUser(user);
    setIsMessagingOpen(true);
  };

  /**
   * Close messaging
   */
  const closeMessaging = () => {
    setSelectedUser(null);
    setIsMessagingOpen(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("messageUser");
    }
  };

  /**
   * Get initial user from sessionStorage (for messages page)
   */
  const getInitialUser = (): ConversationUser | null => {
    if (typeof window === "undefined") return null;

    const storedUser = sessionStorage.getItem("messageUser");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser) as ConversationUser;
        // Clear after reading
        sessionStorage.removeItem("messageUser");
        return user;
      } catch {
        return null;
      }
    }
    return null;
  };

  return {
    selectedUser,
    isMessagingOpen,
    openMessaging,
    closeMessaging,
    getInitialUser,
  };
}
