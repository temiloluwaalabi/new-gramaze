"use client";
import * as React from "react";

import { conversations, messageThread } from "@/config/constants";

import MessageSidebar from "../shared/layout/message-sidebar";
import MessageThread from "../shared/layout/message-thread";
export const MessagesChatClient = () => {
  const [selectedConversation, setSelectedConversation] = React.useState(1);

  return (
    <section className="flex h-full !bg-white pl-[15px] lg:pl-[15px] 2xl:pl-[20px]">
      <MessageSidebar
        conversations={conversations}
        selectedId={selectedConversation}
        onSelect={setSelectedConversation}
      />
      <MessageThread
        messages={messageThread}
        currentConversation={conversations.find(
          (c) => c.id === selectedConversation
        )}
      />
    </section>
  );
};
