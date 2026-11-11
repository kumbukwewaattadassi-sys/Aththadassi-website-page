"use client";

import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  GraduationCap, 
  Medal, 
  Loader2,
  Sparkles,
  Share2,
  Check,
  Star
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
  description: string;
}

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<'exams' | 'competitions'>('exams');
  const [examResults, setExamResults] = useState<ExamResult[]>([]);
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 1. Supabase Database එකෙන් දත්ත ලබාගැනීම
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
          // Fallback initial data (Database හි දත්ත නොමැති විට පමණි)
          setExamResults([
            {
              id: "1",
              exam_name: "5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාගය",
              year: "2026",
              badge: "Scholarship Results",
              pass_rate: "100%",
              cutoff_passes: 18,
              highest_marks: "194",
              top_students: [
                { name: "කේ. ඩී. සිනෙත් නෙත්මින", marks: "194", status: "දිස්ත්‍රික් ප්‍රමුඛ" },
                { name: "එම්. ජී. ඉමේෂා සඳමිණි", marks: "189", status: "විශිෂ්ට සාමාර්ථ" },
                { name: "ඩබ්. ඒ. දිනුක ලක්ෂාන්", marks: "185", status: "විශිෂ්ට සාමාර්ථ" },
                { name: "එස්. එච්. පවනි තත්සරණි", marks: "182", status: "විශිෂ්ට සාමාර්ථ" },
              ]
            },
            {
              id: "2",
              exam_name: "අ.පො.ස. සාමාන්‍ය පෙළ (G.C.E. O/L)",
              year: "2025 / 2026",
              badge: "O/L Achievements",
              pass_rate: "98.2%",
              cutoff_passes: 42,
              highest_marks: "A 9",
              top_students: [
                { name: "ආර්. එම්. චමත් සංදීප", marks: "A 9", status: "විශිෂ්ට සාමාර්ථ 9" },
                { name: "පී. කේ. නෙත්මි කාවින්ද්‍යා", marks: "A 9", status: "විශිෂ්ට සාමාර්ථ 9" },
                { name: "ටී. එච්. කසුන් කලහාර", marks: "A 8, B 1", status: "විශිෂ්ට සාමාර්ථ 8" },
                { name: "එච්. ඩී. තරුෂි ප්‍රබෝධා", marks: "A 7, B 2", status: "විශිෂ්ට සාමාර්ථ 7" },
              ]
            }
          ]);
        }

        if (achieveRes.data && achieveRes.data.length > 0) {
          setAchievements(achieveRes.data);
        } else {
          setAchievements([
            {
              id: "1",
              title: "සමස්ත ලංකා නර්තන හා සංගීත තරගාවලිය",
              category: "සෞන්දර්ය හා කලා",
              place: "1st Place (රන් පදක්කම)",
              winner_name: "විද්‍යාලයීය ජ්‍යෙෂ්ඨ නර්තන කණ්ඩායම",
              year: "2026",
              image_url: "https://res.cloudinary.com/n911ylla/image/upload/f_auto,q_auto/685919899_1430362865799214_5670876124687149843_n",
              description: "වයඹ පළාත නියෝජනය කරමින් ඉදිරිපත් වූ අප විද්‍යාලයීය සාම්ප්‍රදායික උඩරට නර්තන කණ්ඩායම සමස්ත ලංකා ප්‍රථම ස්ථානය දිනාගන්නා ලදී."
            },
            {
              id: "2",
              title: "සමස්ත ලංකා කථික හා විවාද තරගාවලිය",
              category: "භාෂා සාහිත්‍ය",
              place: "2nd Place (රිදී පදක්කම)",
              winner_name: "චමත් සංදීප (ශ්‍රේණිය 11)",
              year: "2026",
              image_url: "https://res.cloudinary.com/n911ylla/image/upload/q_auto/832247094_1580265014142331_668856309073154634_n.jpg",
              description: "ජ්‍යෙෂ්ඨ අංශයේ සිංහල කථික තරග අංශයෙන් විශිෂ්ට ජයක් හිමිකර ගන්නා ලදී."
            }
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

  // 2. Result Card Share Function (WhatsApp, Facebook or Link Copy)
  const handleShareResult = async (res: ExamResult) => {
    const shareText = `🎓 ${res.exam_name} - ${res.year}\n✨ සමත් ප්‍රතිශතය: ${res.pass_rate}\n🏆 ඉහළම ප්‍රතිඵලය: ${res.highest_marks}\n🏅 කඩඉම් ඉක්මවූ සිසුන්: ${res.cutoff_passes} දෙනෙකි\n\nපු/කුඹුක්වැව අත්ථදස්සි කනිෂ්ඨ විද්‍යාලයීය නිල ප්‍රතිඵල පුවරුවෙන් බලන්න:`;
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${res.exam_name} ප්‍රතිඵල`,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or share dismissed
      }
    } else {
      // Fallback: Clipboard එකට copy කිරීම
      navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
      setCopiedId(res.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 md:pt-32 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
        
        {/* ── 1. Page Header ── */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#065F46] text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            Academics & Achievements
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            ශාස්ත්‍රීය හා කුසලතා ජයග්‍රහණ
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
            පු/කුඹුක්වැව අත්ථදස්සි කනිෂ්ඨ විද්‍යාලයීය දූ දරුවන් විභාග හා බාහිර තරග ජයග්‍රහණ ඔස්සේ ගෙනා අභිමානය.
          </p>

          {/* ── Tab Switch ── */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex p-1 bg-slate-200/90 rounded-2xl gap-1 shadow-inner">
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
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center gap-2 py-16 text-emerald-800">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-xs font-medium">ජයග්‍රහණ පුවරුව යාවත්කාලීන වෙමින් පවතී...</span>
          </div>
        )}

        {/* ── 2. TAB 1: විභාග ප්‍රතිඵල (SHAREABLE CARDS WITH WARM YELLOW ACHIEVERS) ── */}
        {!loading && activeTab === 'exams' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {examResults.map((res) => (
                <div 
                  key={res.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    
                    {/* Header: Title, Badge, Share Button, Pass Rate */}
                    <div className="flex items-start justify-between border-b border-slate-100 pb-3 gap-2">
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {res.badge}
                        </span>
                        <h3 className="text-sm sm:text-base font-black text-slate-900 mt-1 truncate">
                          {res.exam_name} - {res.year}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {/* ── SHARE BUTTON ── */}
                        <button
                          type="button"
                          onClick={() => handleShareResult(res)}
                          title="ප්‍රතිඵලය Share කරන්න"
                          className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all flex items-center gap-1 active:scale-95"
                        >
                          {copiedId === res.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                          <span className="text-[10px] font-bold hidden sm:inline">
                            {copiedId === res.id ? 'Copied' : 'Share'}
                          </span>
                        </button>

                        <div className="text-right pl-1">
                          <span className="text-[9px] text-slate-400 block font-semibold uppercase">සමත් අනුපාතය</span>
                          <span className="text-base sm:text-lg font-black text-emerald-600">{res.pass_rate}</span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Strip: Admin එකෙන් දමන Cutoff Passes & Highest Marks */}
                    <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-medium">ඉහළම ලකුණු / සාමාර්ථ</span>
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 block">
                          🏆 {res.highest_marks}
                        </span>
                      </div>
                      <div className="border-l border-slate-200 pl-3">
                        <span className="text-[10px] text-slate-400 block font-medium">කඩඉම් ඉක්මවූ දරුවන්</span>
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 block">
                          {res.cutoff_passes} දෙනෙකි
                        </span>
                      </div>
                    </div>

                    {/* ── 3. විශිෂ්ටතම සිසු දක්ෂතා (WARM AMBER / YELLOW THEME) ── */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-1.5 px-0.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span className="text-[11px] font-black text-amber-950 uppercase tracking-wider">
                          විශිෂ්ටතම සිසු දක්ෂතා
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {res.top_students?.map((st, idx) => (
                          <div 
                            key={idx}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/80 hover:bg-amber-100/60 transition-colors"
                          >
                            <div className="truncate pr-2">
                              <div className="flex items-center gap-1.5">
                                <span className="w-4 h-4 rounded-full bg-amber-400/90 text-slate-950 font-black text-[9px] flex items-center justify-center shrink-0 shadow-2xs">
                                  {idx + 1}
                                </span>
                                <p className="text-xs font-bold text-slate-900 truncate">{st.name}</p>
                              </div>
                              <p className="text-[9.5px] text-amber-800 font-semibold pl-5 truncate mt-0.5">
                                {st.status}
                              </p>
                            </div>
                            
                            <span className="text-xs font-black text-amber-950 bg-white px-2 py-0.5 rounded-lg border border-amber-300 shadow-2xs shrink-0 font-mono">
                              {st.marks}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── 3. TAB 2: TIKTOK / REELS 9:16 VERTICAL BANNER CARDS ── */}
        {!loading && activeTab === 'competitions' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
              {achievements.map((item) => (
                <div 
                  key={item.id}
                  className="group relative rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-950 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col active:scale-[0.98]"
                >
                  <div className="w-full aspect-[9/16] relative overflow-hidden bg-slate-900">
                    <img 
                      src={item.image_url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                      loading="lazy"
                    />

                    {/* Smooth Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1 z-10">
                      <span className="bg-black/60 backdrop-blur-xs text-[8.5px] sm:text-[9.5px] text-amber-300 font-bold px-2 py-0.5 rounded-md border border-white/10">
                        {item.category}
                      </span>
                      <span className="bg-emerald-600/90 text-white font-bold text-[8.5px] sm:text-[9px] px-2 py-0.5 rounded-md">
                        {item.year}
                      </span>
                    </div>

                    {/* Bottom Overlay Content */}
                    <div className="absolute bottom-0 inset-x-0 p-3 sm:p-4 z-10 space-y-1.5">
                      <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-400 text-slate-950 font-black text-[9px] sm:text-[10px] shadow-sm">
                        <Trophy className="w-2.5 h-2.5 shrink-0" />
                        <span className="truncate">{item.place}</span>
                      </div>

                      <h4 className="text-xs sm:text-sm font-black text-white leading-tight line-clamp-2 drop-shadow-sm">
                        {item.title}
                      </h4>

                      <p className="text-[10px] sm:text-[11px] font-bold text-emerald-300 truncate">
                        👤 {item.winner_name}
                      </p>

                      {item.description && (
                        <p className="text-slate-300 text-[9.5px] sm:text-[10px] line-clamp-2 leading-relaxed opacity-90 hidden sm:block">
                          {item.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}