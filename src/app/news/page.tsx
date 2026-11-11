"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Search, ArrowRight, Loader2, Newspaper, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ArticleItem {
  id: string;
  title: string;
  category: string;
  date: string;
  snippet: string;
  image_url?: string;
}

const ITEMS_PER_PAGE = 10;

export default function NewsIndexPage() {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Supabase Database එකෙන් සියලුම පුවත් ලබා ගැනීම
  useEffect(() => {
    async function fetchAllNews() {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .neq('status', 'draft')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Supabase news fetch error:", error.message);
        } else if (data && data.length > 0) {
          const formatted: ArticleItem[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category || 'විශේෂ පුවත්',
            date: item.date || new Date(item.created_at).toLocaleDateString('si-LK'),
            snippet: item.description || item.summary || item.snippet || '',
            image_url: item.image_url || item.image,
          }));
          setArticles(formatted);
        }
      } catch (err) {
        console.error("Error fetching articles:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchAllNews();
  }, []);

  // Search Filter
  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.snippet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Search කළ විට නැවත 1 වන පිටුවට යොමු කිරීම
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination Logic (පිටුවකට News 10යි)
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedArticles = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    // Navbar එකට යට නොවීමට pt-24 (Mobile) සහ md:pt-32 (Desktop) යොදා ඇත
    <div className="min-h-screen bg-slate-50 pt-24 md:pt-32 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-6 md:space-y-8">
        
        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-bold text-[#065F46] uppercase tracking-widest bg-emerald-100 px-3 py-0.5 sm:py-1 rounded-full">
                Aththadassi Newsroom
              </span>
            </div>
            <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight">
              පුවත් සහ නිවේදන (News & Articles)
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              පාසලේ සියලුම විශේෂ අවස්ථා, ජයග්‍රහණ සහ චක්‍රලේඛ නිවේදන මෙතැනින් කියවන්න.
            </p>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="ලිපි හෝ කාණ්ඩ සොයන්න..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-[#065F46] text-xs sm:text-sm bg-white shadow-xs"
            />
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-16 text-emerald-800">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">නවතම පුවත් ලබාගනිමින් පවතී...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-xs max-w-md mx-auto my-8">
            <Newspaper className="w-10 h-10 text-slate-400 mx-auto mb-2.5" />
            <p className="text-slate-700 font-bold text-sm sm:text-base">ලිපි හමු නොවීය</p>
            <p className="text-slate-500 text-xs mt-1">ඔබ සෙවූ වචනයට අදාළ පුවතක් නොමැත.</p>
          </div>
        ) : (
          <>
            {/* 
              GRID LAYOUT: 
              - Mobile: grid-cols-2 (පේළියට 2යි)
              - PC (Desktop): lg:grid-cols-3 (පේළියට 3යි)
            */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-4 lg:gap-5">
              {paginatedArticles.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-2.5 sm:p-4 border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group hover:-translate-y-0.5 active:scale-[0.99]"
                >
                  <div className="space-y-2 sm:space-y-3">
                    
                    {/* Thumbnail Image */}
                    {item.image_url ? (
                      <div className="w-full aspect-[16/10] rounded-xl overflow-hidden relative bg-slate-100 border border-slate-100">
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-1.5 left-1.5 bg-[#022c22]/90 backdrop-blur-xs text-[8px] sm:text-[9.5px] text-[#F59E0B] px-1.5 sm:px-2 py-0.5 rounded font-bold whitespace-nowrap">
                          {item.category}
                        </div>
                      </div>
                    ) : (
                      <div className="w-full aspect-[16/10] rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                        <span className="text-[10px] text-slate-400 font-bold">පින්තූර නොමැත</span>
                      </div>
                    )}

                    {/* Meta & Title */}
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-[9px] sm:text-[10.5px] text-slate-400 font-medium">
                        <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#F59E0B] shrink-0" />
                        <span className="truncate">{item.date}</span>
                      </div>

                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-[#065F46] transition-colors leading-snug line-clamp-2">
                        <Link href={`/news/${item.id}`}>{item.title}</Link>
                      </h3>

                      {item.snippet && (
                        <p className="text-slate-500 text-[10.5px] sm:text-xs leading-relaxed line-clamp-2">
                          {item.snippet}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Read More Footer */}
                  <div className="pt-2 sm:pt-2.5 mt-2 sm:mt-3 border-t border-slate-100 flex items-center justify-between text-[10px] sm:text-[11.5px] font-bold text-[#065F46]">
                    <Link
                      href={`/news/${item.id}`}
                      className="inline-flex items-center gap-1 group-hover:text-[#F59E0B] transition-colors w-full justify-between"
                    >
                      <span>කියවන්න</span>
                      <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Pagination Buttons (ලිපි 10ක් පිරුණු පසු Next Page පෙන්වයි) ── */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2 pt-8 pb-4">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-all"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>

                {/* Page Number Pills */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl text-xs font-bold transition-all ${
                        currentPage === pageNum
                          ? 'bg-[#065F46] text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition-all"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}