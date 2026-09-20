"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Table, GraduationCap, BookOpen, Code2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/visualizer", label: "DATA_FLOW", icon: Table },
    { href: "/practice",   label: "PRACTICE",  icon: GraduationCap },
    { href: "/tutorials",  label: "TUTORIALS", icon: BookOpen },
    { href: "/playground", label: "EDITOR",     icon: Code2 },
  ];

  return (
    <header className="sticky top-0 z-50 bg-base-950/90 backdrop-blur-sm border-b border-base-600 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 font-mono text-sm tracking-wider">
          <span className="text-lime text-base">■</span>
          <span className="text-white font-bold">SQL_VIZ</span>
          <span className="text-muted text-xs">// QUERY //</span>
        </Link>

        <nav className="flex items-center gap-1">
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
      </div>
    </header>
  );
}
