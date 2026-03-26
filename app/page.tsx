"use client";

import { useState } from "react";

export default function Page() {
const [input, setInput] = useState("");
const [result, setResult] = useState("");
const [loading, setLoading] = useState(false);

async function handleClick() {
if (!input.trim()) return;

setLoading(true);
setResult("");

try {
const res = await fetch("/api/generate", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt: input }),
});

const data = await res.json();
setResult(data.result || "No caption generated.");
} catch {
setResult("Something went wrong.");
} finally {
setLoading(false);
}
}

return (
<main
style={{
minHeight: "100vh",
background: "linear-gradient(135deg, #e0e7ff, #f1f5f9)",
display: "flex",
justifyContent: "center",
alignItems: "center",
padding: "24px",
}}
>
<div
style={{
width: "100%",
maxWidth: "700px",
background: "white",
padding: "32px",
borderRadius: "24px",
boxShadow: "0 12px 40px rgba(0,0,0,0.08)",
border: "1px solid #e5e7eb",
}}
>
<h1 style={{ fontSize: "44px", fontWeight: "800", letterSpacing: "-1px" }}>
CaptionPro AI 🚀
</h1>

<p style={{ color: "#6b7280", marginBottom: "24px", fontSize: "16px" }}>
Create scroll-stopping captions that boost engagement 🔥
</p>

<textarea
value={input}
onChange={(e) => setInput(e.target.value)}
placeholder="Try: gym transformation, luxury lifestyle..."
style={{
width: "100%",
minHeight: "120px",
padding: "16px",
borderRadius: "14px",
border: "1px solid #d1d5db",
fontSize: "16px",
resize: "vertical",
boxSizing: "border-box",
}}
/>

<button
onClick={handleClick}
disabled={loading}
style={{
marginTop: "16px",
width: "100%",
padding: "16px",
background: loading ? "#9ca3af" : "linear-gradient(135deg, #111827, #374151)",
color: "white",
borderRadius: "14px",
border: "none",
fontWeight: "bold",
fontSize: "18px",
cursor: loading ? "not-allowed" : "pointer",
}}
>
{loading ? "Generating..." : "Generate Caption"}
</button>

{result && (
<div
style={{
marginTop: "24px",
display: "grid",
gap: "16px",
}}
>
{result.split("\n---\n").map((caption, index) => (
<div
key={index}
style={{
background: "#f9fafb",
border: "1px solid #e5e7eb",
borderRadius: "16px",
padding: "18px",
}}
>
<div
style={{
display: "flex",
justifyContent: "space-between",
marginBottom: "10px",
}}
>
<strong>Caption {index + 1}</strong>

<button
onClick={() => navigator.clipboard.writeText(caption)}
style={{
fontSize: "12px",
padding: "6px 10px",
borderRadius: "8px",
border: "1px solid #ccc",
background: "white",
cursor: "pointer",
}}
>
Copy
</button>
</div>

<div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>
{caption}
</div>
</div>
))}
</div>
)}
</div>
</main>
);
}