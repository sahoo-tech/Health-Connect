"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const SLIDES = [
  {
    image: "/home/banner1.png",
    tag: "Maternal Care Network",
    title: "Expert Care for\nEvery Mother",
    subtitle:
      "Health Connect brings certified maternal care specialists to your fingertips — book, track, and manage your pregnancy journey with confidence.",
    cta: "Book a Consultation",
  },
  {
    image: "/home/banner2.png",
    tag: "Compassionate Specialists",
    title: "Safe Deliveries,\nHealthier Futures",
    subtitle:
      "Our team of 50+ certified midwives, OB-GYNs, and maternal health specialists are dedicated to providing personalised care at every stage.",
    cta: "Meet Our Specialists",
  },
  {
    image: "/home/banner3.png",
    tag: "Technology-Driven Care",
    title: "Scheduling Made\nSimple",
    subtitle:
      "OTP-based secure login, real-time booking status, and admin-coordinated slot management — all on one seamless platform built for mothers.",
    cta: "Get Started",
  },
];

const SERVICES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Antenatal Care",
    description:
      "Comprehensive prenatal check-ups, screenings, and health monitoring throughout all three trimesters.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    title: "Midwife Consultations",
    description:
      "One-on-one sessions with registered midwives for birth planning, breastfeeding, and postnatal support.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "High-Risk Pregnancy",
    description:
      "Specialised monitoring and care coordination for mothers with gestational diabetes, hypertension, or complicated pregnancies.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: "Postnatal Recovery",
    description:
      "Post-delivery care including wound care, mental health support, and physical recovery programmes for new mothers.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    title: "Lactation Support",
    description:
      "Expert guidance from certified lactation consultants to ensure healthy breastfeeding for mother and baby.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Neonatal Care",
    description:
      "Dedicated care for newborns including routine check-ups, vaccinations, and early developmental assessments.",
  },
];

const STATS = [
  { value: "50+", label: "Maternal Specialists" },
  { value: "200+", label: "Care Centres" },
  { value: "24/7", label: "Emergency Support" },
  { value: "10K+", label: "Mothers Served" },
  { value: "98%", label: "Safe Delivery Rate" },
  { value: "15 min", label: "Avg. Response Time" },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Login with OTP",
    description:
      "Enter your mobile number and verify your identity with a secure one-time passcode. No passwords to remember.",
    color: "#14b8a6",
  },
  {
    step: "02",
    title: "Submit Booking Request",
    description:
      "Fill in your details, choose your preferred care type, and select an available time slot from the next 7 days.",
    color: "#0ea5e9",
  },
  {
    step: "03",
    title: "Admin Reviews & Acts",
    description:
      "Our coordination team reviews your request, then approves, rejects, or suggests an alternative slot based on availability.",
    color: "#a855f7",
  },
  {
    step: "04",
    title: "Track Your Status",
    description:
      "Monitor your booking status in real time — Pending, Approved, Rescheduled, or Cancelled. Cancel or reschedule if needed.",
    color: "#f59e0b",
  },
];

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const goToSlide = useCallback(
    (index: number) => {
      if (transitioning) return;
      setTransitioning(true);
      setTimeout(() => {
        setCurrentSlide(index);
        setTransitioning(false);
      }, 300);
    },
    [transitioning]
  );

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % SLIDES.length);
  }, [currentSlide, goToSlide]);

  const prevSlide = useCallback(() => {
    goToSlide((currentSlide - 1 + SLIDES.length) % SLIDES.length);
  }, [currentSlide, goToSlide]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const slide = SLIDES[currentSlide];

  return (
    <div className="home-root">
      <nav className="home-nav">
        <Link href="/" className="home-nav-logo">
          <div className="home-nav-logo-icon">
            <svg width="20" height="20" viewBox="0 0 34 34" fill="none">
              <rect x="14" y="2" width="6" height="30" rx="3" fill="white" />
              <rect x="2" y="14" width="30" height="6" rx="3" fill="white" />
            </svg>
          </div>
          <span className="home-nav-logo-text">
            Health <span>Connect</span>
          </span>
        </Link>

        <div className={`home-nav-links ${menuOpen ? "open" : ""}`}>
          <a href="#services" className="home-nav-link" onClick={() => setMenuOpen(false)}>Services</a>
          <a href="#how-it-works" className="home-nav-link" onClick={() => setMenuOpen(false)}>How It Works</a>
          <a href="#appointment" className="home-nav-link" onClick={() => setMenuOpen(false)}>Appointment</a>
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

      <section className="hero-banner">
        <div className={`hero-slide ${transitioning ? "fade-out" : "fade-in"}`}>
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          <div className="hero-overlay" />
          <div className="hero-content">
            <span className="hero-tag">{slide.tag}</span>
            <h1 className="hero-title">{slide.title}</h1>
            <p className="hero-subtitle">{slide.subtitle}</p>
            <Link href="/login" className="hero-cta">
              {slide.cta}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>

        <button className="hero-arrow hero-arrow-left" onClick={prevSlide} aria-label="Previous slide">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button className="hero-arrow hero-arrow-right" onClick={nextSlide} aria-label="Next slide">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <div className="hero-dots">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              className={`hero-dot ${i === currentSlide ? "active" : ""}`}
              onClick={() => goToSlide(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      <section className="stats-strip">
        <div className="stats-inner">
          {STATS.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="home-section">
        <div className="home-section-inner">
          <div className="section-header">
            <span className="section-tag">Specialised Services</span>
            <h2 className="section-title">Maternal Care Services</h2>
            <p className="section-subtitle">
              From prenatal check-ups to postnatal recovery, our certified maternal care specialists deliver compassionate, evidence-based care at every stage of your journey.
            </p>
          </div>
          <div className="services-grid">
            {SERVICES.map((svc) => (
              <div key={svc.title} className="service-card">
                <div className="service-icon">{svc.icon}</div>
                <h3 className="service-title">{svc.title}</h3>
                <p className="service-desc">{svc.description}</p>
                <Link href="/login" className="service-link">
                  Book Now
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="home-section alt-bg">
        <div className="home-section-inner">
          <div className="section-header">
            <span className="section-tag">Simple Process</span>
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">
              From sign-up to confirmed appointment — our streamlined booking flow gets you care in four easy steps.
            </p>
          </div>
          <div className="how-it-works-grid">
            {HOW_IT_WORKS.map((step, i) => (
              <div key={step.step} className="hiw-card">
                <div className="hiw-step-num" style={{ color: step.color, borderColor: step.color, background: `${step.color}14` }}>
                  {step.step}
                </div>
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hiw-connector" />
                )}
                <h3 className="hiw-title">{step.title}</h3>
                <p className="hiw-desc">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="appointment" className="home-section">
        <div className="home-section-inner">
          <div className="split-section">
            <div className="split-content">
              <span className="section-tag">Digital Booking</span>
              <h2 className="section-title left">Book Your Maternal Care Appointment</h2>
              <p className="split-text">
                Skip the queues. Request a maternal care appointment in minutes — choose your service type, preferred slot, and let our coordination team handle the rest.
              </p>
              <ul className="feature-list">
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Instant OTP-based secure login
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Real-time status: Pending / Approved / Rejected
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Reschedule or cancel anytime
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Admin assigns final confirmed slot
                </li>
              </ul>
              <Link href="/login" className="btn-home-primary">
                Book Your Appointment
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
            <div className="split-image">
              <Image
                src="/home/appointment.png"
                alt="Book maternal care appointments online with Health Connect"
                fill
                style={{ objectFit: "cover", borderRadius: "16px" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="home-section alt-bg">
        <div className="home-section-inner">
          <div className="split-section reverse">
            <div className="split-image">
              <Image
                src="/home/specialists.png"
                alt="Certified maternal care specialist team"
                fill
                style={{ objectFit: "cover", borderRadius: "16px" }}
              />
            </div>
            <div className="split-content">
              <span className="section-tag">Expert Team</span>
              <h2 className="section-title left">Certified Maternal Care Specialists</h2>
              <p className="split-text">
                Our 50+ certified OB-GYNs, midwives, and maternal health coordinators bring decades of combined experience in pregnancy, delivery, and postnatal care — with compassion at every step.
              </p>
              <ul className="feature-list">
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Board-certified OB-GYNs and midwives
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Average 12+ years of maternal care experience
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Specialists in high-risk pregnancies
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Trauma-informed and patient-first approach
                </li>
              </ul>
              <Link href="/login" className="btn-home-primary">
                Book a Specialist
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="home-cta-banner">
        <div className="home-section-inner" style={{ textAlign: "center" }}>
          <h2 className="cta-title">Ready to Book Your Maternal Care?</h2>
          <p className="cta-subtitle">
            Join thousands of mothers who trust Health Connect for safe, coordinated maternal care — from first trimester to postnatal recovery.
          </p>
          <div className="cta-actions">
            <Link href="/login" className="btn-home-primary large">
              Book Your Appointment
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <Link href="/admin" className="btn-home-outline large">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Admin Portal
            </Link>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="home-section-inner">
          <div className="footer-grid">
            <div className="footer-col brand-col">
              <div className="home-nav-logo" style={{ marginBottom: "16px" }}>
                <div className="home-nav-logo-icon">
                  <svg width="20" height="20" viewBox="0 0 34 34" fill="none">
                    <rect x="14" y="2" width="6" height="30" rx="3" fill="white" />
                    <rect x="2" y="14" width="30" height="6" rx="3" fill="white" />
                  </svg>
                </div>
                <span className="home-nav-logo-text">
                  Health <span>Connect</span>
                </span>
              </div>
              <p className="footer-brand-text">
                Connecting mothers with certified maternal care specialists through smart, compassionate technology.
              </p>
              <div className="footer-socials">
                <a href="#" className="footer-social" aria-label="Facebook">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a href="#" className="footer-social" aria-label="Twitter">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z" />
                  </svg>
                </a>
                <a href="#" className="footer-social" aria-label="Instagram">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                </a>
                <a href="#" className="footer-social" aria-label="LinkedIn">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                    <rect x="2" y="9" width="4" height="12" />
                    <circle cx="4" cy="4" r="2" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Services</div>
              <ul className="footer-links">
                <li><a href="#services">Antenatal Care</a></li>
                <li><a href="#services">Midwife Consultations</a></li>
                <li><a href="#services">High-Risk Pregnancy</a></li>
                <li><a href="#services">Postnatal Recovery</a></li>
                <li><a href="#services">Lactation Support</a></li>
                <li><a href="#services">Neonatal Care</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Quick Links</div>
              <ul className="footer-links">
                <li><Link href="/login">Patient Portal</Link></li>
                <li><Link href="/admin">Admin Login</Link></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#appointment">Book Appointment</a></li>
                <li><a href="#services">Our Services</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Contact Us</div>
              <ul className="footer-contact">
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>123 Care Avenue, Connect City, HC 400001</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5c-.11-1.09.63-2.17 1.81-2.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>1800-HC-HELP (24/7)</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <polyline points="22,6 12,13 2,6" />
                  </svg>
                  <span>care@healthconnect.in</span>
                </li>
                <li>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>OPD: Mon–Sat, 8 AM – 8 PM</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 Health Connect. All rights reserved.</span>
            <div className="footer-bottom-links">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
