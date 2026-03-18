import { useMemo } from "react";
import { AdminVideo } from "@/types/admin";

function formatRelativeTime(utcTimestamp: string): string {
  let date = new Date(utcTimestamp);
  if (isNaN(date.getTime())) {
    date = new Date(utcTimestamp.replace(" ", "T") + "Z");
  }
  if (isNaN(date.getTime())) return utcTimestamp;

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

interface VideoTableProps {
  videos: AdminVideo[];
}

const VideoTable = ({ videos }: VideoTableProps) => {
  const sorted = useMemo(
    () => [...videos].sort((a, b) => new Date(b.last_loaded_at).getTime() - new Date(a.last_loaded_at).getTime()),
    [videos]
  );

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">Videos ({videos.length})</h3>
      </div>
      <div className="overflow-auto max-h-[500px] p-2">
        {videos.length === 0 ? (
          <p className="text-muted-foreground text-sm p-4 text-center">No videos loaded yet</p>
        ) : (
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-border">
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">ID</th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Title</th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Channel</th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Duration</th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Language</th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Chunks</th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Loads</th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Fails</th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Last Error</th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Languages</th>
                <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Last Loaded</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((video) => {
                const failOnly = video.fail_count > 0 && video.load_count === 0;
                return (
                  <tr
                    key={video.video_id}
                    className={`border-b border-border/50 last:border-0 ${failOnly ? "bg-destructive/10" : ""}`}
                  >
                    <td className="px-2 py-1.5 whitespace-nowrap">
                      <a
                        href={`https://www.youtube.com/watch?v=${video.video_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {video.video_id}
                      </a>
                    </td>
                    <td className="px-2 py-1.5 text-foreground max-w-[200px] truncate" title={video.title}>
                      {video.title}
                    </td>
                    <td className="px-2 py-1.5 text-muted-foreground whitespace-nowrap">
                      {video.channel}
                    </td>
                    <td className="px-2 py-1.5 text-muted-foreground whitespace-nowrap">
                      {video.duration_display}
                    </td>
                    <td className="px-2 py-1.5 text-muted-foreground whitespace-nowrap">
                      {video.language}
                      {video.is_generated && (
                        <span className="ml-1 text-[10px] text-yellow-400">(auto)</span>
                      )}
                    </td>
                    <td className="px-2 py-1.5 text-muted-foreground">
                      {video.chunk_count}
                    </td>
                    <td className="px-2 py-1.5 text-foreground">
                      {video.load_count}
                    </td>
                    <td className={`px-2 py-1.5 ${video.fail_count > 0 ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                      {video.fail_count}
                    </td>
                    <td className={`px-2 py-1.5 max-w-[150px] truncate ${video.last_error ? "text-destructive" : "text-muted-foreground"}`} title={video.last_error || ""}>
                      {video.last_error || ""}
                    </td>
                    <td className="px-2 py-1.5 text-muted-foreground max-w-[100px] truncate" title={Array.isArray(video.available_languages) ? video.available_languages.join(", ") : (video.available_languages || "")}>
                      {Array.isArray(video.available_languages) ? video.available_languages.join(", ") : (video.available_languages || "")}
                    </td>
                    <td className="px-2 py-1.5 text-muted-foreground whitespace-nowrap">
                      {formatRelativeTime(video.last_loaded_at)}
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

export default VideoTable;
