"use server";

import { addMessage, createChat, getChatsByUserId, getMessagesByChatId } from "@/db/queries/chats-queries";
import { auth } from "@clerk/nextjs/server";
import { handleCustomerSupport } from "./openai-actions";

export async function startNewChat() {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  const newChat = await createChat({ userId });
  return newChat;
}

export async function sendMessage(chatId: string | null, content: string) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  let actualChatId = chatId;
  if (!actualChatId) {
    const newChat = await createChat({ userId });
    actualChatId = newChat.id;
  }

  // Add user message to the database
  await addMessage({ chatId: actualChatId, role: "user", content });

  // Get all messages for this chat
  const chatHistory = await getMessagesByChatId(actualChatId);

  // Process the message with OpenAI
  const response = await handleCustomerSupport(
    content,
    chatHistory.map((msg) => ({
      role: msg.role as "user" | "assistant",
      content: msg.content
    }))
  );

  // Add AI response to the database
  await addMessage({ chatId: actualChatId, role: "assistant", content: response.message });

  return { ...response, chatId: actualChatId };
}

export async function getUserChats() {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  return getChatsByUserId(userId);
}

export async function getChatMessages(chatId: string) {
  return getMessagesByChatId(chatId);
}
