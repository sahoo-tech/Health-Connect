"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import StatusBadge from "@/components/StatusBadge";
import { Booking, BookingStatus } from "@/lib/types";
import { API_BASE } from "@/lib/api";

export default function AdminDashboard() {
    const router = useRouter();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("All");

    const loadBookings = useCallback(async () => {
        const res = await fetch(`${API_BASE}/api/bookings`);
        const data = await res.json();
        setBookings(data.bookings || []);
        setLoading(false);
    }, []);

    useEffect(() => {
        const stored = sessionStorage.getItem("hc_admin");
        if (stored !== "true") {
            router.push("/admin");
            return;
        }
        loadBookings();
    }, [router, loadBookings]);

    useEffect(() => {
        const interval = setInterval(loadBookings, 4000);
        return () => clearInterval(interval);
    }, [loadBookings]);

    const handleLogout = () => {
        sessionStorage.removeItem("hc_admin");
        router.push("/admin");
    };

    const filteredBookings = filter === "All"
        ? bookings
        : bookings.filter((b) => b.status === filter);

    const counts = {
        total: bookings.length,
        pending: bookings.filter((b) => b.status === BookingStatus.Pending).length,
        confirmed: bookings.filter((b) => b.status === BookingStatus.Confirmed).length,
        rejected: bookings.filter((b) => b.status === BookingStatus.Rejected).length,
    };

    const formatSlot = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }) + ", " + d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatCreated = (iso: string) => {
        return new Date(iso).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    return (
        <>
            <Header role="admin" onLogout={handleLogout} />
            <div className="page-container">
                <h1 className="page-title">All requests</h1>
                <p className="page-subtitle">Review and manage booking requests</p>

                <div className="stats-row">
                    <div className="stat-card">
                        <div className="stat-value teal">{counts.total}</div>
                        <div className="stat-label">Total</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value amber">{counts.pending}</div>
                        <div className="stat-label">Awaiting</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value green">{counts.confirmed}</div>
                        <div className="stat-label">Confirmed</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value red">{counts.rejected}</div>
                        <div className="stat-label">Rejected</div>
                    </div>
                </div>

                <div className="filter-bar">
                    {["All", ...Object.values(BookingStatus)].map((f) => (
                        <button
                            key={f}
                            className={`filter-btn ${filter === f ? "active" : ""}`}
                            onClick={() => setFilter(f)}
                        >
                            {f}
                            {f === "All" && ` (${bookings.length})`}
                            {f !== "All" && ` (${bookings.filter((b) => b.status === f).length})`}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <div className="loading-container">
                        <div className="spinner" style={{ color: "var(--accent-teal)" }}></div>
                        <span>Loading</span>
                    </div>
                ) : filteredBookings.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-state-graphic">
                            <svg viewBox="0 0 64 64" fill="none">
                                <rect x="8" y="16" width="48" height="42" rx="5" stroke="currentColor" strokeWidth="2.5" />
                                <path d="M8 26h48" stroke="currentColor" strokeWidth="2.5" />
                                <rect x="21" y="8" width="5" height="14" rx="2.5" fill="currentColor" />
                                <rect x="38" y="8" width="5" height="14" rx="2.5" fill="currentColor" />
                                <path d="M24 40l4 4 12-12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.4" />
                            </svg>
                        </div>
                        <div className="empty-state-title">
                            {filter === "All" ? "No requests yet" : `No ${filter.toLowerCase()} requests`}
                        </div>
                        <div className="empty-state-text">
                             {filter === "All" ? "Requests will appear here once users submit them." : `Switch the filter to see other requests.`}
                        </div>
                    </div>
                ) : (
                    <div className="booking-list">
                        {filteredBookings
                            .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                            .map((booking, i) => (
                                <Link
                                    key={booking.booking_id}
                                    href={`/admin/booking/${booking.booking_id}`}
                                    className="booking-card"
                                    style={{ animationDelay: `${i * 0.04}s` }}
                                >
                                    <div className="booking-card-left">
                                        <div className="booking-card-id">
                                            {booking.booking_id}
                                            <span style={{ color: "var(--text-muted)", fontWeight: 400, fontSize: "13px", marginLeft: "12px" }}>
                                                {booking.user_phone}
                                            </span>
                                        </div>
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
                                            <span>
                                                <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                                                    <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.5" />
                                                    <path d="M8 4.5V8l2.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                                {formatCreated(booking.created_at)}
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
        </>
    );
}
