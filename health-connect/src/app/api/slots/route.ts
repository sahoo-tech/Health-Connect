import { NextResponse } from "next/server";
import { getAvailableSlots } from "@/lib/store";

export async function GET() {
    const slots = getAvailableSlots();
    return NextResponse.json({ slots });
}
