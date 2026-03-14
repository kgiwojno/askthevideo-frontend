import { useState, useEffect, useCallback } from "react";
import { RefreshCw, ExternalLink, Wrench } from "lucide-react";
import { AdminMetrics } from "@/types/admin";
import { fetchAdminMetrics } from "@/lib/admin-api";
import MetricCard from "./MetricCard";
import EventLog from "./EventLog";

interface AdminDashboardProps {
  token: string;
  onAuthError: () => void;
}

function formatNumber(n: number): string {
  return n.toLocaleString();
}

function cycleBarColor(pct: number): string {
  if (pct < 60) return "bg-green-500";
  if (pct <= 80) return "bg-yellow-500";
  return "bg-destructive";
}

const externalLinks = [
  { label: "LangSmith", url: "https://eu.smith.langchain.com" },
  { label: "Pinecone", url: "https://app.pinecone.io" },
  { label: "Koyeb", url: "https://app.koyeb.com" },
  { label: "Google Analytics", url: "https://analytics.google.com" },
  { label: "Discord", url: "https://discord.com" },
];

const AdminDashboard = ({ token, onAuthError }: AdminDashboardProps) => {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [versionInfo, setVersionInfo] = useState<{ commit: string; deploy: string } | null>(null);

  useEffect(() => {
    fetch("/health")
      .then((res) => res.json())
      .then((data) => {
        const deploy = data.deployment_id || "—";
        setVersionInfo({
          commit: data.commit || "—",
          deploy: deploy.length > 8 ? deploy.slice(0, 8) : deploy,
        });
      })
      .catch(() => {});
  }, []);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchAdminMetrics(token);
      setMetrics(data);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: any) {
      if (err.message?.includes("Invalid or expired")) {
        onAuthError();
        return;
      }
      setError(err.message || "Failed to fetch metrics");
    } finally {
      setLoading(false);
    }
  }, [token, onAuthError]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  if (loading && !metrics) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  if (error && !metrics) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <p className="text-destructive">{error}</p>
        <button onClick={refresh} className="text-primary hover:underline text-sm">
          Retry
        </button>
      </div>
    );
  }

  if (!metrics) return null;

  const { realtime, sessions, cost, pinecone, users, events } = metrics;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-primary" />
          <h1 className="text-lg font-semibold">
            AskTheVideo <span className="text-muted-foreground font-normal">— Admin Dashboard</span>
          </h1>
        </div>
        <button
          onClick={refresh}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Row 1: Real-time metrics */}
        <section>
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Real-time</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard label="Active Sessions" value={String(realtime.active_sessions)} />
            <MetricCard label="RAM Usage" value={`${realtime.ram_mb.toFixed(0)} / ${realtime.ram_max_mb} MB`} />
            <MetricCard label="CPU" value={`${realtime.cpu_percent.toFixed(1)}%`} />
            <MetricCard label="Uptime" value={`${realtime.uptime_hours.toFixed(1)}h`} />
          </div>
        </section>

        {/* Row 2: Session stats */}
        <section>
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Sessions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard label="Total Queries" value={formatNumber(sessions.total_queries)} />
            <MetricCard label="Videos Loaded" value={formatNumber(sessions.total_videos_loaded)} />
            <MetricCard label="Key Queries" value={formatNumber(sessions.key_queries)} />
            <MetricCard label="Errors / Alerts" value={`${sessions.error_count} / ${sessions.alert_count}`} />
          </div>
        </section>

        {/* Row 3: User stats */}
        <section>
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Users</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard label="Total Users" value={formatNumber(users.total_users)} />
            <MetricCard label="Returning Users" value={formatNumber(users.returning_users)} />
            <MetricCard label="Avg Sessions/User" value={users.avg_sessions_per_user.toFixed(1)} />
            <MetricCard label="Avg Questions/User" value={users.avg_questions_per_user.toFixed(1)} />
          </div>
        </section>

        {/* Row 4: API cost */}
        <section>
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">API Cost</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <MetricCard label="Input Tokens" value={formatNumber(cost.total_input_tokens)} />
            <MetricCard label="Output Tokens" value={formatNumber(cost.total_output_tokens)} />
            <MetricCard label="Estimated Cost" value={`$${cost.estimated_cost.toFixed(2)}`} />
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-xs text-muted-foreground mb-2">Cycle Budget</p>
              <p className="text-lg font-semibold">
                ${cost.cycle_used.toFixed(2)} / ${cost.cycle_budget.toFixed(2)}
              </p>
              <div className="w-full h-2 bg-muted rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${cycleBarColor(cost.cycle_budget > 0 ? (cost.cycle_used / cost.cycle_budget) * 100 : 0)}`}
                  style={{ width: `${Math.min(cost.cycle_budget > 0 ? (cost.cycle_used / cost.cycle_budget) * 100 : 0, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[11px] text-muted-foreground">
                <span>Total spend: ${cost.total_spend.toFixed(2)}</span>
                <span>Total loaded: ${cost.total_loaded.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Row 5: Pinecone stats */}
        <section>
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Pinecone</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            <MetricCard label="Cached Videos" value={formatNumber(pinecone.cached_videos)} />
            <MetricCard label="Total Vectors" value={formatNumber(pinecone.total_vectors)} />
            <MetricCard label="Index Fullness" value={`${pinecone.index_fullness_percent.toFixed(1)}%`} />
          </div>
        </section>

        {/* Row 6: Event log */}
        <section>
          <EventLog events={events} />
        </section>

        {/* Row 7: External links */}
        <section>
          <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">External Dashboards</h2>
          <div className="flex flex-wrap gap-2">
            {externalLinks.map((link) => (
              <a
                key={link.label}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-card border border-border rounded-lg px-4 py-2 text-sm text-foreground hover:border-primary/50 transition-colors"
              >
                {link.label}
                <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
              </a>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border px-4 sm:px-6 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          Auto-refresh: 30s | Last: {lastUpdated || "—"}
          {versionInfo && ` | commit: ${versionInfo.commit} | deploy: ${versionInfo.deploy}`}
        </p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
