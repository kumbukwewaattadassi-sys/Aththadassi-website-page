"use client";

import React, { useState } from 'react';
import { Play, Youtube, ExternalLink } from 'lucide-react';

interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  category: string;
  duration: string;
  views: string;
  thumbnail: string;
}

export default function SchoolMediaVideos() {
  const videoList: VideoItem[] = [
    {
      id: "vid-1",
      youtubeId: "TxOwUxLeu6FmAOnu",
      title: "වාර්ෂික නිවාසාන්තර මලල ක්‍රීඩා උළෙල 2026 - Official Highlights",
      category: "Sports & Athletics",
      duration: "14:20",
      views: "12K views",
      thumbnail: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "vid-2",
      youtubeId: "dQw4w9WgXcQ",
      title: "පාසල් ගීතය (Official School Anthem) - Media Unit Official Production",
      category: "School Heritage",
      duration: "04:15",
      views: "28K views",
      thumbnail: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "vid-3",
      youtubeId: "dQw4w9WgXcQ",
      title: "සමස්ත ලංකා ජයග්‍රාහී විද්‍යාලයීය තූර්ය වාදක කණ්ඩායමේ සංදර්ශනය",
      category: "Western & Eastern Band",
      duration: "08:45",
      views: "18K views",
      thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "vid-4",
      youtubeId: "dQw4w9WgXcQ",
      title: "විද්‍යා හා තාක්ෂණ ප්‍රදර්ශනය 'INNOVA' - සිසු නිර්මාණ වාර්තා වැඩසටහන",
      category: "Innovations & STEM",
      duration: "10:30",
      views: "9.5K views",
      thumbnail: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
    },
  ];

  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

  return (
    <section id="school-media" className="py-12 md:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-bold uppercase tracking-wider">
              <Youtube className="w-4 h-4 fill-red-600 text-red-600" />
              <span>විද්‍යාලයීය නිල මාධ්‍ය ඒකකය (Media Unit)</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900">
              පාසල් YouTube වීඩියෝ සංග්‍රහය
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm max-w-xl">
              ක්‍රීඩා උත්සව, ත්‍යාග ප්‍රදානෝත්සව, වාර්ෂික මහා සංග්‍රාම සහ විශේෂ අවස්ථාවන්හි සජීවී විකාශන හා වීඩියෝ මෙතැනින් නරඹන්න.
            </p>
          </div>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-all hover:scale-105 shrink-0"
          >
            <Youtube className="w-4 h-4" />
            <span>YouTube Channel එකට පිවිසෙන්න</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Video Frames Grid: Desktop/Tablet වල පේළියට 3ක් (md:grid-cols-3) සහ Mobile වල 2ක් (grid-cols-2) */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
          {videoList.map((video) => (
            <div
              key={video.id}
              onClick={() => setPlayingVideoId(video.youtubeId)}
              className="group bg-slate-50 hover:bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
            >
              <div className="relative h-28 sm:h-44 w-full overflow-hidden bg-slate-900">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <span className="absolute bottom-2 right-2 sm:bottom-2.5 sm:right-2.5 bg-black/80 text-white font-mono text-[9px] sm:text-[10px] px-1.5 py-0.5 sm:px-2 rounded font-bold">
                  {video.duration}
                </span>

                <span className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 bg-[#065F46]/90 text-white text-[9px] sm:text-[10px] px-2 py-0.5 sm:px-2.5 rounded-full font-bold">
                  {video.category}
                </span>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-red-600 group-hover:bg-red-500 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-2 sm:space-y-3">
                <h3 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-[#065F46] transition-colors line-clamp-2 leading-snug">
                  {video.title}
                </h3>

                <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[10px] sm:text-[11px] text-slate-500 font-medium">
                  <span>{video.views}</span>
                  <span className="text-[#065F46] font-bold flex items-center gap-1">
                    Play Video <Play className="w-3 h-3 fill-current" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Embedded Video Player Modal */}
      {playingVideoId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/20">
            <button
              onClick={() => setPlayingVideoId(null)}
              className="absolute top-4 right-4 z-20 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/40 text-white text-xs font-bold transition-all"
            >
              ✕ වසන්න (Close)
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${playingVideoId}?autoplay=1`}
                title="School YouTube Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

    </section>
  );
}