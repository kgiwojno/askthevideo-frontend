export interface Video {
  id: string;           // internal use (= video_id from API)
  video_id: string;     // YouTube video ID from API
  title: string;
  channel?: string;
  url: string;
  duration: string;     // duration_display from API
  selected: boolean;
  chunk_count?: number;
  status?: "ingested" | "cached";
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface Limits {
  videos_loaded: number;
  videos_max: number | null;
  questions_used: number;
  questions_max: number | null;
  unlimited: boolean;
}

export interface ApiError {
  error: string;
  code: string;
}

export type AppState =
  | "empty"
  | "loading-video"
  | "videos-loaded"
  | "thinking"
  | "limit-reached"
  | "unlimited";
