"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import SlotPicker from "@/components/SlotPicker";
import Toast from "@/components/Toast";
import { API_BASE } from "@/lib/api";

const SPECIALITIES = [
    "General Medicine",
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

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function BookPage() {
    const router = useRouter();
    const [selectedSlot, setSelectedSlot] = useState<string>("");
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<{ id: string; phone_number: string } | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    const [patientName, setPatientName] = useState("");
    const [patientAge, setPatientAge] = useState("");
    const [patientGender, setPatientGender] = useState("");
    const [patientBloodGroup, setPatientBloodGroup] = useState("");
    const [patientCity, setPatientCity] = useState("");

    const [doctorName, setDoctorName] = useState("");
    const [doctorSpeciality, setDoctorSpeciality] = useState("");
    const [doctorRegNo, setDoctorRegNo] = useState("");
    const [doctorExperience, setDoctorExperience] = useState("");
    const [doctorClinic, setDoctorClinic] = useState("");

    useEffect(() => {
        const stored = sessionStorage.getItem("hc_user");
        if (!stored) {
            router.push("/");
            return;
        }
        setUser(JSON.parse(stored));
    }, [router]);

    const isFormValid =
        patientName.trim() &&
        patientAge &&
        patientGender &&
        patientBloodGroup &&
        patientCity.trim() &&
        doctorSpeciality &&
        selectedSlot;

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
                patient_name: patientName.trim(),
                patient_age: Number(patientAge),
                patient_gender: patientGender,
                patient_blood_group: patientBloodGroup,
                patient_city: patientCity.trim(),
                doctor_name: doctorName.trim() || "",
                doctor_speciality: doctorSpeciality,
                doctor_reg_no: doctorRegNo.trim() || "",
                doctor_experience: doctorExperience.trim() || "",
                doctor_clinic: doctorClinic.trim() || "",
            }),
        });
        const data = await res.json();
        setLoading(false);

        if (data.success) {
            setToast({ message: "Booking submitted", type: "success" });
            setTimeout(() => router.push("/patient/dashboard"), 800);
        } else {
            setToast({ message: data.error || "Could not create booking", type: "error" });
        }
    };

    if (!user) return null;

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
                <h1 className="page-title">Request a slot</h1>
                <p className="page-subtitle">Fill in your details and choose a convenient time</p>

                <div className="card" style={{ marginBottom: "24px" }}>
                    <div className="card-header">
                        <div className="card-title">Patient Details</div>
                        <div className="card-description">Your personal information for the appointment</div>
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
                                value={patientName}
                                onChange={(e) => setPatientName(e.target.value)}
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
                                value={patientAge}
                                onChange={(e) => setPatientAge(e.target.value.replace(/\D/g, "").slice(0, 3))}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Gender <span style={{ color: "var(--accent-red)" }}>*</span>
                            </label>
                            <select
                                className="form-input"
                                value={patientGender}
                                onChange={(e) => setPatientGender(e.target.value)}
                            >
                                <option value="">Select gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Blood Group <span style={{ color: "var(--accent-red)" }}>*</span>
                            </label>
                            <select
                                className="form-input"
                                value={patientBloodGroup}
                                onChange={(e) => setPatientBloodGroup(e.target.value)}
                            >
                                <option value="">Select blood group</option>
                                {BLOOD_GROUPS.map((bg) => (
                                    <option key={bg} value={bg}>{bg}</option>
                                ))}
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
                                value={patientCity}
                                onChange={(e) => setPatientCity(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="card" style={{ marginBottom: "24px" }}>
                    <div className="card-header">
                        <div className="card-title">Doctor Preference</div>
                        <div className="card-description">Tell us who you'd like to see — required fields help us assign the right specialist</div>
                    </div>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                            <label className="form-label">
                                Speciality <span style={{ color: "var(--accent-red)" }}>*</span>
                            </label>
                            <select
                                className="form-input"
                                value={doctorSpeciality}
                                onChange={(e) => setDoctorSpeciality(e.target.value)}
                            >
                                <option value="">Select speciality</option>
                                {SPECIALITIES.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group" style={{ gridColumn: "1 / -1" }}>
                            <label className="form-label">
                                Preferred Doctor Name{" "}
                                <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. Dr. Priya Sharma — leave blank for any available doctor"
                                value={doctorName}
                                onChange={(e) => setDoctorName(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Doctor Registration No.{" "}
                                <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. MH-12345"
                                value={doctorRegNo}
                                onChange={(e) => setDoctorRegNo(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Preferred Clinic / Hospital{" "}
                                <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. MedCare Clinic"
                                value={doctorClinic}
                                onChange={(e) => setDoctorClinic(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">
                                Years of Experience Preferred{" "}
                                <span style={{ color: "var(--text-muted)", fontWeight: 400 }}>(optional)</span>
                            </label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="e.g. 10+ years"
                                value={doctorExperience}
                                onChange={(e) => setDoctorExperience(e.target.value)}
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
