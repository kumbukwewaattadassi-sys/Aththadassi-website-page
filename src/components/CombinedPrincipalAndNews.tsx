"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Quote, Calendar, Bell, ChevronRight, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  image: string;
  summary: string;
}

export default function CombinedPrincipalAndNews() {
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchLiveNews() {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .neq('status', 'draft')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Supabase news fetch error:", error.message);
        } else if (data && data.length > 0) {
          const formattedNews: NewsItem[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category || 'විශේෂ පුවත්',
            date: item.date || new Date(item.created_at).toLocaleDateString('si-LK'),
            author: item.author || 'පරිපාලන අංශය',
            image: item.image_url || item.image || 'https://res.cloudinary.com/n911ylla/image/upload/f_auto,q_auto/685919899_1430362865799214_5670876124687149843_n',
            summary: item.description || item.summary || '',
          }));
          setNewsList(formattedNews);
        }
      } catch (err) {
        console.error("Failed to load news:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLiveNews();
  }, []);

  const latestNews = newsList[0];
  const subNews = newsList.slice(1, 3);

  return (
    <section id="news-section" className="py-6 sm:py-8 md:py-24 bg-slate-50 relative overflow-hidden font-sans">
      <div className="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-emerald-100/40 to-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-4 sm:mb-6 md:mb-10 gap-2 sm:gap-4 pb-2.5 sm:pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-[#065F46] uppercase tracking-widest bg-emerald-100 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full inline-block">
              පරිපාලනය සහ තොරතුරු (Administration & Notices)
            </span>
            <h2 className="text-lg sm:text-3xl lg:text-4xl font-black text-slate-900 mt-1 md:mt-2">
              <span className="lg:hidden">නවතම පාසල් පුවත්</span>
              <span className="hidden lg:inline">විදුහල්පති පණිවිඩය සහ නවතම පුවත්</span>
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden md:inline">
            දිනපතා යාවත්කාලීන වන නිල පාසල් පුවරුව
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-8 items-start">
          
          {/* ================= PRINCIPAL CARD (DESKTOP ONLY) ================= */}
          <div className="hidden lg:block lg:col-span-5 w-full">
            <div className="group bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <Quote className="w-8 h-8 text-[#F59E0B]" />
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#065F46] border border-emerald-200">
                  විදුහල්පති පණිවිඩය
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative cursor-pointer">
                  <div className="w-44 h-44 rounded-[2.5rem] bg-gradient-to-tr from-[#065F46] via-[#047857] to-[#F59E0B] p-2 shadow-xl transform transition-transform duration-300 group-hover:scale-105">
                    <div className="w-full h-full rounded-[2rem] bg-slate-100 overflow-hidden relative">
                      <img
                        src="https://res.cloudinary.com/n911ylla/image/upload/f_auto/q_auto/prnipla.jpg"
                        alt="Principal"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const fb = target.parentElement?.querySelector('.p-fb-pc') as HTMLElement;
                          if (fb) fb.style.display = 'flex';
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="p-fb-pc hidden w-full h-full bg-emerald-50 flex-col items-center justify-center text-emerald-800 text-3xl font-bold">
                        👩‍🏫
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-slate-950 font-black text-xs px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                    විදුහල්පතිතුමිය
                  </div>
                </div>

                <div className="mt-5 space-y-1">
                  <h3 className="text-lg font-black text-slate-900">ලසන්ද්‍රා ෆනෑන්ඩෝ</h3>
                  <p className="text-xs text-[#065F46] font-bold">විදුහල්පතිතුමිය</p>
                  <p className="text-[11px] text-slate-500">ශ්‍රී ලංකා අධ්‍යාපන පරිපාලන සේවය</p>
                </div>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-5 pt-5 border-t border-slate-100 text-left">
                &quot;දැනුම පමණක් නොව විනය, මානුෂීය ගුණධර්ම සහ නායකත්වයෙන් පිරිපුන් පුරවැසියන් රටට දායාද කිරීම අපේ අරමුණයි. ශ්‍රී ලංකාවේ අභිමානය ඔසවා තබන පරපුරක් මෙහි බිහිවේ.&quot;
              </p>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-semibold pt-3 border-t border-slate-100">
                <span className="text-[#065F46]">වසර 63 ක විශිෂ්ටත්වය</span>
                <span>ATHTHADASSI KV</span>
              </div>
            </div>
          </div>

          {/* ================= NEWS SECTION ================= */}
          <div className="w-full lg:col-span-7 space-y-3 sm:space-y-4">
            
            <div className="flex items-center justify-between mb-0.5">
              <h3 className="text-xs sm:text-base font-bold text-slate-900 flex items-center gap-1.5 sm:gap-2">
                <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#10B981] animate-pulse" />
                නවතම පුවත් සහ නිවේදන
              </h3>
              {isLoading && <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />}
            </div>

            {/* ──────────────────────────────────────────────────────────
                1. TOP: HIGHLIGHT BANNER
                - Mobile: Image එක ඇතුලෙම Smooth Shadow එකක් සහිත Overlay Layout
                - Desktop: Original Horizontal Side-by-Side Layout
            ────────────────────────────────────────────────────────── */}
            {latestNews ? (
              <Link
                href={`/news/${latestNews.id}`}
                className="group relative block w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-emerald-500/40 bg-slate-950 shadow-md shadow-emerald-950/20 active:scale-[0.99] transition-transform duration-200"
              >
                {/* ── [A] MOBILE ONLY OVERLAY BANNER (sm:hidden) ── */}
                <div className="relative w-full h-52 overflow-hidden sm:hidden flex flex-col justify-between p-3.5">
                  {/* Background Image */}
                  <img
                    src={latestNews.image}
                    alt={latestNews.title}
                    className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Smooth Multi-stop Dark Shadow Overlay (Lag නැති අතිශය සුමට Gradient එකක්) */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 pointer-events-none" />

                  {/* Top Badges */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/30 border border-emerald-400/60 text-emerald-300 text-[8.5px] font-black uppercase tracking-wider backdrop-blur-xs">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                      Latest Update
                    </span>
                    <span className="bg-black/60 backdrop-blur-xs text-[8.5px] text-amber-300 font-bold px-2 py-0.5 rounded-md border border-white/10">
                      {latestNews.category}
                    </span>
                  </div>

                  {/* Bottom Content inside Image */}
                  <div className="relative z-10 space-y-1.5 pt-4">
                    <div className="flex items-center gap-1 text-[9px] text-emerald-200/90 font-medium">
                      <Calendar className="w-2.5 h-2.5 text-[#F59E0B]" />
                      <span>{latestNews.date}</span>
                    </div>

                    <h4 className="text-[12.5px] font-black text-white leading-snug line-clamp-2 drop-shadow-sm">
                      {latestNews.title}
                    </h4>

                    <div className="pt-0.5 flex items-center justify-between text-[10px] font-bold text-emerald-400">
                      <span className="inline-flex items-center gap-1">
                        කියවන්න <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="text-[9px] text-slate-300 font-normal">
                        By {latestNews.author}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ── [B] DESKTOP & TABLET LAYOUT (hidden sm:flex) ── */}
                <div className="hidden sm:flex flex-row items-stretch">
                  <div className="sm:w-5/12 relative min-h-[190px] overflow-hidden bg-emerald-950 shrink-0">
                    <img
                      src={latestNews.image}
                      alt={latestNews.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-slate-900/85 backdrop-blur-md text-[9px] text-amber-300 px-2 py-0.5 rounded-md font-bold">
                      {latestNews.category}
                    </div>
                  </div>

                  <div className="sm:w-7/12 p-5 flex flex-col justify-between space-y-3 bg-gradient-to-br from-slate-950 via-[#021811] to-slate-950">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                          <Sparkles className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                          Latest Update
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10.5px] font-medium text-slate-400">
                          <Calendar className="w-3 h-3 text-[#F59E0B]" />
                          {latestNews.date}
                        </span>
                      </div>

                      <h4 className="text-base font-black text-white group-hover:text-emerald-300 transition-colors leading-snug line-clamp-2">
                        {latestNews.title}
                      </h4>

                      {latestNews.summary && (
                        <p className="text-slate-300 text-xs line-clamp-2 leading-relaxed">
                          {latestNews.summary}
                        </p>
                      )}
                    </div>

                    <div className="pt-1 flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-[11px]">
                        කියවන්න <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                      <span className="text-[10.5px] text-slate-400 font-normal">
                        By {latestNews.author}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ) : null}

            {/* ──────────────────────────────────────────────────────────
                2. BOTTOM: SUB ARTICLES (BALANCED 2 CARDS IN 1 ROW)
            ────────────────────────────────────────────────────────── */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-4 w-full">
              {subNews.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group bg-white rounded-2xl p-2.5 sm:p-3.5 border border-slate-200/90 hover:border-emerald-400 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between active:scale-[0.98]"
                >
                  <div className="space-y-2">
                    {/* Thumbnail Image */}
                    <div className="w-full aspect-[16/10] rounded-xl overflow-hidden relative bg-slate-100 border border-slate-200">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-1.5 left-1.5 bg-slate-900/85 text-[8px] sm:text-[8.5px] text-amber-300 px-1.5 py-0.5 rounded font-semibold whitespace-nowrap">
                        {item.category}
                      </div>
                    </div>

                    {/* Meta & Title */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[9px] sm:text-[10px] text-slate-400 font-medium">
                        <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#F59E0B] shrink-0" />
                        <span className="truncate">{item.date}</span>
                      </div>

                      <h5 className="text-[11px] sm:text-[13px] font-bold text-slate-900 group-hover:text-[#065F46] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h5>
                    </div>
                  </div>

                  {/* Read More Footer */}
                  <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11px] font-bold text-[#065F46]">
                    <span>කියවන්න</span>
                    <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Strip */}
            <div className="p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-[10px] sm:text-xs text-amber-900">
              <span className="flex items-center gap-1.5 sm:gap-2 font-medium truncate">
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F59E0B] shrink-0" />
                <span className="truncate">සියලු විභාග සහ පාසල් නිවාඩු චක්‍රලේඛ දැන් Notice Board එකෙන් ලබාගත හැක.</span>
              </span>
              <Link href="/news" className="font-bold underline hover:text-[#065F46] shrink-0 ml-1.5">
                සියල්ල
              </Link>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}