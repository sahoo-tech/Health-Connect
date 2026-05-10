"use client";

import { useEffect } from "react";

export function useScrollReveal(selector = ".reveal", threshold = 0.12) {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, threshold]);
}

export function useCountUp(
  selector = ".count-up",
  duration = 1800
) {
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(selector);
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const raw = el.getAttribute("data-target") || "0";
          const suffix = el.getAttribute("data-suffix") || "";
          const numericPart = parseFloat(raw.replace(/[^0-9.]/g, ""));
          const prefix = raw.replace(/[0-9.]+.*/, "");
          const start = performance.now();

          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(eased * numericPart);
            el.textContent = prefix + current + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = prefix + raw.replace(/[^0-9.+/]+/g, (m) => m) + suffix;
          };

          requestAnimationFrame(tick);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [selector, duration]);
}
