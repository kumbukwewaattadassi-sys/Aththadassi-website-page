"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingQuizButton() {
  const pathname = usePathname();

  // Admin හෝ Quiz පිටුවලදී button එක සඟවයි
  if (pathname.startsWith("/admin") || pathname.startsWith("/quiz")) {
    return null;
  }

  return (
    <div 
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[90] pointer-events-auto transform-gpu"
      style={{ willChange: "transform" }}
    >
      <Link
        href="/quiz"
        aria-label="Play Quiz & Run Game"
        title="Play Quiz & Run Game"
        className="group relative flex h-16 w-16 sm:h-[72px] sm:w-[72px] items-center justify-center rounded-full p-[2px] active:scale-95 sm:hover:scale-105 transition-transform duration-150 ease-out transform-gpu"
      >
        {/* Hardware-Accelerated Ambient Ping Ring (No-Lag) */}
        <span 
          className="absolute -inset-1 rounded-full border-2 border-cyan-400/50 animate-ping opacity-35 pointer-events-none" 
          style={{ willChange: "transform, opacity" }}
        />

        {/* Shiny Cyan Outer Ring */}
        <span className="absolute inset-0 rounded-full border-2 border-cyan-300 shadow-[0_0_12px_rgba(34,211,238,0.5)] pointer-events-none z-10" />

        {/* Inline Pure SVG Vector Badge (Never Breaks / Fast Load) */}
        <div className="relative h-full w-full overflow-hidden rounded-full bg-[#0d3b66] border border-black/40 shadow-xl flex items-center justify-center select-none">
          <svg 
            viewBox="0 0 100 100" 
            className="w-full h-full transform-gpu transition-transform duration-300 group-hover:scale-110"
          >
            <defs>
              <radialGradient id="radialBg" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="60%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#0f172a" />
              </radialGradient>
            </defs>

            {/* Background Sunburst Circle */}
            <circle cx="50" cy="50" r="49" fill="url(#radialBg)" />

            {/* Sunburst Rays */}
            <g opacity="0.25" fill="#60a5fa">
              <polygon points="50,50 42,0 58,0" />
              <polygon points="50,50 100,42 100,58" />
              <polygon points="50,50 58,100 42,100" />
              <polygon points="50,50 0,58 0,42" />
              <polygon points="50,50 85,15 75,5" />
              <polygon points="50,50 85,85 95,75" />
              <polygon points="50,50 15,85 25,95" />
              <polygon points="50,50 15,15 5,25" />
            </g>

            {/* Dust Cloud */}
            <path d="M12,65 Q18,60 22,68 Q28,62 30,75 Q20,80 12,65 Z" fill="#fde047" opacity="0.9" />

            {/* Runner Boy Body */}
            {/* Legs */}
            <path d="M35,62 L26,75 L22,73" stroke="#ea580c" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M45,62 L55,77 L62,75" stroke="#c2410c" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            
            {/* Shoes */}
            <circle cx="20" cy="74" r="4" fill="#78350f" />
            <circle cx="63" cy="76" r="4" fill="#78350f" />

            {/* Torso & Shirt */}
            <rect x="30" y="44" width="22" height="20" rx="5" fill="#3b82f6" stroke="#1d4ed8" strokeWidth="1.5" />
            
            {/* Arms */}
            <path d="M32,48 L20,53 L18,48" stroke="#fbcfe8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="17" cy="48" r="3" fill="#fbcfe8" />
            
            <path d="M48,50 L58,56 L64,52" stroke="#fbcfe8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="64" cy="52" r="3" fill="#fbcfe8" />

            {/* Head & Face */}
            <circle cx="45" cy="36" r="13" fill="#fde047" opacity="0.1" />
            <circle cx="45" cy="36" r="12" fill="#fed7aa" stroke="#ea580c" strokeWidth="1" />
            <path d="M38,28 Q48,24 55,30 Q52,38 45,34 Z" fill="#92400e" />

            {/* Eyes & Smile */}
            <ellipse cx="43" cy="35" rx="1.5" ry="2.2" fill="#1e293b" />
            <ellipse cx="50" cy="35" rx="1.5" ry="2.2" fill="#1e293b" />
            <path d="M42,40 Q47,45 52,40" stroke="#b91c1c" strokeWidth="1.8" strokeLinecap="round" fill="#ef4444" />

            {/* Graduation Cap */}
            <polygon points="45,18 25,25 45,30 65,25" fill="#451a03" stroke="#78350f" strokeWidth="1" />
            <path d="M36,27 L36,32 Q45,36 54,32 L54,27" fill="#451a03" />
            <path d="M33,26 L30,35" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="30" cy="36" r="1.5" fill="#f59e0b" />

            {/* Speech Bubble: QUIZ & RUN */}
            <rect x="54" y="16" width="41" height="26" rx="6" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            <polygon points="56,36 50,42 62,38" fill="#ffffff" stroke="#1e293b" strokeWidth="1.5" />
            <text x="74" y="27" fontSize="8" fontWeight="900" textAnchor="middle" fill="#0f172a" fontFamily="sans-serif">QUIZ</text>
            <text x="74" y="37" fontSize="7" fontWeight="900" textAnchor="middle" fill="#dc2626" fontFamily="sans-serif">&amp; RUN</text>

            {/* Green Gem Accent */}
            <polygon points="78,54 86,50 92,56 86,63 76,59" fill="#10b981" stroke="#059669" strokeWidth="1" />
            <polygon points="78,54 86,50 86,63" fill="#34d399" />

            {/* Golden Question Mark */}
            <text x="68" y="85" fontSize="22" fontWeight="900" fill="#facc15" stroke="#ca8a04" strokeWidth="1" fontFamily="sans-serif">?</text>
          </svg>
        </div>

        {/* Live Notification Indicator Dot */}
        <span className="absolute -right-0.5 -top-0.5 z-20 flex h-4 w-4">
          <span 
            className="absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75 animate-ping" 
            style={{ willChange: "transform, opacity" }}
          />
          <span className="relative inline-flex h-4 w-4 rounded-full border-2 border-slate-900 bg-amber-400" />
        </span>
      </Link>
    </div>
  );
}