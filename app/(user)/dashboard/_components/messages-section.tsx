import { fetchConversations, fetchMessages } from "@/app/actions/services/chats.actions";
import { getSession } from "@/app/actions/session.actions";
import { Message } from "@/components/shared/message-widget";
import { formatDate } from "@/lib/utils";

export async function MessagesSection() {
  const session = await getSession();
  const { conversations } = await fetchConversations();

  const getSenderName = (id: string) => {
    const match = conversations.find((c) => String(c.id) === id);
    return match?.name || `User ${id}`;
  };

  const rawMessages = await fetchMessages(String(session.user_id));

  const userMessages = rawMessages.messages
    .filter((msg) => String(msg.receiverId) === String(session.user_id))
    .reverse()
    .map((msg) => ({
      id: msg.id,
      avatar: "/asset/images/robert.jpg",
      name: getSenderName(msg.senderId),
      message: msg.message,
      timestamp: formatDate(new Date(msg.timestamp)),
      unreadCount: msg.isRead ? 0 : 1,
    }));

  if (userMessages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <span className="mb-3 text-[#b0b0b0]">
          <svg width="48" height="48" fill="none" viewBox="0 0 24 24">
            <path
              d="M21 15.5a2.5 2.5 0 0 1-2.5 2.5H7l-4 4V5.5A2.5 2.5 0 0 1 5.5 3h13A2.5 2.5 0 0 1 21 5.5v10Z"
              stroke="#b0b0b0"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="text-base font-medium text-[#71717a]">No messages</span>
      </div>
    );
  }

  return (
    <div>
      {userMessages.slice(0, 4).map((msg, idx) => (
        <Message key={msg.id || idx} {...msg} />
      ))}
    </div>
  );
}

export function MessagesSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-16 bg-gray-200 animate-pulse rounded-lg" />
      ))}
    </div>
  );
}