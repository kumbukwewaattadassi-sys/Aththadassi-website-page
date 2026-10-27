"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Calendar, Tag, Search, ArrowRight } from 'lucide-react';

export default function NewsIndexPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const articles = [
    {
      id: "big-match-2026",
      title: "වාර්ෂික මහා ක්‍රිකට් සංග්‍රාමය (Big Match) උත්සවාකාරයෙන් ඇරඹේ",
      category: "Sports",
      date: "2026-03-15",
      snippet: "දෙවිදුහල් අතර පැවැත්වෙන 45 වන වාර්ෂික මහා ක්‍රිකට් ගැටුම වෙනුවෙන් වූ ප්‍රධාන මාධ්‍ය හමුව...",
    },
    {
      id: "al-results-celebration",
      title: "උසස් පෙළ ප්‍රතිඵල: විද්‍යාලයේ සිසුන් 42 දෙනෙකුට විශ්වවිද්‍යාල වරම්",
      category: "Academic",
      date: "2026-02-28",
      snippet: "මෙවර උසස් පෙළ විභාගයෙන් ගණිත, විද්‍යා, වාණිජ සහ තාක්ෂණවේදය අංශවලින් දිස්ත්‍රික් ප්‍රමුඛස්ථාන රැසක්...",
    },
    {
      id: "science-day-exhibition",
      title: "වාර්ෂික විද්‍යා සහ නව නිපැයුම් ප්‍රදර්ශනය 'INNOVA 2026'",
      category: "Events",
      date: "2026-01-20",
      snippet: "ශ්‍රී ලංකා විද්‍යාභිවර්ධන සංගමයේ අනුග්‍රහයෙන් සිසුන්ගේ නව නිර්මාණ 50 කට අධික ප්‍රමාණයක් එළිදක්වන ලදී...",
    },
    {
      id: "sports-meet-2026",
      title: "වාර්ෂික නිවාසාන්තර මලල ක්‍රීඩා උළෙල ජයග්‍රාහී ලෙස නිමාවට පත්වේ",
      category: "Sports",
      date: "2026-01-12",
      snippet: "මෙවර ශූරතාවය තියුණු සටනකින් පසු ගැමුණු නිවාසය විසින් දිනා ගැනීමට සමත් විය...",
    },
  ];

  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.snippet.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              පුවත් සහ නිවේදන (News & Articles)
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              පාසලේ සියලුම විශේෂ අවස්ථා, ජයග්‍රහණ සහ චක්‍රලේඛ නිවේදන මෙතැනින් කියවන්න.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ලිපි සොයන්න..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-school-maroon/20 focus:border-school-maroon text-sm"
            />
          </div>
        </div>

        {/* Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-school-gold" />
                    {item.date}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 hover:text-school-maroon transition-colors">
                  <Link href={`/news/${item.id}`}>{item.title}</Link>
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {item.snippet}
                </p>
              </div>

              <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end">
                <Link
                  href={`/news/${item.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-school-maroon hover:underline"
                >
                  සම්පූර්ණ විස්තරය <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}