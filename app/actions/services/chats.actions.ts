"use server";

import { getSession } from "@/app/actions/session.actions";
import { chatServices } from "@/lib/api/api"; 
import { ApiError } from "@/lib/api/api-client";
import type {
  BackendUser,
  ChatUser,
  Message,
  SendMessagePayload,
} from "@/types";

const requireSession = async () => {
  const session = await getSession();
  if (!session?.accessToken) {
    throw new ApiError({
      statusCode: 401,
      message: "Unauthorized: No active session found",
      errorType: "SessionError",
    });
  }
  return session;
};

export const fetchMessages = async (userId: string) => {
  try {
    await requireSession();
    const data = await chatServices.fetchMessages(userId);
    return { success: true, messages: data.messages ?? [] as Message[] };
  } catch (error) {
    console.error("Fetch messages error:", error);
    if (ApiError.isAPiError(error)) throw error;
    throw new ApiError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};


export const fetchChatList = async () => {
  try {
    await requireSession();
    const data = await chatServices.fetchChatList();
    return { success: true, message: data.message ?? "", chatUsers: data.chatUsers ?? [] as ChatUser[] };
  } catch (error) {
    console.error("Fetch chat list error:", error);
    if (ApiError.isAPiError(error)) throw error;
    throw new ApiError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};

export const sendMessage = async (payload: SendMessagePayload) => {
  try {
    await requireSession();
    const data = await chatServices.sendMessage(payload);
    return { success: true, message: data.message ?? "Message sent", data };
  } catch (error) {
    console.error("Send message error:", error);
    if (ApiError.isAPiError(error)) throw error;
    throw new ApiError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};

export const markMessageAsRead = async (messageId: string) => {
  try {
    await requireSession();
    const data = await chatServices.markMessageAsRead(messageId);
    return { success: true, message: data.message ?? "Marked as read" };
  } catch (error) {
    console.error("Mark message as read error:", error);
    if (ApiError.isAPiError(error)) throw error;
    throw new ApiError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};

export const searchUsers = async (name: string) => {
  await requireSession();
  const data = await chatServices.searchByName(name);
  const backendUsers: BackendUser[] = Array.isArray(data.users) ? data.users : [];

  const chatUsers: ChatUser[] = backendUsers.map((u) => ({
    id: String(u.id),
    name: `${u.first_name ?? ""} ${u.last_name ?? ""}`.trim() || u.email || `User ${u.id}`,
    avatar: undefined,
    message_notification: u.message_notification ?? null,
  }));

  return { success: true, users: chatUsers, message: data.message ?? "" };
};

export const fetchConversations = async () => {
  try {
    await requireSession();
    const convs = await chatServices.fetchConversations(); // ChatUser[]
    return { success: true, conversations: convs };
  } catch (error) {
    console.error("Fetch conversations error:", error);
    if (ApiError.isAPiError(error)) throw error;
    throw new ApiError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "An unknown error occurred",
      errorType: "UnknownError",
    });
  }
};
