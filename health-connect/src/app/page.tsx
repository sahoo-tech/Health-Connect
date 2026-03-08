"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";

const SLIDES = [
  {
    image: "/home/banner1.png",
    tag: "World-Class Healthcare",
    title: "Advanced Care,\nClose to Home",
    subtitle:
      "Health Connect brings specialist-grade medical care to your fingertips — book, track, and manage your health journey with ease.",
    cta: "Book an Appointment",
  },
  {
    image: "/home/banner2.png",
    tag: "Compassionate Doctors",
    title: "Your Health,\nOur Priority",
    subtitle:
      "Our team of 50+ experienced specialists is dedicated to providing personalised care tailored to your unique needs.",
    cta: "Meet Our Doctors",
  },
  {
    image: "/home/banner3.png",
    tag: "Technology-Driven",
    title: "Healthcare Meets\nInnovation",
    subtitle:
      "Cutting-edge diagnostic tools, AI-powered insights, and digital health records — all integrated on one seamless platform.",
    cta: "Explore Services",
  },
];

const SERVICES = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
    title: "General Medicine",
    description:
      "Comprehensive primary care for all age groups — from routine check-ups to managing chronic conditions.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "Cardiology",
    description:
      "Advanced cardiac diagnostics and treatment from India's leading cardiologists. ECG, echo, and interventional care.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    title: "Orthopedics",
    description:
      "Expert joint, spine, and sports injury care with minimally invasive surgical options and rapid rehabilitation.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    title: "Neurology",
    description:
      "Comprehensive brain and nervous system care — stroke, epilepsy, Parkinson's, and neurocritical services.",
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
    title: "Pediatrics",
    description:
      "Dedicated child healthcare with a warm, child-friendly environment. Vaccination, nutrition, and developmental care.",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Oncology",
    description:
      "Multidisciplinary cancer care with the latest chemotherapy, immunotherapy, and targeted therapy protocols.",
  },
];

const STATS = [
  { value: "50+", label: "Expert Doctors" },
  { value: "200+", label: "Hospital Beds" },
  { value: "24/7", label: "Emergency Care" },
  { value: "10K+", label: "Patients Yearly" },
  { value: "15+", label: "Specialties" },
  { value: "98%", label: "Patient Satisfaction" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Cardiac Patient",
    initials: "PS",
    color: "#14b8a6",
    text: "The cardiology team at Health Connect gave me a second chance at life. The booking system was seamless and the doctors were incredibly thorough with their diagnosis.",
    rating: 5,
  },
  {
    name: "Rajesh Kumar",
    role: "Orthopedic Patient",
    initials: "RK",
    color: "#3b82f6",
    text: "After my knee surgery, the online appointment tracking made follow-up visits so convenient. I could see my recovery notes and schedule in one place.",
    rating: 5,
  },
  {
    name: "Anjali Mehta",
    role: "Parent",
    initials: "AM",
    color: "#a855f7",
    text: "Taking my daughter for pediatric check-ups used to be stressful. Health Connect made the whole experience smooth — from booking to the warm, friendly doctors.",
    rating: 5,
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
          <a href="#specialists" className="home-nav-link" onClick={() => setMenuOpen(false)}>Specialists</a>
          <a href="#emergency" className="home-nav-link" onClick={() => setMenuOpen(false)}>Emergency</a>
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
            <span className="section-tag">What We Offer</span>
            <h2 className="section-title">Our Medical Services</h2>
            <p className="section-subtitle">
              From preventive care to complex surgeries, our specialised departments deliver exceptional outcomes
              backed by the latest medical technology.
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

      <section id="specialists" className="home-section alt-bg">
        <div className="home-section-inner">
          <div className="split-section">
            <div className="split-image">
              <Image
                src="/home/specialists.png"
                alt="Our medical specialists team"
                fill
                style={{ objectFit: "cover", borderRadius: "16px" }}
              />
            </div>
            <div className="split-content">
              <span className="section-tag">Expert Team</span>
              <h2 className="section-title left">Meet Our Specialists</h2>
              <p className="split-text">
                Our 50+ board-certified specialists bring decades of combined experience across 15+ medical disciplines. Each doctor is selected for both clinical excellence and their compassionate approach to patient care.
              </p>
              <ul className="feature-list">
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Board-certified in their respective specialties
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Average 15+ years of clinical experience
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Trained at leading national & international institutions
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Ongoing research and academic contributions
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

      <section id="emergency" className="home-section">
        <div className="home-section-inner">
          <div className="split-section reverse">
            <div className="split-image">
              <Image
                src="/home/emergency.png"
                alt="24/7 Emergency care department"
                fill
                style={{ objectFit: "cover", borderRadius: "16px" }}
              />
            </div>
            <div className="split-content">
              <span className="section-tag emergency-tag">Always Ready</span>
              <h2 className="section-title left">24/7 Emergency Care</h2>
              <p className="split-text">
                Our emergency department is fully staffed around the clock with trauma specialists, critical care teams, and state-of-the-art resuscitation equipment — ready for any medical crisis.
              </p>
              <div className="emergency-contact">
                <div className="emergency-number">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5c-.11-1.09.63-2.17 1.81-2.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                  <span>Emergency Helpline: <strong>1800-HC-HELP</strong></span>
                </div>
                <div className="emergency-number">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>Response time: <strong>Under 5 minutes</strong></span>
                </div>
              </div>
              <ul className="feature-list">
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Trauma & critical care units
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Advanced life support ambulance fleet
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  On-call specialist response in minutes
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="appointment" className="home-section alt-bg">
        <div className="home-section-inner">
          <div className="split-section">
            <div className="split-content">
              <span className="section-tag">Digital Health</span>
              <h2 className="section-title left">Book Appointments Online</h2>
              <p className="split-text">
                Skip the queues. Book appointments with your preferred doctor in seconds, receive real-time status updates, and manage your health records — all from your phone.
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
                  Real-time appointment status tracking
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Choose preferred doctor & time slot
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Digital health records & prescription history
                </li>
              </ul>
              <Link href="/login" className="btn-home-primary">
                Get Started — It's Free
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
            <div className="split-image">
              <Image
                src="/home/appointment.png"
                alt="Book appointments online with Health Connect"
                fill
                style={{ objectFit: "cover", borderRadius: "16px" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="home-section pharmacy-section">
        <div className="home-section-inner">
          <div className="split-section reverse">
            <div className="split-image">
              <Image
                src="/home/pharmacy.png"
                alt="In-house pharmacy services"
                fill
                style={{ objectFit: "cover", borderRadius: "16px" }}
              />
            </div>
            <div className="split-content">
              <span className="section-tag">In-House Services</span>
              <h2 className="section-title left">Full-Service Pharmacy</h2>
              <p className="split-text">
                Our in-house pharmacy stocks a comprehensive range of medications, generic alternatives, and medical supplies — so you leave with everything you need after your consultation.
              </p>
              <ul className="feature-list">
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  10,000+ medicines in stock
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Licensed pharmacists on duty 24/7
                </li>
                <li>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Affordable generics & branded options
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="home-section alt-bg">
        <div className="home-section-inner">
          <div className="section-header">
            <span className="section-tag">Patient Stories</span>
            <h2 className="section-title">What Our Patients Say</h2>
            <p className="section-subtitle">
              Real stories from real patients who trusted Health Connect for their medical journey.
            </p>
          </div>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="testimonial-card">
                <div className="testimonial-stars">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="var(--accent-amber)" stroke="none">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                    </svg>
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.color }}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home-cta-banner">
        <div className="home-section-inner" style={{ textAlign: "center" }}>
          <h2 className="cta-title">Ready to Take Control of Your Health?</h2>
          <p className="cta-subtitle">
            Join thousands of patients who manage their healthcare digitally with Health Connect.
          </p>
          <div className="cta-actions">
            <Link href="/login" className="btn-home-primary large">
              Book Your Appointment
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a href="tel:1800-HC-HELP" className="btn-home-outline large">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.61 5c-.11-1.09.63-2.17 1.81-2.27h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.09a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              Call Emergency
            </a>
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
                Bridging patients and world-class healthcare through technology. Compassionate care, digitally delivered.
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
                <li><a href="#services">General Medicine</a></li>
                <li><a href="#services">Cardiology</a></li>
                <li><a href="#services">Orthopedics</a></li>
                <li><a href="#services">Neurology</a></li>
                <li><a href="#services">Pediatrics</a></li>
                <li><a href="#services">Oncology</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <div className="footer-col-title">Quick Links</div>
              <ul className="footer-links">
                <li><Link href="/login">Patient Portal</Link></li>
                <li><Link href="/admin">Admin Login</Link></li>
                <li><a href="#appointment">Book Appointment</a></li>
                <li><a href="#specialists">Our Doctors</a></li>
                <li><a href="#emergency">Emergency</a></li>
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
                  <span>123 Medical Avenue, Health City, HC 400001</span>
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
