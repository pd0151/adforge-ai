"use client";

import { useEffect, useState } from "react";

type SavedAd = {
id: number;
prompt: string;
image: string;
};

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [loading, setLoading] = useState(false);
const [savedAds, setSavedAds] = useState<SavedAd[]>([]);

useEffect(() => {
const stored = localStorage.getItem("ads");
if (stored) {
try {
setSavedAds(JSON.parse(stored));
} catch {
setSavedAds([]);
}
}
}, []);

function saveAds(ads: SavedAd[]) {
setSavedAds(ads);
localStorage.setItem("ads", JSON.stringify(ads));
}

async function generateAd() {
if (!prompt.trim()) {
alert("Type something first");
return;
}

setLoading(true);

try {
const res = await fetch("/api/generate-image", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt }),
});

const data = await res.json();

if (!res.ok) {
alert(data.error || "Failed to generate");
return;
}

if (!data.image) {
alert("No image returned");
return;
}

const newAd: SavedAd = {
id: Date.now(),
prompt,
image: data.image,
};

const nextAds = [newAd, ...savedAds];
saveAds(nextAds);
setPrompt("");
} catch (error) {
console.error(error);
alert("Error generating ad");
} finally {
setLoading(false);
}
}

function downloadImage(src: string, id: number) {
const a = document.createElement("a");
a.href = src;
a.download = `ad-${id}.png`;
a.click();
}

function clearAds() {
localStorage.removeItem("ads");
setSavedAds([]);
}

return (
<main
style={{
minHeight: "100vh",
padding: "40px",
background: "linear-gradient(#1e293b, #0f172a)",
color: "white",
fontFamily: "Arial, sans-serif",
}}
>
<div style={{ maxWidth: "1100px", margin: "0 auto" }}>
<h1 style={{ fontSize: "40px", marginBottom: "20px" }}>Ad Feed</h1>

<div
style={{
display: "flex",
gap: "12px",
flexWrap: "wrap",
marginBottom: "25px",
}}
>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your ad..."
style={{
padding: "14px",
borderRadius: "10px",
width: "460px",
border: "none",
fontSize: "16px",
}}
/>

<button
onClick={generateAd}
disabled={loading}
style={{
padding: "14px 20px",
borderRadius: "10px",
border: "none",
cursor: "pointer",
fontWeight: "bold",
}}
>
{loading ? "Generating..." : "Generate Ad"}
</button>

{savedAds.length > 0 && (
<button
onClick={clearAds}
style={{
padding: "14px 20px",
borderRadius: "10px",
border: "none",
cursor: "pointer",
fontWeight: "bold",
background: "#ef4444",
color: "white",
}}
>
Clear Feed
</button>
)}
</div>

{loading && <p style={{ marginBottom: "20px" }}>Generating image...</p>}

{savedAds.length === 0 ? (
<p>No ads yet. Generate your first one.</p>
) : (
<>
<h2 style={{ marginBottom: "16px" }}>Saved Ads</h2>

<div
style={{
display: "grid",
gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
gap: "20px",
}}
>
{savedAds.map((ad, index) => (
<div
key={ad.id}
style={{
background: "rgba(255,255,255,0.06)",
borderRadius: "16px",
padding: "14px",
border:
index === 0
? "2px solid white"
: "1px solid rgba(255,255,255,0.2)",
}}
>
{index === 0 && (
<div
style={{
marginBottom: "10px",
fontSize: "12px",
fontWeight: "bold",
color: "#93c5fd",
}}
>
Latest Ad
</div>
)}

<img
src={ad.image}
alt={ad.prompt}
style={{
width: "100%",
borderRadius: "12px",
display: "block",
marginBottom: "10px",
}}
/>

<p
style={{
fontSize: "14px",
lineHeight: "1.4",
marginBottom: "10px",
}}
>
{ad.prompt}
</p>

<button
onClick={() => downloadImage(ad.image, ad.id)}
style={{
padding: "10px 12px",
borderRadius: "8px",
border: "none",
cursor: "pointer",
fontWeight: "bold",
}}
>
Download
</button>
</div>
))}
</div>
</>
)}
</div>
</main>
);
}