export enum BookingStatus {
    Pending = "Pending",
    Confirmed = "Confirmed",
    Rejected = "Rejected",
    Rescheduled = "Rescheduled",
    Cancelled = "Cancelled",
}

export enum PresetReason {
    ScheduleConflict = "Schedule Conflict",
    PersonalEmergency = "Personal Emergency",
    NoLongerNeeded = "No Longer Needed",
    FoundAlternative = "Found Alternative",
    SlotUnavailable = "Slot Unavailable",
    AdminDecision = "Admin Decision",
    Other = "Other",
}

export interface User {
    id: string;
    phone_number: string;
    name?: string;
    city?: string;
}

export interface Booking {
    booking_id: string;
    user_id: string;
    user_phone: string;
    slot_datetime: string;
    status: BookingStatus;
    reason?: string;
    created_at: string;
    updated_at: string;
    requester_name?: string;
    requester_age?: number;
    requester_gender?: string;
    requester_city?: string;
    provider_name?: string;
    provider_speciality?: string;
    provider_reg_no?: string;
    provider_experience?: string;
    provider_location?: string;
}
