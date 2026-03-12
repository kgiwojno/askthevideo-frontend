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

export interface AdminMetrics {
  realtime: AdminRealtimeMetrics;
  sessions: AdminSessionStats;
  cost: AdminCostMetrics;
  pinecone: AdminPineconeStats;
  users: AdminUserStats;
  events: AdminEvent[];
  last_updated: string;
}
