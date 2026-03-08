import { useState, useCallback } from "react";
import { Video, ChatMessage } from "@/types/app";
import AppSidebar from "@/components/app/AppSidebar";
import ChatArea from "@/components/app/ChatArea";

// Demo video titles for simulation
const DEMO_TITLES = [
  "How Neural Networks Work — A Visual Guide",
  "The Future of AI in 2025 and Beyond",
  "Understanding Transformers from Scratch",
  "Machine Learning Explained in 15 Minutes",
  "Why GPT-4 Changes Everything",
];

const Index = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [questionsRemaining, setQuestionsRemaining] = useState(10);
  const [isUnlimited, setIsUnlimited] = useState(false);

  const handleLoadVideo = useCallback(
    (url: string) => {
      if (videos.length >= 5) return;
      setIsLoadingVideo(true);

      // Simulate loading
      setTimeout(() => {
        const title = DEMO_TITLES[videos.length % DEMO_TITLES.length];
        const newVideo: Video = {
          id: crypto.randomUUID(),
          title,
          url,
          duration: `${Math.floor(Math.random() * 20 + 5)}:${String(Math.floor(Math.random() * 60)).padStart(2, "0")}`,
          selected: true,
        };
        setVideos((prev) => [...prev, newVideo]);
        setIsLoadingVideo(false);

        // Success message
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `✅ Video loaded: "${title}" (${newVideo.duration}). You can now ask questions about it.`,
            timestamp: new Date(),
          },
        ]);
      }, 1500);
    },
    [videos.length]
  );

  const handleRemoveVideo = useCallback((id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }, []);

  const handleToggleVideo = useCallback((id: string) => {
    setVideos((prev) =>
      prev.map((v) => (v.id === id ? { ...v, selected: !v.selected } : v))
    );
  }, []);

  const handleSendMessage = useCallback(
    (text: string) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);

      if (!isUnlimited) {
        setQuestionsRemaining((prev) => Math.max(0, prev - 1));
      }

      // Simulate AI response
      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `Based on the selected videos, here's what I found:\n\nThe key concept discussed at [3:00-4:30](https://youtu.be/example?t=180) is that neural networks learn through backpropagation. The speaker explains the gradient descent process in detail.\n\nAdditionally, at [8:15](https://youtu.be/example?t=495), the learning rate and its impact on model convergence are covered. This ties directly to your question about "${text.slice(0, 50)}".`,
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        setIsThinking(false);
      }, 2000);
    },
    [isUnlimited]
  );

  const handleSubmitAccessKey = useCallback((key: string) => {
    // Simulate key validation
    if (key.length > 0) {
      setIsUnlimited(true);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "🔓 Access key accepted! You now have unlimited access. All limits have been removed.",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  const limitReached = !isUnlimited && questionsRemaining <= 0;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <AppSidebar
        videos={videos}
        onLoadVideo={handleLoadVideo}
        onRemoveVideo={handleRemoveVideo}
        onToggleVideo={handleToggleVideo}
        questionsRemaining={questionsRemaining}
        isUnlimited={isUnlimited}
        isLoadingVideo={isLoadingVideo}
        onSubmitAccessKey={handleSubmitAccessKey}
      />
      <ChatArea
        messages={messages}
        onSendMessage={handleSendMessage}
        hasVideos={videos.length > 0}
        isThinking={isThinking}
        questionsRemaining={questionsRemaining}
        isUnlimited={isUnlimited}
        limitReached={limitReached}
      />
    </div>
  );
};

export default Index;
