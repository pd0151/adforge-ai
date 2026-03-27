"use client";

import { useEffect, useState } from "react";

const PAYMENT_LINK = "https://buy.stripe.com/test_28E28rbrj02Ugev5XpbZe00";

export default function Home() {
const [business, setBusiness] = useState("");
const [product, setProduct] = useState("");
const [offer, setOffer] = useState("");
const [audience, setAudience] = useState("");
const [styleType, setStyleType] = useState("Premium");
const [imageUrl, setImageUrl] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [uses, setUses] = useState(0);
const [isPremium, setIsPremium] = useState(false);

useEffect(() => {
const storedUses = localStorage.getItem("ad_uses");
const storedPremium = localStorage.getItem("adforge_premium");

if (storedUses) {
setUses(parseInt(storedUses, 10) || 0);
}

if (storedPremium === "true") {
setIsPremium(true);
}
}, []);

const saveUses = (newUses: number) => {
setUses(newUses);
localStorage.setItem("ad_uses", newUses.toString());
};

const handleUpgrade = () => {
localStorage.setItem("adforge_premium", "true");
setIsPremium(true);
window.location.href = PAYMENT_LINK;
};

const generateAdImage = async () => {
if (!isPremium && uses >= 1) {
setError("Your 1 free ad is used. Upgrade to continue.");
return;
}

setLoading(true);
setError("");
setImageUrl("");

try {
const prompt = `
Create a high-converting social media advertisement.

Business: ${business}
Product: ${product}
Offer: ${offer}
Audience: ${audience}
Style: ${styleType}

Requirements:
- perfect spelling
- bold headline
- short catchy text
- strong call to action
- modern marketing layout
- premium branding
- realistic product image
- make it look like a real Facebook or Instagram ad
- clean typography
- polished composition
`.trim();

const res = await fetch("/api/generate-image", {
method: "POST",
headers: {
"Content-Type": "application/json",
},
body: JSON.stringify({ prompt }),
});

const data = await res.json();

if (!res.ok) {
throw new Error(data.error || "Failed to generate image");
}

setImageUrl(data.image);

if (!isPremium) {
saveUses(uses + 1);
}
} catch (err: any) {
setError(err.message || "Something went wrong");
} finally {
setLoading(false);
}
};

const downloadImage = () => {
if (!imageUrl) return;

const link = document.createElement("a");
link.href = imageUrl;
link.download = "adforge-ad.png";
document.body.appendChild(link);
link.click();
document.body.removeChild(link);
};

const resetFreeUse = () => {
localStorage.setItem("ad_uses", "0");
setUses(0);
setError("");
};

const removePremiumForTesting = () => {
localStorage.removeItem("adforge_premium");
setIsPremium(false);
setError("");
};

return (
<main style={styles.page}>
<div style={styles.card}>
<h1 style={styles.title}>AdForge AI</h1>
<p style={styles.subtitle}>Create professional ads in seconds</p>

<p style={styles.small}>
{isPremium
? "Premium unlocked • Unlimited ads • No watermark"
: "1 free ad • Unlimited with upgrade"}
</p>

<button style={styles.upgradeButton} onClick={handleUpgrade}>
{isPremium ? "Premium Active" : "Upgrade £9.99"}
</button>

<input
style={styles.input}
placeholder="Business (e.g. Nike)"
value={business}
onChange={(e) => setBusiness(e.target.value)}
/>

<input
style={styles.input}
placeholder="Product (e.g. Running Shoes)"
value={product}
onChange={(e) => setProduct(e.target.value)}
/>

<input
style={styles.input}
placeholder="Offer (e.g. 50% Off)"
value={offer}
onChange={(e) => setOffer(e.target.value)}
/>

<input
style={styles.input}
placeholder="Audience (e.g. Gym lovers)"
value={audience}
onChange={(e) => setAudience(e.target.value)}
/>

<div style={styles.styleWrap}>
<p style={styles.styleLabel}>Choose Style</p>
<div style={styles.styleButtons}>
{["Premium", "Bold", "Luxury"].map((style) => (
<button
key={style}
onClick={() => setStyleType(style)}
style={{
...styles.styleButton,
...(styleType === style ? styles.styleButtonActive : {}),
}}
>
{style}
</button>
))}
</div>
</div>

<button
style={styles.generateButton}
onClick={generateAdImage}
disabled={loading}
>
{loading ? "Generating..." : "Generate Ad"}
</button>

{error && <p style={styles.error}>{error}</p>}

{!isPremium && (
<div style={styles.noteBox}>
<p style={styles.noteText}>Free mode: 1 ad only, with watermark.</p>
</div>
)}

{imageUrl && (
<div style={styles.resultBox}>
<div style={styles.imageWrapper}>
<img src={imageUrl} alt="Generated ad" style={styles.image} />
{!isPremium && <div style={styles.watermark}>FREE VERSION</div>}
</div>

<button style={styles.downloadButton} onClick={downloadImage}>
Download Ad
</button>
</div>
)}

<div style={styles.testingButtons}>
<button style={styles.secondaryButton} onClick={resetFreeUse}>
Reset Free Use
</button>

<button style={styles.secondaryButton} onClick={removePremiumForTesting}>
Turn Off Premium
</button>
</div>
</div>
</main>
);
}

const styles: { [key: string]: React.CSSProperties } = {
page: {
minHeight: "100vh",
background: "linear-gradient(180deg, #f8fafc 0%, #eef2f7 100%)",
display: "flex",
justifyContent: "center",
alignItems: "center",
padding: "30px 16px",
},
card: {
width: "100%",
maxWidth: "540px",
background: "#ffffff",
borderRadius: "28px",
padding: "32px",
boxShadow: "0 20px 60px rgba(15, 23, 42, 0.12)",
},
title: {
fontSize: "24px",
fontWeight: 800,
textAlign: "center",
margin: 0,
color: "#111827",
},
subtitle: {
textAlign: "center",
color: "#4b5563",
fontSize: "16px",
marginTop: "12px",
marginBottom: "8px",
},
small: {
textAlign: "center",
color: "#9ca3af",
fontSize: "14px",
marginBottom: "24px",
},
upgradeButton: {
width: "100%",
background: "#111111",
color: "#ffffff",
border: "none",
borderRadius: "16px",
padding: "18px",
fontSize: "18px",
fontWeight: 800,
cursor: "pointer",
marginBottom: "18px",
},
input: {
width: "100%",
padding: "18px",
borderRadius: "16px",
border: "1px solid #d1d5db",
fontSize: "16px",
marginBottom: "14px",
outline: "none",
boxSizing: "border-box",
},
styleWrap: {
marginTop: "8px",
marginBottom: "18px",
},
styleLabel: {
margin: "0 0 10px 0",
fontSize: "14px",
fontWeight: 700,
color: "#374151",
},
styleButtons: {
display: "flex",
gap: "10px",
},
styleButton: {
flex: 1,
padding: "12px",
borderRadius: "12px",
border: "1px solid #d1d5db",
background: "#ffffff",
cursor: "pointer",
fontWeight: 700,
},
styleButtonActive: {
background: "#111111",
color: "#ffffff",
border: "1px solid #111111",
},
generateButton: {
width: "100%",
background: "#111111",
color: "#ffffff",
border: "none",
borderRadius: "16px",
padding: "18px",
fontSize: "18px",
fontWeight: 800,
cursor: "pointer",
},
error: {
color: "#b91c1c",
marginTop: "14px",
textAlign: "center",
fontWeight: 600,
},
noteBox: {
marginTop: "14px",
background: "#f9fafb",
border: "1px solid #e5e7eb",
borderRadius: "12px",
padding: "12px",
},
noteText: {
margin: 0,
fontSize: "13px",
color: "#6b7280",
textAlign: "center",
},
resultBox: {
marginTop: "22px",
},
imageWrapper: {
position: "relative",
},
image: {
width: "100%",
borderRadius: "18px",
display: "block",
boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
},
watermark: {
position: "absolute",
top: "12px",
left: "12px",
background: "rgba(0,0,0,0.75)",
color: "#ffffff",
padding: "8px 12px",
borderRadius: "10px",
fontSize: "12px",
fontWeight: 800,
letterSpacing: "0.5px",
},
downloadButton: {
width: "100%",
marginTop: "14px",
background: "#2563eb",
color: "#ffffff",
border: "none",
borderRadius: "14px",
padding: "16px",
fontSize: "16px",
fontWeight: 800,
cursor: "pointer",
},
testingButtons: {
display: "flex",
gap: "10px",
marginTop: "18px",
},
secondaryButton: {
flex: 1,
background: "#f3f4f6",
color: "#111827",
border: "1px solid #d1d5db",
borderRadius: "12px",
padding: "12px",
fontSize: "14px",
fontWeight: 700,
cursor: "pointer",
},
};