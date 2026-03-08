import { NextRequest, NextResponse } from "next/server";
import { verifyOtp, getOrCreateUser } from "@/lib/store";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { phone, otp, name, city } = body;

    if (!phone || !otp) {
        return NextResponse.json({ success: false, error: "Phone and OTP required" }, { status: 400 });
    }

    const valid = verifyOtp(phone, otp);
    if (!valid) {
        return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 401 });
    }

    const user = getOrCreateUser(phone, name, city);
    return NextResponse.json({ success: true, user });
}
