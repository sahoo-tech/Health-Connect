"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Header from "@/components/Header";
import StatusBadge from "@/components/StatusBadge";
import SlotPicker from "@/components/SlotPicker";
import Toast from "@/components/Toast";
import { Booking, BookingStatus, PresetReason } from "@/lib/types";
import { API_BASE } from "@/lib/api";

export default function AdminBookingDetail() {
    const router = useRouter();
    const params = useParams();
    const bookingId = params.id as string;

    const [booking, setBooking] = useState<Booking | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [showRescheduleModal, setShowRescheduleModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [newSlot, setNewSlot] = useState("");
    const [rejectReason, setRejectReason] = useState(PresetReason.AdminDecision);
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
        const stored = sessionStorage.getItem("hc_admin");
        if (stored !== "true") {
            router.push("/admin");
            return;
        }
        loadBooking();
    }, [router, loadBooking]);

    const handleAction = async (
        status: BookingStatus,
        reason?: string,
        newSlotDatetime?: string
    ) => {
        setActionLoading(true);
        const body: Record<string, string> = { status };
        if (reason) body.reason = reason;
        if (newSlotDatetime) body.newSlotDatetime = newSlotDatetime;

        const res = await fetch(`${API_BASE}/api/bookings/${bookingId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        setActionLoading(false);

        if (data.success) {
            setBooking(data.booking);
            setShowRescheduleModal(false);
            setShowRejectModal(false);

            const messages: Record<string, string> = {
                [BookingStatus.Confirmed]: "Request confirmed",
                [BookingStatus.Rejected]: "Request rejected",
                [BookingStatus.Rescheduled]: "New slot suggested",
            };

            setToast({ message: messages[status] || "Updated", type: "success" });
        } else {
            setToast({ message: data.error || "Action failed", type: "error" });
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
                <Header role="admin" />
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
                <Header role="admin" />
                <div className="page-container medium">
                    <div className="empty-state">
                        <div className="empty-state-graphic">
                            <svg viewBox="0 0 64 64" fill="none">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="2.5" />
                                <path d="M22 22l20 20M42 22L22 42" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                            </svg>
                        </div>
                        <div className="empty-state-title">Booking not found</div>
                        <a href="/admin/dashboard" className="btn btn-primary">Back to dashboard</a>
                    </div>
                </div>
            </>
        );
    }

    const isPending = booking.status === BookingStatus.Pending;
    const isActive = booking.status === BookingStatus.Pending || booking.status === BookingStatus.Confirmed || booking.status === BookingStatus.Rescheduled;

    return (
        <>
            <Header role="admin" />
            <div className="page-container medium">
                <a href="/admin/dashboard" className="back-link">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    All requests
                </a>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
                    <div>
                        <h1 className="page-title">{booking.booking_id}</h1>
                        <p className="page-subtitle" style={{ marginBottom: 0 }}>Request management</p>
                    </div>
                    <StatusBadge status={booking.status} />
                </div>

                <div className="card" style={{ marginBottom: "24px" }}>
                    <div className="section-title">Request details</div>
                    <div className="detail-grid">
                        <div className="detail-item">
                            <div className="detail-label">Requester</div>
                            <div className="detail-value">{booking.user_phone}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Requested slot</div>
                            <div className="detail-value">{formatDatetime(booking.slot_datetime)}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Submitted</div>
                            <div className="detail-value">{formatDate(booking.created_at)}</div>
                        </div>
                        <div className="detail-item">
                            <div className="detail-label">Last updated</div>
                            <div className="detail-value">{formatDate(booking.updated_at)}</div>
                        </div>
                    </div>

                    {booking.reason && (
                        <div className="detail-item" style={{ marginTop: "16px" }}>
                            <div className="detail-label">Reason</div>
                            <div className="detail-value">{booking.reason}</div>
                        </div>
                    )}

                    <hr className="divider" />
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "8px" }}>
                        <div>
                            <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "12px" }}>Requester Info</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {[
                                    { label: "Name", value: booking.requester_name },
                                    { label: "Phone", value: booking.user_phone },
                                    { label: "Age / Gender", value: booking.requester_age && booking.requester_gender ? `${booking.requester_age} yrs · ${booking.requester_gender}` : undefined },
                                    { label: "City", value: booking.requester_city },
                                ].map((row) => (
                                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "6px" }}>
                                        <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
                                        <span style={{ color: row.value ? "var(--text-primary)" : "var(--text-muted)", fontWeight: row.value ? 500 : 400 }}>{row.value || "—"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: "11px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", marginBottom: "12px" }}>Provider Preference</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                                {[
                                    { label: "Service Type", value: booking.provider_speciality },
                                    { label: "Preferred Provider", value: booking.provider_name },
                                    { label: "Ref. No.", value: booking.provider_reg_no },
                                    { label: "Experience", value: booking.provider_experience },
                                    { label: "Location", value: booking.provider_location },
                                ].map((row) => (
                                    <div key={row.label} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", borderBottom: "1px solid var(--border-subtle)", paddingBottom: "6px" }}>
                                        <span style={{ color: "var(--text-muted)" }}>{row.label}</span>
                                        <span style={{ color: row.value ? "var(--text-primary)" : "var(--text-muted)", fontWeight: row.value ? 500 : 400 }}>{row.value || "—"}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>

                {isActive && (
                    <div className="card">
                        <div className="section-title">Actions</div>
                        <div className="action-group">
                            {isPending && (
                                <button
                                    className="btn btn-success"
                                    onClick={() => handleAction(BookingStatus.Confirmed, "Approved")}
                                    disabled={actionLoading}
                                >
                                    {actionLoading ? <span className="spinner"></span> : (
                                        <>
                                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                                <path d="M2 8l5 5 7-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            Approve
                                        </>
                                    )}
                                </button>
                            )}
                            <button
                                className="btn btn-warning"
                                onClick={() => setShowRescheduleModal(true)}
                                disabled={actionLoading}
                            >
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <path d="M13.5 2.5A6.5 6.5 0 1 0 14 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                    <path d="M14 2.5V6h-3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Suggest new slot
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => setShowRejectModal(true)}
                                disabled={actionLoading}
                            >
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                </svg>
                                Reject
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {showRescheduleModal && (
                <div className="modal-overlay" onClick={() => setShowRescheduleModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "600px" }}>
                        <div className="modal-title">Suggest a new slot</div>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
                            Pick an available time to offer the requester.
                        </p>
                        <SlotPicker onSelect={setNewSlot} selectedSlot={newSlot} />
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowRescheduleModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-warning"
                                onClick={() => handleAction(BookingStatus.Rescheduled, "New slot suggested", newSlot)}
                                disabled={!newSlot || actionLoading}
                            >
                                {actionLoading ? <span className="spinner"></span> : "Send suggestion"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showRejectModal && (
                <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "var(--radius-sm)", background: "rgba(239,68,68,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                            </div>
                            <div className="modal-title" style={{ marginBottom: 0 }}>Reject this request?</div>
                        </div>
                        <p style={{ color: "var(--text-secondary)", marginBottom: "20px", fontSize: "14px" }}>
                            The requester will be notified with the reason you provide.
                        </p>
                        <div className="form-group">
                            <label className="form-label">Reason for rejection</label>
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
                                            border: rejectReason === reason ? "1px solid rgba(239,68,68,0.4)" : "1px solid var(--border-medium)",
                                            background: rejectReason === reason ? "rgba(239,68,68,0.08)" : "var(--bg-glass)",
                                            cursor: "pointer",
                                            transition: "all 150ms",
                                        }}
                                    >
                                        <span style={{
                                            width: "16px", height: "16px", borderRadius: "50%",
                                            border: rejectReason === reason ? "5px solid var(--accent-red)" : "2px solid var(--border-medium)",
                                            flexShrink: 0,
                                            transition: "border 150ms",
                                            background: "transparent",
                                            display: "inline-block",
                                        }} />
                                        <input
                                            type="radio"
                                            name="rejectReason"
                                            value={reason}
                                            checked={rejectReason === reason}
                                            onChange={() => setRejectReason(reason as PresetReason)}
                                            style={{ display: "none" }}
                                        />
                                        <span style={{ fontSize: "14px", color: rejectReason === reason ? "var(--text-primary)" : "var(--text-secondary)", fontWeight: rejectReason === reason ? 500 : 400 }}>{reason}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="modal-actions">
                            <button className="btn btn-secondary" onClick={() => setShowRejectModal(false)}>
                                Cancel
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={() => handleAction(BookingStatus.Rejected, rejectReason)}
                                disabled={actionLoading}
                            >
                                {actionLoading ? <span className="spinner"></span> : "Confirm reject"}
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
