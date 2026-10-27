"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function NewsSection() {
  const [filter, setFilter] = useState('all');

  const articles = [
    {
      id: "big-match-2026",
      title: "වාර්ෂික මහා ක්‍රිකට් සංග්‍රාමය (Big Match) උත්සවාකාරයෙන් ඇරඹේ",
      category: "sports",
      categoryName: "ක්‍රීඩා",
      date: "2026 මාර්තු 15",
      author: "School Media Unit",
      snippet: "දෙවිදුහල් අතර පැවැත්වෙන 45 වන වාර්ෂික මහා ක්‍රිකට් ගැටුම වෙනුවෙන් වූ ප්‍රධාන මාධ්‍ය හමුව සහ නිල ජර්සි එළිදැක්වීම...",
      readTime: "3 min read",
      badgeColor: "bg-emerald-100 text-emerald-800",
    },
    {
      id: "al-results-celebration",
      title: "උසස් පෙළ ප්‍රතිඵල: විද්‍යාලයේ සිසුන් 42 දෙනෙකුට විශ්වවිද්‍යාල වරම්",
      category: "academic",
      categoryName: "අධ්‍යයන",
      date: "2026 පෙබරවාරි 28",
      author: "Exam Committee",
      snippet: "මෙවර උසස් පෙළ විභාගයෙන් ගණිත, විද්‍යා, වාණිජ සහ තාක්ෂණවේදය අංශවලින් දිස්ත්‍රික් ප්‍රමුඛස්ථාන රැසක් දිනා ගැනීමට...",
      readTime: "4 min read",
      badgeColor: "bg-blue-100 text-blue-800",
    },
    {
      id: "science-day-exhibition",
      title: "වාර්ෂික හරිත විද්‍යා සහ නව නිපැයුම් ප්‍රදර්ශනය 'INNOVA 2026'",
      category: "events",
      categoryName: "උත්සව",
      date: "2026 ජනවාරි 20",
      author: "Science Society",
      snippet: "ශ්‍රී ලංකා විද්‍යාභිවර්ධන සංගමයේ අනුග්‍රහයෙන් සිසුන්ගේ හරිත තාක්ෂණික නව නිර්මාණ 50 කට අධික ප්‍රමාණයක් එළිදක්වන ලදී...",
      readTime: "5 min read",
      badgeColor: "bg-teal-100 text-teal-800",
    },
  ];

  const filtered = filter === 'all' ? articles : articles.filter(a => a.category === filter);

  return (
    <section className="py-12 md:py-20 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Tabs */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-5">
          <div>
            <span className="text-xs font-extrabold text-[#065F46] uppercase tracking-widest bg-emerald-100 px-3.5 py-1.5 rounded-full inline-block">
              පාසල් පුවත් (Articles & News)
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 mt-2">
              නවතම සිදුවීම් සහ ප්‍රවෘත්ති
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {[
              { id: 'all', label: 'සියල්ල' },
              { id: 'sports', label: 'ක්‍රීඩා' },
              { id: 'academic', label: 'අධ්‍යයන' },
              { id: 'events', label: 'උත්සව' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full text-xs font-bold transition-all ${
                  filter === tab.id
                    ? 'bg-[#065F46] text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards: Mobile වල grid-cols-2 (පේළියට 2ක්), PC වල lg:grid-cols-3 (පේළියට 3ක්) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6 lg:gap-8">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="bg-white rounded-2xl sm:rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between group"
            >
              {/* Header Banner */}
              <div className="h-28 sm:h-44 bg-gradient-to-tr from-[#022C22] to-[#065F46] relative p-3 sm:p-6 flex flex-col justify-between overflow-hidden">
                <div className="flex items-center justify-between relative z-10 gap-1">
                  <span className={`text-[9px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-3 sm:py-1 rounded-full whitespace-nowrap ${item.badgeColor}`}>
                    {item.categoryName}
                  </span>
                  <span className="text-[10px] sm:text-xs text-emerald-200 font-medium whitespace-nowrap">{item.readTime}</span>
                </div>

                <div className="relative z-10 text-white text-[10px] sm:text-xs opacity-90 flex items-center gap-1 sm:gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                  <span className="truncate">{item.date}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3 sm:p-6 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
                <div className="space-y-1.5 sm:space-y-2">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-base lg:text-lg group-hover:text-[#065F46] transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-[11px] sm:text-xs lg:text-sm leading-relaxed line-clamp-2 sm:line-clamp-3">
                    {item.snippet}
                  </p>
                </div>

                <div className="pt-2.5 sm:pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] sm:text-xs text-slate-500">
                  <div className="flex items-center gap-1 sm:gap-1.5 truncate">
                    <User className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{item.author}</span>
                  </div>
                  <Link
                    href={`/news/${item.id}`}
                    className="inline-flex items-center gap-1 font-bold text-[#065F46] hover:underline shrink-0"
                  >
                    කියවන්න <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}