import { apiFetch } from "./api";

export async function fetchMyDonations() {
  const res = await apiFetch("/api/my/", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch donations");
  }

  return await res.json();   
}
export async function fetchAllDonations() {
  const res = await apiFetch("/api/all/", {
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch donations");
  }

  return await res.json();
}