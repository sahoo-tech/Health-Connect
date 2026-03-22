"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Toast from "@/components/Toast";
import { API_BASE } from "@/lib/api";

export default function LoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<"phone" | "otp">("phone");
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState(["", "", "", ""]);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);
    const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const stored = sessionStorage.getItem("hc_user");
        if (stored) {
            router.push("/requester/dashboard");
        }
    }, [router]);

    const handleSendOtp = async () => {
        if (phone.length < 10) {
            setToast({ message: "Enter a valid 10-digit number", type: "error" });
            return;
        }

        setLoading(true);
        const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone }),
        });
        const data = await res.json();
        setLoading(false);

        if (data.success) {
            setStep("otp");
            setToast({ message: "Code sent — use 1234 for demo", type: "info" });
            setTimeout(() => otpRefs.current[0]?.focus(), 100);
        } else {
            setToast({ message: data.error || "Could not send OTP", type: "error" });
        }
    };

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) value = value[value.length - 1];
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value && index < 3) {
            otpRefs.current[index + 1]?.focus();
        }
    };

    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = async () => {
        const otpValue = otp.join("");
        if (otpValue.length !== 4) {
            setToast({ message: "Enter the 4-digit code", type: "error" });
            return;
        }

        setLoading(true);
        const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ phone, otp: otpValue }),
        });
        const data = await res.json();
        setLoading(false);

        if (data.success) {
            sessionStorage.setItem("hc_user", JSON.stringify(data.user));
            setToast({ message: "Logged in", type: "success" });
            setTimeout(() => router.push("/requester/dashboard"), 500);
        } else {
            setToast({ message: data.error || "Incorrect code", type: "error" });
        }
    };

    return (
        <div className="page-container narrow" style={{ paddingTop: "60px" }}>
            <div style={{ marginBottom: "16px" }}>
                <Link
                    href="/"
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        color: "var(--text-muted)",
                        fontSize: "13px",
                        textDecoration: "none",
                        transition: "color 200ms",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "var(--accent-teal)")}
                    onMouseLeave={(e) => (e.currentTarget.style.color = "var(--text-muted)")}
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6" />
                    </svg>
                    Back to Home
                </Link>
            </div>

            <div className="login-hero">
                <div className="login-hero-mark">
                    <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                        <rect x="14" y="2" width="6" height="30" rx="3" fill="white" />
                        <rect x="2" y="14" width="30" height="6" rx="3" fill="white" />
                    </svg>
                </div>
                <h1>
                    Health <span>Connect</span>
                </h1>
                <p>Book your appointment, track every update</p>
                <div style={{ marginTop: "16px", fontSize: "12px", color: "var(--text-secondary)", background: "var(--bg-card)", padding: "8px 12px", borderRadius: "8px", border: "1px dashed var(--border-medium)", display: "inline-block" }}>
                    <strong>Note:</strong> This is a demo. Only Member and Admin logins are active.
                </div>
            </div>

            <div className="card">
                {step === "phone" && (
                    <>
                        <div className="card-header">
                            <div className="card-title">Sign in</div>
                            <div className="card-description">We'll send a one-time code to your number</div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Mobile number</label>
                            <div className="phone-input-wrapper">
                                <div className="phone-prefix">+91</div>
                                <input
                                    type="tel"
                                    className="form-input"
                                    placeholder="10-digit number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                                    onKeyDown={(e) => e.key === "Enter" && handleSendOtp()}
                                    maxLength={10}
                                />
                            </div>
                        </div>
                        <button
                            className="btn btn-primary btn-full btn-lg"
                            onClick={handleSendOtp}
                            disabled={loading || phone.length < 10}
                        >
                            {loading ? <span className="spinner"></span> : "Send code"}
                        </button>
                        <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
                            <div
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "12px 16px",
                                    borderRadius: "var(--radius-sm)",
                                    border: "1px solid rgba(20, 184, 166, 0.25)",
                                    background: "rgba(20, 184, 166, 0.05)",
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                <span style={{ fontSize: "13px", color: "var(--accent-teal-light)", fontWeight: 500 }}>Member Login</span>
                            </div>
                            <a
                                href="/admin"
                                style={{
                                    flex: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "10px",
                                    padding: "12px 16px",
                                    borderRadius: "var(--radius-sm)",
                                    border: "1px solid rgba(168, 85, 247, 0.25)",
                                    background: "rgba(168, 85, 247, 0.05)",
                                    textDecoration: "none",
                                    transition: "all 200ms",
                                    cursor: "pointer",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "rgba(168, 85, 247, 0.12)";
                                    e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.5)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "rgba(168, 85, 247, 0.05)";
                                    e.currentTarget.style.borderColor = "rgba(168, 85, 247, 0.25)";
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-purple)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <span style={{ fontSize: "13px", color: "var(--accent-purple)", fontWeight: 500 }}>Admin Login</span>
                            </a>
                        </div>
                    </>
                )}

                {step === "otp" && (
                    <>
                        <div className="card-header">
                            <div className="card-title">Enter your code</div>
                            <div className="card-description">
                                Sent to +91 {phone}
                            </div>
                        </div>
                        <div className="otp-input-group">
                            {otp.map((digit, i) => (
                                <input
                                    key={i}
                                    ref={(el) => { otpRefs.current[i] = el; }}
                                    type="text"
                                    inputMode="numeric"
                                    className="otp-digit"
                                    value={digit}
                                    onChange={(e) => handleOtpChange(i, e.target.value)}
                                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                    maxLength={1}
                                />
                            ))}
                        </div>
                        <button
                            className="btn btn-primary btn-full btn-lg"
                            onClick={handleVerifyOtp}
                            disabled={loading || otp.join("").length !== 4}
                        >
                            {loading ? <span className="spinner"></span> : "Verify & continue"}
                        </button>
                        <div style={{ textAlign: "center", marginTop: "16px" }}>
                            <button
                                className="btn btn-secondary btn-sm"
                                onClick={() => { setStep("phone"); setOtp(["", "", "", ""]); }}
                            >
                                ← Change number
                            </button>
                        </div>
                    </>
                )}
            </div>

            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </div>
    );
}
