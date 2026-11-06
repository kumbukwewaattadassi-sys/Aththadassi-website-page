"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Sparkles } from "lucide-react";

export default function FloatingQuizButton() {
  const pathname = usePathname();

  // Admin හෝ Quiz පිටුවලදී නොපෙන්වයි
  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/quiz")
  ) {
    return null;
  }

  return (
    /* 
      1. Isolated Compositing Layer:
         - pointer-events-auto සහ transform-gpu මඟින් පිටුව scroll වන විට 
           button එක නිසා මුළු පිටුවම repaint වීම සම්පූර්ණයෙන්ම වළක්වයි.
    */
    <div 
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[90] pointer-events-auto transform-gpu"
      style={{ transform: "translate3d(0, 0, 0)" }}
    >
      <Link
        href="/quiz"
        aria-label="Play Quiz Game"
        title="Play Quiz Game"
        className="group relative flex h-[58px] w-[58px] sm:h-[66px] sm:w-[66px] items-center justify-center rounded-full border-2 border-amber-400/90 bg-gradient-to-br from-emerald-600 via-emerald-800 to-[#022c22] text-amber-300 shadow-md active:scale-95 sm:hover:scale-105 transition-transform duration-150 ease-out transform-gpu"
      >
        {/* 
          2. Zero-Lag Ambient Glow Ping (Hardware-Accelerated opacity):
             - Box-shadow වෙනුවට GPU-friendly ping ring එකක් යොදා ඇත.
        */}
        <span className="absolute -inset-1 rounded-full border border-emerald-400/40 animate-ping opacity-30 pointer-events-none" />

        {/* Inner Border Ring */}
        <span className="absolute inset-[4px] rounded-full border border-white/15 pointer-events-none" />

        {/* Gamepad Icon */}
        <Gamepad2
          className="relative z-10 h-7 w-7 sm:h-8 sm:w-8 fill-amber-300/10 transition-transform duration-200 group-hover:rotate-6 group-active:scale-90"
          strokeWidth={2}
        />

        {/* Small Sparkle Accent */}
        <Sparkles
          className="absolute right-2 top-2 h-3.5 w-3.5 text-amber-200 pointer-events-none"
        />

        {/* Notification Dot */}
        <span className="absolute -right-0.5 -top-0.5 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60 animate-ping" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-[#022c22] bg-amber-400" />
        </span>
      </Link>
    </div>
  );
}