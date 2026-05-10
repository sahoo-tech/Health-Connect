"use client";

import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
    role: "requester" | "admin";
    onLogout?: () => void;
}

export default function Header({ role, onLogout }: HeaderProps) {
    return (
        <header className="header">
            <Link href={role === "requester" ? "/requester/dashboard" : "/admin/dashboard"} className="header-logo">
                <div className="header-logo-icon" style={{ background: "transparent" }}>
                    <Image src="/robotech-logo.png" alt="ROBOTECH" width={22} height={22} style={{ objectFit: "contain" }} />
                </div>
                <div className="header-logo-text">
                    Health <span>Connect</span>
                </div>
            </Link>
            <div className="header-nav">
                <div className={`header-badge ${role}`}>
                    {role === "requester" ? "Member" : "Admin"}
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
