import { NextRequest, NextResponse } from "next/server";
import { generateOtp } from "@/lib/store";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { phone } = body;

    if (!phone || phone.length < 10) {
        return NextResponse.json({ success: false, error: "Invalid phone number" }, { status: 400 });
    }

    const otp = generateOtp(phone);
    return NextResponse.json({ success: true, message: `OTP sent to ${phone}`, otp });
}
