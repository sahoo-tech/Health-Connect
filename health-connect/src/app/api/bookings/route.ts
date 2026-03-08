import { NextRequest, NextResponse } from "next/server";
import { createBooking, getAllBookings, getBookingsByUser } from "@/lib/store";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (userId) {
        return NextResponse.json({ bookings: getBookingsByUser(userId) });
    }

    return NextResponse.json({ bookings: getAllBookings() });
}

export async function POST(request: NextRequest) {
    const body = await request.json();
    const {
        userId,
        userPhone,
        slotDatetime,
        patient_name,
        patient_age,
        patient_gender,
        patient_blood_group,
        patient_city,
        doctor_name,
        doctor_speciality,
        doctor_reg_no,
        doctor_experience,
        doctor_clinic,
    } = body;

    if (!userId || !slotDatetime || !patient_name || !patient_age || !patient_gender || !patient_blood_group || !patient_city || !doctor_speciality) {
        return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 });
    }

    const booking = createBooking(userId, userPhone, slotDatetime, {
        patient_name,
        patient_age: Number(patient_age),
        patient_gender,
        patient_blood_group,
        patient_city,
        doctor_name: doctor_name || undefined,
        doctor_speciality,
        doctor_reg_no: doctor_reg_no || undefined,
        doctor_experience: doctor_experience || undefined,
        doctor_clinic: doctor_clinic || undefined,
    });

    if (!booking) {
        return NextResponse.json(
            { success: false, error: "Slot unavailable. Please choose another slot." },
            { status: 409 }
        );
    }

    return NextResponse.json({ success: true, booking });
}
