"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Table, GraduationCap, BookOpen, Code2, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/visualizer", label: "DATA_FLOW", icon: Table },
    { href: "/practice",   label: "PRACTICE",  icon: GraduationCap },
    { href: "/tutorials",  label: "TUTORIALS", icon: BookOpen },
    { href: "/playground", label: "EDITOR",     icon: Code2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-base-950/90 backdrop-blur-sm border-b border-base-600 px-4 sm:px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 font-mono text-sm tracking-wider">
          <span className="text-lime text-base">■</span>
          <span className="text-white font-bold">SQL_VIZ</span>
          <span className="text-muted text-xs hidden sm:inline">// QUERY //</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 text-xs font-mono uppercase tracking-wider px-4 py-2 rounded-sm transition-all duration-200",
                  active
                    ? "bg-lime/10 text-lime border border-lime/40"
                    : "text-muted-light hover:text-white hover:bg-white/[0.04] border border-transparent"
                )}
              >
                <Icon size={14} className={active ? "text-lime" : "text-muted"} />
                <span>[{link.label}]</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen((o) => !o)}
          className="md:hidden p-2 text-muted hover:text-lime transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <nav className="md:hidden mt-3 pb-2 border-t border-base-600 pt-3 flex flex-col gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 text-xs font-mono uppercase tracking-wider px-4 py-2.5 rounded-sm transition-all duration-200",
                  active
                    ? "bg-lime/10 text-lime border border-lime/40"
                    : "text-muted-light hover:text-white hover:bg-white/[0.04] border border-transparent"
                )}
              >
                <Icon size={14} className={active ? "text-lime" : "text-muted"} />
                <span>[{link.label}]</span>
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
