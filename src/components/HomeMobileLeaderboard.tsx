"use client";

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Trophy, Flame, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';

interface ScoreRecord {
  id: string;
  player_name: string;
  phone_number?: string;
  grade: string;
  subject: string;
  score: number;
  created_at: string;
}

// ප්‍රධාන විෂයන් සහ කාණ්ඩ විෂයන් (Basket Subjects) සියල්ලම
const ALL_LEADERBOARD_SUBJECTS = [
  "විද්‍යාව", 
  "ගණිතය", 
  "ඉතිහාසය", 
  "සිංහල", 
  "ඉංග්‍රීසි", 
  "තොරතුරු තාක්ෂණය (ICT)",
  "වාණිජ සහ ගිණුම්කරණය",
  "චිත්‍ර",
  "සංගීතය",
  "සාහිත්‍ය රසාස්වාදය"
];

/* ================= 3D REALISTIC TROPHIES & SHINE ANIMATION ================= */

// 1st Place: 3D Gold Trophy with Crown & Smooth Shimmer Shine
function GoldTrophyIcon() {
  return (
    <div className="relative flex flex-col items-center justify-center group">
      {/* 3D Gold Crown */}
      <svg className="w-5 h-5 -mb-1 filter drop-shadow-sm transform-gpu transition-transform duration-300 group-hover:scale-110" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5Z"
          fill="url(#goldCrownGrad)"
          stroke="#B45309"
          strokeWidth="0.8"
        />
        <circle cx="12" cy="14" r="1.5" fill="#EF4444" />
        <defs>
          <linearGradient id="goldCrownGrad" x1="3" y1="4" x2="21" y2="16" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDE047" />
            <stop offset="0.5" stopColor="#EAB308" />
            <stop offset="1" stopColor="#CA8A04" />
          </linearGradient>
        </defs>
      </svg>

      {/* 3D Gold Cup Container with Lag-Free Light Sweep Animation */}
      <div className="relative overflow-hidden rounded-xl p-0.5">
        <svg className="w-9 h-9 filter drop-shadow-md transform-gpu" viewBox="0 0 64 64" fill="none">
          <path
            d="M14 18C7 18 6 28 14 34C18 37 22 37 24 36"
            stroke="url(#goldHandle)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M50 18C57 18 58 28 50 34C46 37 42 37 40 36"
            stroke="url(#goldHandle)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M18 14H46V28C46 38 38 44 32 44C26 44 18 38 18 28V14Z"
            fill="url(#goldBodyGrad)"
            stroke="#CA8A04"
            strokeWidth="1.5"
          />
          <path
            d="M22 17H26V30C26 34 24 37 22 38V17Z"
            fill="#FEF08A"
            fillOpacity="0.7"
          />
          <path d="M28 44H36V50H28V44Z" fill="url(#goldStemGrad)" stroke="#B45309" strokeWidth="1" />
          <rect x="20" y="50" width="24" height="6" rx="2" fill="url(#woodBaseGrad)" stroke="#78350F" strokeWidth="1" />
          
          <defs>
            <linearGradient id="goldBodyGrad" x1="18" y1="14" x2="46" y2="44" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FEF08A" />
              <stop offset="0.3" stopColor="#FBBF24" />
              <stop offset="0.7" stopColor="#F59E0B" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="goldHandle" x1="10" y1="18" x2="24" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FDE047" />
              <stop offset="1" stopColor="#B45309" />
            </linearGradient>
            <linearGradient id="goldStemGrad" x1="28" y1="44" x2="36" y2="50" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FCD34D" />
              <stop offset="1" stopColor="#92400E" />
            </linearGradient>
            <linearGradient id="woodBaseGrad" x1="20" y1="50" x2="44" y2="56" gradientUnits="userSpaceOnUse">
              <stop stopColor="#92400E" />
              <stop offset="0.5" stopColor="#78350F" />
              <stop offset="1" stopColor="#451A03" />
            </linearGradient>
          </defs>
        </svg>

        {/* 120 FPS Diagonal Shine Overlay */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent transform-gpu pointer-events-none" />
      </div>
    </div>
  );
}

// 2nd Place: 3D Silver Cup with Shine
function SilverTrophyIcon() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl p-0.5">
      <svg className="w-8 h-8 filter drop-shadow-sm transform-gpu" viewBox="0 0 64 64" fill="none">
        <path
          d="M15 19C9 19 8 28 15 33C18 36 22 36 24 35"
          stroke="url(#silverHandle)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M49 19C55 19 56 28 49 33C46 36 42 36 40 35"
          stroke="url(#silverHandle)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M19 15H45V27C45 36 38 42 32 42C26 42 19 36 19 27V15Z"
          fill="url(#silverBodyGrad)"
          stroke="#94A3B8"
          strokeWidth="1.2"
        />
        <path
          d="M23 18H26V29C26 33 24 35 23 36V18Z"
          fill="#FFFFFF"
          fillOpacity="0.8"
        />
        <path d="M29 42H35V48H29V42Z" fill="url(#silverStem)" stroke="#64748B" strokeWidth="1" />
        <rect x="22" y="48" width="20" height="5" rx="1.5" fill="url(#silverBase)" stroke="#475569" strokeWidth="1" />

        <defs>
          <linearGradient id="silverBodyGrad" x1="19" y1="15" x2="45" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F8FAFC" />
            <stop offset="0.3" stopColor="#E2E8F0" />
            <stop offset="0.7" stopColor="#94A3B8" />
            <stop offset="1" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id="silverHandle" x1="12" y1="19" x2="24" y2="35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F1F5F9" />
            <stop offset="1" stopColor="#64748B" />
          </linearGradient>
          <linearGradient id="silverStem" x1="29" y1="42" x2="35" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#CBD5E1" />
            <stop offset="1" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="silverBase" x1="22" y1="48" x2="42" y2="53" gradientUnits="userSpaceOnUse">
            <stop stopColor="#64748B" />
            <stop offset="1" stopColor="#334155" />
          </linearGradient>
        </defs>
      </svg>
      {/* Soft Shine Sweep */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite_0.4s] bg-gradient-to-r from-transparent via-white/35 to-transparent transform-gpu pointer-events-none" />
    </div>
  );
}

// 3rd Place: 3D Bronze Cup with Shine
function BronzeTrophyIcon() {
  return (
    <div className="relative flex flex-col items-center justify-center overflow-hidden rounded-xl p-0.5">
      <svg className="w-8 h-8 filter drop-shadow-sm transform-gpu" viewBox="0 0 64 64" fill="none">
        <path
          d="M15 19C9 19 8 28 15 33C18 36 22 36 24 35"
          stroke="url(#bronzeHandle)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M49 19C55 19 56 28 49 33C46 36 42 36 40 35"
          stroke="url(#bronzeHandle)"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M19 15H45V27C45 36 38 42 32 42C26 42 19 36 19 27V15Z"
          fill="url(#bronzeBodyGrad)"
          stroke="#9A3412"
          strokeWidth="1.2"
        />
        <path
          d="M23 18H26V29C26 33 24 35 23 36V18Z"
          fill="#FED7AA"
          fillOpacity="0.6"
        />
        <path d="M29 42H35V48H29V42Z" fill="url(#bronzeStem)" stroke="#7C2D12" strokeWidth="1" />
        <rect x="22" y="48" width="20" height="5" rx="1.5" fill="url(#bronzeBase)" stroke="#431407" strokeWidth="1" />

        <defs>
          <linearGradient id="bronzeBodyGrad" x1="19" y1="15" x2="45" y2="42" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FFEDD5" />
            <stop offset="0.3" stopColor="#FB923C" />
            <stop offset="0.7" stopColor="#C2410C" />
            <stop offset="1" stopColor="#7C2D12" />
          </linearGradient>
          <linearGradient id="bronzeHandle" x1="12" y1="19" x2="24" y2="35" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FDBA74" />
            <stop offset="1" stopColor="#7C2D12" />
          </linearGradient>
          <linearGradient id="bronzeStem" x1="29" y1="42" x2="35" y2="48" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EA580C" />
            <stop offset="1" stopColor="#7C2D12" />
          </linearGradient>
          <linearGradient id="bronzeBase" x1="22" y1="48" x2="42" y2="53" gradientUnits="userSpaceOnUse">
            <stop stopColor="#7C2D12" />
            <stop offset="1" stopColor="#431407" />
          </linearGradient>
        </defs>
      </svg>
      {/* Soft Shine Sweep */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite_0.8s] bg-gradient-to-r from-transparent via-white/30 to-transparent transform-gpu pointer-events-none" />
    </div>
  );
}

// 4th & 5th Places: Ribbon Medal Badge with subtle glint
function RibbonMedalIcon({ rank }: { rank: number }) {
  return (
    <div className="relative flex items-center justify-center shrink-0">
      <svg className="w-5 h-5 filter drop-shadow-2xs" viewBox="0 0 32 32" fill="none">
        <path d="M12 18L9 29L16 25L23 29L20 18" fill="url(#redRibbon)" stroke="#991B1B" strokeWidth="0.8" />
        <circle cx="16" cy="14" r="9" fill="url(#medalGold)" stroke="#B45309" strokeWidth="1" />
        <circle cx="16" cy="14" r="7.5" stroke="#FDE047" strokeWidth="0.8" strokeDasharray="1.5 1.5" />
        <defs>
          <linearGradient id="redRibbon" x1="9" y1="18" x2="23" y2="29" gradientUnits="userSpaceOnUse">
            <stop stopColor="#EF4444" />
            <stop offset="1" stopColor="#991B1B" />
          </linearGradient>
          <linearGradient id="medalGold" x1="7" y1="5" x2="25" y2="23" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FEF08A" />
            <stop offset="0.5" stopColor="#F59E0B" />
            <stop offset="1" stopColor="#B45309" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute font-black text-[9px] text-amber-950 top-[3.5px] font-mono">
        {rank}
      </span>
    </div>
  );
}

/* ================= MAIN MOBILE LEADERBOARD ================= */

export default function HomeMobileLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<ScoreRecord[]>([]);
  const [selectedSubject, setSelectedSubject] = useState(ALL_LEADERBOARD_SUBJECTS[0]);

  useEffect(() => {
    async function loadData() {
      try {
        const { data } = await supabase
          .from('quiz_scores')
          .select('*')
          .ilike('subject', selectedSubject.trim())
          .order('score', { ascending: false })
          .limit(20);

        if (data) {
          const unique: ScoreRecord[] = [];
          const seen = new Set<string>();
          for (const item of data) {
            const key = item.phone_number ? item.phone_number.trim() : item.player_name.trim().toLowerCase();
            if (!seen.has(key)) {
              seen.add(key);
              unique.push(item);
            }
          }
          setLeaderboard(unique.slice(0, 5));
        }
      } catch (err) {
        console.error("Leaderboard fetch error:", err);
      }
    }
    loadData();
  }, [selectedSubject]);

  const top1 = leaderboard[0];
  const top2 = leaderboard[1];
  const top3 = leaderboard[2];
  const rest = leaderboard.slice(3);

  return (
    <section className="block md:hidden w-full my-6 px-4">
      {/* Custom CSS for 120 FPS Ultra-Smooth Shimmer Keyframes */}
      <style jsx global>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>

      <div className="bg-white border-2 border-emerald-100 rounded-3xl p-4 shadow-sm space-y-3.5">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-xs">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-[10px] font-black uppercase text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded-full">
                  Rankings
                </span>
                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold text-amber-600">
                  <Flame className="w-2.5 h-2.5 fill-amber-500 text-amber-500" /> Live
                </span>
              </div>
              <h3 className="text-xs font-black text-slate-900 mt-0.5">Quiz Arena Leaderboard</h3>
            </div>
          </div>

          {/* Subject Switcher including All Basket Subjects */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-emerald-50 border border-emerald-200 rounded-xl px-2 py-1 text-[11px] font-black text-emerald-900 focus:outline-none cursor-pointer max-w-[140px] truncate"
          >
            {ALL_LEADERBOARD_SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Podium Top 3 with 3D Animated Shimmer Trophies */}
        {leaderboard.length === 0 ? (
          <div className="py-6 text-center text-slate-400 text-xs font-bold bg-slate-50 rounded-2xl">
            {selectedSubject} සඳහා තවම ලකුණු නැත.
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="grid grid-cols-3 gap-1.5 text-center items-end pt-1">
              
              {/* 2nd Place: Silver Trophy */}
              <div className="bg-slate-50/90 border border-slate-200/90 rounded-2xl p-2 flex flex-col items-center justify-between min-h-[125px] shadow-2xs">
                <SilverTrophyIcon />
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-wider mt-1">2nd Silver</span>
                <h4 className="font-black text-slate-900 text-[10px] truncate w-full mt-0.5">
                  {top2 ? top2.player_name : "-"}
                </h4>
                <span className="text-[8px] text-slate-400 truncate w-full">{top2 ? top2.grade : ""}</span>
                <span className="mt-1 px-1.5 py-0.5 rounded-md bg-slate-200 text-slate-900 font-black text-[9px]">
                  {top2 ? `${top2.score}/10` : "-"}
                </span>
              </div>

              {/* 1st Place: 3D Gold Trophy with Crown & Shine */}
              <div className="bg-gradient-to-b from-amber-50/90 via-white to-amber-50/40 border-2 border-amber-300 rounded-2xl p-2 flex flex-col items-center justify-between min-h-[145px] relative shadow-xs">
                <GoldTrophyIcon />
                <span className="text-[8px] font-black text-amber-600 uppercase tracking-wider mt-1">1st Gold</span>
                <h4 className="font-black text-slate-900 text-[11px] truncate w-full mt-0.5">
                  {top1 ? top1.player_name : "-"}
                </h4>
                <span className="text-[8px] text-slate-500 font-bold truncate w-full">{top1 ? top1.grade : ""}</span>
                <span className="mt-1 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[10px] shadow-2xs">
                  {top1 ? `${top1.score}/10` : "-"}
                </span>
              </div>

              {/* 3rd Place: Bronze Trophy */}
              <div className="bg-orange-50/40 border border-orange-200/80 rounded-2xl p-2 flex flex-col items-center justify-between min-h-[125px] shadow-2xs">
                <BronzeTrophyIcon />
                <span className="text-[8px] font-black text-orange-700 uppercase tracking-wider mt-1">3rd Bronze</span>
                <h4 className="font-black text-slate-900 text-[10px] truncate w-full mt-0.5">
                  {top3 ? top3.player_name : "-"}
                </h4>
                <span className="text-[8px] text-slate-400 truncate w-full">{top3 ? top3.grade : ""}</span>
                <span className="mt-1 px-1.5 py-0.5 rounded-md bg-orange-100 text-orange-950 font-black text-[9px]">
                  {top3 ? `${top3.score}/10` : "-"}
                </span>
              </div>

            </div>

            {/* 4th & 5th Places: Ribbon Medals */}
            {rest.length > 0 && (
              <div className="space-y-1 pt-1.5 border-t border-slate-100">
                {rest.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 text-[10.5px]">
                    <div className="flex items-center gap-2 truncate">
                      <RibbonMedalIcon rank={idx + 4} />
                      <span className="font-bold text-slate-800 truncate">{item.player_name}</span>
                      <span className="text-[8.5px] text-slate-400">({item.grade})</span>
                    </div>
                    <span className="font-black text-slate-800 shrink-0">{item.score} pts</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Link to Quiz Page */}
        <Link
          href="/quiz"
          className="w-full bg-slate-900 hover:bg-slate-800 text-white font-black py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all shadow-sm"
        >
          <span>දැන්ම Quiz එකට සහභාගී වන්න</span>
          <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
        </Link>
      </div>
    </section>
  );
}