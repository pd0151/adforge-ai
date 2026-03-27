import OpenAI from "openai";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type AdRequest = {
business?: string;
product?: string;
offer?: string;
audience?: string;
style?: string;
};

function buildPrompt({
business,
product,
offer,
audience,
style,
}: AdRequest) {
const styleText =
style === "luxury"
? "luxury, premium, elegant"
: style === "bold"
? "bold, high-contrast, attention-grabbing"
: "premium, modern, polished";

return `
Create a high-converting square social media ad image.

Brand: ${business || "Unknown brand"}
Product: ${product || "Unknown product"}
Offer: ${offer || "No offer provided"}
Audience: ${audience || "General audience"}

Style: ${styleText}

Design requirements:
- clean professional advertisement
- premium marketing look
- strong visual hierarchy
- include a clear product-focused layout
- include short headline text
- include a call to action button saying "SHOP NOW"
- make it look like a real paid social ad
- square 1:1 format
- high quality
`.trim();
}

export async function POST(req: Request) {
try {
const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
return Response.json(
{ error: "OPENAI_API_KEY is missing on the server." },
{ status: 500 }
);
}

const body = (await req.json()) as AdRequest;

const prompt = buildPrompt(body);

const openai = new OpenAI({ apiKey });

const result = await openai.images.generate({
model: "gpt-image-1",
prompt,
size: "1024x1024",
});

const imageBase64 = result.data?.[0]?.b64_json;

if (!imageBase64) {
return Response.json(
{ error: "No image was returned from OpenAI." },
{ status: 500 }
);
}

return Response.json({
image: `data:image/png;base64,${imageBase64}`,
});
} catch (error) {
console.error("Generate image error:", error);

return Response.json(
{
error: "Failed to generate image",
},
{ status: 500 }
);
}
}