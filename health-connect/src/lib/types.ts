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
