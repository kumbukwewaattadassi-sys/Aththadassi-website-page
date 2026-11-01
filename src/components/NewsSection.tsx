"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Calendar, User, ChevronRight, Play, Bell } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  image_url: string;
  description: string;
}

interface VideoItem {
  id: string;
  title: string;
  category: string;
  youtube_url: string;
  thumbnail_url: string;
  duration: string;
  views: string;
}

export default function NewsAndVideos() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    async function fetchData() {
      // News fetch
      const { data: newsData } = await supabase.from('news').select('*').order('created_at', { ascending: false }).limit(3);
      if (newsData) setNews(newsData);

      // Videos fetch
      const { data: videoData } = await supabase.from('youtube_videos').select('*').order('created_at', { ascending: false }).limit(4);
      if (videoData) setVideos(videoData);
    }
    fetchData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* 1. NEWS & NOTICES SECTION */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">නවතම පුවත් සහ නිවේදන</h2>
          </div>
          <span className="text-xs text-slate-400">Click to view article</span>
        </div>

        <div className="space-y-4">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-center">
              <div className="relative w-full sm:w-48 h-32 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-black/60 text-amber-300 text-[10px] font-bold px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                  {item.category}
                </span>
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-amber-500" /> {item.date}</span>
                  <span className="flex items-center gap-1.5"><User className="w-3.5 h-3.5 text-slate-400" /> {item.author}</span>
                </div>
                <h3 className="font-bold text-base sm:text-lg text-slate-900 leading-snug">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">{item.description}</p>
                <Link href={`/news/${item.id}`} className="inline-flex items-center text-xs font-semibold text-emerald-800 hover:text-emerald-950 pt-1">
                  කියවන්න <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Notice Board Banner */}
        <div className="mt-6 bg-amber-50 border border-amber-200/80 rounded-2xl p-4 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2.5 text-amber-900">
            <Bell className="w-4 h-4 text-amber-600 shrink-0" />
            <span>සියලු විභාග සහ පාසල් නිවාඩු චක්‍රලේඛ දැන් <strong>Notice Board</strong> එකෙන් ලබාගත හැක.</span>
          </div>
          <Link href="/news" className="font-bold text-amber-900 hover:underline shrink-0 ml-4">සියල්ල</Link>
        </div>
      </div>

      {/* 2. YOUTUBE VIDEOS SECTION */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">පාසල් <span className="text-red-600">YouTube</span> වීඩියෝ සංග්‍රහය</h2>
            <p className="text-xs text-slate-500 mt-1">ක්‍රීඩා උත්සව, ත්‍යාග ප්‍රදානෝත්සව සහ විශේෂ අවස්ථාවන්හි සජීව විකාශන මෙතැනින් නරඹන්න.</p>
          </div>
          <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors">
            <Play className="w-3.5 h-3.5 fill-white" /> YouTube Channel එක
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((vid) => (
            <div key={vid.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img src={vid.thumbnail_url} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  <span className="absolute top-3 left-3 bg-emerald-950/80 text-emerald-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full backdrop-blur-md">
                    {vid.category}
                  </span>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded">
                    {vid.duration}
                  </span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-sm text-slate-900 line-clamp-2 leading-snug">{vid.title}</h4>
                </div>
              </div>
              <div className="px-4 pb-4 flex items-center justify-between text-xs text-slate-400 border-t border-slate-50 pt-2">
                <span>{vid.views}</span>
                <a href={vid.youtube_url} target="_blank" rel="noreferrer" className="font-semibold text-slate-700 hover:text-red-600 flex items-center gap-1">
                  Play Video <ChevronRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}