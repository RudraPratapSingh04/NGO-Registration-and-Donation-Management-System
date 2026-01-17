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

export async function registerUser(payload) {
  const res=await fetch("/api/auth/register/", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body:JSON.stringify(payload),
  });
  if (!res.ok){
    const err=await res.json();
    throw err;
  }
  return res.json();
}

export async function verifyOtp(payload) {
  const res = await fetch("/api/auth/verify-otp/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
  if (!res.ok){
    const err=await res.json();
    throw err;
  }
  return res.json();
}

