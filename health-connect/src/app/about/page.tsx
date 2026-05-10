"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useScrollReveal } from "@/lib/useScrollReveal";

const DIVISIONS = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "Biomedical Research",
    description: "Exploring evidence-based approaches to maternal health, studying care workflows, and building the research foundation for future robotics-enabled assistance.",
    color: "#14b8a6",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    title: "Product (UI/UX + Dev)",
    description: "Designing and building Health Connect — our privacy-first booking platform — with intuitive interfaces for patients, admins, and care coordinators.",
    color: "#0ea5e9",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
    title: "Electronics & Embedded",
    description: "Prototyping sensor systems and embedded controllers that will underpin future hardware integrations for maternal care monitoring devices.",
    color: "#a855f7",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: "Cybersecurity & Cloud",
    description: "Ensuring privacy-first architecture, secure OTP flows, and cloud infrastructure that meets healthcare data protection standards.",
    color: "#f59e0b",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
      </svg>
    ),
    title: "Mechanical Research",
    description: "Long-term R&D into mechanical systems and robotics that could assist healthcare delivery in underserved and remote communities.",
    color: "#6ee7e7",
  },
];

const PHASES = [
  {
    phase: "Phase 1",
    title: "Constraints & Boundaries",
    description: "Define what we will NOT build. Establish ethical guardrails, privacy policies, and non-clinical boundaries before writing any code.",
    status: "completed",
    color: "#34d399",
  },
  {
    phase: "Phase 2",
    title: "Functioning MVP",
    description: "Build Health Connect — a working booking and care-coordination prototype with OTP login, appointment flows, and admin management.",
    status: "active",
    color: "#14b8a6",
  },
  {
    phase: "Phase 3",
    title: "Pilot Validation",
    description: "Deploy with real users in underserved communities. Validate workflows, gather feedback, and iterate on operational learnings.",
    status: "upcoming",
    color: "#0ea5e9",
  },
  {
    phase: "Phase 4",
    title: "Scale & Research",
    description: "Expand engineering depth. Begin hardware prototyping and research into robotics-enabled assistance for maternal care.",
    status: "upcoming",
    color: "#a855f7",
  },
];

const VALUES = [
  { title: "Safety First", desc: "Pregnancy care is high-stakes. We never cut corners on safety, privacy, or ethical boundaries." },
  { title: "Research First", desc: "Every feature is grounded in evidence and validated through real-world testing before scaling." },
  { title: "Non-Clinical First", desc: "We start with coordination and access — problems safe to solve today — not clinical claims." },
  { title: "Proof Over Presentations", desc: "Working prototypes and real learning over slide decks. Execution over promises." },
  { title: "Privacy by Design", desc: "Minimal data capture. No Aadhaar, no medical history in V0. Only what is needed, nothing more." },
  { title: "Disciplined Building", desc: "Clear roles, weekly deliverables, documentation discipline. We operate like a real startup." },
];

export default function AboutPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  useScrollReveal();

  return (
    <div className="home-root">
      <nav className="home-nav">
        <Link href="/" className="home-nav-logo">
          <div className="home-nav-logo-icon" style={{ background: "transparent" }}>
            <Image src="/robotech-logo.png" alt="ROBOTECH" width={28} height={28} style={{ objectFit: "contain" }} />
          </div>
          <span className="home-nav-logo-text">
            Health <span>Connect</span>
          </span>
        </Link>

        <div className={`home-nav-links ${menuOpen ? "open" : ""}`}>
          <Link href="/" className="home-nav-link" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/about" className="home-nav-link" onClick={() => setMenuOpen(false)} style={{ color: "var(--accent-teal-light)" }}>About Us</Link>
          <Link href="/admin" className="home-nav-cta home-nav-cta-admin" onClick={() => setMenuOpen(false)}>
            Admin Login
          </Link>
          <Link href="/login" className="home-nav-cta" onClick={() => setMenuOpen(false)}>
            Patient Login
          </Link>
        </div>

        <button className="home-nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      <section className="about-hero">
        <Image src="/about/hero.png" alt="ROBOTECH maternal care innovation" fill style={{ objectFit: "cover" }} priority />
        <div className="about-hero-overlay" />
        <div className="about-hero-content">
          <span className="hero-tag">About ROBOTECH</span>
          <h1 className="hero-title">Building Disciplined{"\n"}Healthcare Innovation</h1>
          <p className="hero-subtitle">
            A student-led HealthTech initiative improving maternal-care access and safety in underserved communities — safety-first, research-first, non-clinical-first.
          </p>
          <div className="about-hero-meta">
            <div className="about-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
              <span>Bhadrachalam, Telangana</span>
            </div>
            <div className="about-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
              <span>Founded 2023</span>
            </div>
            <div className="about-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              <span>11–50 Members</span>
            </div>
            <div className="about-meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9" /></svg>
              <span>Robotics Engineering</span>
            </div>
          </div>
        </div>
      </section>

      <section className="about-mission home-section">
        <div className="home-section-inner">
          <div className="split-section">
            <div className="split-content">
              <span className="section-tag">Our Mission</span>
              <h2 className="section-title left">Reducing Delays and Missed Access in Maternal Care</h2>
              <p className="split-text">
                ROBOTECH exists because pregnancy care is high-stakes, yet millions of mothers in underserved communities face preventable delays in accessing even basic coordination and scheduling support.
              </p>
              <p className="split-text">
                Our current focus is <strong style={{ color: "var(--accent-teal-light)" }}>Health Connect</strong> — a privacy-first, non-clinical booking and care-coordination system designed to reduce delays and missed access. It supports appointment requests, OTP verification, admin approvals, slot assignment, reschedule/cancel flows, and status tracking — all with minimal data capture.
              </p>
              <p className="split-text" style={{ color: "var(--text-muted)", fontSize: "14px", fontStyle: "italic" }}>
                We do not collect sensitive identity documents or medical history in V0, and we avoid clinical claims.
              </p>
            </div>
            <div className="split-image">
              <Image src="/about/team.png" alt="ROBOTECH team collaborating" fill style={{ objectFit: "cover", borderRadius: "16px" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="home-section alt-bg">
        <div className="home-section-inner">
          <div className="section-header">
            <span className="section-tag">Our Principles</span>
            <h2 className="section-title">What We Stand For</h2>
            <p className="section-subtitle">
              We build with discipline — clear constraints, honest boundaries, and a commitment to proof over presentations.
            </p>
          </div>
          <div className="about-values-grid">
            {VALUES.map((v, i) => (
              <div key={v.title} className={`about-value-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="about-value-num">{String(i + 1).padStart(2, "0")}</div>
                <h3 className="about-value-title">{v.title}</h3>
                <p className="about-value-desc">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section">
        <div className="home-section-inner">
          <div className="section-header">
            <span className="section-tag">Interdisciplinary Team</span>
            <h2 className="section-title">Our Divisions</h2>
            <p className="section-subtitle">
              Built by an interdisciplinary team across five core verticals — we operate like an execution-driven early-stage startup.
            </p>
          </div>
          <div className="about-divisions-grid">
            {DIVISIONS.map((div, i) => (
              <div key={div.title} className={`about-division-card reveal reveal-delay-${(i % 3) + 1}`}>
                <div className="service-icon" style={{ borderColor: `${div.color}40`, background: `${div.color}18` }}>
                  <span style={{ color: div.color }}>{div.icon}</span>
                </div>
                <h3 className="service-title">{div.title}</h3>
                <p className="service-desc">{div.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-section alt-bg">
        <div className="home-section-inner">
          <div className="section-header">
            <span className="section-tag">Phased Approach</span>
            <h2 className="section-title">Our Roadmap</h2>
            <p className="section-subtitle">
              We build step-by-step — establishing constraints before code, validating before scaling, and expanding capability only when foundations are proven.
            </p>
          </div>
          <div className="about-roadmap">
            {PHASES.map((p, i) => (
              <div key={p.phase} className={`about-phase-card reveal reveal-delay-${i + 1}`}>
                <div className="about-phase-indicator">
                  <div className="about-phase-dot" style={{ background: p.color, boxShadow: `0 0 16px ${p.color}60` }}>
                    {p.status === "completed" ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                    ) : p.status === "active" ? (
                      <div className="about-phase-pulse" style={{ background: p.color }} />
                    ) : null}
                  </div>
                  {i < PHASES.length - 1 && <div className="about-phase-line" />}
                </div>
                <div className="about-phase-body">
                  <span className="about-phase-label" style={{ color: p.color }}>{p.phase}</span>
                  <h3 className="about-phase-title">{p.title}</h3>
                  <p className="about-phase-desc">{p.description}</p>
                  {p.status === "active" && (
                    <span className="about-phase-badge">In Progress</span>
                  )}
                  {p.status === "completed" && (
                    <span className="about-phase-badge completed">Completed</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="about-contact-section home-section">
        <div className="home-section-inner">
          <div className="about-contact-grid">
            <div className="about-contact-info">
              <span className="section-tag">Get In Touch</span>
              <h2 className="section-title left">Connect With ROBOTECH</h2>
              <p className="split-text">
                We collaborate with students, early professionals, researchers, and institutions who value real-world impact, consistency, and long-term thinking. If you align with disciplined building and meaningful healthcare innovation, reach out.
              </p>
              <ul className="about-contact-list">
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5c-.11-1.09.63-2.17 1.81-2.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
                  <div>
                    <div className="about-contact-label">Phone</div>
                    <div className="about-contact-value">9603828903</div>
                  </div>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                  <div>
                    <div className="about-contact-label">Headquarters</div>
                    <div className="about-contact-value">Bhadrachalam, Telangana</div>
                  </div>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4" /></svg>
                  <div>
                    <div className="about-contact-label">Industry</div>
                    <div className="about-contact-value">Robotics Engineering</div>
                  </div>
                </li>
                <li>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
                  <div>
                    <div className="about-contact-label">LinkedIn Members</div>
                    <div className="about-contact-value">8 Associated Members</div>
                  </div>
                </li>
              </ul>
            </div>
            <div className="about-contact-card-wrap">
              <div className="about-contact-card">
                <div className="about-contact-card-icon" style={{ background: "transparent", padding: 0 }}>
                  <Image src="/robotech-logo.png" alt="ROBOTECH Logo" width={80} height={80} style={{ objectFit: "contain" }} />
                </div>
                <h3>ROBOTECH</h3>
                <p>Student-Led HealthTech Initiative</p>
                <div className="about-contact-card-stats">
                  <div><strong>Founded</strong><span>2023</span></div>
                  <div><strong>Team Size</strong><span>11–50</span></div>
                  <div><strong>Focus</strong><span>Maternal Care</span></div>
                </div>
                <Link href="/login" className="btn-home-primary" style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
                  Try Health Connect
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-section-inner">
          <div className="footer-bottom" style={{ borderTop: "none", paddingTop: "0" }}>
            <span>© 2026 ROBOTECH — Health Connect. All rights reserved.</span>
            <div className="footer-bottom-links">
              <Link href="/">Home</Link>
              <Link href="/login">Patient Portal</Link>
              <Link href="/admin">Admin Portal</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
