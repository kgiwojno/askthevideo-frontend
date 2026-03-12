import { useState, useMemo } from "react";
import { AdminEvent } from "@/types/admin";
import { ArrowUpDown } from "lucide-react";

function toLocalTime(utcTimestamp: string): string {
  let date = new Date(utcTimestamp);
  if (isNaN(date.getTime())) {
    date = new Date(utcTimestamp.replace(" ", "T") + "Z");
  }
  if (isNaN(date.getTime())) return utcTimestamp;
  const day = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const time = date.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return `${day} ${time}`;
}

const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

const typeColors: Record<string, string> = {
  QUERY: "text-foreground",
  VIDEO: "text-primary",
  SESSION: "text-muted-foreground",
  KEY: "text-yellow-400",
  ERROR: "text-destructive",
  ALERT: "text-orange-400",
  TOOL: "text-cyan-400",
};

function formatLatency(ms: number | undefined): string | null {
  if (ms == null) return null;
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

function latencyColor(ms: number | undefined): string {
  if (ms == null) return "";
  if (ms < 5000) return "text-green-400";
  if (ms <= 15000) return "text-yellow-400";
  return "text-destructive";
}

function formatTokens(tokIn: number | undefined, tokOut: number | undefined): string | null {
  if (tokIn == null && tokOut == null) return null;
  const fmt = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(1)}k` : `${n}`;
  return `${fmt(tokIn ?? 0)}/${fmt(tokOut ?? 0)}`;
}

function getEventLatency(event: AdminEvent): number | undefined {
  if (event.latency_ms != null) return event.latency_ms;
  if (event.type === "VIDEO" && event.fetch_ms != null) return event.fetch_ms;
  return undefined;
}

function getEventTool(event: AdminEvent): string | null {
  if (event.tool) return event.tool;
  return null;
}

function getEventDetail(event: AdminEvent): string {
  const { type } = event;

  if (type === "VIDEO") {
    const parts: string[] = [];
    if (event.video_id) parts.push(event.video_id);
    if (event.duration_s != null) {
      const mins = Math.floor(event.duration_s / 60);
      const secs = event.duration_s % 60;
      parts.push(`${mins}:${String(secs).padStart(2, "0")}`);
    }
    if (event.chunks != null) parts.push(`${event.chunks} chunks`);
    return parts.length > 0 ? parts.join(" · ") : event.detail;
  }

  if (type === "SESSION" && event.tier != null) {
    const parts = [event.tier];
    if (event.questions != null) parts.push(`${event.questions} questions`);
    if (event.videos != null) parts.push(`${event.videos} videos`);
    return parts.join(", ");
  }

  return event.detail;
}

interface SummaryBarProps {
  events: AdminEvent[];
}

const SummaryBar = ({ events }: SummaryBarProps) => {
  const stats = useMemo(() => {
    const queryEvents = events.filter((e) => e.type === "QUERY" || e.type === "KEY");
    const latencies = queryEvents.map((e) => e.latency_ms).filter((l): l is number => l != null);
    const avgLatency = latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : null;

    const totalTokensIn = queryEvents.reduce((sum, e) => sum + (e.tokens_in ?? 0), 0);
    const totalTokensOut = queryEvents.reduce((sum, e) => sum + (e.tokens_out ?? 0), 0);

    const toolEvents = events.filter((e) => e.type === "TOOL");
    const cacheHits = toolEvents.filter((e) => e.subtype === "cache").length;
    const apiCalls = toolEvents.filter((e) => e.subtype === "api").length;
    const cacheRate = cacheHits + apiCalls > 0
      ? Math.round((cacheHits / (cacheHits + apiCalls)) * 100)
      : null;

    return { avgLatency, totalTokensIn, totalTokensOut, cacheRate };
  }, [events]);

  return (
    <div className="flex gap-4 px-4 py-2 border-b border-border text-xs text-muted-foreground">
      <span>
        Avg latency:{" "}
        <span className={stats.avgLatency != null ? latencyColor(stats.avgLatency) : ""}>
          {stats.avgLatency != null ? formatLatency(Math.round(stats.avgLatency)) : "—"}
        </span>
      </span>
      <span>
        Tokens:{" "}
        <span className="text-foreground">
          {formatTokens(stats.totalTokensIn, stats.totalTokensOut) ?? "—"}
        </span>
      </span>
      <span>
        Cache hit rate:{" "}
        <span className="text-foreground">
          {stats.cacheRate != null ? `${stats.cacheRate}%` : "—"}
        </span>
      </span>
    </div>
  );
};

interface EventLogProps {
  events: AdminEvent[];
}

const EventLog = ({ events }: EventLogProps) => {
  const [sortByLatency, setSortByLatency] = useState<"asc" | "desc" | null>(null);

  const sortedEvents = useMemo(() => {
    if (!sortByLatency) return events;
    return [...events].sort((a, b) => {
      const la = getEventLatency(a) ?? -1;
      const lb = getEventLatency(b) ?? -1;
      return sortByLatency === "desc" ? lb - la : la - lb;
    });
  }, [events, sortByLatency]);

  const toggleSort = () => {
    setSortByLatency((prev) => {
      if (prev === null) return "desc";
      if (prev === "desc") return "asc";
      return null;
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">Recent Events</h3>
      </div>
      <SummaryBar events={events} />
      <div className="overflow-auto max-h-[400px] p-2">
        {events.length === 0 ? (
          <p className="text-muted-foreground text-sm p-4 text-center">No events yet</p>
        ) : (
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border">
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">
                  Time ({localTimezone})
                </th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Type</th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">IP</th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Tool</th>
                <th
                  className="px-2 py-1.5 text-left text-muted-foreground font-normal cursor-pointer select-none hover:text-foreground transition-colors"
                  onClick={toggleSort}
                >
                  <span className="inline-flex items-center gap-1">
                    Latency
                    <ArrowUpDown className="w-3 h-3" />
                    {sortByLatency && (
                      <span className="text-[10px]">{sortByLatency === "desc" ? "↓" : "↑"}</span>
                    )}
                  </span>
                </th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Tokens</th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Detail</th>
              </tr>
            </thead>
            <tbody>
              {sortedEvents.map((event, i) => {
                const latencyMs = getEventLatency(event);
                const tool = getEventTool(event);
                const tokens = formatTokens(event.tokens_in, event.tokens_out);
                const detail = getEventDetail(event);

                return (
                  <tr key={i} className="border-b border-border/50 last:border-0">
                    <td className="px-2 py-1.5 text-muted-foreground whitespace-nowrap">
                      {toLocalTime(event.timestamp)}
                    </td>
                    <td className={`px-2 py-1.5 font-semibold whitespace-nowrap ${typeColors[event.type] ?? "text-foreground"}`}>
                      {event.type}
                    </td>
                    <td className="px-2 py-1.5 text-muted-foreground whitespace-nowrap">
                      {event.ip}
                    </td>
                    <td className="px-2 py-1.5 text-foreground whitespace-nowrap">
                      {tool ?? ""}
                    </td>
                    <td className={`px-2 py-1.5 whitespace-nowrap ${latencyColor(latencyMs)}`}>
                      {formatLatency(latencyMs) ?? ""}
                    </td>
                    <td className="px-2 py-1.5 text-foreground whitespace-nowrap">
                      {tokens ?? ""}
                    </td>
                    <td className="px-2 py-1.5 text-foreground truncate max-w-[300px]">
                      {detail}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default EventLog;
