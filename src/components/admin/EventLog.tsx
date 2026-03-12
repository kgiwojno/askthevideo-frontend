import { AdminEvent } from "@/types/admin";

function toLocalTime(utcTimestamp: string): string {
  // Backend may send ISO 8601 ("2026-03-12T09:12:31.515455+00:00") or plain ("2026-03-09 14:25:01")
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

const typeColors: Record<AdminEvent["type"], string> = {
  QUERY: "text-foreground",
  VIDEO: "text-primary",
  SESSION: "text-muted-foreground",
  KEY: "text-yellow-400",
  ERROR: "text-destructive",
  ALERT: "text-orange-400",
};

interface EventLogProps {
  events: AdminEvent[];
}

const EventLog = ({ events }: EventLogProps) => (
  <div className="bg-card border border-border rounded-lg overflow-hidden">
    <div className="px-4 py-3 border-b border-border">
      <h3 className="text-sm font-medium text-foreground">Recent Events</h3>
    </div>
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
              <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Subtype</th>
              <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">IP</th>
              <th className="px-2 py-1.5 text-left text-muted-foreground font-normal">Detail</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                <td className="px-2 py-1.5 text-muted-foreground whitespace-nowrap">
                  {toLocalTime(event.timestamp)}
                </td>
                <td className={`px-2 py-1.5 font-semibold whitespace-nowrap ${typeColors[event.type]}`}>
                  {event.type}
                </td>
                <td className="px-2 py-1.5 text-muted-foreground whitespace-nowrap">
                  {event.subtype}
                </td>
                <td className="px-2 py-1.5 text-muted-foreground whitespace-nowrap">
                  {event.ip}
                </td>
                <td className="px-2 py-1.5 text-foreground truncate max-w-[300px]">
                  {event.detail}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

export default EventLog;
