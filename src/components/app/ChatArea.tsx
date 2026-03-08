import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types/app";
import { Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ChatAreaProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  hasVideos: boolean;
  isThinking: boolean;
  questionsRemaining: number;
  isUnlimited: boolean;
  limitReached: boolean;
}

const ThinkingIndicator = () => (
  <div className="flex items-start gap-3 px-6 py-3">
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
      <Bot className="w-4 h-4 text-primary" />
    </div>
    <div className="bg-card border border-border rounded-card p-4 max-w-[75%]">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" style={{ animationDelay: "0s" }} />
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" style={{ animationDelay: "0.2s" }} />
        <span className="w-2 h-2 rounded-full bg-primary animate-pulse-dot" style={{ animationDelay: "0.4s" }} />
        <span className="text-xs text-muted-foreground ml-2">Thinking…</span>
      </div>
    </div>
  </div>
);

const WelcomeScreen = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="flex-1 flex items-center justify-center"
  >
    <div className="text-center max-w-md px-6">
      <span className="text-5xl mb-6 block">🎬</span>
      <h2 className="text-2xl font-bold text-foreground mb-3 tracking-tight">
        Welcome to AskTheVideo
      </h2>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        Paste a YouTube URL in the sidebar to get started. You can ask questions,
        get summaries, compare videos, and more.
      </p>
      <div className="grid grid-cols-2 gap-3 text-left">
        {[
          { icon: "💬", label: "Ask questions about video content" },
          { icon: "📝", label: "Get summaries with timestamps" },
          { icon: "🔍", label: "Search across multiple videos" },
          { icon: "⚡", label: "Instant AI-powered answers" },
        ].map((item) => (
          <div
            key={item.label}
            className="bg-card border border-border rounded-card p-3 text-xs text-muted-foreground flex items-start gap-2"
          >
            <span className="text-base shrink-0">{item.icon}</span>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const formatMessageContent = (content: string) => {
  // Convert timestamp links: [3:00-4:30](url) → clickable styled links
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match;

  while ((match = linkRegex.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(content.slice(lastIndex, match.index));
    }
    const isTimestamp = /^\d+:\d+/.test(match[1]);
    parts.push(
      <a
        key={match.index}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        className={
          isTimestamp
            ? "inline-block text-primary font-medium text-[13px] bg-primary/10 px-1.5 py-0.5 rounded hover:bg-primary/20 transition-colors"
            : "text-primary hover:underline"
        }
      >
        {match[1]}
      </a>
    );
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < content.length) {
    parts.push(content.slice(lastIndex));
  }
  return parts.length > 0 ? parts : content;
};

const ChatArea = ({
  messages,
  onSendMessage,
  hasVideos,
  isThinking,
  questionsRemaining,
  isUnlimited,
  limitReached,
}: ChatAreaProps) => {
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  const handleSend = () => {
    if (input.trim() && !limitReached && hasVideos) {
      onSendMessage(input.trim());
      setInput("");
    }
  };

  const inputDisabled = !hasVideos || limitReached;

  return (
    <div className="flex-1 flex flex-col h-screen overflow-hidden">
      {/* Warning banners */}
      <AnimatePresence>
        {limitReached && !isUnlimited && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-accent/10 border-b border-accent/20 px-6 py-3"
          >
            <p className="text-xs text-accent font-medium">
              ⚠️ You have reached the 10-question limit. Enter an access key in the sidebar for unlimited access.
            </p>
          </motion.div>
        )}
        {!isUnlimited && questionsRemaining <= 3 && questionsRemaining > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-accent/10 border-b border-accent/20 px-6 py-2"
          >
            <p className="text-xs text-accent">
              ⚠️ You have {questionsRemaining} questions remaining.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages or Welcome */}
      {!hasVideos && messages.length === 0 ? (
        <WelcomeScreen />
      ) : (
        <div className="flex-1 overflow-y-auto py-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 px-6 py-3 ${
                  msg.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.role === "user"
                      ? "bg-primary/20"
                      : "bg-primary/10"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-primary" />
                  ) : (
                    <Bot className="w-4 h-4 text-primary" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-card p-4 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary/10 text-foreground"
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  {formatMessageContent(msg.content)}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isThinking && <ThinkingIndicator />}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Chat Input */}
      <div className="border-t border-border p-4 bg-background">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={inputDisabled}
            placeholder={
              !hasVideos
                ? "Load a video first…"
                : limitReached
                ? "Question limit reached"
                : "Ask a question about your videos…"
            }
            className="flex-1 bg-secondary text-foreground text-sm border border-muted rounded-input px-4 py-3 placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-focus-ring transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || inputDisabled}
            className="bg-primary text-primary-foreground p-3 rounded-button hover:opacity-85 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed shadow-primary-glow"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatArea;
