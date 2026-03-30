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
body: JSON.stringify({ prompt }),
});

const data = await res.json();
setImage(data.image);
setLikes(0);
setComments([]);
} catch (err) {
console.error(err);
alert("Failed to generate image");
}
setLoading(false);
};

const handleLike = () => {
setLikes((prev) => prev + 1);
};

const handleAddComment = () => {
if (!commentInput) return;
setComments((prev) => [...prev, commentInput]);
setCommentInput("");
};

const handleDownload = () => {
if (!image) return;
const link = document.createElement("a");
link.href = image;
link.download = "ad-image.png";
link.click();
};

const handleShare = async () => {
if (navigator.share) {
await navigator.share({
title: "AI Ad",
text: prompt,
url: image,
});
} else {
alert("Sharing not supported on this device");
}
};

return (
<div className="min-h-screen bg-black text-white p-6">
{/* INPUT */}
<div className="flex gap-2 mb-6">
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Create an ad..."
className="flex-1 p-3 rounded bg-gray-800 text-white"
/>
<button
onClick={generateImage}
className="bg-blue-500 px-4 rounded"
>
{loading ? "Generating..." : "Generate"}
</button>
</div>

{/* IMAGE CARD */}
{image && (
<div className="bg-gray-900 rounded-lg p-4 max-w-xl mx-auto">
<img src={image} className="rounded mb-4" />

<h2 className="text-xl font-bold mb-2">
{prompt}
</h2>

{/* ACTIONS */}
<div className="flex gap-4 mb-4">
<button onClick={handleLike}>
❤️ {likes}
</button>

<button onClick={handleShare}>
🔗 Share
</button>

<button onClick={handleDownload}>
⬇️ Download
</button>
</div>

{/* COMMENTS */}
<div>
<div className="flex gap-2 mb-2">
<input
value={commentInput}
onChange={(e) => setCommentInput(e.target.value)}
placeholder="Write a comment..."
className="flex-1 p-2 rounded bg-gray-800"
/>
<button
onClick={handleAddComment}
className="bg-green-500 px-3 rounded"
>
Post
</button>
</div>

{comments.map((c, i) => (
<p key={i} className="text-sm text-gray-300">
💬 {c}
</p>
))}
</div>
</div>
)}
</div>
);
}
