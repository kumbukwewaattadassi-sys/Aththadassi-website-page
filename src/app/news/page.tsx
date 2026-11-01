"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Search, ArrowRight, Loader2, Newspaper } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ArticleItem {
  id: string;
  title: string;
  category: string;
  date: string;
  snippet: string;
  image_url?: string;
}

// Supabase load වන තුරු හෝ offline පවතින විට පෙන්වීමට fallback ලිපි
const initialArticles: ArticleItem[] = [
   
];

export default function NewsIndexPage() {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Supabase Database එකෙන් සියලුම පුවත් ලබා ගැනීම
  useEffect(() => {
    async function fetchAllNews() {
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Supabase news fetch error:", error.message);
        } else if (data && data.length > 0) {
          const formatted: ArticleItem[] = data.map((item: any) => ({
            id: item.id,
            title: item.title,
            category: item.category,
            date: item.date,
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

  return (
    <div className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs font-bold text-[#065F46] uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full">
                Aththadassi Newsroom
              </span>
            </div>
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
              placeholder="ලිපි හෝ කාණ්ඩ සොයන්න..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 focus:border-[#065F46] text-sm bg-white shadow-sm"
            />
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-8 text-emerald-800">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">නවතම පුවත් ලබාගනිමින් පවතී...</span>
          </div>
        )}

        {/* Grid List */}
        {!isLoading && filtered.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm max-w-md mx-auto">
            <Newspaper className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-700 font-bold text-base">ලිපි හමු නොවීය</p>
            <p className="text-slate-500 text-xs mt-1">ඔබ සෙවූ වචනයට අදාළ පුවතක් නොමැත.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-4">
                  
                  {/* Image (ඇත්නම් පමණක් පෙන්වයි) */}
                  {item.image_url && (
                    <div className="w-full h-48 rounded-2xl overflow-hidden relative bg-slate-100">
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-[#022c22]/90 backdrop-blur-sm text-[11px] text-[#F59E0B] px-3 py-1 rounded-full font-bold">
                        {item.category}
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      {!item.image_url && (
                        <span className="font-semibold px-3 py-1 rounded-full bg-emerald-50 text-[#065F46] border border-emerald-200/60">
                          {item.category}
                        </span>
                      )}
                      <span className="flex items-center gap-1 font-mono text-[11px] ml-auto">
                        <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
                        {item.date}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#065F46] transition-colors leading-snug">
                      <Link href={`/news/${item.id}`}>{item.title}</Link>
                    </h3>

                    <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                      {item.snippet}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-6 border-t border-slate-100 flex justify-end">
                  <Link
                    href={`/news/${item.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#065F46] group-hover:text-[#F59E0B] transition-colors"
                  >
                    සම්පූර්ණ විස්තරය <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}