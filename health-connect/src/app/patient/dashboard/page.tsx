"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import StatusBadge from "@/components/StatusBadge";
import Toast from "@/components/Toast";
import { Booking } from "@/lib/types";
import { API_BASE } from "@/lib/api";

export default function PatientDashboard() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<{ id: string; phone_number: string; name?: string } | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    const loadBookings = useCallback(async (userId: string) => {
        const res = await fetch(`${API_BASE}/api/bookings?userId=${userId}`);
        const data = await res.json();
        setBookings(data.bookings || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        const stored = sessionStorage.getItem("hc_user");
        if (!stored) {
            router.push("/");
            return;
        }
        const userData = JSON.parse(stored);
        setUser(userData);
        loadBookings(userData.id);
    }, [router, loadBookings]);

    const handleLogout = () => {
        sessionStorage.removeItem("hc_user");
        router.push("/");
    };

    useEffect(() => {
        if (!user) return;
        const interval = setInterval(() => loadBookings(user.id), 5000);
        return () => clearInterval(interval);
    }, [user, loadBookings]);

    const formatSlot = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
        }) + " at " + d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    if (!user) return null;

    return (
        <>
            <Header role="patient" onLogout={handleLogout} />
            <div className="page-container medium">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                    <div>
                        <h1 className="page-title">Your appointments</h1>
                        <p className="page-subtitle" style={{ marginBottom: 0 }}>
                            {user.phone_number}
                        </p>
                    </div>
                    <Link href="/patient/book" className="btn btn-primary">
                        Request slot
                    </Link>
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner" style={{ color: "var(--accent-teal)" }}></div>
                        <span>Loading</span>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-graphic">
                            <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="8" y="16" width="48" height="42" rx="5" stroke="currentColor" strokeWidth="2.5" />
                                <path d="M8 26h48" stroke="currentColor" strokeWidth="2.5" />
                                <rect x="21" y="8" width="5" height="14" rx="2.5" fill="currentColor" />
                                <rect x="38" y="8" width="5" height="14" rx="2.5" fill="currentColor" />
                                <path d="M20 38h24M20 46h16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="empty-state-title">Nothing booked yet</div>
                        <div className="empty-state-text">Pick a date and request a slot — it takes under a minute.</div>
                        <Link href="/patient/book" className="btn btn-primary">
                            Request a slot
                        </Link>
                    </div>
                ) : (
                    <div className="booking-list">
                        {bookings.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((booking, i) => (
                            <Link
                                key={booking.booking_id}
                                href={`/patient/booking/${booking.booking_id}`}
                                className="booking-card"
                                style={{ animationDelay: `${i * 0.05}s` }}
                            >
                                <div className="booking-card-left">
                                    <div className="booking-card-id">{booking.booking_id}</div>
                                    <div className="booking-card-detail">
                                        <span>
                                            <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                                <rect x="1" y="3" width="14" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M1 7h14" stroke="currentColor" strokeWidth="1.5" />
                                                <rect x="4.5" y="0.5" width="2" height="5" rx="1" fill="currentColor" />
                                                <rect x="9.5" y="0.5" width="2" height="5" rx="1" fill="currentColor" />
                                            </svg>
                                            {formatSlot(booking.slot_datetime)}
                                        </span>
                                    </div>
                                </div>
                                <div className="booking-card-right">
                                    <StatusBadge status={booking.status} />
                                    <span className="booking-card-arrow">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </>
    );
}
