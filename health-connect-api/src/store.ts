import { User, Booking, BookingStatus } from "./types";

const users: Map<string, User> = new Map();
const bookings: Booking[] = [];
const otpStore: Map<string, string> = new Map();
const lockedSlots: Set<string> = new Set();

let userCounter = 1;
let bookingCounter = 1;

export function generateOtp(phone: string): string {
    const otp = "1234";
    otpStore.set(phone, otp);
    return otp;
}

export function verifyOtp(phone: string, otp: string): boolean {
    const stored = otpStore.get(phone);
    if (stored === otp) {
        otpStore.delete(phone);
        return true;
    }
    return false;
}

export function getOrCreateUser(phone: string, name?: string, city?: string): User {
    const existing = users.get(phone);
    if (existing) return existing;

    const user: User = {
        id: `USR-${String(userCounter++).padStart(4, "0")}`,
        phone_number: phone,
        name,
        city,
    };
    users.set(phone, user);
    return user;
}

export function getUserByPhone(phone: string): User | undefined {
    return users.get(phone);
}

export function getUserById(id: string): User | undefined {
    for (const user of users.values()) {
        if (user.id === id) return user;
    }
    return undefined;
}

export function createBooking(
    userId: string,
    userPhone: string,
    slotDatetime: string,
    info?: {
        patient_name?: string;
        patient_age?: number;
        patient_gender?: string;
        patient_blood_group?: string;
        patient_city?: string;
        doctor_name?: string;
        doctor_speciality?: string;
        doctor_reg_no?: string;
        doctor_experience?: string;
        doctor_clinic?: string;
    }
): Booking | null {
    if (lockedSlots.has(slotDatetime)) return null;

    const now = new Date().toISOString();
    const booking: Booking = {
        booking_id: `BKG-${String(bookingCounter++).padStart(4, "0")}`,
        user_id: userId,
        user_phone: userPhone,
        slot_datetime: slotDatetime,
        status: BookingStatus.Pending,
        created_at: now,
        updated_at: now,
        ...info,
    };

    lockedSlots.add(slotDatetime);
    bookings.push(booking);
    return booking;
}

export function getBookingById(id: string): Booking | undefined {
    return bookings.find((b) => b.booking_id === id);
}

export function getBookingsByUser(userId: string): Booking[] {
    return bookings.filter((b) => b.user_id === userId);
}

export function getAllBookings(): Booking[] {
    return [...bookings];
}

export function updateBooking(
    id: string,
    status: BookingStatus,
    reason?: string,
    newSlotDatetime?: string
): Booking | null {
    const booking = bookings.find((b) => b.booking_id === id);
    if (!booking) return null;

    if (status === BookingStatus.Cancelled) {
        lockedSlots.delete(booking.slot_datetime);
    }

    if (status === BookingStatus.Rejected) {
        lockedSlots.delete(booking.slot_datetime);
    }

    if (newSlotDatetime) {
        if (lockedSlots.has(newSlotDatetime)) return null;
        lockedSlots.delete(booking.slot_datetime);
        lockedSlots.add(newSlotDatetime);
        booking.slot_datetime = newSlotDatetime;
    }

    booking.status = status;
    booking.reason = reason || booking.reason;
    booking.updated_at = new Date().toISOString();

    return booking;
}

export function getAvailableSlots(): string[] {
    const slots: string[] = [];
    const now = new Date();
    const startDate = new Date(now);
    startDate.setHours(0, 0, 0, 0);

    for (let day = 0; day < 7; day++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + day);

        for (let hour = 9; hour < 17; hour++) {
            for (let min = 0; min < 60; min += 30) {
                const slot = new Date(date);
                slot.setHours(hour, min, 0, 0);

                if (slot > now) {
                    const isoString = slot.toISOString();
                    if (!lockedSlots.has(isoString)) {
                        slots.push(isoString);
                    }
                }
            }
        }
    }

    return slots;
}
