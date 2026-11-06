"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Quote, Calendar, Bell, User, ChevronRight, Loader2 } from 'lucide-react';
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

  // Supabase වෙතින් Published පුවත් පමණක් සජීවීව ලබා ගැනීම
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
            category: item.category,
            date: item.date,
            author: item.author,
            image: item.image_url || item.image,
            summary: item.description || item.summary,
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

  return (
    <section id="news-section" className="py-8 md:py-24 bg-slate-50 relative overflow-hidden">
      <div className="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-emerald-100/40 to-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-12 gap-3 md:gap-4 pb-3 md:pb-4 border-b border-slate-200">
          <div>
            <span className="text-[10.5px] sm:text-xs font-bold text-[#065F46] uppercase tracking-widest bg-emerald-100 px-3 py-0.5 sm:py-1 rounded-full inline-block">
              පරිපාලනය සහ තොරතුරු (Administration & Notices)
            </span>
            <h2 className="text-xl sm:text-4xl font-black text-slate-900 mt-1.5 md:mt-2">
              විදුහල්පති පණිවිඩය සහ නවතම පුවත්
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden md:inline">
            දිනපතා යාවත්කාලීන වන නිල පාසල් පුවරුව
          </span>
        </div>

        {/* 
          Main Container:
          - Mobile (flex-col-reverse): News Section (order-1) comes on TOP, Principal Card (order-2) comes UNDER.
          - Desktop (lg:grid lg:grid-cols-12): Principal on LEFT (col-span-5), News on RIGHT (col-span-7) unmodified.
        */}
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* ================= PRINCIPAL CARD ================= */}
          <div className="w-full lg:col-span-5">
            
            {/* 1. MOBILE ONLY: COMPACT HORIZONTAL CARD WITH SIDE PHOTO (lg:hidden) */}
            <div className="block lg:hidden bg-white rounded-2xl p-3.5 border border-slate-200 shadow-sm">
              <div className="flex items-start gap-3">
                
                {/* Small Compact Side Photo Frame */}
                <div className="relative shrink-0">
                  <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-600 bg-emerald-50 shadow-xs">
                    <img
                      src="https://res.cloudinary.com/n911ylla/image/upload/f_auto/q_auto/prnipla.jpg"
                      alt="Principal"
                      onError={(e) => {
                        const target = e.currentTarget as HTMLImageElement;
                        target.style.display = 'none';
                        const fb = target.parentElement?.querySelector('.p-fb-mobile') as HTMLElement;
                        if (fb) fb.style.display = 'flex';
                      }}
                      className="w-full h-full object-cover"
                    />
                    <div className="p-fb-mobile hidden w-full h-full bg-emerald-50 flex items-center justify-center text-xl">
                      👩‍🏫
                    </div>
                  </div>
                  <span className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-slate-950 font-black text-[8px] px-1.5 py-0.2 rounded-full whitespace-nowrap shadow-xs">
                    විදුහල්පති
                  </span>
                </div>

                {/* Right Side Text Details */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 text-[#065F46] border border-emerald-200">
                      පණිවිඩය
                    </span>
                    <Quote className="w-4 h-4 text-[#F59E0B]" />
                  </div>
                  <h3 className="text-xs font-black text-slate-900 leading-tight pt-0.5 truncate">
                    ලසන්ද්‍රා ෆනෑන්ඩෝ මිය
                  </h3>
                  <p className="text-[10px] text-[#065F46] font-bold leading-none">
                    විදුහල්පතිතුමිය
                  </p>
                  <p className="text-[9px] text-slate-400 font-medium">
                    ශ්‍රී ලංකා අධ්‍යාපන පරිපාලන සේවය
                  </p>
                </div>
              </div>

              {/* Message Quote */}
              <p className="text-slate-600 text-[11px] leading-relaxed mt-2.5 pt-2 border-t border-slate-100 font-normal">
                &quot;දැනුම පමණක් නොව විනය, මානුෂීය ගුණධර්ම සහ නායකත්වයෙන් පිරිපුන් පුරවැසියන් රටට දායාද කිරීම අපේ අරමුණයි.&quot;
              </p>

              <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400 font-semibold pt-1.5 border-t border-slate-100">
                <span className="text-[#065F46]">වසර 63 ක විශිෂ්ටත්වය</span>
                <span className="font-mono">ATHTHADASSI KV</span>
              </div>
            </div>

            {/* 2. DESKTOP ONLY: ORIGINAL CARD UNCHANGED (hidden lg:block) */}
            <div className="hidden lg:block group bg-white rounded-[2.5rem] p-9 border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <Quote className="w-9 h-9 text-[#F59E0B]" />
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#065F46] border border-emerald-200">
                  විදුහල්පති පණිවිඩය
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative cursor-pointer">
                  <div className="w-48 h-48 rounded-[2.5rem] bg-gradient-to-tr from-[#065F46] via-[#047857] to-[#F59E0B] p-2 shadow-xl transform transition-transform duration-300 group-hover:scale-105">
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

              <p className="text-slate-600 text-sm leading-relaxed mt-5 pt-5 border-t border-slate-100 text-left">
                &quot;දැනුම පමණක් නොව විනය, මානුෂීය ගුණධර්ම සහ නායකත්වයෙන් පිරිපුන් පුරවැසියන් රටට දායාද කිරීම අපේ අරමුණයි. ශ්‍රී ලංකාවේ අභිමානය ඔසවා තබන පරපුරක් මෙහි බිහිවේ.&quot;
              </p>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-semibold pt-3 border-t border-slate-100">
                <span className="text-[#065F46]">වසර 63 ක විශිෂ්ටත්වය</span>
                <span>ATHTHADASSI KV</span>
              </div>
            </div>

          </div>

          {/* ================= NEWS SECTION (ON TOP IN MOBILE) ================= */}
          <div className="w-full lg:col-span-7 space-y-3.5 sm:space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-sm sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                නවතම පුවත් සහ නිවේදන
              </h3>
              <div className="flex items-center gap-2">
                {isLoading && <Loader2 className="w-3.5 h-3.5 text-emerald-600 animate-spin" />}
                <span className="text-[11px] sm:text-xs text-slate-500 font-medium">Click to view article</span>
              </div>
            </div>

            {/* Grid Container */}
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-2.5 sm:gap-4">
              {newsList.map((item) => (
                <Link
                  key={item.id}
                  href={`/news/${item.id}`}
                  className="group bg-white hover:bg-emerald-50/40 rounded-xl sm:rounded-3xl p-2.5 sm:p-5 border border-slate-200/90 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-5"
                >
                  {/* Thumbnail Image */}
                  <div className="w-full sm:w-36 h-24 sm:h-28 rounded-lg sm:rounded-2xl overflow-hidden shrink-0 relative bg-slate-100 border border-slate-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-slate-900/80 backdrop-blur-sm text-[8.5px] sm:text-[10px] text-amber-300 px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-md font-semibold whitespace-nowrap">
                      {item.category}
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 space-y-1 w-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[9.5px] sm:text-[11px] text-slate-500 mb-0.5">
                        <span className="flex items-center gap-1 font-medium truncate">
                          <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#F59E0B] shrink-0" /> {item.date}
                        </span>
                        <span className="hidden sm:flex items-center gap-1 font-medium truncate">
                          <User className="w-3 h-3 text-[#065F46] shrink-0" /> {item.author}
                        </span>
                      </div>

                      <h4 className="text-[11px] sm:text-base font-bold text-slate-900 group-hover:text-[#065F46] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1 hidden sm:block">
                        {item.summary}
                      </p>
                    </div>

                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[9.5px] sm:text-xs font-bold text-[#065F46] group-hover:text-[#047857]">
                      <span className="truncate">කියවන්න</span>
                      <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transform group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Strip */}
            <div className="p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-[10.5px] sm:text-xs text-amber-900">
              <span className="flex items-center gap-2 font-medium">
                <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#F59E0B] shrink-0" />
                සියලු විභාග සහ පාසල් නිවාඩු චක්‍රලේඛ දැන් Notice Board එකෙන් ලබාගත හැක.
              </span>
              <Link href="/news" className="font-bold underline hover:text-[#065F46] shrink-0 ml-2">
                සියල්ල
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}