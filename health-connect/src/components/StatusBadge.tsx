"use client";

import { BookingStatus } from "@/lib/types";

interface StatusBadgeProps {
    status: BookingStatus;
}

const statusClassMap: Record<BookingStatus, string> = {
    [BookingStatus.Pending]: "status-pending",
    [BookingStatus.Confirmed]: "status-confirmed",
    [BookingStatus.Rejected]: "status-rejected",
    [BookingStatus.Rescheduled]: "status-rescheduled",
    [BookingStatus.Cancelled]: "status-cancelled",
};

export default function StatusBadge({ status }: StatusBadgeProps) {
    return (
        <span className={`status-badge ${statusClassMap[status]}`}>
            {status}
        </span>
    );
}
