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
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt }),
});

const data = await res.json();
setImage(data.image);
setLikes(0);
setComments([]);
} catch (err) {
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
<div style={styles.page}>
<div style={styles.container}>
<h1 style={styles.title}>AdForge</h1>

{/* INPUT */}
<div style={styles.inputRow}>
<input
style={styles.input}
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
placeholder="Create an ad..."
/>

<button style={styles.button} onClick={generateImage}>
{loading ? "Generating..." : "Generate"}
</button>
</div>

{/* IMAGE CARD */}
{image && (
<div style={styles.card}>
<img src={image} style={styles.image} />

<h2 style={styles.prompt}>{prompt}</h2>

{/* ACTIONS */}
<div style={styles.actions}>
<button onClick={() => setLikes(likes + 1)}>
❤️ {likes}
</button>

<button
onClick={() => {
navigator.clipboard.writeText(image);
alert("Link copied");
}}
>
🔗 Share
</button>

<button
onClick={() => {
const a = document.createElement("a");
a.href = image;
a.download = "ad.png";
a.click();
}}
>
⬇ Download
</button>
</div>

{/* COMMENTS */}
<div style={styles.commentBox}>
<input
style={styles.commentInput}
value={commentInput}
onChange={(e) => setCommentInput(e.target.value)}
placeholder="Write a comment..."
/>

<button onClick={addComment}>Post</button>
</div>

{comments.map((c, i) => (
<p key={i} style={styles.comment}>
💬 {c}
</p>
))}
</div>
)}
</div>
</div>
);
}

const styles: any = {
page: {
minHeight: "100vh",
background: "#0f172a",
color: "white",
padding: 20,
},
container: {
maxWidth: 700,
margin: "0 auto",
},
title: {
fontSize: 32,
marginBottom: 20,
},
inputRow: {
display: "flex",
gap: 10,
marginBottom: 20,
},
input: {
flex: 1,
padding: 12,
borderRadius: 6,
border: "none",
},
button: {
padding: "12px 20px",
background: "#2563eb",
color: "white",
border: "none",
borderRadius: 6,
},
card: {
background: "#111827",
padding: 16,
borderRadius: 10,
},
image: {
width: "100%",
borderRadius: 8,
},
prompt: {
marginTop: 10,
fontWeight: "bold",
},
actions: {
display: "flex",
gap: 10,
marginTop: 10,
},
commentBox: {
display: "flex",
gap: 10,
marginTop: 10,
},
commentInput: {
flex: 1,
padding: 8,
},
comment: {
marginTop: 5,
color: "#ccc",
},
};