"use client";

import Link from "next/link";

interface HeaderProps {
    role: "patient" | "admin";
    onLogout?: () => void;
}

export default function Header({ role, onLogout }: HeaderProps) {
    return (
        <header className="header">
            <Link href={role === "patient" ? "/patient/dashboard" : "/admin/dashboard"} className="header-logo">
                <div className="header-logo-icon">
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <rect x="7" y="1" width="4" height="16" rx="2" fill="white" />
                        <rect x="1" y="7" width="16" height="4" rx="2" fill="white" />
                    </svg>
                </div>
                <div className="header-logo-text">
                    Health <span>Connect</span>
                </div>
            </Link>
            <div className="header-nav">
                <div className={`header-badge ${role}`}>
                    {role === "patient" ? "Patient" : "Admin"}
                </div>
                {onLogout && (
                    <button className="header-btn" onClick={onLogout}>
                        Sign out
                    </button>
                )}
            </div>
        </header>
    );
}
