"use client";

import { useState } from "react";

export default function Home() {
const [input, setInput] = useState("");
const [result, setResult] = useState("");
const [loading, setLoading] = useState(false);

const generateContent = async () => {
if (!input.trim()) return;

setLoading(true);
setResult("");

const fullPrompt = `You are a viral social media expert.

The user topic is: "${input}"

Create:
1. 3 viral Instagram captions
2. 3 short AI video ideas
3. 1 short reel script

Make the response clear and easy to read.

Format:

CAPTIONS
1.
2.
3.

VIDEO IDEAS
1.
2.
3.

REEL SCRIPT
Hook:
Scene 1:
Scene 2:
Scene 3:
Ending:
`;

try {
const res = await fetch("/api/generate", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt: fullPrompt }),
});

const data = await res.json();
setResult(data.result || data.text || data.output || "No result returned.");
} catch (error) {
setResult("Something went wrong. Please try again.");
}

setLoading(false);
};

return (
<main
style={{
minHeight: "100vh",
background: "#eef2ff",
padding: "24px",
fontFamily: "Arial, sans-serif",
}}
>
<div
style={{
maxWidth: "850px",
margin: "40px auto",
background: "white",
borderRadius: "24px",
padding: "32px",
boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
}}
>
<h1
style={{
fontSize: "48px",
fontWeight: "bold",
marginBottom: "10px",
color: "#111827",
}}
>
CaptionPro AI 🚀
</h1>

<p
style={{
fontSize: "20px",
color: "#4b5563",
marginBottom: "24px",
}}
>
Create viral captions, video ideas, and reel scripts in seconds 🔥
</p>

<textarea
placeholder="Try: gym transformation, luxury lifestyle, beauty brand launch..."
value={input}
onChange={(e) => setInput(e.target.value)}
style={{
width: "100%",
minHeight: "120px",
padding: "18px",
fontSize: "18px",
border: "1px solid #d1d5db",
borderRadius: "16px",
marginBottom: "18px",
resize: "vertical",
boxSizing: "border-box",
}}
/>

<button
onClick={generateContent}
disabled={loading}
style={{
width: "100%",
padding: "18px",
background: loading ? "#9ca3af" : "#111827",
color: "white",
border: "none",
borderRadius: "16px",
fontSize: "22px",
fontWeight: "bold",
cursor: loading ? "not-allowed" : "pointer",
}}
>
{loading ? "Generating..." : "Generate Captions + Video Ideas"}
</button>

{result && (
<div
style={{
marginTop: "28px",
background: "#f9fafb",
border: "1px solid #e5e7eb",
borderRadius: "18px",
padding: "24px",
}}
>
<div
style={{
display: "flex",
justifyContent: "space-between",
alignItems: "center",
marginBottom: "16px",
}}
>
<h2
style={{
fontSize: "24px",
margin: 0,
color: "#111827",
}}
>
Your Content
</h2>

<button
onClick={() => navigator.clipboard.writeText(result)}
style={{
padding: "10px 14px",
background: "white",
border: "1px solid #d1d5db",
borderRadius: "10px",
cursor: "pointer",
fontWeight: "bold",
}}
>
Copy
</button>
</div>

<div
style={{
whiteSpace: "pre-wrap",
lineHeight: 1.7,
color: "#1f2937",
fontSize: "17px",
}}
>
{result}
</div>
</div>
)}
</div>
</main>
);
}