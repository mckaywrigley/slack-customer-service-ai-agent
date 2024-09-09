import { ChatInput } from "./chat-input";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface Chat {
  id: string;
  createdAt: Date;
}

interface ChatAreaProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (message: string) => void;
  chats: Chat[];
  onSelectChat: (chatId: string) => void;
  onStartNewChat: () => void;
  currentChatId: string | null;
}

export function ChatArea({ isOpen, onClose, messages, onSendMessage, chats, onSelectChat, onStartNewChat, currentChatId }: ChatAreaProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-96 h-[32rem] bg-background border rounded-lg shadow-lg flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold">Chat</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
        >
          Close
        </Button>
      </div>
      <div className="flex-grow flex overflow-hidden">
        <ScrollArea className="w-1/3 border-r p-2">
          <Button
            onClick={onStartNewChat}
            className="w-full mb-2"
          >
            New Chat
          </Button>
          {chats.map((chat) => (
            <Button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              variant={chat.id === currentChatId ? "secondary" : "ghost"}
              className="w-full justify-start mb-1 text-sm"
            >
              {new Date(chat.createdAt).toLocaleDateString()}
            </Button>
          ))}
        </ScrollArea>
        <div className="w-2/3 flex flex-col">
          <ScrollArea className="flex-grow p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-2 ${message.role === "user" ? "text-right" : "text-left"}`}
              >
                <span className={`inline-block p-2 rounded-lg max-w-[80%] break-words ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{message.content}</span>
              </div>
            ))}
          </ScrollArea>
          <div className="p-4 border-t">
            <ChatInput onSendMessage={onSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
