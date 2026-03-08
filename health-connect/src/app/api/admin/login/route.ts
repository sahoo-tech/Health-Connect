import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = "admin123";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { password } = body;

    if (password === ADMIN_PASSWORD) {
        return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: "Invalid password" }, { status: 401 });
}
