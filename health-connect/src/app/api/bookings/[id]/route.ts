import { NextRequest, NextResponse } from "next/server";
import { updateBooking, getBookingById } from "@/lib/store";
import { BookingStatus } from "@/lib/types";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const booking = getBookingById(id);

    if (!booking) {
        return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json({ booking });
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await request.json();
    const { status, reason, newSlotDatetime } = body;

    if (!status || !Object.values(BookingStatus).includes(status)) {
        return NextResponse.json({ success: false, error: "Invalid status" }, { status: 400 });
    }

    const booking = updateBooking(id, status, reason, newSlotDatetime);

    if (!booking) {
        return NextResponse.json(
            { success: false, error: "Booking not found or slot unavailable" },
            { status: 404 }
        );
    }

    return NextResponse.json({ success: true, booking });
}
