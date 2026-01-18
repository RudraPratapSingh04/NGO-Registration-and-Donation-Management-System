import { store } from "../store";
import { clearAuth } from "../store/authSlice";
import { refreshAccessToken } from "./refreshToken";

const API_BASE_URL = "http://localhost:8000";

export async function apiFetch(endpoint, options = {}) {
  const makeRequest = () => {
    const state = store.getState();
    const accessToken = state.auth.accessToken;

    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: "include",
    });
  };


  let response = await makeRequest();
  if (response.status === 401) {
    const refreshed = await refreshAccessToken();

    if (!refreshed) {
      store.dispatch(clearAuth());
      throw new Error("Session expired");
    }
    response = await makeRequest();
  }

  return response;
}
