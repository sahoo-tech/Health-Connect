"use client";

import { useEffect, useState } from "react";
import { API_BASE } from "@/lib/api";

interface SlotPickerProps {
    onSelect: (slot: string) => void;
    selectedSlot?: string;
}

export default function SlotPicker({ onSelect, selectedSlot }: SlotPickerProps) {
    const [slots, setSlots] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState<string>("");

    useEffect(() => {
        fetch(`${API_BASE}/api/slots`)
            .then((res) => res.json())
            .then((data) => {
                setSlots(data.slots);
                if (data.slots.length > 0) {
                    const firstDate = new Date(data.slots[0]).toDateString();
                    setSelectedDate(firstDate);
                }
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner" style={{ color: "var(--accent-teal)" }}></div>
                <span>Loading slots</span>
            </div>
        );
    }

    const dateGroups: Record<string, string[]> = {};
    slots.forEach((slot) => {
        const dateKey = new Date(slot).toDateString();
        if (!dateGroups[dateKey]) dateGroups[dateKey] = [];
        dateGroups[dateKey].push(slot);
    });

    const dates = Object.keys(dateGroups);

    const formatDate = (dateStr: string) => {
        const d = new Date(dateStr);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (d.toDateString() === today.toDateString()) return "Today";
        if (d.toDateString() === tomorrow.toDateString()) return "Tomorrow";

        return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
    };

    const formatTime = (isoStr: string) => {
        return new Date(isoStr).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <div>
            <div className="date-tabs">
                {dates.map((date) => (
                    <button
                        key={date}
                        className={`date-tab ${selectedDate === date ? "active" : ""}`}
                        onClick={() => setSelectedDate(date)}
                    >
                        {formatDate(date)}
                    </button>
                ))}
            </div>
            {selectedDate && dateGroups[selectedDate] && (
                <div className="slot-grid">
                    {dateGroups[selectedDate].map((slot) => (
                        <button
                            key={slot}
                            className={`slot-btn ${selectedSlot === slot ? "selected" : ""}`}
                            onClick={() => onSelect(slot)}
                        >
                            {formatTime(slot)}
                        </button>
                    ))}
                </div>
            )}
            {dates.length === 0 && (
                <div className="empty-state">
                    <div className="empty-state-graphic">
                        <svg viewBox="0 0 64 64" fill="none">
                            <rect x="8" y="16" width="48" height="42" rx="5" stroke="currentColor" strokeWidth="2.5" />
                            <path d="M8 26h48" stroke="currentColor" strokeWidth="2.5" />
                            <rect x="21" y="8" width="5" height="14" rx="2.5" fill="currentColor" />
                            <rect x="38" y="8" width="5" height="14" rx="2.5" fill="currentColor" />
                            <path d="M22 38h20M22 45h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
                        </svg>
                    </div>
                    <div className="empty-state-title">No slots open</div>
                    <div className="empty-state-text">All times are taken — check back soon.</div>
                </div>
            )}
        </div>
    );
}
