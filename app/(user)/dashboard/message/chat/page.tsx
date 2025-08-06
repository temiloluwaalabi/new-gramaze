
import React from "react";
import { getSession } from "@/app/actions/session.actions";
import { fetchChatList as fetchChatListAction } from "@/app/actions/services/chats.actions";
import MessagesChatClient from "@/components/pages/messages-chat-client";

export default async function MessagesChatPage() {
  const session = await getSession();

  // pass only plain, serializable fields
  const safeSession = session
    ? {
        userId: session.user_id,
        email: session.email,
        firstName: session.firstName,
      }
    : null;

  // Fetch chat list on the server (server action that uses chatServices)
  const chatList = await fetchChatListAction();

  // chatList must be a plain object/array (no functions/classes)
  return <MessagesChatClient session={safeSession} initialChatList={chatList.chatUsers ?? []} />;
}
