import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  getChatList,
  getConversations,
  getMessages,
  searchUsers,
  sendMessage,
} from "@/app/actions/services/messages.actions";
import { SendMessagePayload } from "@/types/new-messages";

import { handleMutationError } from "./handle-mutation-error";

// Query Keys
export const messagingKeys = {
  all: ["messaging"] as const,
  chatList: () => [...messagingKeys.all, "chat-list"] as const,
  conversations: () => [...messagingKeys.all, "conversations"] as const,
  messages: (userId: number) =>
    [...messagingKeys.all, "messages", userId] as const,
  search: (query: string) => [...messagingKeys.all, "search", query] as const,
};

// Get chat list (all users you can chat with)
export const useGetChatList = () => {
  return useQuery({
    queryKey: messagingKeys.chatList(),
    queryFn: async () => {
      const result = await getChatList();
      if (!result.success) {
        throw result;
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 30, // Refetch every 30 seconds for live updates
  });
};

// Get conversations (users you've chatted with)
export const useGetConversations = () => {
  return useQuery({
    queryKey: messagingKeys.conversations(),
    queryFn: async () => {
      const result = await getConversations();
      if (!result.success) {
        throw result;
      }
      return result.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
  });
};

// Get messages with a specific user
export const useGetMessages = (userId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: messagingKeys.messages(userId ?? 0),
    queryFn: async () => {
      if (!userId) return null;
      const result = await getMessages(userId);
      if (!result.success) {
        throw result;
      }
      return result.data;
    },
    enabled: enabled && userId !== null,
    staleTime: 1000 * 30, // 30 seconds
    refetchInterval: 1000 * 5, // Refetch every 5 seconds for real-time feel
  });
};

// Search users
export const useSearchUsers = (query: string, enabled: boolean = false) => {
  return useQuery({
    queryKey: messagingKeys.search(query),
    queryFn: async () => {
      const result = await searchUsers(query);
      if (!result.success) {
        throw result;
      }
      return result.data;
    },
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

// Send message mutation
export const useSendMessage = (pathname: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["messaging", "send"],
    mutationFn: async (payload: SendMessagePayload) => {
      const result = await sendMessage(payload, pathname);
      if (!result.success) {
        throw result;
      }
      return result;
    },
    onSuccess: (data, variables) => {
      // Invalidate messages for this conversation
      queryClient.invalidateQueries({
        queryKey: messagingKeys.messages(variables.receiver_id),
      });
      // Invalidate conversations list
      queryClient.invalidateQueries({
        queryKey: messagingKeys.conversations(),
      });
      // Invalidate chat list
      queryClient.invalidateQueries({
        queryKey: messagingKeys.chatList(),
      });

      toast.success("Message sent successfully");
      return data;
    },
    onError: (error) => {
      console.error("Send message error:", error);
      handleMutationError(error);
    },
  });
};
