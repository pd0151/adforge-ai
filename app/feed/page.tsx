"use client";

import { useEffect, useState } from "react";

type Post = {
id: string;
prompt: string;
image: string;
likes: number;
comments: string[];
shares: number;
};

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(false);
const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

// LOAD POSTS
useEffect(() => {
const saved = localStorage.getItem("adforge-posts");
if (saved) {
try {
setPosts(JSON.parse(saved));
} catch {
setPosts([]);
}
}
}, []);

// SAVE POSTS
useEffect(() => {
localStorage.setItem("adforge-posts", JSON.stringify(posts));
}, [posts]);

// GENERATE AD
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

console.log("API:", data);

if (!res.ok || !data.image) {
alert("Error generating image");
return;
}

const newPost: Post = {
id: Date.now().toString(),
prompt,
image: data.image,
likes: 0,
comments: [],
shares: 0,
};

setPosts((prev) => [newPost, ...prev]);
setPrompt("");

} catch (error) {
console.error(error);
alert("Error generating");
} finally {
setLoading(false);
}
}

function likePost(id: string) {
setPosts((prev) =>
prev.map((p) =>
p.id === id ? { ...p, likes: p.likes + 1 } : p
)
);
}

function sharePost(id: string, image: string) {
navigator.clipboard.writeText(image);

setPosts((prev) =>
prev.map((p) =>
p.id === id ? { ...p, shares: p.shares + 1 } : p
)
);

alert("Copied!");
}

function addComment(id: string) {
const text = (commentInputs[id] || "").trim();
if (!text) return;

setPosts((prev) =>
prev.map((p) =>
p.id === id
? { ...p, comments: [...p.comments, text] }
: p
)
);

setCommentInputs((prev) => ({
...prev,
[id]: "",
}));
}

return (
<main style={{ padding: 20, color: "white" }}>
<h1>AdForge Feed</h1>

<div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Create an ad..."
style={{ flex: 1, padding: 10 }}
/>

<button onClick={generateAd}>
{loading ? "..." : "Generate"}
</button>
</div>

{posts.map((post) => (
<div key={post.id} style={{ marginBottom: 30 }}>

{/* IMAGE */}
<img
src={post.image}
style={{ width: "100%", maxHeight: 400, objectFit: "cover" }}
/>

<p>{post.prompt}</p>

<div style={{ display: "flex", gap: 10 }}>
<button onClick={() => likePost(post.id)}>
❤️ {post.likes}
</button>

<button>💬 {post.comments.length}</button>

<button onClick={() => sharePost(post.id, post.image)}>
🔗 Share
</button>
</div>

<div style={{ marginTop: 10 }}>
<input
placeholder="Comment..."
value={commentInputs[post.id] || ""}
onChange={(e) =>
setCommentInputs({
...commentInputs,
[post.id]: e.target.value,
})
}
/>

<button onClick={() => addComment(post.id)}>Add</button>
</div>

{post.comments.map((c, i) => (
<p key={i}>💬 {c}</p>
))}
</div>
))}
</main>
);
}