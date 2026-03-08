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
  budget_total: number;
  budget_remaining: number;
}

export interface AdminPineconeStats {
  cached_videos: number;
  total_vectors: number;
  index_fullness_percent: number;
}

export interface AdminEvent {
  timestamp: string;
  type: "QUERY" | "VIDEO" | "SESSION" | "KEY" | "ERROR" | "ALERT";
  subtype: string;
  ip: string;
  detail: string;
}

export interface AdminMetrics {
  realtime: AdminRealtimeMetrics;
  sessions: AdminSessionStats;
  cost: AdminCostMetrics;
  pinecone: AdminPineconeStats;
  events: AdminEvent[];
  last_updated: string;
}
