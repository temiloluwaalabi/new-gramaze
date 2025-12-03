// Types for messaging system

export interface ChatUser {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  user_type: string;
  user_role: string;
  phone: string | null;
  image: string | null;
  user_status: string;
  last_login_time: string | null;
  online?: boolean;
}

export interface ChatListUser extends ChatUser {
  lastMessage?: string;
  lastMessageTime?: string;
  unread?: boolean;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

export interface ConversationUser {
  id: number;
  first_name: string;
  last_name?: string;
  email?: string;
  image?: string | null;
}

export interface Conversation {
  user: ConversationUser | null;
  messages: {
    id: number;
    sender_id: number;
    message: string;
    receiver_id: number;
    read_at: string;
    created_at: string;
    updated_at: string;
  }[];
  last_message: {
    id: number;
    sender_id: number;
    receiver_id: number;
    message: string;
    read_at: string;
    created_at: string;
    updated_at: string;
  };
  unread_messages: number;
}

export interface SendMessagePayload {
  receiver_id: number;
  message: string;
}

export interface ChatListResponse {
  status: boolean;
  message: string;
  chat_users: ChatUser[];
}

export interface ConversationResponse {
  status: boolean;
  data: ConversationUser[];
}

export interface SendMessageResponse {
  status: boolean;
  message: Message;
}

export interface MessagesResponse {
  status: boolean;
  messages: Message[];
}

export interface SearchUsersResponse {
  status: boolean;
  message: string;
  users: ChatUser[];
}
