import OpenAI from "openai";

const openai = new OpenAI({
apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
const { prompt } = await req.json();

const completion = await openai.chat.completions.create({
model: "gpt-4o-mini",
messages: [
{
role: "system",
content: `You are a viral Instagram content expert.

Write 3 HIGHLY engaging captions.

Each caption MUST:
- Start with a powerful hook (first line should grab attention instantly)
- Sound bold, raw, or slightly controversial
- Feel like something that would go viral on Reels/TikTok
- Be short and punchy (no fluff)
- Use line breaks for readability
- Include 3-5 trending hashtags

Avoid generic motivational phrases.

Make it feel REAL, like a creator talking, not AI.`,
},
{
role: "user",
content: prompt,
},
],
});

const text = completion.choices[0].message.content;

return Response.json({ result: text });
}
