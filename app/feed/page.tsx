import { useEffect, useState } from "react";

type SavedAd = {
id: number;
prompt: string;
image: string;
};

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [image, setImage] = useState<string | null>(null);
const [loading, setLoading] = useState(false);
const [savedAds, setSavedAds] = useState<SavedAd[]>([]);

// Load saved ads
useEffect(() => {
const stored = localStorage.getItem("ads");
if (stored) setSavedAds(JSON.parse(stored));
}, []);

// Save ads
const saveAds = (ads: SavedAd[]) => {
setSavedAds(ads);
localStorage.setItem("ads", JSON.stringify(ads));
};

async function generateAd() {
if (!prompt.trim()) {
alert("Type something first");
return;
}

setLoading(true);
setImage(null);

try {
const res = await fetch("/api/generate-image", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt }),
});

const data = await res.json();

if (!data.image) {
alert("Failed to generate");
return;
}

setImage(data.image);

const newAd: SavedAd = {
id: Date.now(),
prompt,
image: data.image,
};

saveAds([newAd, ...savedAds]);
} catch (err) {
alert("Error generating ad");
} finally {
setLoading(false);
}
}

function downloadImage() {
if (!image) return;
const a = document.createElement("a");
a.href = image;
a.download = "ad.png";
a.click();
}

return (
<main
style={{
minHeight: "100vh",
padding: "40px",
background: "linear-gradient(#1e293b, #0f172a)",
color: "white",
fontFamily: "Arial",
}}
>
<h1 style={{ fontSize: "40px", marginBottom: "20px" }}>
Ad Feed
</h1>

<div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Describe your ad..."
style={{
padding: "12px",
borderRadius: "10px",
width: "400px",
border: "none",
}}
/>

<button
onClick={generateAd}
style={{
padding: "12px 20px",
borderRadius: "10px",
border: "none",
cursor: "pointer",
}}
>
{loading ? "Generating..." : "Generate Ad"}
</button>
</div>

{loading && <p>Generating image...</p>}

{image && (
<div style={{ marginBottom: "30px" }}>
<img
src={image}
style={{
width: "400px",
borderRadius: "12px",
marginBottom: "10px",
}}
/>

<div>
<button
onClick={downloadImage}
style={{
padding: "10px",
borderRadius: "8px",
border: "none",
cursor: "pointer",
}}
>
Download
</button>
</div>
</div>
)}

<h2>Previous Ads</h2>

<div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
{savedAds.map((ad) => (
<div key={ad.id}>
<img
src={ad.image}
style={{ width: "200px", borderRadius: "10px" }}
/>
<p style={{ fontSize: "12px" }}>{ad.prompt}</p>
</div>
))}
</div>
</main>
);
}