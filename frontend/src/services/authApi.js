export async function login(email, password) {
  const res = await fetch("/api/auth/login/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", 
    body: JSON.stringify({
      email: email,
      password: password,
    })
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  return res.json(); 
}
