"use client";

import { getChatMessages, getUserChats, sendMessage, startNewChat } from "@/actions/chat-actions";
import { useEffect, useState } from "react";
import { ChatArea } from "./chat-area";
import { ChatButton } from "./chat-button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Chat {
  id: string;
  createdAt: Date;
}

export function IntercomClone() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    const userChats = await getUserChats();
    setChats(userChats);
  };

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  const handleStartNewChat = async () => {
    const newChat = await startNewChat();
    setCurrentChatId(newChat.id);
    setMessages([]);
    setIsChatOpen(true);
  };

  const handleSendMessage = async (content: string) => {
    const response = await sendMessage(currentChatId, content);
    setCurrentChatId(response.chatId);
    const updatedMessages = await getChatMessages(response.chatId);
    setMessages(
      updatedMessages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content
      }))
    );

    if (response.isResolved) {
      console.log("Issue resolved");
    }
  };

  const handleSelectChat = async (chatId: string) => {
    setCurrentChatId(chatId);
    const chatMessages = await getChatMessages(chatId);
    setMessages(
      chatMessages.map((msg) => ({
        id: msg.id,
        role: msg.role as "user" | "assistant",
        content: msg.content
      }))
    );
    setIsChatOpen(true);
  };

  return (
    <>
      <ChatButton onClick={toggleChat} />
      <ChatArea
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        onSendMessage={handleSendMessage}
        chats={chats}
        onSelectChat={handleSelectChat}
        onStartNewChat={handleStartNewChat}
        currentChatId={currentChatId}
      />
    </>
  );
}
