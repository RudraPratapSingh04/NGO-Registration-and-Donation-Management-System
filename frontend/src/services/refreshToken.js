import { store } from "../store";
import { setAuth } from "../store/authSlice";

export async function refreshAccessToken() {
  const res = await fetch("/api/auth/refresh/", {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) return false;
  const data = await res.json();
  const state = store.getState();
  store.dispatch(
    setAuth({
      accessToken: data.access,
      user: state.auth.user, 
    })
  );

  return true;
}
