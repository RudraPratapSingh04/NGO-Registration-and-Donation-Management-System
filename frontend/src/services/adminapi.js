import { apiFetch } from "./api";

export const fetchAdminStats = async () => {
  const res = await apiFetch("/api/admin/stats/");
  if (!res.ok) throw new Error("Failed to fetch admin stats");
  return res.json();
};