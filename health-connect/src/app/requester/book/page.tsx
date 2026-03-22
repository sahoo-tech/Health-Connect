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

                <div className="card" style={{ marginBottom: "24px" }}>
                    <div className="card-header">
                        <div className="card-title">
                            Provider Preference <span style={{ fontSize: "10px", fontWeight: 600, background: "rgba(14,165,233,0.13)", color: "var(--accent-teal)", border: "1px solid rgba(14,165,233,0.25)", borderRadius: "4px", padding: "2px 6px", letterSpacing: "0.05em", textTransform: "uppercase", marginLeft: "12px", verticalAlign: "middle" }}>Optional</span>
                        </div>
                        <div className="card-description">If left blank, default system info will be populated for the session</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div className="form-group">
                            <label className="form-label">Service Type</label>
                            <select
                                className="form-input"
                                value={providerSpeciality}
                                onChange={(e) => setProviderSpeciality(e.target.value)}
                            >
                                <option value="">Select service type</option>
                                {SERVICE_TYPES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Preferred Name</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Any available"
                                value={providerName}
                                onChange={(e) => setProviderName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">ID / Ref. No.</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. PRV-12345"
                                value={providerRegNo}
                                onChange={(e) => setProviderRegNo(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Location / Centre</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Wellness Centre"
                                value={providerLocation}
                                onChange={(e) => setProviderLocation(e.target.value)}
                            />
                        </div>
                        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                            <label className="form-label">Years of Experience</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. 10+ years"
                                value={providerExperience}
                                onChange={(e) => setProviderExperience(e.target.value)}
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


            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </>
    );
}
