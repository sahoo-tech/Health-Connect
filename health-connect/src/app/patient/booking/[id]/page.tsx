"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import StatusBadge from "@/components/StatusBadge";
import Toast from "@/components/Toast";
import { Booking, BookingStatus, PresetReason } from "@/lib/types";
import { API_BASE } from "@/lib/api";

export default function PatientBookingDetail() {
    const router = useRouter();
    const params = useParams();
    const bookingId = params.id as string;

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState(PresetReason.ScheduleConflict);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    const loadBooking = useCallback(async () => {
        const res = await fetch(`${API_BASE}/api/bookings/${bookingId}`);
        const data = await res.json();
        if (data.booking) {
            setBooking(data.booking);
        }
        setLoading(false);
    }, [bookingId]);

    useEffect(() => {
        const stored = sessionStorage.getItem("hc_user");
        if (!stored) {
            router.push("/");
            return;
        }
        loadBooking();
    }, [router, loadBooking]);

    useEffect(() => {
        const interval = setInterval(loadBooking, 5000);
        return () => clearInterval(interval);
    }, [loadBooking]);

    const handleCancel = async () => {
        setActionLoading(true);
        const res = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                status: BookingStatus.Cancelled,
                reason: cancelReason,
            }),
        });
        const data = await res.json();
        setActionLoading(false);

        if (data.success) {
            setBooking(data.booking);
            setShowCancelModal(false);
            setToast({ message: "Booking cancelled", type: "success" });
        } else {
            setToast({ message: data.error || "Could not cancel", type: "error" });
        }
    };

    const formatDatetime = (iso: string) => {
        const d = new Date(iso);
        return d.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        }) + " at " + d.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    };

    const formatDate = (iso: string) => {
        return new Date(iso).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "numeric",
            minute: "2-digit",
        });
    };

    if (loading) {
        return (
            <>
                <Header role="patient" />
                <div className="page-container medium">
                    <div className="loading-container">
                        <div className="spinner" style={{ color: "var(--accent-teal)" }}></div>
                        <span>Loading</span>
                    </div>
                </div>
            </>
        );
    }

    if (!booking) {
        return (
            <>
                <Header role="patient" />
                <div className="page-container medium">
                    <div className="empty-state">
                        <div className="empty-state-graphic">
                            <svg viewBox="0 0 64 64" fill="none">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2.5" />
                                <path d="M22 22l20 20M42 22L22 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="empty-state-title">Booking not found</div>
                        <a href="/patient/dashboard" className="btn btn-primary">Back to dashboard</a>
                    </div>
                </div>
            </>
        );
    }

    const canCancel = booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed || booking.status === BookingStatus.Rescheduled;

    return (
        <>
            <Header role="patient" />
            <div className="page-container medium">
                <a href="/patient/dashboard" className="back-link">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Dashboard
                </a>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                    <div>
                        <h1 className="page-title">{booking.booking_id}</h1>
                        <p className="page-subtitle" style={{ marginBottom: 0 }}>Booking details</p>
                    </div>
                    <StatusBadge status={booking.status} />
                </div>

                <div className="card">
                    <div className="detail-grid">
                        <div className="detail-item">
                            <div className="detail-label">Slot</div>
                            <div className="detail-value">{formatDatetime(booking.slot_datetime)}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Status</div>
                            <div className="detail-value">{booking.status}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Requested</div>
                            <div className="detail-value">{formatDate(booking.created_at)}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Last updated</div>
                            <div className="detail-value">{formatDate(booking.updated_at)}</div>
                        </div>
                    </div>

                    {booking.reason && (
                        <div className="detail-item" style={{ marginBottom: "24px" }}>
                            <div className="detail-label">Reason</div>
                            <div className="detail-value">{booking.reason}</div>
                        </div>
                    )}

                    <hr className="divider" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "8px" }}>
                        <div>
                            <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "12px" }}>Patient Info <span style={{ marginLeft: "6px", padding: "2px 8px", borderRadius: "var(--radius-full)", background: "rgba(20,184,166,0.1)", color: "var(--accent-teal-light)", fontSize: "10px", letterSpacing: "0.02em", fontWeight: 500, textTransform: "none" }}>Demo</span></div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {[{ label: "Name", value: "Aryan Mehta" }, { label: "Phone", value: booking.user_phone || "+91 98765 43210" }, { label: "Age / Gender", value: "28 yrs · Male" }, { label: "Blood Group", value: "O+" }, { label: "City", value: "Bangalore, KA" }].map((row) => (
                                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "6px" }}>
                                        <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
                                        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "12px" }}>Doctor Info <span style={{ marginLeft: "6px", padding: "2px 8px", borderRadius: "var(--radius-full)", background: "rgba(168,85,247,0.1)", color: "var(--accent-purple)", fontSize: "10px", letterSpacing: "0.02em", fontWeight: 500, textTransform: "none" }}>Demo</span></div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {[{ label: "Name", value: "Dr. Priya Sharma" }, { label: "Speciality", value: "General Physician" }, { label: "Reg. No.", value: "MH-12345" }, { label: "Experience", value: "12 years" }, { label: "Clinic", value: "MedCare Clinic" }].map((row) => (
                                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "6px" }}>
                                        <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
                                        <span style={{ color: "var(--text-primary)", fontWeight: 500 }}>{row.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {canCancel && (
                        <>
                            <hr className="divider" />
                            <div className="action-group">
                                <button
                                    className="btn btn-danger"
                                    onClick={() => setShowCancelModal(true)}
                                >
                                    Cancel booking
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {showCancelModal && (
                <div className="modal-overlay" onClick={() => setShowCancelModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "var(--radius-sm)", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                            </div>
                            <div className="modal-title" style={{ marginBottom: 0 }}>Cancel this booking?</div>
                        </div>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "14px" }}>
                            This action cannot be undone. Please select a reason.
                        </p>
                        <div className="form-group">
                            <label className="form-label">Reason for cancellation</label>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {Object.values(PresetReason).map((reason) => (
                                    <label
                                        key={reason}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "12px",
                                            padding: "12px 16px",
                                            borderRadius: "var(--radius-sm)",
                                            border: cancelReason === reason ? "1px solid rgba(239,68,68,0.4)" : "1px solid var(--border-medium)",
                                            background: cancelReason === reason ? "rgba(239,68,68,0.08)" : "var(--bg-glass)",
                                            cursor: "pointer",
                                            transition: "all 150ms",
                                        }}
                                    >
                                        <span style={{
                                            width: "16px", height: "16px", borderRadius: "50%",
                                            border: cancelReason === reason ? "5px solid var(--accent-red)" : "2px solid var(--border-medium)",
                                            flexShrink: 0,
                                            transition: "border 150ms",
                                            background: "transparent",
                                            display: "inline-block",
                                        }} />
                                        <input
                                            type="radio"
                                            name="cancelReason"
                                            value={reason}
                                            checked={cancelReason === reason}
                                            onChange={() => setCancelReason(reason as PresetReason)}
                                            style={{ display: "none" }}
                                        />
                                        <span style={{ fontSize: "14px", color: cancelReason === reason ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: cancelReason === reason ? 500 : 400 }}>{reason}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowCancelModal(false)}>
                                Keep it
                            </button>
                            <button className="btn btn-danger" onClick={handleCancel} disabled={actionLoading}>
                                {actionLoading ? <span className="spinner"></span> : "Yes, cancel"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </>
    );
}
