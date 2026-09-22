"use client";

import { useEffect, useRef, useState } from "react";

interface Dot {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  alpha: number;
}

export default function GreenDotsCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const dotsRef = useRef<Dot[]>([]);
  const animRef = useRef<number>(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect mobile/touch devices — disable animation entirely on small screens
    const mql = window.matchMedia("(max-width: 768px)");
    const checkMobile = () => setIsMobile(mql.matches);
    checkMobile();
    mql.addEventListener("change", checkMobile);
    return () => mql.removeEventListener("change", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return; // Don't run canvas animation on mobile

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SPACING = 45;
    const DOT_SIZE = 1.5;
    const INFLUENCE_RADIUS = 160;

    function createDots() {
      const dots: Dot[] = [];
      const cols = Math.ceil(canvas!.width / SPACING) + 1;
      const rows = Math.ceil(canvas!.height / SPACING) + 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x: c * SPACING,
            y: r * SPACING,
            baseX: c * SPACING,
            baseY: r * SPACING,
            size: DOT_SIZE,
            alpha: 0.15,
          });
        }
      }
      dotsRef.current = dots;
    }

    function resize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      createDots();
    }

    function draw() {
      ctx!.clearRect(0, 0, canvas!.width, canvas!.height);
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (const dot of dotsRef.current) {
        const dx = mx - dot.baseX;
        const dy = my - dot.baseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < INFLUENCE_RADIUS) {
          const factor = 1 - dist / INFLUENCE_RADIUS;
          const ease = factor * factor;

          // Attract toward cursor
          dot.x += (dot.baseX + dx * ease * 0.15 - dot.x) * 0.12;
          dot.y += (dot.baseY + dy * ease * 0.15 - dot.y) * 0.12;
          dot.alpha += (0.2 + ease * 0.8 - dot.alpha) * 0.15;
          dot.size += (DOT_SIZE + ease * 3 - dot.size) * 0.15;
        } else {
          dot.x += (dot.baseX - dot.x) * 0.08;
          dot.y += (dot.baseY - dot.y) * 0.08;
          dot.alpha += (0.15 - dot.alpha) * 0.08;
          dot.size += (DOT_SIZE - dot.size) * 0.08;
        }

        ctx!.beginPath();
        ctx!.arc(dot.x, dot.y, dot.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(200, 255, 0, ${dot.alpha})`;
        ctx!.fill();
      }

      animRef.current = requestAnimationFrame(draw);
    }

    function handleMouseMove(e: MouseEvent) {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    }

    function handleMouseLeave() {
      mouseRef.current = { x: -1000, y: -1000 };
    }

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    animRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animRef.current);
    };
  }, [isMobile]);

  // Don't render canvas at all on mobile — saves memory and CPU
  if (isMobile) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}
