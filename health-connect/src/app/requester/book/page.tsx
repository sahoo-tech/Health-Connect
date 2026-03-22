"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import SlotPicker from "@/components/SlotPicker";
import Toast from "@/components/Toast";
import { API_BASE } from "@/lib/api";

const SERVICE_TYPES = [
    "General Consultation",
    "Cardiology",
    "Orthopedics",
    "Neurology",
    "Pediatrics",
    "Oncology",
    "Dermatology",
    "Gynecology",
    "Ophthalmology",
    "ENT",
    "Psychiatry",
    "Urology",
    "Endocrinology",
    "Pulmonology",
    "Nephrology",
    "Gastroenterology",
    "Rheumatology",
    "Other",
];

export default function BookPage() {
    const router = useRouter();
    const [selectedSlot, setSelectedSlot] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<{ id: string; phone_number: string } | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    // Provider preference panel
    const [providerPanelOpen, setProviderPanelOpen] = useState(false);

    // Requester fields
    const [requesterName, setRequesterName] = useState("");
    const [requesterAge, setRequesterAge] = useState("");
    const [requesterGender, setRequesterGender] = useState("");
    const [requesterCity, setRequesterCity] = useState("");

    // Provider fields (all optional)
    const [providerName, setProviderName] = useState("");
    const [providerSpeciality, setProviderSpeciality] = useState("");
    const [providerRegNo, setProviderRegNo] = useState("");
    const [providerExperience, setProviderExperience] = useState("");
    const [providerLocation, setProviderLocation] = useState("");

    useEffect(() => {
        const stored = sessionStorage.getItem("hc_user");
        if (!stored) {
            router.push("/");
            return;
        }
        setUser(JSON.parse(stored));
    }, [router]);

    const isFormValid =
        requesterName.trim() &&
        requesterAge &&
        requesterGender &&
        requesterCity.trim() &&
        selectedSlot;

    const providerFilled = !!(providerName || providerSpeciality || providerRegNo || providerExperience || providerLocation);

    const handleSubmit = async () => {
        if (!isFormValid || !user) return;

        setLoading(true);
        const res = await fetch(`${API_BASE}/api/bookings`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userId: user.id,
                userPhone: user.phone_number,
                slotDatetime: selectedSlot,
                requester_name: requesterName.trim(),
                requester_age: Number(requesterAge),
                requester_gender: requesterGender,
                requester_city: requesterCity.trim(),
                provider_name: providerName.trim() || "",
                provider_speciality: providerSpeciality || "",
                provider_reg_no: providerRegNo.trim() || "",
                provider_experience: providerExperience.trim() || "",
                provider_location: providerLocation.trim() || "",
            }),
        });
        const data = await res.json();
        setLoading(false);

        if (data.success) {
            setToast({ message: "Booking submitted", type: "success" });
            setTimeout(() => router.push("/requester/dashboard"), 800);
        } else {
            setToast({ message: data.error || "Could not create booking", type: "error" });
        }
    };

    if (!user) return null;

    return (
        <>
            <Header role="requester" />
            <div className="page-container medium">
                <a href="/requester/dashboard" className="back-link">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M13 8H3M7 4l-4 4 4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Dashboard
                </a>
                <h1 className="page-title">Request a slot</h1>
                <p className="page-subtitle">Fill in your details and choose a convenient time</p>

                <div className="card" style={{ marginBottom: "24px" }}>
                    <div className="card-header">
                        <div className="card-title">Your Details</div>
                        <div className="card-description">Your information for the booking</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                            <label className="form-label">
                                Full Name <span style={{ color: "var(--accent-red)" }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Rahul Sharma"
                                value={requesterName}
                                onChange={(e) => setRequesterName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Age <span style={{ color: "var(--accent-red)" }}>*</span>
                            </label>
                            <input
                                type="number"
                                className="form-input"
                                placeholder="e.g. 32"
                                min={1}
                                max={120}
                                value={requesterAge}
                                onChange={(e) => setRequesterAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Gender <span style={{ color: "var(--accent-red)" }}>*</span>
                            </label>
                            <select
                                className="form-input"
                                value={requesterGender}
                                onChange={(e) => setRequesterGender(e.target.value)}
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                City <span style={{ color: "var(--accent-red)" }}>*</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Mumbai"
                                value={requesterCity}
                                onChange={(e) => setRequesterCity(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="card">
                    <div className="card-header">
                        <div className="card-title">
                            Pick a time slot <span style={{ color: "var(--accent-red)" }}>*</span>
                        </div>
                        <div className="card-description">Next 7 days — pick any open slot</div>
                    </div>

                    <SlotPicker onSelect={setSelectedSlot} selectedSlot={selectedSlot} />

                    {selectedSlot && (
                        <div className="selected-slot-preview">
                            <div className="selected-slot-preview-label">Selected</div>
                            <div className="selected-slot-preview-value">
                                {new Date(selectedSlot).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}{" "}
                                at{" "}
                                {new Date(selectedSlot).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                })}
                            </div>
                        </div>
                    )}

                    <hr className="divider" />

                    {!isFormValid && (
                        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "12px", textAlign: "center" }}>
                            Fill all required fields and select a slot to continue
                        </p>
                    )}

                    <button
                        className="btn btn-primary btn-full btn-lg"
                        onClick={handleSubmit}
                        disabled={!isFormValid || loading}
                    >
                        {loading ? <span className="spinner"></span> : "Confirm booking"}
                    </button>
                </div>
            </div>

            {/* ── Floating Provider Preference Panel ── */}
            <div style={{
                position: "fixed",
                bottom: "24px",
                right: "24px",
                zIndex: 1000,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "8px",
            }}>
                {/* Expanded panel */}
                {providerPanelOpen && (
                    <div style={{
                        width: "320px",
                        maxHeight: "440px",
                        overflowY: "auto",
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-medium)",
                        borderRadius: "var(--radius)",
                        boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
                        padding: "20px",
                        animation: "fadeInUp 180ms ease",
                    }}>
                        {/* Header row */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                    <circle cx="9" cy="7" r="4"/>
                                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                </svg>
                                <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>Provider Preference</span>
                                <span style={{ fontSize: "10px", fontWeight: 600, background: "rgba(14,165,233,0.13)", color: "var(--accent-teal)", border: "1px solid rgba(14,165,233,0.25)", borderRadius: "4px", padding: "1px 6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>Optional</span>
                            </div>
                            <button
                                onClick={() => setProviderPanelOpen(false)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: "2px", display: "flex", alignItems: "center" }}
                            >
                                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                    <path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                </svg>
                            </button>
                        </div>

                        {/* Disclaimer note */}
                        <div style={{
                            background: "rgba(14,165,233,0.07)",
                            border: "1px solid rgba(14,165,233,0.2)",
                            borderRadius: "var(--radius-sm)",
                            padding: "8px 12px",
                            marginBottom: "16px",
                            fontSize: "11.5px",
                            color: "var(--text-secondary)",
                            lineHeight: "1.5",
                        }}>
                            ℹ️ If this form is not filled, <strong>demo data</strong> will be shown in your booking details.
                        </div>

                        {/* Form fields */}
                        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontSize: "11px" }}>Service Type</label>
                                <select
                                    className="form-input"
                                    style={{ fontSize: "13px", padding: "8px 10px" }}
                                    value={providerSpeciality}
                                    onChange={(e) => setProviderSpeciality(e.target.value)}
                                >
                                    <option value="">Select service type</option>
                                    {SERVICE_TYPES.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontSize: "11px" }}>Preferred Provider Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ fontSize: "13px", padding: "8px 10px" }}
                                    placeholder="e.g. Any available"
                                    value={providerName}
                                    onChange={(e) => setProviderName(e.target.value)}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontSize: "11px" }}>Provider ID / Ref. No.</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ fontSize: "13px", padding: "8px 10px" }}
                                    placeholder="e.g. PRV-12345"
                                    value={providerRegNo}
                                    onChange={(e) => setProviderRegNo(e.target.value)}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontSize: "11px" }}>Preferred Location / Centre</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ fontSize: "13px", padding: "8px 10px" }}
                                    placeholder="e.g. MedCare Centre, Mumbai"
                                    value={providerLocation}
                                    onChange={(e) => setProviderLocation(e.target.value)}
                                />
                            </div>

                            <div className="form-group" style={{ marginBottom: 0 }}>
                                <label className="form-label" style={{ fontSize: "11px" }}>Years of Experience Preferred</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    style={{ fontSize: "13px", padding: "8px 10px" }}
                                    placeholder="e.g. 10+ years"
                                    value={providerExperience}
                                    onChange={(e) => setProviderExperience(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Toggle pill button */}
                <button
                    onClick={() => setProviderPanelOpen((v) => !v)}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        background: providerFilled ? "var(--accent-teal)" : "var(--bg-card)",
                        color: providerFilled ? "#fff" : "var(--text-primary)",
                        border: providerFilled ? "none" : "1px solid var(--border-medium)",
                        borderRadius: "999px",
                        padding: "10px 18px",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                        transition: "all 200ms",
                        whiteSpace: "nowrap",
                    }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    Provider Preference
                    {providerFilled && (
                        <span style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#fff", opacity: 0.85, display: "inline-block" }} />
                    )}
                    {!providerFilled && (
                        <span style={{ fontSize: "10px", fontWeight: 600, background: "rgba(14,165,233,0.13)", color: "var(--accent-teal)", border: "1px solid rgba(14,165,233,0.3)", borderRadius: "4px", padding: "1px 6px", letterSpacing: "0.05em", textTransform: "uppercase" }}>optional</span>
                    )}
                </button>
            </div>

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </>
    );
}
