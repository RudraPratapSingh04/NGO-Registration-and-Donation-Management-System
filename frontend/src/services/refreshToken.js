import { store } from "../store";
import { setAuth, clearAuth } from "../store/authSlice";

export async function refreshAccessToken() {
  const res = await fetch("http://localhost:8000/api/auth/refresh/", {
    method: "POST",
    credentials: "include", 
  });

  if (!res.ok) {
    store.dispatch(clearAuth());
    return false;
  }

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
