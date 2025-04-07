import React, { useState, useRef, useEffect } from "react";
import { tv } from "tailwind-variants";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose, IoSend } from "react-icons/io5";
import { FiMessageSquare } from "react-icons/fi";

// Define types for our component
export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatbotProps {
  title?: string;
  placeholderText?: string;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  initialOpen?: boolean;
  onSendMessage?: (message: string) => Promise<string> | string;
  avatar?: React.ReactNode;
  className?: string;
}

// Tailwind variants for styling
const chatbotButton = tv({
  base: [
    "w-14",
    "h-14",
    "rounded-full",
    "flex",
    "items-center",
    "justify-center",
    "text-white",
    "cursor-pointer",
    "shadow-lg",
    "transition-all",
    "duration-300",
    "ease-in-out",
    "bg-primary-400",
    "hover:bg-primary-500",
    "z-40",
  ],
});

const chatContainer = tv({
  base: [
    "flex",
    "flex-col",
    "rounded-2xl",
    "shadow-xl",
    "overflow-hidden",
    "text-white",
    "z-30",
    "backdrop-blur-xl",
    "bg-gradient-to-br",
    "from-[rgba(79,183,221,0.05)]",
    "to-[rgba(79,183,221,0.10)]",
    "border",
    "border-white/10",
  ],
  variants: {
    position: {
      "bottom-right": "right-0 bottom-20",
      "bottom-left": "left-0 bottom-20",
      "top-right": "right-0 top-20",
      "top-left": "left-0 top-20",
    },
  },
  defaultVariants: {
    position: "bottom-right",
  },
});

const messageContainer = tv({
  base: [
    "flex",
    "flex-col",
    "gap-3",
    "p-4",
    "overflow-y-auto",
    "scrollbar-thin",
    "scrollbar-thumb-white/20",
    "scrollbar-track-transparent",
  ],
});

const message = tv({
  base: ["px-4", "py-2", "rounded-xl", "max-w-[80%]", "body-3", "shadow-sm"],
  variants: {
    type: {
      user: "self-end bg-primary-400 bg-opacity-70 text-white",
      bot: "self-start bg-white bg-opacity-10 text-white",
    },
  },
});

const inputContainer = tv({
  base: [
    "flex",
    "items-center",
    "gap-2",
    "p-3",
    "border-t",
    "border-white/10",
    "bg-white/5",
  ],
});

const input = tv({
  base: [
    "flex-1",
    "p-2",
    "rounded-lg",
    "bg-white",
    "bg-opacity-10",
    "text-white",
    "placeholder-white/50",
    "focus:outline-none",
    "focus:ring-1",
    "focus:ring-primary-400",
  ],
});

const sendButton = tv({
  base: [
    "p-2",
    "rounded-lg",
    "bg-primary-400",
    "text-white",
    "cursor-pointer",
    "hover:bg-primary-500",
    "transition-colors",
    "duration-200",
  ],
  variants: {
    disabled: {
      true: "opacity-50 cursor-not-allowed hover:bg-primary-400",
      false: "",
    },
  },
});

// Default welcome messages
const defaultMessages: ChatMessage[] = [
  {
    id: "1",
    content: "Hello! How can I help you today?",
    isUser: false,
    timestamp: new Date(),
  },
];

export const Chatbot: React.FC<ChatbotProps> = ({
  title = "Chat Support",
  placeholderText = "Type your message...",
  position = "bottom-right",
  initialOpen = false,
  onSendMessage,
  avatar,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [messages, setMessages] = useState<ChatMessage[]>(defaultMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages when a new message is added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 300);
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Process response
    try {
      let responseContent = "Thank you for your message. I'll respond shortly.";

      if (onSendMessage) {
        const result = await onSendMessage(inputValue);
        if (result) {
          responseContent = result;
        }
      }

      setTimeout(() => {
        const botMessage: ChatMessage = {
          id: `bot-${Date.now()}`,
          content: responseContent,
          isUser: false,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        content: "Sorry, I encountered an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "top-right": "top-6 right-6",
    "top-left": "top-6 left-6",
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 ${className || ""}`}
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={chatContainer({ position })}
            style={{ width: "350px", height: "450px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white/5 border-b border-white/10">
              <div className="flex items-center gap-2">
                {avatar || (
                  <div className="w-8 h-8 rounded-full bg-primary-400 flex items-center justify-center">
                    <FiMessageSquare size={16} />
                  </div>
                )}
                <div className="font-medium body-2">{title}</div>
              </div>
              <button
                onClick={handleToggle}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Close chat"
              >
                <IoClose size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className={messageContainer()} style={{ height: "320px" }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={message({ type: msg.isUser ? "user" : "bot" })}
                >
                  {msg.content}
                </div>
              ))}
              {isLoading && (
                <div className={message({ type: "bot" })}>
                  <div className="flex gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full bg-white/60 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-white/60 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <div
                      className="w-2 h-2 rounded-full bg-white/60 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className={inputContainer()}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={placeholderText}
                className={input()}
                disabled={isLoading}
                aria-label="Chat message"
              />
              <button
                onClick={handleSendMessage}
                className={sendButton({
                  disabled: isLoading || !inputValue.trim(),
                })}
                disabled={isLoading || !inputValue.trim()}
                aria-label="Send message"
              >
                <IoSend size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        className={chatbotButton()}
        onClick={handleToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label={isOpen ? "Close chat" : "Open chat"}
        initial={false}
        animate={isOpen ? { rotate: 0 } : { rotate: 0 }}
      >
        {isOpen ? <IoClose size={24} /> : <FiMessageSquare size={24} />}
      </motion.button>
    </div>
  );
};

export default Chatbot;
