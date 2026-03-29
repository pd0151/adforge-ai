import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

const result = await openai.images.generate({
model: "gpt-image-1",
prompt,
size: "1024x1024",
});

const image_base64 = result.data[0].b64_json;

return NextResponse.json({
image: `data:image/png;base64,${image_base64}`,
});
} catch (error: any) {
console.error(error);

return NextResponse.json(
{ error: error.message || "Failed" },
{ status: 500 }
);
}
}