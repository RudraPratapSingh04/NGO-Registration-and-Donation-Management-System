import { apiFetch } from "./api";

export async function fetchCurrentUser() {
  const res = await apiFetch("/api/auth/me/");
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
  return res.json();
}
