"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Quote, Calendar, Bell, User, X, ChevronRight } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  author: string;
  image: string;
  summary: string;
  fullContent: string;
}

export default function CombinedPrincipalAndNews() {
  const newsList: NewsItem[] = [
    {
      id: "big-match-2026",
      title: "වාර්ෂික මහා ක්‍රිකට් සංග්‍රාමය (Big Match) උත්සවාකාරයෙන් ඇරඹේ",
      category: "ක්‍රීඩා",
      date: "2026 මාර්තු 15",
      author: "Media Unit",
      image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&w=800&q=80",
      summary: "දෙවිදුහල් අතර පැවැත්වෙන වාර්ෂික මහා ක්‍රිකට් ගැටුමේ නිල සමාරම්භය සහ ක්‍රීඩක සංචිතය එළිදැක්වීම අති උත්කර්ෂවත් ලෙස පැවැත්විණි.",
      fullContent: "දෙවිදුහල් අතර වසර ගණනාවක නොබිඳුණු සහෝදරත්වයෙන් පැවැත්වෙන වාර්ෂික මහා ක්‍රිකට් තරගාවලිය වෙනුවෙන් පාසලේ ප්‍රධාන ක්‍රීඩාංගණයේදී විශේෂ උත්සවයක් සංවිධානය කර තිබුණි. විද්‍යාලයීය ක්‍රීඩකයින් 16 දෙනෙකුගෙන් යුත් නිල සංචිතය විදුහල්පතිතුමා අතින් මෙහිදී නිල වශයෙන් සහතික ලබන ලදී.",
    },
    {
      id: "ol-exam-schedule",
      title: "2026 සාමාන්‍ය පෙළ (O/L) පෙරහුරු විභාග කාලසටහන නිකුත් කෙරේ",
      category: "අධ්‍යයන",
      date: "2026 මාර්තු 10",
      author: "විභාග කමිටුව",
      image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
      summary: "මෙවර සාමාන්‍ය පෙළ විභාගයට පෙනී සිටින සිසු දරුවන් වෙනුවෙන් පැවැත්වෙන අවසන් සම්මන්ත්‍රණ හා පෙරහුරු විභාග කාලසටහන.",
      fullContent: "අ.පො.ස. සාමාන්‍ය පෙළ විභාග අපේක්ෂකයින් සඳහා විද්‍යාලයීය විභාග කමිටුව විසින් මෙහෙයවනු ලබන පුනරීක්ෂණ සම්මන්ත්‍රණ මාලාව ලබන සඳුදා සිට ප්‍රධාන ශාලාවේදී පැවැත්වේ. සියලු සිසුන් පෙරවරු 7.45 වන විට සම්මන්ත්‍රණ ශාලාවට වාර්තා කළ යුතුය.",
    },
    {
      id: "science-exhibition",
      title: "වාර්ෂික හරිත විද්‍යා හා නව නිපැයුම් ප්‍රදර්ශනය 'INNOVA 2026'",
      category: "උත්සව",
      date: "2026 පෙබරවාරි 25",
      author: "විද්‍යා සංගමය",
      image: "https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&w=800&q=80",
      summary: "ශ්‍රී ලංකා විද්‍යාභිවර්ධන සංගමයේ සහයෝගයෙන් සිසු දරු දැරියන්ගේ නව තාක්ෂණික නිර්මාණ 50 කට අධික සංඛ්‍යාවක් ප්‍රදර්ශනය කෙරේ.",
      fullContent: "ශ්‍රී ලංකා විද්‍යාභිවර්ධන සංගමයේ නියෝජිතයින්ගේ ප්‍රධානත්වයෙන් පැවැති විද්‍යා ප්‍රදර්ශනයේදී රොබෝ තාක්ෂණය, හරිත බලශක්තිය හා AI පාදක නිර්මාණ රැසක් ප්‍රදර්ශනය විය. දිස්ත්‍රික් මට්ටමේ ප්‍රථම ස්ථාන 3 ක් විද්‍යාලයේ නව නිපැයුම්කරුවන් දිනා ගත්හ.",
    },
  ];

  const [activeModalNews, setActiveModalNews] = useState<NewsItem | null>(null);

  return (
    <section id="news-section" className="py-12 md:py-24 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-gradient-to-r from-emerald-100/40 to-amber-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-4 pb-4 border-b border-slate-200">
          <div>
            <span className="text-xs font-bold text-[#065F46] uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full inline-block">
              පරිපාලනය සහ තොරතුරු (Administration & Notices)
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 mt-2">
              විදුහල්පති පණිවිඩය සහ නවතම පුවත්
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            දිනපතා යාවත්කාලීන වන නිල පාසල් පුවරුව
          </span>
        </div>

        {/* Outer Layout: Principal (Left) & News (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Principal Card with 3D Pop-up Hover */}
          <div className="lg:col-span-5">
            <div className="group bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-9 border border-slate-200 shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <Quote className="w-8 h-8 sm:w-9 sm:h-9 text-[#F59E0B]" />
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-[#065F46] border border-emerald-200">
                  විදුහල්පති පණිවිඩය
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative cursor-pointer">
                  <div className="w-36 h-36 sm:w-48 sm:h-48 rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-to-tr from-[#065F46] via-[#047857] to-[#F59E0B] p-2 shadow-xl transform transition-transform duration-300 group-hover:scale-105">
                    <div className="w-full h-full rounded-[1.6rem] sm:rounded-[2rem] bg-slate-100 overflow-hidden relative">
                      <img
                        src="https://scontent.fcmb3-3.fna.fbcdn.net/v/t39.30808-6/516392046_1172485148253655_7840767259100969756_n.jpg?stp=dst-jpg_tt6&cstp=mx1280x960&ctp=s1280x960&_nc_cat=100&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeGO6z8j2kTH1dUVNHoI7XOIKsWXVZb5Wk0qxZdVlvlaTVCzO1sPjs2sHYrAQqhV21IIZPbCZKxGtSS3tmIanKJ6&_nc_ohc=rSMJeq104SAQ7kNvwEMpFE2&_nc_oc=AdpRKYsi7iCK9Ls6jjdeKxpjIsWYq_pnWZdN0fDmUNULE6Vi7G6YwVMIrXAIC6LV2to&_nc_zt=23&_nc_ht=scontent.fcmb3-3.fna&_nc_gid=mVNCfbrEnhvoRlFyQ_DZJw&_nc_ss=7b2a8&oh=00_AQNx_FYgm3ES_03stXYgM9LpQSDDf9nXO6iSeDW1iUXX6g&oe=6AE6A67D"
                        alt="Principal"
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = 'none';
                          const fb = target.parentElement?.querySelector('.p-fb') as HTMLElement;
                          if (fb) fb.style.display = 'flex';
                        }}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="p-fb hidden w-full h-full bg-emerald-50 flex-col items-center justify-center text-emerald-800 text-3xl font-bold">
                        👨‍🏫
                      </div>
                    </div>
                  </div>

                  <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-slate-950 font-black text-[11px] sm:text-xs px-4 py-1 rounded-full shadow-md whitespace-nowrap">
                    විදුහල්පතිතුමා
                  </div>
                </div>

                <div className="mt-5 space-y-1">
                  <h3 className="text-base sm:text-lg font-black text-slate-900">ලසන්ද්‍රා ෆනෑන්ඩෝ</h3>
                  <p className="text-[11px] sm:text-xs text-[#065F46] font-bold">විදුහල්පතිතුමිය</p>
                  <p className="text-[10px] sm:text-[11px] text-slate-500">ශ්‍රී ලංකා අධ්‍යාපන පරිපාලන සේවය</p>
                </div>
              </div>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-5 pt-5 border-t border-slate-100 text-center sm:text-left">
                &quot;දැනුම පමණක් නොව විනය, මානුෂීය ගුණධර්ම සහ නායකත්වයෙන් පිරිපුන් පුරවැසියන් රටට දායාද කිරීම අපේ අරමුණයි. ශ්‍රී ලංකාවේ අභිමානය ඔසවා තබන පරපුරක් මෙහි බිහිවේ.&quot;
              </p>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-semibold pt-3 border-t border-slate-100">
                <span className="text-[#065F46]">වසර 78 ක විශිෂ්ටත්වය</span>
                <span>ATHTHADASSI KV</span>
              </div>
            </div>
          </div>

          {/* News & Notices: Mobile එකේ පේළියට 2ක් (grid-cols-2) සහ PC එකේ single-column stacked (sm:grid-cols-1) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                නවතම පුවත් සහ නිවේදන
              </h3>
              <span className="text-xs text-slate-500 font-medium">Click to view article</span>
            </div>

            {/* Grid Container: Mobile: 2 per row (grid-cols-2), Tablet/Desktop: stacked vertical cards (sm:grid-cols-1) */}
            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3.5 sm:gap-4">
              {newsList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => setActiveModalNews(item)}
                  className="group bg-white hover:bg-emerald-50/40 rounded-2xl sm:rounded-3xl p-3 sm:p-5 border border-slate-200/90 hover:border-emerald-300 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col sm:flex-row items-center gap-3 sm:gap-5"
                >
                  {/* Thumbnail Image */}
                  <div className="w-full sm:w-36 h-28 sm:h-28 rounded-xl sm:rounded-2xl overflow-hidden shrink-0 relative bg-slate-100 border border-slate-200">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 bg-slate-900/80 backdrop-blur-sm text-[9px] sm:text-[10px] text-amber-300 px-2 py-0.5 rounded-md font-semibold whitespace-nowrap">
                      {item.category}
                    </div>
                  </div>

                  {/* Text Details */}
                  <div className="flex-1 space-y-1.5 w-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 mb-1">
                        <span className="flex items-center gap-1 font-medium truncate">
                          <Calendar className="w-3 h-3 text-[#F59E0B] shrink-0" /> {item.date}
                        </span>
                        <span className="hidden sm:flex items-center gap-1 font-medium truncate">
                          <User className="w-3 h-3 text-[#065F46] shrink-0" /> {item.author}
                        </span>
                      </div>

                      <h4 className="text-xs sm:text-base font-bold text-slate-900 group-hover:text-[#065F46] transition-colors line-clamp-2 leading-snug">
                        {item.title}
                      </h4>

                      <p className="text-[11px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed mt-1 hidden sm:block">
                        {item.summary}
                      </p>
                    </div>

                    <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-xs font-bold text-[#065F46] group-hover:text-[#047857]">
                      <span className="truncate">කියවන්න</span>
                      <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Strip */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-[11px] sm:text-xs text-amber-900">
              <span className="flex items-center gap-2 font-medium">
                <Bell className="w-4 h-4 text-[#F59E0B] shrink-0" />
                සියලු විභාග සහ පාසල් නිවාඩු චක්‍රලේඛ දැන් Notice Board එකෙන් ලබාගත හැක.
              </span>
              <Link href="/news" className="font-bold underline hover:text-[#065F46] shrink-0 ml-2">
                සියල්ල
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ZERO DELAY MODAL POPUP */}
      {activeModalNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 text-slate-900 rounded-[2rem] sm:rounded-[2.5rem] max-w-2xl w-full p-5 sm:p-8 shadow-2xl relative overflow-hidden">
            <button
              onClick={() => setActiveModalNews(null)}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors z-20"
              aria-label="Close"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <div className="w-full h-44 sm:h-52 rounded-2xl overflow-hidden mb-4 sm:mb-5 relative">
              <img
                src={activeModalNews.image}
                alt={activeModalNews.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 bg-[#F59E0B] text-slate-950 font-bold text-xs px-3 py-1 rounded-full">
                {activeModalNews.category}
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-4 text-xs text-slate-500">
                <span>📅 {activeModalNews.date}</span>
                <span>✍️ {activeModalNews.author}</span>
              </div>

              <h3 className="text-lg sm:text-2xl font-black text-slate-900 leading-tight">
                {activeModalNews.title}
              </h3>

              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed pt-1 sm:pt-2">
                {activeModalNews.fullContent}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setActiveModalNews(null)}
                className="px-5 py-2 sm:px-6 sm:py-2.5 rounded-full bg-[#065F46] hover:bg-[#022C22] text-white font-bold text-xs shadow-md transition-all"
              >
                වසන්න (Close)
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}