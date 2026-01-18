import { apiFetch } from "./api";


export async function fetchCurrentUser() {
  const res = await apiFetch("/api/auth/me/");
  if (!res.ok) {
    throw new Error("Failed to fetch user");
  }
  return res.json();
}

export async function fetchUsers() {
  const res = await apiFetch("/api/accounts/users/");
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  return res.json();
}

export async function toggleAdmin(userId) {
  const res = await apiFetch(
    `/api/accounts/users/${userId}/toggle-admin/`,
    { method: "PATCH" }
  );
  if (!res.ok) throw new Error("Failed to update role");
  return res.json();
}