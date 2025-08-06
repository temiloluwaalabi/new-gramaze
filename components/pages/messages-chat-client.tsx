
"use client";

import * as React from "react";
import { startTransition } from "react";
import { searchUsers, fetchConversations } from "@/app/actions/services/chats.actions"; // server actions
import { chatServices } from "@/lib/api/api"; // client usage for fetchMessages/send/mark read
import type { ChatUser, Message as ChatMessage } from "@/types";
import MessageSidebar from "../shared/layout/message-sidebar";
import MessageThread from "../shared/layout/message-thread";

type SafeSession = { userId?: string | number } | null;

export default function MessagesChatClient({
  session,
  initialChatList,
}: {
  session: SafeSession;
  initialChatList: ChatUser[];
}) {
  const [conversations, setConversations] = React.useState<ChatUser[]>(initialChatList ?? []);
  const [selectedId, setSelectedId] = React.useState<string | null>(() =>
    initialChatList && initialChatList.length ? String(initialChatList[0].id) : null
  );
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [loadingConvos, setLoadingConvos] = React.useState(false);
  const [loadingMessages, setLoadingMessages] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Load messages when a conversation is selected (client-side)
  React.useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }

    let mounted = true;
    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        // fetchMessages expects the other user's id as user_id
        const data = await chatServices.fetchMessages(String(selectedId));
        if (!mounted) return;
        setMessages(data.messages ?? []);
      } catch (err: any) {
        console.error("Failed to load messages", err);
        setError(err?.message ?? "Failed to load messages");
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
    return () => {
      mounted = false;
    };
  }, [selectedId]);

  // Handler when sidebar selects conversation
  const handleSelect = (id: string) => {
    setSelectedId(String(id));
  };

  const currentUserId = session?.userId ? String(session.userId) : "me";

  // Send message (optimistic)
  const handleSendMessage = async (receiverId: string, messageText: string) => {
    if (!messageText.trim()) return;

    const optimistic: ChatMessage = {
      id: `tmp-${Date.now()}`,
      senderId: currentUserId,
      receiverId,
      message: messageText,
      timestamp: new Date().toISOString(),
      isRead: true,
    };

    setMessages((prev) => [...prev, optimistic]);

    try {
      // Use new SendMessagePayload shape: { senderId, receiverId, message }
      await chatServices.sendMessage({
        senderId: currentUserId,
        receiverId,
        message: messageText,
      });

      // Refresh messages (server returns normalized message list)
      const refreshed = await chatServices.fetchMessages(receiverId);
      setMessages(refreshed.messages ?? []);
    } catch (err) {
      console.error("Failed to send message", err);
      // Roll back by refetching
      try {
        const refreshed = await chatServices.fetchMessages(receiverId);
        setMessages(refreshed.messages ?? []);
      } catch {
        setError("Failed to send message");
      }
    }
  };

  // Mark as read
  const handleMarkAsRead = async (messageId: string) => {
    try {
      await chatServices.markMessageAsRead(messageId);
      setMessages((prev) => prev.map((m) => (String(m.id) === String(messageId) ? { ...m, isRead: true } : m)));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  // Search handler — calls server action `searchUsers`
  const handleSearch = (term: string) => {
    if (!term || !term.trim()) return;

    startTransition(async () => {
      try {
        const res = await searchUsers(term.trim());
        if (res?.success && Array.isArray(res.users)) {
          setConversations((prev) => {
            const map = new Map(prev.map((c) => [String(c.id), c]));
            for (const u of res.users) {
              map.set(String(u.id), u);
            }
            return Array.from(map.values());
          });

          if (res.users.length > 0) {
            setSelectedId(String(res.users[0].id));
          }
        }
      } catch (err) {
        console.error("Search failed", err);
      }
    });
  };

  // Refresh conversations (calls server action fetchConversations)
  const handleRefreshConversations = () => {
    startTransition(async () => {
      try {
        setLoadingConvos(true);
        const res = await fetchConversations();
        if (res?.success && Array.isArray(res.conversations)) {
          setConversations(res.conversations);
          if (!selectedId && res.conversations.length) {
            setSelectedId(String(res.conversations[0].id));
          }
        }
      } catch (err) {
        console.error("Failed to refresh conversations", err);
      } finally {
        setLoadingConvos(false);
      }
    });
  };

  const currentConversation = conversations.find((c) => String(c.id) === String(selectedId)) ?? undefined;

  return (
    <section className="flex h-full !bg-white pl-[15px] lg:pl-[15px] 2xl:pl-[20px]">
      <MessageSidebar
        conversations={conversations}
        selectedId={selectedId}
        onSelect={handleSelect}
        loading={loadingConvos}
        onSearch={handleSearch}
        onRefresh={handleRefreshConversations}
      />
      <MessageThread
        messages={messages.map((m) => ({
          id: m.id,
          sender: m.senderId,
          message: m.message,
          time: new Date(m.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          isUserMessage: String(m.senderId) === currentUserId,
        }))}
        currentConversation={
          currentConversation
            ? {
                id: String(currentConversation.id),
                name: currentConversation.name,
                avatar: currentConversation.avatar ?? "/avatar-placeholder.png",
                unread: currentConversation.message_notification !== null,
                online: false,
                time: "",
                lastMessage: "",
              }
            : undefined
        }
        onSend={(text) => selectedId && handleSendMessage(String(selectedId), text)}
        loadingMessages={loadingMessages}
        onMarkAsRead={handleMarkAsRead}
      />
    </section>
  );
}
