import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
try {
const body = await req.json();
const prompt = body.prompt;

if (!prompt) {
return Response.json({ error: "No prompt" }, { status: 400 });
}

const result = await openai.images.generate({
model: "gpt-image-1",
prompt,
size: "1024x1024",
});

const item = result.data?.[0];

if (!item) {
return Response.json({ error: "No image returned" }, { status: 500 });
}

if ("b64_json" in item && item.b64_json) {
const image = `data:image/png;base64,${item.b64_json}`;
return Response.json({ image });
}

if ("url" in item && item.url) {
return Response.json({ image: item.url });
}

return Response.json({ error: "Image format not supported" }, { status: 500 });
} catch (error) {
console.error("IMAGE ERROR:", error);
return Response.json({ error: "Failed to generate image" }, { status: 500 });
}
}