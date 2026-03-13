import { useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { DEMO_VIDEOS, DEMO_QUESTIONS } from "@/lib/demo-config";
import { Video, MessageSquare } from "lucide-react";

interface DemoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLoadVideo: (url: string) => void;
  onSendMessage: (text: string) => void;
  hasVideos: boolean;
}

const DemoModal = ({
  open,
  onOpenChange,
  onLoadVideo,
  onSendMessage,
  hasVideos,
}: DemoModalProps) => {
  const handleVideoClick = useCallback(
    (url: string) => {
      onOpenChange(false);
      onLoadVideo(url);
    },
    [onOpenChange, onLoadVideo]
  );

  const handleQuestionClick = useCallback(
    (question: string) => {
      onOpenChange(false);
      onSendMessage(question);
    },
    [onOpenChange, onSendMessage]
  );

  // Keyboard shortcuts: 1-3 for videos, 4-8 for questions when modal is open
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = parseInt(e.key);
      if (isNaN(key) || key < 1) return;

      if (key <= DEMO_VIDEOS.length) {
        e.preventDefault();
        handleVideoClick(DEMO_VIDEOS[key - 1].url);
      } else if (key <= DEMO_VIDEOS.length + DEMO_QUESTIONS.length) {
        e.preventDefault();
        const questionIndex = key - DEMO_VIDEOS.length - 1;
        if (hasVideos && DEMO_QUESTIONS[questionIndex]) {
          handleQuestionClick(DEMO_QUESTIONS[questionIndex].question);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, handleVideoClick, handleQuestionClick, hasVideos]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🎬 Demo Shortcuts
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Video shortcuts */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <Video className="h-4 w-4" />
              Load Video
            </h3>
            <div className="grid gap-2">
              {DEMO_VIDEOS.map((video, index) => (
                <Button
                  key={video.url}
                  variant="outline"
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => handleVideoClick(video.url)}
                >
                  <span className="text-xs font-mono text-muted-foreground mr-2">
                    {index + 1}
                  </span>
                  <span className="font-medium">{video.label}</span>
                  {video.description && (
                    <span className="text-muted-foreground text-xs ml-2">
                      — {video.description}
                    </span>
                  )}
                </Button>
              ))}
            </div>
          </div>

          {/* Question shortcuts */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Ask Question
              {!hasVideos && (
                <span className="text-xs text-muted-foreground/60">
                  (load a video first)
                </span>
              )}
            </h3>
            <div className="grid gap-2">
              {DEMO_QUESTIONS.map((q, index) => (
                <Button
                  key={q.question}
                  variant="outline"
                  className="justify-start h-auto py-2 px-3"
                  onClick={() => handleQuestionClick(q.question)}
                  disabled={!hasVideos}
                >
                  <span className="text-xs font-mono text-muted-foreground mr-2">
                    {DEMO_VIDEOS.length + index + 1}
                  </span>
                  <span className="font-medium">{q.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-center pt-2 border-t">
            Press number keys for quick selection • Press <kbd className="px-1 py-0.5 rounded bg-muted">D</kbd> to toggle
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoModal;
