"use client";

import { useEffect, useRef } from "react";

export default function CursorEffect() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -200, y: -200 });
  const rafId = useRef<number>(0);
  const isHovering = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (prefersReduced || isTouch) return;

    document.documentElement.style.cursor = "none";
    document.body.style.cursor = "none";

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const interactive = target.closest("a, button, [data-magnetic], input, select, textarea, label");
      if (interactive) {
        isHovering.current = true;
        cursorRef.current?.classList.add("cursor-hover");
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;
      const interactive = target.closest("a, button, [data-magnetic], input, select, textarea, label");
      if (interactive) {
        isHovering.current = false;
        cursorRef.current?.classList.remove("cursor-hover");
      }
    };

    const onClick = (e: MouseEvent) => {
      const ripple = document.createElement("div");
      ripple.className = "cursor-ripple";
      ripple.style.left = `${e.clientX}px`;
      ripple.style.top = `${e.clientY}px`;
      document.body.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    };

    let cursorX = -200, cursorY = -200;
    let trailX = -200, trailY = -200;

    const animate = () => {
      const mx = mouse.current.x;
      const my = mouse.current.y;

      cursorX = mx;
      cursorY = my;
      trailX += (mx - trailX) * 0.25;
      trailY += (my - trailY) * 0.25;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
      }
      if (trailRef.current) {
        trailRef.current.style.transform = `translate3d(${trailX}px, ${trailY}px, 0)`;
      }
      rafId.current = requestAnimationFrame(animate);
    };

    const styleSheet = document.createElement("style");
    styleSheet.textContent = `a,button,[data-magnetic],input,select,textarea,label{cursor:none!important}`;
    document.head.appendChild(styleSheet);

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseover", onMouseOver, { passive: true });
    document.addEventListener("mouseout", onMouseOut, { passive: true });
    window.addEventListener("click", onClick);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.style.cursor = "";
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("click", onClick);
      cancelAnimationFrame(rafId.current);
      styleSheet.remove();
    };
  }, []);

  return (
    <>
      <div ref={trailRef} className="cursor-trail" aria-hidden="true" />
      <div ref={cursorRef} className="custom-cursor" aria-hidden="true" />
    </>
  );
}
