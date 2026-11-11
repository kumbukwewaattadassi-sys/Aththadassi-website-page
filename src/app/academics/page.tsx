"use client";

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  GraduationCap, 
  Medal, 
  Sparkles, 
  Loader2, 
  Award, 
  Star,
  Flame,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ExamResult {
  id: string;
  exam_name: string;
  year: string;
  badge: string;
  pass_rate: string;
  cutoff_passes: number;
  highest_marks: string;
  top_students: { name: string; marks: string; status: string }[];
}

interface AchievementItem {
  id: string;
  title: string;
  category: string;
  place: string;
  winner_name: string;
  year: string;
  image_url: string;
  description?: string;
  aspect_ratio?: 'vertical' | 'landscape'; // 'vertical' = TikTok (9:16), 'landscape' = YouTube (16:9)
}

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<'exams' | 'competitions'>('exams');
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

        const [examsRes, achieveRes] = await Promise.all([
          supabase.from('academic_results').select('*').order('created_at', { ascending: false }),
          supabase.from('achievements').select('*').order('created_at', { ascending: false })
        ]);

        if (examsRes.data && examsRes.data.length > 0) {
          setExamResults(examsRes.data);
        } else {
          // Default Academic Data
          setExamResults([
            {
              id: "1",
              exam_name: "5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාගය",
              year: "2026",
              badge: "National Scholarship Results",
              pass_rate: "100%",
              cutoff_passes: 18,
              highest_marks: "194",
              top_students: [
                 ]
            },
            {
              id: "2",
              exam_name: "අ.පො.ස. සාමාන්‍ය පෙළ (G.C.E. O/L)",
              year: "2025 / 2026",
              badge: "G.C.E. O/L Results",
              pass_rate: "98.2%",
              cutoff_passes: 42,
              highest_marks: "A 9",
              top_students: [
                 
              ]
            }
          ]);
        }

        if (achieveRes.data && achieveRes.data.length > 0) {
          setAchievements(achieveRes.data);
        } else {
          // TikTok (vertical 9:16) සහ YouTube (landscape 16:9) දෙකම ඇතුළත් Demo Data
          setAchievements([
             
          ]);
        }
      } catch (err) {
        console.error("Academics fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 md:pt-32 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 md:space-y-10">
        
        {/* ── 1. Page Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#065F46] text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Academics & Achievements
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            ශාස්ත්‍රීය හා කුසලතා ජයග්‍රහණ
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            පු/කුඹුක්වැව අත්ථදස්සි කනිෂ්ඨ විද්‍යාලයීය සිසු දරුවන් විභාග හා බාහිර තරග ජයග්‍රහණ ඔස්සේ ගෙනා විශිෂ්ට අභිමානය.
          </p>

          {/* ── Tabs (2 Selected Tabs Only) ── */}
          <div className="inline-flex p-1 bg-slate-200/90 rounded-2xl gap-1 pt-2 shadow-inner">
            <button
              onClick={() => setActiveTab('exams')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'exams' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🎓 විභාග ප්‍රතිඵල (ශිෂ්‍යත්ව / සා.පෙළ)
            </button>
            <button
              onClick={() => setActiveTab('competitions')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === 'competitions' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏆 තරග හා කුසලතා (Posters & Banners)
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-emerald-800">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">ජයග්‍රහණ පුවරුව යාවත්කාලීන වෙමින් පවතී...</span>
          </div>
        )}

        {/* ── 2. TAB 1: විභාග ප්‍රතිඵල සහ Highlight කළ සිසු වාර්තා ── */}
        {!loading && activeTab === 'exams' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
              {examResults.map((res) => (
                <div 
                  key={res.id}
                  className="bg-white rounded-3xl p-4 sm:p-7 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 space-y-5"
                >
                  {/* Card Top Title & Pass Rate */}
                  <div className="flex items-start justify-between border-b border-slate-100 pb-4">
                    <div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#065F46] border border-emerald-200">
                        <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                        {res.badge}
                      </span>
                      <h3 className="text-base sm:text-xl font-black text-slate-900 mt-1.5">
                        {res.exam_name} - {res.year}
                      </h3>
                    </div>
                    <div className="text-right bg-emerald-500/10 px-3 py-1.5 rounded-2xl border border-emerald-500/20">
                      <span className="text-[9px] text-slate-500 block font-bold uppercase">සමත් ප්‍රතිශතය</span>
                      <span className="text-lg sm:text-2xl font-black text-[#065F46]">{res.pass_rate}</span>
                    </div>
                  </div>

                  {/* ── HIGHLIGHT RECORD BANNER (කඩඉම් සහ ඉහළම ලකුණු Highlight එක) ── */}
                  <div className="relative overflow-hidden rounded-2xl p-3.5 sm:p-4 bg-gradient-to-r from-amber-500/15 via-emerald-500/10 to-amber-500/20 border-2 border-amber-400/50 shadow-inner flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black shadow-md shrink-0">
                        <Trophy className="w-5 h-5 fill-slate-950" />
                      </div>
                      <div>
                        <p className="text-[10px] text-amber-900 font-bold uppercase tracking-wider">ඉහළම විශිෂ්ට ලකුණු / සාමාර්ථය</p>
                        <p className="text-sm sm:text-lg font-black text-slate-950">{res.highest_marks}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[10px] text-emerald-900 font-bold">කඩඉම් ඉක්මවූ ගණන</p>
                      <p className="text-sm sm:text-lg font-black text-[#065F46]">{res.cutoff_passes} දෙනෙකි</p>
                    </div>
                  </div>

                  {/* ── TOP STUDENTS LIST WITH GOLD / EMERALD HIGHLIGHT CARDS ── */}
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>විශිෂ්ටතම සිසු වාර්තා (Top Achievers List):</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {res.top_students?.map((st, idx) => {
                        const isTopFirst = idx === 0;
                        return (
                          <div 
                            key={idx}
                            className={`flex items-center justify-between p-3 rounded-2xl transition-transform duration-200 hover:scale-[1.01] ${
                              isTopFirst 
                                ? 'bg-gradient-to-r from-amber-500/20 to-amber-100/60 border-2 border-amber-400/70 shadow-xs' 
                                : 'bg-slate-50/90 border border-slate-200/90'
                            }`}
                          >
                            <div className="truncate pr-2 space-y-0.5">
                              <div className="flex items-center gap-1">
                                {isTopFirst && <span className="text-xs">👑</span>}
                                <p className="text-xs sm:text-[12.5px] font-black text-slate-900 truncate">
                                  {st.name}
                                </p>
                              </div>
                              <p className={`text-[10px] font-bold truncate ${isTopFirst ? 'text-amber-900 font-black' : 'text-[#065F46]'}`}>
                                {st.status}
                              </p>
                            </div>
                            <span className={`text-xs sm:text-[13px] font-black px-2.5 py-1 rounded-xl shadow-xs shrink-0 ${
                              isTopFirst
                                ? 'bg-amber-400 text-slate-950 border border-amber-500'
                                : 'bg-white text-slate-900 border border-slate-200'
                            }`}>
                              {st.marks}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. TAB 2: DYNAMIC TIKTOK (9:16) & YOUTUBE (16:9) CARDS ── */}
        {!loading && activeTab === 'competitions' && (
          <div className="space-y-4">
            {/* Masonry / Auto-balancing Flex-Grid: YouTube (16:9) සහ TikTok (9:16) දෙකටම එකවර ගැලපෙන Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 items-start">
              {achievements.map((item) => {
                const isLandscape = item.aspect_ratio === 'landscape';

                return (
                  <div 
                    key={item.id}
                    className={`group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-950 shadow-md hover:shadow-2xl transition-all duration-300 flex flex-col active:scale-[0.98] ${
                      isLandscape ? 'col-span-2' : 'col-span-1'
                    }`}
                  >
                    {/* 
                      FRAME RATIO LOGIC:
                      - TikTok Frame = aspect-[9/16]
                      - YouTube Frame = aspect-[16/9]
                    */}
                    <div className={`w-full relative overflow-hidden bg-slate-900 ${
                      isLandscape ? 'aspect-[16/9]' : 'aspect-[9/16]'
                    }`}>
                      <img 
                        src={item.image_url} 
                        alt={item.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        loading="lazy"
                      />

                      {/* Smooth Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-transparent pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10">
                        <span className="bg-black/65 backdrop-blur-xs text-[8px] sm:text-[9.5px] text-amber-300 font-bold px-2 py-0.5 rounded-md border border-white/10">
                          {item.category}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="bg-slate-900/80 backdrop-blur-xs text-slate-300 text-[7.5px] sm:text-[8.5px] px-1.5 py-0.5 rounded font-mono uppercase">
                            {isLandscape ? 'YouTube 16:9' : 'TikTok 9:16'}
                          </span>
                          <span className="bg-emerald-600/90 text-white font-bold text-[8px] sm:text-[9px] px-2 py-0.5 rounded-md">
                            {item.year}
                          </span>
                        </div>
                      </div>

                      {/* Bottom Overlay Content */}
                      <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 z-10 space-y-1 sm:space-y-1.5">
                        
                        {/* Award / Place Tag */}
                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] shadow-sm">
                          <Trophy className="w-2.5 h-2.5 shrink-0 fill-slate-950" />
                          <span className="truncate">{item.place}</span>
                        </div>

                        {/* Title */}
                        <h4 className="text-xs sm:text-sm font-black text-white leading-tight line-clamp-2 drop-shadow-sm">
                          {item.title}
                        </h4>

                        {/* Winner Name */}
                        <p className="text-[10px] sm:text-[11.5px] font-bold text-emerald-300 truncate">
                          👤 {item.winner_name}
                        </p>

                        {/* Description (Landscape හෝ Desktop Hover එකේදී පෙනේ) */}
                        {item.description && (
                          <p className="text-slate-300 text-[9px] sm:text-[10px] line-clamp-2 leading-relaxed opacity-85 hidden sm:block">
                            {item.description}
                          </p>
                        )}
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}