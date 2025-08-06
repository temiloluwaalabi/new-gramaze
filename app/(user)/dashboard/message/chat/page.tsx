
import React from "react";
import { getSession } from "@/app/actions/session.actions";
import { fetchChatList as fetchChatListAction } from "@/app/actions/services/chats.actions";
import MessagesChatClient from "@/components/pages/messages-chat-client";

function safeSerialize<T>(obj: T): T | null {
  try {
    // try structuredClone if available
    // @ts-ignore
    if (typeof structuredClone === "function") return structuredClone(obj);
  } catch (_) {}
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (_) {
    return null;
  }
}

export default async function MessagesChatPage() {
  const session = await getSession();
  const chatListRes = await fetchChatListAction();

  // Create a minimal, plain session object — DO NOT include accessToken
  const safeSession = session
    ? {
        userId: session.user_id ?? null,
        email: session.email ?? null,
        firstName: session.firstName ?? null,
        isLoggedIn: !!session.isLoggedIn,
        userType: session.userType ?? null,
        isBoarded: !!session.isBoarded,
      }
    : null;

  const rawChatUsers = chatListRes?.chatUsers ?? [];
  const safeInitialChatList = safeSerialize(rawChatUsers) ?? [];

  return (
    <MessagesChartWrapper />
  );

  function MessagesChartWrapper() {
    // NOTE: Next expects a default export component; we inline the client component
    // import will be resolved by next, but to preserve types we forward props:
    // Pass only plain data
    return <MessagesChatClient session={safeSession} initialChatList={safeInitialChatList} />;
  }
}
