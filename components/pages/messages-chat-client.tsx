"use client";
import * as React from "react";

import { useMessagingNavigation } from "@/hooks/use-messaging-navigation";
import { useUserStore } from "@/store/user-store";
import { ConversationUser } from "@/types/new-messages";

import NewMessageDialog from "../dialogs/new-messaging-dialog";
import MessageSidebar from "../shared/layout/message-sidebar";
import MessageThread from "../shared/layout/message-thread";

interface MessagesChatClientProps {
  initialUser?: ConversationUser | null; // Optional initial user to select
  options?: {
    url?: string;
  };
}

export const MessagesChatClient = ({
  initialUser,
  options,
}: MessagesChatClientProps = {}) => {
  const { user } = useUserStore();
  const { getInitialUser } = useMessagingNavigation({
    messagesPageUrl: options?.url,
  });
  const [selectedUser, setSelectedUser] =
    React.useState<ConversationUser | null>(initialUser || null);
  const [openDialog, setOpenDialog] = React.useState(false);

  // Check if we navigated here with a user to message
  React.useEffect(() => {
    // Only check sessionStorage if no initialUser was provided
    if (!initialUser) {
      const userFromNavigation = getInitialUser();
      if (userFromNavigation) {
        setSelectedUser(userFromNavigation);
      }
    }
  }, [getInitialUser, initialUser]);
  // Update selectedUser if initialUser changes (from parent)
  React.useEffect(() => {
    if (initialUser) {
      setSelectedUser(initialUser);
    }
  }, [initialUser]);

  const handleSelectUser = (user: ConversationUser) => {
    setSelectedUser(user);
    setOpenDialog(false); // Close dialog if open
  };
  return (
    <section className="flex h-full !bg-white pl-[15px] lg:pl-[15px] 2xl:pl-[20px]">
      <MessageSidebar
        selectedUserId={selectedUser?.id ?? null} // Highlights the active conversation
        onSelect={handleSelectUser}
        onNewMessage={() => {
          setOpenDialog(true);
        }} // Opens new message dialog
      />
      <MessageThread
        selectedUser={selectedUser} // Shows messages for this user
        currentUserId={user?.id || 0} // Knows which messages are "yours"
      />

      <NewMessageDialog
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSelectUser={handleSelectUser}
      />
    </section>
  );
};
