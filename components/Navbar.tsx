"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Table, GraduationCap, Code2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/visualizer", label: "Data Flow Visualizer", icon: Table },
    { href: "/practice",   label: "Practice Hub",          icon: GraduationCap },
    { href: "/playground", label: "Custom Editor",          icon: Code2 },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-2xl bg-slate-950/60 border-b border-slate-700/50 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-semibold text-slate-50 tracking-tight text-lg">
          <div className="p-1.5 rounded-lg bg-brandRed-500/20 border border-brandRed-500/40 text-brandRed-500 shadow-glow-red">
            <Sparkles size={18} />
          </div>
          <span>SQL<span className="gradient-text font-bold">Visualizer</span></span>
        </Link>

        <nav className="flex items-center gap-1.5 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-700/50 backdrop-blur-xl">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-xl transition-all duration-200",
                  active
                    ? "bg-gradient-to-r from-brandRed-500 to-brandRed-600 text-palette-white border border-brandRed-400/50 shadow-glow-red"
                    : "text-slate-300 hover:text-palette-white hover:bg-slate-800/40"
                )}
              >
                <Icon size={15} className={active ? "text-palette-white" : "text-slate-400"} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
