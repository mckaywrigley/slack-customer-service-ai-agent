import { db } from "@/db/db";
import { chatsTable, InsertChat, InsertMessage, messagesTable } from "@/db/schema/chats-schema";
import { eq } from "drizzle-orm";

export async function createChat(chat: InsertChat) {
  const [newChat] = await db.insert(chatsTable).values(chat).returning();
  return newChat;
}

export async function getChatsByUserId(userId: string) {
  return db.select().from(chatsTable).where(eq(chatsTable.userId, userId));
}

export async function addMessage(message: InsertMessage) {
  const [newMessage] = await db.insert(messagesTable).values(message).returning();
  return newMessage;
}

export async function getMessagesByChatId(chatId: string) {
  return db.select().from(messagesTable).where(eq(messagesTable.chatId, chatId));
}
