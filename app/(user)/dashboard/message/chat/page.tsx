import React from "react";

import { fetchChatList as fetchChatListAction } from "@/app/actions/services/chats.actions";
import { getSession } from "@/app/actions/session.actions";
import MessagesChatClient from "@/components/pages/messages-chat-client";

function safeSerialize<T>(obj: T): T | null {
  try {
    // look up structuredClone safely on globalThis without compiler directives
    const sc = (globalThis as unknown as { structuredClone?: (v: unknown) => unknown }).structuredClone;
    if (typeof sc === "function") return sc(obj) as T;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_unused) {}
  try {
    return JSON.parse(JSON.stringify(obj));
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_unused) {
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
