import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

const result = await openai.images.generate({
model: "gpt-image-1",
prompt,
size: "1024x1024",
});

const b64 = result.data?.[0]?.b64_json;

if (!b64) {
return new Response(
JSON.stringify({ error: "No image returned" }),
{ status: 500 }
);
}

const image = `data:image/png;base64,${b64}`;

return new Response(
JSON.stringify({ image }),
{ status: 200 }
);
} catch (error) {
console.error("Image generation failed:", error);

return new Response(
JSON.stringify({ error: "Failed to generate image" }),
{ status: 500 }
);
}
}