import { AdminEvent } from "@/types/admin";

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
          <tbody>
            {events.map((event, i) => (
              <tr key={i} className="border-b border-border/50 last:border-0">
                <td className="px-2 py-1.5 text-muted-foreground whitespace-nowrap">
                  {event.timestamp}
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
