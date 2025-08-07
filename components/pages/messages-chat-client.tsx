"use client";
import * as React from "react";
import { startTransition } from "react";

// SERVER ACTIONS (call from client — they run on server)
import {
  fetchMessages as fetchMessagesAction,
  sendMessage as sendMessageAction,
  markMessageAsRead as markMessageAsReadAction,
  searchUsers as searchUsersAction,
  fetchConversations as fetchConversationsAction,
} from "@/app/actions/services/chats.actions";
import type { ChatUser, Message as ChatMessage } from "@/types";

import MessageSidebar from "../shared/layout/message-sidebar";
import MessageThread from "../shared/layout/message-thread";

type SafeSession = { 
  userId?: string | number;
  email?: string;
  firstName?: string;
  isLoggedIn?: boolean;
  userType?: string;
  isBoarded?: boolean;
} | null;

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
  const [, setError] = React.useState<string | null>(null);

  const currentUserId = session?.userId ? String(session.userId) : "me";

  // load messages when selectedId changes — use server action fetchMessagesAction
  React.useEffect(() => {
    if (!selectedId) {
      setMessages([]);
      return;
    }

    let mounted = true;
    const loadMessages = async () => {
      setLoadingMessages(true);
      try {
        // Call server action — runs on server and returns plain data
        const res = await fetchMessagesAction(String(selectedId));
        if (!mounted) return;
        if (res?.success) {
          setMessages(res.messages ?? []);
        } else {
          setMessages([]);
        }
      } catch (err: unknown) {
        console.error("Failed to load messages", err);
        const message = err instanceof Error ? err.message : String(err ?? "Failed to load messages");
        setError(message);
      } finally {
        setLoadingMessages(false);
      }
    };

    loadMessages();
    return () => {
      mounted = false;
    };
  }, [selectedId]);

  // handler when sidebar selects conversation
  const handleSelect = (id: string) => {
    setSelectedId(String(id));
  };

  // send message — use server action; optimistic update + refresh
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
      // server action expects SendMessagePayload shape — your action maps and posts to backend
      await sendMessageAction({
        senderId: currentUserId,
        receiverId,
        message: messageText,
      } as Parameters<typeof sendMessageAction>[0]);


      // refresh
      const refreshed = await fetchMessagesAction(receiverId);
      if (refreshed?.success) setMessages(refreshed.messages ?? []);
    } catch (err) {
      console.error("Failed to send message", err);
      // rollback by refetching
      try {
        const refreshed = await fetchMessagesAction(receiverId);
        if (refreshed?.success) setMessages(refreshed.messages ?? []);
      } catch {
        setError("Failed to send message");
      }
    }
  };

  // mark as read — call server action
  const handleMarkAsRead = async (messageId: string) => {
    try {
      await markMessageAsReadAction(String(messageId));
      setMessages((prev) => prev.map((m) => (String(m.id) === String(messageId) ? { ...m, isRead: true } : m)));
    } catch (err) {
      console.error("Failed to mark as read", err);
    }
  };

  // search handler — call server action searchUsersAction
  const handleSearch = (term: string) => {
    if (!term || !term.trim()) return;

    startTransition(async () => {
      try {
        const res = await searchUsersAction(term.trim());
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

  // refresh conversations using server action fetchConversationsAction
  const handleRefreshConversations = () => {
    startTransition(async () => {
      try {
        setLoadingConvos(true);
        const res = await fetchConversationsAction();
        if (res?.success && Array.isArray(res.conversations)) {
          setConversations(res.conversations);
          if (!selectedId && res.conversations.length > 0) {
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
                avatar: currentConversation.avatar ?? "/asset/images/robert.jpg",
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
