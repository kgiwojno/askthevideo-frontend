import { useState } from "react";
import { Video, Limits } from "@/types/app";
import { Film, X, ChevronDown, ChevronRight, Coffee, MessageSquare, Key, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface AppSidebarProps {
  videos: Video[];
  onLoadVideo: (url: string) => void;
  onRemoveVideo: (id: string) => void;
  onToggleVideo: (id: string) => void;
  questionsRemaining: number;
  isUnlimited: boolean;
  isLoadingVideo: boolean;
  onSubmitAccessKey: (key: string) => void;
  limits: Limits;
}

const AppSidebar = ({
  videos,
  onLoadVideo,
  onRemoveVideo,
  onToggleVideo,
  questionsRemaining,
  isUnlimited,
  isLoadingVideo,
  onSubmitAccessKey,
  limits,
}: AppSidebarProps) => {
  const [url, setUrl] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [keyExpanded, setKeyExpanded] = useState(false);

  const handleLoadVideo = () => {
    if (url.trim()) {
      onLoadVideo(url.trim());
      setUrl("");
    }
  };

  const handleKeySubmit = () => {
    if (accessKey.trim()) {
      onSubmitAccessKey(accessKey.trim());
      setAccessKey("");
    }
  };

  const videosMax = limits.videos_max ?? 5;
  const videoLimitReached = !isUnlimited && videos.length >= videosMax;

  return (
    <aside className="w-[300px] min-w-[300px] h-screen bg-card border-r border-border flex flex-col overflow-hidden">
      {/* Logo */}
      <div className="p-5 pb-3">
        <h1 className="text-xl font-bold tracking-tight flex items-center gap-2">
          <span className="text-2xl">🎬</span>
          <span className="text-foreground">AskTheVideo</span>
        </h1>
      </div>

      {/* URL Input */}
      <div className="px-5 pb-4">
        <p className="text-sm font-semibold text-foreground mb-2">Add Video</p>
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLoadVideo()}
          placeholder="https://youtube.com/watch?v=..."
          className="w-full bg-secondary text-foreground text-sm border border-muted rounded-input px-3 py-2 placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-focus-ring transition-colors"
        />
        <button
          onClick={handleLoadVideo}
          disabled={!url.trim() || isLoadingVideo || videoLimitReached}
          className="mt-2 w-full bg-primary text-primary-foreground font-semibold text-sm py-2 rounded-button shadow-primary-glow hover:opacity-85 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoadingVideo ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading...
            </>
          ) : (
            "Load Video"
          )}
        </button>
        {videoLimitReached && (
          <div className="mt-2 text-xs text-warning bg-warning/10 border border-warning/30 rounded-md px-3 py-2 text-center">
            Maximum {videosMax} videos reached. Remove a video to add another.
          </div>
        )}
      </div>

      <div className="h-px bg-border mx-5" />

      {/* Video Library */}
      <div className="px-5 py-4 flex-1 overflow-y-auto">
        <p className="text-sm font-semibold text-foreground mb-3">Loaded Videos</p>
        {videos.length === 0 ? (
          <p className="text-xs text-muted-foreground">No videos loaded yet.</p>
        ) : (
          <div className="space-y-1.5">
            <AnimatePresence>
              {videos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`flex items-center gap-2 p-2 rounded-input text-sm cursor-pointer transition-colors group ${
                    video.selected
                      ? "bg-secondary border-l-2 border-l-primary"
                      : "hover:bg-secondary/60"
                  }`}
                  onClick={() => onToggleVideo(video.id)}
                >
                  <Film className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate flex-1 text-foreground text-xs">
                    {video.title.length > 40
                      ? video.title.slice(0, 40) + "…"
                      : video.title}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemoveVideo(video.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="mt-auto">
        <div className="h-px bg-border mx-5" />

        {/* Limits */}
        <div className="px-5 py-3 space-y-1">
          <p className="text-xs text-muted-foreground">
            📊 {limits.videos_loaded}/{isUnlimited ? "∞" : videosMax} videos loaded
          </p>
          {isUnlimited ? (
            <p className="text-xs text-success">📊 Unlimited access ✅</p>
          ) : (
            <p className="text-xs text-muted-foreground">
              📊 {limits.questions_used}/{limits.questions_max ?? 10} questions used
            </p>
          )}
        </div>

        <div className="h-px bg-border mx-5" />

        {/* Access Key */}
        <div className="px-5 py-3">
          <button
            onClick={() => setKeyExpanded(!keyExpanded)}
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
          >
            <Key className="w-3.5 h-3.5" />
            <span>Access Key</span>
            {keyExpanded ? (
              <ChevronDown className="w-3 h-3 ml-auto" />
            ) : (
              <ChevronRight className="w-3 h-3 ml-auto" />
            )}
          </button>
          <AnimatePresence>
            {keyExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="flex gap-2 mt-2">
                  <input
                    type="password"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleKeySubmit()}
                    placeholder="Enter key"
                    className="flex-1 bg-secondary text-foreground text-xs border border-muted rounded-input px-2.5 py-1.5 placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:shadow-focus-ring transition-colors"
                  />
                  <button
                    onClick={handleKeySubmit}
                    disabled={!accessKey.trim()}
                    className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1.5 rounded-input hover:opacity-85 transition-opacity disabled:opacity-40"
                  >
                    Go
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="h-px bg-border mx-5" />

        {/* Links */}
        <div className="px-5 py-3 space-y-2">
          <a
            href="https://buymeacoffee.com/kgiw"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-primary hover:underline transition-colors"
          >
            <Coffee className="w-3.5 h-3.5" />
            Buy Me a Coffee
          </a>
          <a
            href="https://forms.gle/8LQNE85WL29wSdno8"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Give Feedback
          </a>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-border">
          <p className="text-[11px] text-muted-foreground text-center">
            Powered by Claude Sonnet 4.6 & Pinecone
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
