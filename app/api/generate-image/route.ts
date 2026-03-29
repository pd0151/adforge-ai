import { NextResponse } from "next/server";

const testImage =
"https://via.placeholder.com/600x600.png?text=AdForge+Working";

export async function POST() {
return NextResponse.json({
image: testImage,
});
}

export async function GET() {
return NextResponse.json({
image: testImage,
});
}