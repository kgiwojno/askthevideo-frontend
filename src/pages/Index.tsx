import { useState, useCallback, useEffect, useRef } from "react";
import { Video, ChatMessage, Limits } from "@/types/app";
import { apiCall, apiStreamCall } from "@/lib/api";
import AppSidebar from "@/components/app/AppSidebar";
import MobileSidebarDrawer from "@/components/app/MobileSidebarDrawer";
import ChatArea from "@/components/app/ChatArea";
import ConnectionStatus from "@/components/app/ConnectionStatus";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const DEFAULT_LIMITS: Limits = {
  videos_loaded: 0,
  videos_max: 5,
  questions_used: 0,
  questions_max: 10,
  unlimited: false,
};

const Index = () => {
  const isMobile = useIsMobile();
  const [videos, setVideos] = useState<Video[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingVideo, setIsLoadingVideo] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamMsgIdRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [limits, setLimits] = useState<Limits>(DEFAULT_LIMITS);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  // Derived state
  const questionsRemaining = limits.unlimited
    ? Infinity
    : (limits.questions_max ?? 10) - limits.questions_used;
  const isUnlimited = limits.unlimited;
  const limitReached = !isUnlimited && questionsRemaining <= 0;

  // Initialise session on mount
  useEffect(() => {
    const init = async () => {
      try {
        const data = await apiCall("GET", "/api/status");
        if (data.limits) {
          setLimits(data.limits);
        }
        // If session exists, restore state
        if (data.session_id) {
          const [videosRes, historyRes] = await Promise.all([
            apiCall("GET", "/api/videos"),
            apiCall("GET", "/api/history"),
          ]);

          if (videosRes.videos?.length) {
            setVideos(
              videosRes.videos.map((v: any) => ({
                id: v.video_id,
                video_id: v.video_id,
                title: v.title,
                channel: v.channel,
                url: `https://youtube.com/watch?v=${v.video_id}`,
                duration: v.duration_display,
                selected: v.selected,
              }))
            );
          }
          if (videosRes.limits) setLimits(videosRes.limits);

          if (historyRes.messages?.length) {
            setMessages(
              historyRes.messages.map((m: any, i: number) => ({
                id: `history-${i}`,
                role: m.role,
                content: m.content,
                timestamp: new Date(),
              }))
            );
          }
        }
      } catch {
        // Backend not available
        setIsOffline(true);
      } finally {
        setIsInitializing(false);
      }
    };
    init();
  }, []);

  const handleLoadVideo = useCallback(
    async (url: string) => {
      if (!isUnlimited && videos.length >= (limits.videos_max ?? 5)) return;
      setIsLoadingVideo(true);

      try {
        const data = await apiCall("POST", "/api/videos", { url });
        const v = data.video;
        const newVideo: Video = {
          id: v.video_id,
          video_id: v.video_id,
          title: v.title,
          channel: v.channel,
          url,
          duration: v.duration_display,
          selected: true,
          chunk_count: v.chunk_count,
          status: v.status,
        };
        setVideos((prev) => [...prev, newVideo]);
        if (data.limits) setLimits(data.limits);

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Video loaded: "${v.title}" (${v.duration_display}). You can now ask questions about it.`,
            timestamp: new Date(),
          },
        ]);
      } catch (err: any) {
        const msg = err?.error || "Failed to load video.";
        toast.error(msg);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Error: ${msg}`,
            timestamp: new Date(),
          },
        ]);
      } finally {
        setIsLoadingVideo(false);
      }
    },
    [videos.length, limits.videos_max, isUnlimited]
  );

  const handleRemoveVideo = useCallback(async (id: string) => {
    try {
      const data = await apiCall("DELETE", `/api/videos/${id}`);
      setVideos((prev) => prev.filter((v) => v.id !== id));
      if (data.limits) setLimits(data.limits);
    } catch (err: any) {
      toast.error(err?.error || "Failed to remove video.");
    }
  }, []);

  const handleToggleVideo = useCallback(async (id: string) => {
    let previousSelected: boolean | undefined;
    setVideos((prev) => {
      const video = prev.find((v) => v.id === id);
      previousSelected = video?.selected;
      return prev.map((v) => (v.id === id ? { ...v, selected: !v.selected } : v));
    });
    try {
      await apiCall("PATCH", `/api/videos/${id}`, {
        selected: !previousSelected,
      });
    } catch (err: any) {
      setVideos((prev) =>
        prev.map((v) => (v.id === id ? { ...v, selected: !v.selected } : v))
      );
      toast.error(err?.error || "Failed to update video.");
    }
  }, []);

  const handleSendMessage = useCallback(
    async (text: string) => {
      const userMsg: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setIsThinking(true);

      // Cancel any in-flight stream
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      const assistantId = crypto.randomUUID();
      streamMsgIdRef.current = assistantId;

      await apiStreamCall(
        "/api/ask/stream",
        { question: text },
        // onToken — append streaming message
        (accumulated) => {
          setIsThinking(false);
          setIsStreaming(true);
          setMessages((prev) => {
            const existing = prev.find((m) => m.id === assistantId);
            if (existing) {
              return prev.map((m) =>
                m.id === assistantId ? { ...m, content: accumulated } : m
              );
            }
            return [
              ...prev,
              {
                id: assistantId,
                role: "assistant" as const,
                content: accumulated,
                timestamp: new Date(),
              },
            ];
          });
        },
        // onDone
        (_fullText, data) => {
          setIsThinking(false);
          setIsStreaming(false);
          streamMsgIdRef.current = null;
          if (data?.limits) setLimits(data.limits);
        },
        // onError
        (err) => {
          setIsThinking(false);
          setIsStreaming(false);
          streamMsgIdRef.current = null;
          const msg = err?.error || "Failed to get a response.";
          setMessages((prev) => [
            ...prev,
            {
              id: assistantId,
              role: "assistant",
              content: `Error: ${msg}`,
              timestamp: new Date(),
            },
          ]);
          if (err?.code === "QUESTION_LIMIT") {
            setLimits((prev) => ({ ...prev, questions_used: prev.questions_max ?? 10 }));
          }
        },
        controller.signal
      );
    },
    []
  );

  const handleSubmitAccessKey = useCallback(async (key: string) => {
    try {
      const data = await apiCall("POST", "/api/auth", { key });
      if (data.valid) {
        if (data.limits) setLimits(data.limits);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Access key accepted! You now have unlimited access. All limits have been removed.",
            timestamp: new Date(),
          },
        ]);
      } else {
        toast.error("Access key not accepted.");
      }
    } catch (err: any) {
      toast.error(err?.error || "Failed to validate access key.");
    }
  }, []);

  if (isInitializing) {
    return (
      <div className="flex h-dvh bg-background items-center justify-center">
        <div className="text-center">
          <span className="text-4xl mb-4 block animate-pulse">🎬</span>
          <p className="text-sm text-muted-foreground">Connecting…</p>
        </div>
      </div>
    );
  }

  const sidebarProps = {
    videos,
    onLoadVideo: handleLoadVideo,
    onRemoveVideo: handleRemoveVideo,
    onToggleVideo: handleToggleVideo,
    questionsRemaining: isUnlimited ? Infinity : questionsRemaining,
    isUnlimited,
    isLoadingVideo,
    onSubmitAccessKey: handleSubmitAccessKey,
    limits,
  };

  return (
    <div className="flex flex-col h-dvh bg-background overflow-hidden">
      <ConnectionStatus isOffline={isOffline} />
      {isMobile && <MobileSidebarDrawer {...sidebarProps} />}
      <div className="flex flex-1 overflow-hidden">
        {!isMobile && <AppSidebar {...sidebarProps} />}
        <ChatArea
          messages={messages}
          onSendMessage={handleSendMessage}
          hasVideos={videos.length > 0}
          isThinking={isThinking}
          isStreaming={isStreaming}
          streamingMsgId={streamMsgIdRef.current}
          questionsRemaining={isUnlimited ? Infinity : questionsRemaining}
          isUnlimited={isUnlimited}
          limitReached={limitReached}
        />
      </div>
    </div>
  );
};

export default Index;
