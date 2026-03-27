"use client";

import { useState } from "react";

export default function Home() {
const [business, setBusiness] = useState("");
const [product, setProduct] = useState("");
const [offer, setOffer] = useState("");
const [audience, setAudience] = useState("");
const [style, setStyle] = useState("");
const [imageUrl, setImageUrl] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const generate = async () => {
setLoading(true);
setError("");
setImageUrl("");

try {
const res = await fetch("/api/generate-image", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({
business,
product,
offer,
audience,
style,
}),
});

const data = await res.json();

if (!res.ok) {
throw new Error(data.error || "Failed");
}

setImageUrl(data.image);
} catch (err: any) {
setError(err.message || "Something went wrong");
}

setLoading(false);
};

return (
<main style={{ padding: 20 }}>
<h1>Ad Generator</h1>

<input placeholder="Business" onChange={(e) => setBusiness(e.target.value)} />
<br />
<input placeholder="Product" onChange={(e) => setProduct(e.target.value)} />
<br />
<input placeholder="Offer" onChange={(e) => setOffer(e.target.value)} />
<br />
<input placeholder="Audience" onChange={(e) => setAudience(e.target.value)} />
<br />
<input placeholder="Style" onChange={(e) => setStyle(e.target.value)} />
<br /><br />

<button onClick={generate}>
{loading ? "Generating..." : "Generate Ad"}
</button>

{error && <p style={{ color: "red" }}>{error}</p>}

{imageUrl && (
<div>
<h3>Result:</h3>
<img src={imageUrl} width={300} />
</div>
)}
</main>
);
}