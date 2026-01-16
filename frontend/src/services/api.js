import { store } from "../store";
import { setAuth, clearAuth } from "../store/authSlice";

export async function apiFetch(url, options={}){
  const state=store.getState();
  const accessToken=state.auth.accessToken;
  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: accessToken
        ? `Bearer ${accessToken}`
        : undefined,
    },
    credentials: "include",
  });

  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (!refreshed) {
      store.dispatch(clearAuth());
      throw new Error("Session expired");
    }
    const newToken = store.getState().auth.accessToken;
    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${newToken}`,
      },
      credentials: "include",
    });
  }

  return res;
}
