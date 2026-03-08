export interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
  selected: boolean;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export type AppState =
  | "empty"
  | "loading-video"
  | "videos-loaded"
  | "thinking"
  | "limit-reached"
  | "unlimited";
