"use client";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

import { MessagesChatClient } from "@/components/pages/messages-chat-client";
import { Button } from "@/components/ui/button";
import { useGetConversations } from "@/lib/queries/messaging-queries";
import { ConversationUser } from "@/types/new-messages";

import NewMessageDialog from "../dialogs/new-messaging-dialog";

export default function MessagesUserDashboardClient() {
  const { data: conversationsData, isLoading } = useGetConversations();
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false);
  const [shouldShowChat, setShouldShowChat] = useState(false);
  const [initialUser, setInitialUser] = useState<ConversationUser | null>(null);

  // Filter out conversations with null users
  const conversations = conversationsData || [];
  const validConversations = conversations.filter((conv) => conv.user !== null);
  const hasConversations = validConversations.length > 0;

  // Handle user selection from new message dialog
  const handleUserSelected = (user: ConversationUser) => {
    setInitialUser(user);
    setShouldShowChat(true);
    setShowNewMessageDialog(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // Show full chat if:
  // 1. User has existing conversations, OR
  // 2. User selected someone from new message dialog
  if (hasConversations || shouldShowChat) {
    return (
      <>
        <MessagesChatClient initialUser={initialUser} />
        <NewMessageDialog
          open={showNewMessageDialog}
          onOpenChange={setShowNewMessageDialog}
          onSelectUser={handleUserSelected}
        />
      </>
    );
  }

  // Empty state - no conversations yet
  return (
    <>
      <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
        <Image
          src="https://res.cloudinary.com/davidleo/image/upload/v1745315401/Message_bnbben.png"
          alt="No conversations"
          width={318}
          height={257}
          className="object-cover"
        />
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-col items-center justify-center gap-2">
            <h4 className="text-xl font-medium text-[#13180B] lg:text-2xl">
              No conversations yet
            </h4>
            <p className="text-center text-sm font-normal text-[#66666B] lg:text-base">
              Your messages will appear here. Start a conversation to get
              connected.
            </p>
          </div>
          <Button
            onClick={() => setShowNewMessageDialog(true)}
            className="!h-[49px] w-[198px] text-sm font-normal"
          >
            Start a conversation
          </Button>
        </div>
      </div>

      {/* New Message Dialog */}
      <NewMessageDialog
        open={showNewMessageDialog}
        onOpenChange={setShowNewMessageDialog}
        onSelectUser={handleUserSelected}
      />
    </>
  );
}
