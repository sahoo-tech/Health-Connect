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

export enum AdminRejectReason {
    NoSlotsAvailable = "No slots available for requested date",
    IneligibleRequest = "Request does not meet eligibility criteria",
    IncompleteInformation = "Incomplete or invalid patient information",
    OutOfServiceArea = "Patient location outside service area",
    ResourceUnavailable = "Required care resource not available",
    DuplicateRequest = "Duplicate booking detected",
    PolicyViolation = "Request violates programme policy",
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
