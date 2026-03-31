"use client";

import { useState } from "react";

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [image, setImage] = useState("");
const [loading, setLoading] = useState(false);
const [likes, setLikes] = useState(0);
const [comments, setComments] = useState<string[]>([]);
const [commentInput, setCommentInput] = useState("");

const generateImage = async () => {
if (!prompt) return;
setLoading(true);

try {
const res = await fetch("/api/generate-image", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({ prompt }),
});

const data = await res.json();
setImage(data.image);
setLikes(0);
setComments([]);
} catch {
alert("Error generating image");
}

setLoading(false);
};

const addComment = () => {
if (!commentInput) return;
setComments([...comments, commentInput]);
setCommentInput("");
};

return (
<div style={{ padding: 20, background: "#0f172a", minHeight: "100vh", color: "white" }}>
<h1>AdForge</h1>

<div style={{ display: "flex", gap: 10 }}>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Create an ad..."
style={{ flex: 1, padding: 10 }}
/>
<button onClick={generateImage}>
{loading ? "Generating..." : "Generate"}
</button>
</div>

{image && (
<div style={{ marginTop: 20, background: "#111", padding: 10 }}>
<img src={image} style={{ width: "100%" }} />

<h3>{prompt}</h3>

<div style={{ display: "flex", gap: 10 }}>
<button onClick={() => setLikes(likes + 1)}>❤️ {likes}</button>

<button
onClick={() => {
navigator.clipboard.writeText(image);
alert("Copied");
}}
>
Share
</button>

<button
onClick={() => {
const a = document.createElement("a");
a.href = image;
a.download = "ad.png";
a.click();
}}
>
Download
</button>
</div>

<div style={{ marginTop: 10 }}>
<input
value={commentInput}
onChange={(e) => setCommentInput(e.target.value)}
placeholder="Write comment..."
/>
<button onClick={addComment}>Post</button>
</div>

{comments.map((c, i) => (
<p key={i}>{c}</p>
))}
</div>
)}
</div>
);
}