"use client";

import { useState } from "react";

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [image, setImage] = useState<string | null>(null);
const [loading, setLoading] = useState(false);

function generateAd() {
setLoading(true);

const text = prompt || "AdForge Test";

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900">
<defs>
<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="#0f172a"/>
<stop offset="100%" stop-color="#1e3a8a"/>
</linearGradient>
</defs>

<rect width="100%" height="100%" fill="url(#bg)"/>

<rect
x="90"
y="120"
width="720"
height="660"
rx="28"
fill="#111827"
stroke="white"
stroke-width="3"
/>

<text
x="450"
y="260"
text-anchor="middle"
fill="white"
font-size="64"
font-family="Arial"
font-weight="bold"
>
AdForge
</text>

<text
x="450"
y="370"
text-anchor="middle"
fill="#38bdf8"
font-size="34"
font-family="Arial"
>
${text}
</text>

<rect
x="260"
y="500"
width="380"
height="95"
rx="18"
fill="#facc15"
/>

<text
x="450"
y="558"
text-anchor="middle"
fill="#111827"
font-size="30"
font-family="Arial"
font-weight="bold"
>
Generated Preview
</text>
</svg>
`;

const dataUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

setTimeout(() => {
setImage(dataUrl);
setLoading(false);
}, 500);
}

return (
<main
style={{
minHeight: "100vh",
padding: "40px",
background: "linear-gradient(to bottom, #1e293b, #0f172a)",
color: "white",
fontFamily: "Arial",
}}
>
<h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>
Ad Feed
</h1>

<div
style={{
display: "flex",
gap: "12px",
flexWrap: "wrap",
alignItems: "center",
}}
>
<input
type="text"
placeholder="Describe your ad..."
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
style={{
padding: "14px",
borderRadius: "10px",
width: "420px",
maxWidth: "100%",
border: "none",
fontSize: "16px",
}}
/>

<button
onClick={generateAd}
disabled={loading}
style={{
padding: "14px 18px",
borderRadius: "10px",
border: "none",
cursor: "pointer",
fontSize: "16px",
fontWeight: "bold",
}}
>
{loading ? "Generating..." : "Generate Ad"}
</button>
</div>

{image && (
<div style={{ marginTop: "30px" }}>
<img
src={image}
alt="Generated ad"
style={{
width: "420px",
maxWidth: "100%",
borderRadius: "16px",
border: "2px solid white",
boxShadow: "0 0 20px rgba(0,0,0,0.5)",
display: "block",
}}
/>
</div>
)}
</main>
);
}