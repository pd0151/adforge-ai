"use client";

import { useState } from "react";

export default function Home() {
const [business, setBusiness] = useState("");
const [product, setProduct] = useState("");
const [offer, setOffer] = useState("");
const [audience, setAudience] = useState("");
const [imageUrl, setImageUrl] = useState("");
const [loading, setLoading] = useState(false);

async function handleSubmit(e: any) {
e.preventDefault();
setLoading(true);

try {
const prompt = `
Business: ${business}
Product: ${product}
Special Offer: ${offer}
Target Audience: ${audience}
`.trim();

const res = await fetch("/api/generate-image", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt }),
cache: "no-store", // 🔥 IMPORTANT FIX
});

const data = await res.json();

if (!res.ok) {
throw new Error(data.error || "Image generation failed");
}

setImageUrl(data.image);
} catch (err: any) {
alert(err.message);
} finally {
setLoading(false);
}
}

return (
<main style={{ padding: 20 }}>
<h1>Ad Generator</h1>

<form onSubmit={handleSubmit}>
<input
placeholder="Business"
value={business}
onChange={(e) => setBusiness(e.target.value)}
/>
<br />

<input
placeholder="Product"
value={product}
onChange={(e) => setProduct(e.target.value)}
/>
<br />

<input
placeholder="Offer"
value={offer}
onChange={(e) => setOffer(e.target.value)}
/>
<br />

<input
placeholder="Audience"
value={audience}
onChange={(e) => setAudience(e.target.value)}
/>
<br />

<button type="submit" disabled={loading}>
{loading ? "Generating..." : "Generate Ad"}
</button>
</form>

{imageUrl && (
<div>
<h2>Result:</h2>
<img src={imageUrl} width={300} />
</div>
)}
</main>
);
}