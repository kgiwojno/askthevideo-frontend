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

      // Simulate AI response with varied answers
      const responses = [
        `Great question! At [2:14-3:45](https://youtu.be/example?t=134), the speaker breaks down how attention mechanisms allow models to focus on relevant parts of the input sequence.\n\nThere's also a key insight at [7:22](https://youtu.be/example?t=442) about positional encoding — without it, transformers wouldn't understand word order at all. This directly relates to "${text.slice(0, 40)}".`,
        `Here's what I found across your videos:\n\nThe section at [1:30-2:50](https://youtu.be/example?t=90) covers the difference between supervised and unsupervised learning with clear visual examples.\n\nLater at [5:48](https://youtu.be/example?t=348), the presenter demonstrates how reinforcement learning agents explore vs exploit — a fascinating tradeoff relevant to your question about "${text.slice(0, 40)}".`,
        `Based on the video content:\n\nAt [4:05-5:30](https://youtu.be/example?t=245), the speaker explains why large language models sometimes "hallucinate" — generating plausible but incorrect information.\n\nThe discussion at [10:12](https://youtu.be/example?t=612) about RLHF (Reinforcement Learning from Human Feedback) shows how this problem is being addressed. Your question about "${text.slice(0, 40)}" connects well to this.`,
        `Interesting question! The video addresses this at [0:45-2:10](https://youtu.be/example?t=45), where the host explains tokenization — how raw text is split into subword units before being processed.\n\nAt [6:33](https://youtu.be/example?t=393), there's a deep dive into embedding spaces and how semantically similar words end up near each other in vector space. This is core to understanding "${text.slice(0, 40)}".`,
        `I found several relevant sections:\n\nAt [3:20](https://youtu.be/example?t=200), the video explains the concept of transfer learning — training on one task and applying knowledge to another.\n\nThe most relevant part for your question is at [9:05-10:40](https://youtu.be/example?t=545), where fine-tuning techniques like LoRA are demonstrated, showing how to adapt large models efficiently for "${text.slice(0, 40)}".`,
        `Here's a summary related to your question:\n\nThe segment at [1:15-3:00](https://youtu.be/example?t=75) provides an excellent overview of convolutional neural networks and how they detect patterns in images layer by layer.\n\nAt [8:42](https://youtu.be/example?t=522), the speaker compares CNNs to Vision Transformers (ViTs), arguing the latter may eventually replace convolutions entirely. This ties into "${text.slice(0, 40)}".`,
      ];
      const responseIndex = Math.floor(Math.random() * responses.length);
      setTimeout(() => {
        const assistantMsg: ChatMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: responses[responseIndex],
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
