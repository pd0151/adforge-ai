import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
try {
const { prompt } = await req.json();

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

const result = await openai.images.generate({
model: "gpt-image-1",
prompt,
});

return NextResponse.json({
image: result.data[0].url,
});
} catch (error: any) {
console.error(error);
return NextResponse.json(
{ error: error.message || "Something went wrong" },
{ status: 500 }
);
}
}