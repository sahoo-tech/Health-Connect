"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Toast from "@/components/Toast";
import { API_BASE } from "@/lib/api";

export default function AdminLogin() {
    const router = useRouter();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

    useEffect(() => {
        const stored = sessionStorage.getItem("hc_admin");
        if (stored === "true") {
            router.push("/admin/dashboard");
        }
    }, [router]);

    const handleLogin = async () => {
        if (!password) {
            setToast({ message: "Enter the admin password", type: "error" });
            return;
        }

        setLoading(true);
        const res = await fetch(`${API_BASE}/api/admin/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
        });
        const data = await res.json();
        setLoading(false);

        if (data.success) {
            sessionStorage.setItem("hc_admin", "true");
            setToast({ message: "Access granted", type: "success" });
            setTimeout(() => router.push("/admin/dashboard"), 500);
        } else {
            setToast({ message: "Incorrect password", type: "error" });
        }
    };

    return (
        <div className="page-container narrow" style={{ paddingTop: "60px" }}>
            <div className="login-hero">
                <div className="login-hero-mark purple">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <rect x="10" y="13" width="12" height="14" rx="2" fill="white" fillOpacity="0.9" />
                        <path d="M10 14V10a6 6 0 0 1 12 0v4" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                        <circle cx="16" cy="19.5" r="1.5" fill="#a855f7" />
                        <line x1="16" y1="21" x2="16" y2="24" stroke="#a855f7" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                </div>
                <h1>
                    Admin <span className="purple">Panel</span>
                </h1>
                <p>Restricted access — staff only</p>
            </div>

            <div className="card">
                <div className="card-header">
                    <div className="card-title">Admin login</div>
                    <div className="card-description">Enter your credentials to continue</div>
                </div>
                <div className="form-group">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-input"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                    />
                </div>
                <button
                    className="btn btn-full btn-lg"
                    onClick={handleLogin}
                    disabled={loading || !password}
                    style={{ background: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)", color: "white", boxShadow: "0 2px 12px rgba(168, 85, 247, 0.3)" }}
                >
                    {loading ? <span className="spinner"></span> : "Continue"}
                </button>
                <div style={{ textAlign: "center", marginTop: "24px" }}>
                    <a href="/login" style={{ color: "var(--text-muted)", fontSize: "13px", textDecoration: "none" }}>
                        ← Patient login
                    </a>
                </div>
            </div>

            <div style={{ textAlign: "center", marginTop: "16px", color: "var(--text-muted)", fontSize: "12px" }}>
                Demo password: admin123
            </div>

            {toast && (
                <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
            )}
        </div>
    );
}
