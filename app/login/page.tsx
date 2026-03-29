"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
const [username, setUsername] = useState("");
const router = useRouter();

function handleLogin() {
const stored =
typeof window !== "undefined"
? localStorage.getItem("users")
: null;

const users = stored ? JSON.parse(stored) : [];

if (!users.includes(username.trim())) {
alert("User not found. Sign up first.");
return;
}

localStorage.setItem("user", username.trim());
router.push("/feed");
}

return (
<main
style={{
minHeight: "100vh",
display: "flex",
justifyContent: "center",
alignItems: "center",
background: "#0f172a",
color: "white",
}}
>
<div
style={{
width: "100%",
maxWidth: "420px",
background: "#1e293b",
padding: "32px",
borderRadius: "16px",
}}
>
<h1 style={{ fontSize: "40px", marginBottom: "8px" }}>Login</h1>
<p style={{ marginBottom: "20px", color: "#cbd5e1" }}>
Enter your username
</p>

<input
type="text"
value={username}
onChange={(e) => setUsername(e.target.value)}
placeholder="Username"
style={{
width: "100%",
padding: "14px",
borderRadius: "10px",
border: "none",
marginBottom: "16px",
fontSize: "16px",
}}
/>

<button
onClick={handleLogin}
style={{
padding: "12px 20px",
borderRadius: "10px",
border: "none",
cursor: "pointer",
fontSize: "16px",
}}
>
Login
</button>

<p style={{ marginTop: "16px", color: "#cbd5e1" }}>
No account? <a href="/signup">Sign up</a>
</p>
</div>
</main>
);
}