import { AdminMetrics } from "@/types/admin";

export async function authenticateAdmin(token: string): Promise<boolean> {
  const res = await fetch("/api/admin/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });
  const data = await res.json();
  return data.valid === true;
}

export async function fetchAdminMetrics(token: string): Promise<AdminMetrics> {
  const res = await fetch("/api/admin/metrics", {
    headers: { "X-Admin-Token": token },
  });

  if (res.status === 403) {
    throw new Error("Invalid or expired admin token");
  }

  if (!res.ok) {
    throw new Error("Failed to fetch metrics");
  }

  return res.json();
}
