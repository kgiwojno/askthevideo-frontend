export interface AdminRealtimeMetrics {
  active_sessions: number;
  ram_mb: number;
  ram_max_mb: number;
  cpu_percent: number;
  uptime_hours: number;
}

export interface AdminSessionStats {
  total_queries: number;
  total_videos_loaded: number;
  key_queries: number;
  error_count: number;
  alert_count: number;
}

export interface AdminCostMetrics {
  total_input_tokens: number;
  total_output_tokens: number;
  estimated_cost: number;
  cycle_budget: number;
  cycle_used: number;
  total_spend: number;
  total_loaded: number;
}

export interface AdminPineconeStats {
  cached_videos: number;
  total_vectors: number;
  index_fullness_percent: number;
}

export interface AdminEvent {
  timestamp: string;
  type: "QUERY" | "VIDEO" | "SESSION" | "KEY" | "ERROR" | "ALERT" | "TOOL";
  subtype: string;
  ip: string;
  detail: string;
  // Enriched fields (optional, depend on event type)
  tool?: string;
  latency_ms?: number;
  tokens_in?: number;
  tokens_out?: number;
  video_id?: string;
  chunks?: number;
  duration_s?: number;
  fetch_ms?: number;
  tier?: string;
  questions?: number;
  videos?: number;
}

export interface AdminUserStats {
  total_users: number;
  returning_users: number;
  avg_sessions_per_user: number;
  avg_questions_per_user: number;
}

export interface AdminVideo {
  video_id: string;
  title: string;
  channel: string;
  duration_seconds: number;
  duration_display: string;
  language: string;
  is_generated: boolean;
  chunk_count: number;
  thumbnail_url: string;
  first_loaded_at: string;
  last_loaded_at: string;
  load_count: number;
  fail_count: number;
  last_error: string | null;
  last_error_at: string | null;
  available_languages: string[] | null;
  environment: string;
}

export interface AdminMetrics {
  realtime: AdminRealtimeMetrics;
  sessions: AdminSessionStats;
  cost: AdminCostMetrics;
  pinecone: AdminPineconeStats;
  users: AdminUserStats;
  videos: AdminVideo[];
  events: AdminEvent[];
  last_updated: string;
}
