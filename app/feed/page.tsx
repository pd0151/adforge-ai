"use client";

import { useEffect, useState } from "react";

type Post = {
id: string;
prompt: string;
image: string;
likes: number;
comments: string[];
};

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [posts, setPosts] = useState<Post[]>([]);
const [loading, setLoading] = useState(false);
const [commentInputs, setCommentInputs] = useState<{ [key: string]: string }>({});

// Load posts from localStorage
useEffect(() => {
const saved = localStorage.getItem("adforge-posts");
if (saved) setPosts(JSON.parse(saved));
}, []);

// Save posts
useEffect(() => {
localStorage.setItem("adforge-posts", JSON.stringify(posts));
}, [posts]);

const generateAd = async () => {
if (!prompt) return;
setLoading(true);

try {
const res = await fetch("/api/generate-image", {
method: "POST",
body: JSON.stringify({ prompt }),
});

const data = await res.json();

const newPost: Post = {
id: Date.now().toString(),
prompt,
image: data.image,
likes: 0,
comments: [],
};

setPosts([newPost, ...posts]);
setPrompt("");
} catch (err) {
console.error(err);
}

setLoading(false);
};

const likePost = (id: string) => {
setPosts(posts.map(p =>
p.id === id ? { ...p, likes: p.likes + 1 } : p
));
};

const addComment = (id: string) => {
const text = commentInputs[id];
if (!text) return;

setPosts(posts.map(p =>
p.id === id
? { ...p, comments: [...p.comments, text] }
: p
));

setCommentInputs({ ...commentInputs, [id]: "" });
};

return (
<main style={{ padding: "20px", maxWidth: "600px", margin: "auto", color: "white" }}>
<h1 style={{ fontSize: "28px", marginBottom: "10px" }}>AdForge Feed</h1>

{/* Input */}
<div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
<input
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Create an ad..."
style={{
flex: 1,
padding: "12px",
borderRadius: "8px",
border: "none"
}}
/>
<button
onClick={generateAd}
disabled={loading}
style={{
padding: "12px 16px",
borderRadius: "8px",
border: "none",
cursor: "pointer"
}}
>
{loading ? "..." : "Generate"}
</button>
</div>

{/* Feed */}
{posts.length === 0 && <p>No ads yet</p>}

{posts.map(post => (
<div
key={post.id}
style={{
background: "#1e293b",
padding: "10px",
borderRadius: "12px",
marginBottom: "20px"
}}
>
<img
src={post.image}
style={{
width: "100%",
borderRadius: "10px"
}}
/>

<p style={{ marginTop: "8px", fontSize: "14px" }}>
{post.prompt}
</p>

{/* Actions */}
<div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
<button onClick={() => likePost(post.id)}>
❤️ {post.likes}
</button>

<button
onClick={() => navigator.clipboard.writeText(post.image)}
>
🔗 Share
</button>
</div>

{/* Comments */}
<div style={{ marginTop: "10px" }}>
<input
placeholder="Write a comment..."
value={commentInputs[post.id] || ""}
onChange={(e) =>
setCommentInputs({
...commentInputs,
[post.id]: e.target.value
})
}
style={{
width: "100%",
padding: "8px",
borderRadius: "6px",
border: "none",
marginBottom: "5px"
}}
/>

<button onClick={() => addComment(post.id)}>
Add Comment
</button>

<div style={{ marginTop: "10px" }}>
{post.comments.map((c, i) => (
<p key={i} style={{ fontSize: "13px", opacity: 0.9 }}>
💬 {c}
</p>
))}
</div>
</div>
</div>
))}
</main>
);
}