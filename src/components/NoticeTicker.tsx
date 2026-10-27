"use client";

import React from 'react';
import { Bell, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function NoticeTicker() {
  const notices = [
    "2026 වසරේ සාමාන්‍ය පෙළ (O/L) පෙරහුරු විභාග කාලසටහන දැන් නිකුත් කර ඇත.",
    "සමස්ත ලංකා පාසල් නාට්‍ය තරගාවලියෙන් අප විද්‍යාලයේ නාට්‍ය කණ්ඩායමට ප්‍රථම ස්ථානය!",
    "ලබන සිකුරාදා දින දෙමාපිය ගුරු හමුව පෙරවරු 8.30 ට ප්‍රධාන ශාලාවේදී පැවැත්වේ.",
    "වාර්ෂික හරිත මහා ක්‍රිකට් සංග්‍රාමය සඳහා ක්‍රීඩා පුහුණු සැසි අරඹා ඇත.",
  ];

  return (
    <div className="bg-[#022C22] text-white py-2 px-4 overflow-hidden relative z-50 border-b border-emerald-900/50">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Badge */}
        <div className="flex items-center gap-1.5 bg-[#F59E0B] text-slate-950 font-black text-[11px] px-3 py-1 rounded-full whitespace-nowrap shadow-sm shrink-0">
          <Bell className="w-3.5 h-3.5 fill-current" />
          <span>විශේෂ නිවේදන</span>
        </div>

        {/* 144fps CSS smooth GPU scroll */}
        <div className="flex-1 overflow-hidden whitespace-nowrap">
          <div className="animate-ticker-smooth flex gap-8 text-xs font-medium text-emerald-100">
            {notices.concat(notices).map((notice, idx) => (
              <span key={idx} className="hover:text-amber-300 transition-colors cursor-pointer flex items-center gap-2">
                <span>📌</span> {notice}
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/news"
          className="hidden md:flex items-center gap-1 text-[11px] text-emerald-300 hover:text-white font-semibold shrink-0"
        >
          සියල්ල <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}