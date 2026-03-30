"use client";

import { useState, useEffect } from "react";

export default function FeedPage() {
const [prompt, setPrompt] = useState("");
const [posts, setPosts] = useState<any[]>([]);

useEffect(() => {
const saved = localStorage.getItem("posts");
if (saved) setPosts(JSON.parse(saved));
}, []);

const generate = async () => {
try {
const res = await fetch("/api/generate-image", {
method: "POST",
body: JSON.stringify({ prompt }),
});

const data = await res.json();

const newPost = {
id: Date.now(),
prompt,
image: data.image,
likes: 0,
comments: [],
};

const updated = [newPost, ...posts];
setPosts(updated);
localStorage.setItem("posts", JSON.stringify(updated));
setPrompt("");
} catch {
alert("Error generating");
}
};

const like = (id: number) => {
const updated = posts.map((p) =>
p.id === id ? { ...p, likes: p.likes + 1 } : p
);
setPosts(updated);
localStorage.setItem("posts", JSON.stringify(updated));
};

return (
<main style={styles.container}>
{/* TOP BAR */}
<div style={styles.topBar}>
<input
style={styles.input}
placeholder="Create an ad..."
value={prompt}
onChange={(e) => setPrompt(e.target.value)}
/>
<button style={styles.button} onClick={generate}>
Generate
</button>
</div>

{/* FEED */}
<div style={styles.feed}>
{posts.map((post) => (
<div key={post.id} style={styles.card}>
<img src={post.image} style={styles.image} />

<div style={styles.overlay}>
<p>{post.prompt}</p>

<div style={styles.actions}>
<button onClick={() => like(post.id)}>❤️ {post.likes}</button>
<button
onClick={() =>
navigator.clipboard.writeText(post.image)
}
>
🔗 Share
</button>
</div>
</div>
</div>
))}
</div>
</main>
);
}

const styles: any = {
container: {
background: "#0f172a",
color: "white",
height: "100vh",
overflow: "hidden",
},
topBar: {
display: "flex",
gap: 10,
padding: 10,
position: "fixed",
width: "100%",
zIndex: 10,
background: "#0f172a",
},
input: {
flex: 1,
padding: 10,
borderRadius: 10,
border: "none",
},
button: {
padding: "10px 15px",
borderRadius: 10,
border: "none",
cursor: "pointer",
},
feed: {
marginTop: 70,
height: "calc(100vh - 70px)",
overflowY: "scroll",
scrollSnapType: "y mandatory",
},
card: {
height: "100vh",
position: "relative",
scrollSnapAlign: "start",
},
image: {
width: "100%",
height: "100%",
objectFit: "cover",
},
overlay: {
position: "absolute",
bottom: 20,
left: 20,
},
actions: {
marginTop: 10,
display: "flex",
gap: 10,
},
};