import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/types/app";
import { Send, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

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
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
      <img src="/favicon.png" alt="AskTheVideo" className="w-8 h-8" />
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

const EXAMPLE_PROMPTS = [
  "Summarize this video",
  "What are the key points?",
  "Explain the main argument",
  "List all topics covered",
];

const WelcomeScreen = ({ onSelectPrompt }: { onSelectPrompt: (text: string) => void }) => {
  const container = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15, delayChildren: 0.4 },
    },
  };
  const fadeUp = {
    hidden: { opacity: 0, y: 16 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
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
        <p className="text-sm text-muted-foreground leading-relaxed mb-5">
          Paste a YouTube URL in the sidebar to get started. You can ask questions,
          get summaries, compare videos, and more.
        </p>
        <div className="flex items-center justify-center gap-3 mb-6 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">1</span>Paste URL</span>
          <span className="text-border">→</span>
          <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">2</span>Load Video</span>
          <span className="text-border">→</span>
          <span className="flex items-center gap-1.5"><span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">3</span>Ask Away</span>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 gap-3 text-left"
        >
          {[
            { icon: "💬", label: "Ask questions about video content" },
            { icon: "📝", label: "Get summaries with timestamps" },
            { icon: "🔍", label: "Search across multiple videos" },
            { icon: "⚡", label: "Instant AI-powered answers" },
          ].map((item) => (
            <motion.div
              key={item.label}
              variants={fadeUp}
              className="bg-card border border-border rounded-card p-3 text-xs text-muted-foreground flex items-start gap-2"
            >
              <span className="text-base shrink-0">{item.icon}</span>
              {item.label}
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.1, delayChildren: 1.0 } } }}
          initial="hidden"
          animate="show"
          className="mt-6"
        >
          <motion.p variants={fadeUp} className="text-xs text-muted-foreground mb-2">Try asking:</motion.p>
          <div className="flex flex-wrap justify-center gap-2">
            {EXAMPLE_PROMPTS.map((prompt) => (
              <motion.button
                key={prompt}
                variants={fadeUp}
                onClick={() => onSelectPrompt(prompt)}
                className="text-xs px-3 py-1.5 rounded-full border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors cursor-pointer"
              >
                {prompt}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const MarkdownMessage = ({ content }: { content: string }) => (
  <ReactMarkdown
    components={{
      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium hover:underline transition-colors"
        >
          {children}
        </a>
      ),
      strong: ({ children }) => (
        <strong className="font-semibold text-foreground">{children}</strong>
      ),
      ol: ({ children }) => (
        <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>
      ),
      ul: ({ children }) => (
        <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>
      ),
      code: ({ children }) => (
        <code className="bg-secondary px-1.5 py-0.5 rounded text-xs font-mono">
          {children}
        </code>
      ),
      p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
    }}
  >
    {content}
  </ReactMarkdown>
);

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
        <WelcomeScreen onSelectPrompt={(text) => setInput(text)} />
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
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 overflow-hidden ${
                    msg.role === "user"
                      ? "bg-primary/20"
                      : ""
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-4 h-4 text-primary" />
                  ) : (
                    <img src="/favicon.png" alt="AskTheVideo" className="w-8 h-8" />
                  )}
                </div>
                <div
                  className={`max-w-[75%] rounded-card p-4 text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-primary/10 text-foreground"
                      : "bg-card border border-border text-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <MarkdownMessage content={msg.content} />
                  ) : (
                    msg.content
                  )}
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
