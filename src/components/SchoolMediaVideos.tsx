"use client";

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Youtube, 
  ExternalLink, 
  Loader2, 
  X, 
  Share2, 
  Check, 
  Eye, 
  Clock 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  category: string;
  duration: string;
  views: string;
  thumbnail: string;
}

// YouTube URL එකකින් ID එක වෙන් කරගැනීම
function extractYouTubeId(urlOrId: string): string {
  if (!urlOrId) return "";
  if (urlOrId.length === 11 && !urlOrId.includes("/")) return urlOrId;
  const match = urlOrId.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? match[1] : urlOrId;
}

export default function SchoolMediaVideos() {
  const [videoList, setVideoList] = useState<VideoItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Supabase වෙතින් සජීවීව වීඩියෝ ලබා ගැනීම
  useEffect(() => {
    async function fetchVideos() {
      try {
        const { data, error } = await supabase
          .from('youtube_videos')
          .select('*')
          .neq('status', 'draft')
          .order('created_at', { ascending: false });

        if (error) {
          console.error("Supabase video fetch error:", error.message);
        } else if (data && data.length > 0) {
          const formatted: VideoItem[] = data.map((item: any) => {
            const ytId = extractYouTubeId(item.youtube_url || item.youtubeId || "");
            return {
              id: item.id,
              youtubeId: ytId,
              title: item.title,
              category: item.category || "General",
              duration: item.duration || "Video",
              views: item.views || "1K views",
              thumbnail: item.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : ""),
            };
          });
          setVideoList(formatted);
        }
      } catch (err) {
        console.error("Error loading videos:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchVideos();
  }, []);

  // Share Functionality
  const handleShare = (video: VideoItem) => {
    const videoUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: video.title,
          text: `නරඹන්න: ${video.title} - Aththadassi K Vidyalaya`,
          url: videoUrl,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(videoUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

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

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-red-600">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-sm font-semibold">වීඩියෝ ලබා ගනිමින් පවතී...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && videoList.length === 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-10 text-center text-slate-500 text-sm">
            තවමත් කිසිදු වීඩියෝවක් එක් කර නොමැත. Admin Panel එක මඟින් අලුත් වීඩියෝවක් එක් කරන්න.
          </div>
        )}

        {/* Video Frames Grid: Desktop/Tablet පේළියට 3ක් සහ Mobile 2ක් */}
        {!isLoading && videoList.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-6">
            {videoList.map((video) => (
              <div
                key={video.id}
                onClick={() => setActiveVideo(video)}
                className="group bg-slate-50 hover:bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col justify-between"
              >
                <div className="relative h-28 sm:h-44 w-full overflow-hidden bg-slate-900">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
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
        )}

      </div>

      {/* නවීන Cinema Mode Video Player Modal */}
      {activeVideo && (
        <div 
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative w-full max-w-4xl flex flex-col gap-3 sm:gap-4 text-white"
          >
            
            {/* 1. Header Bar (වීඩියෝ රාමුවට ඉහළින් Close Button එක සහිතව) */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-200">
                  {activeVideo.category} • පාසල් මාධ්‍ය විකාශය
                </span>
              </div>

              {/* Close Button එක වීඩියෝවට පිටින් උඩින් පිහිටුවා ඇත */}
              <button
                onClick={() => setActiveVideo(null)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all active:scale-95 border border-white/10"
                aria-label="Close"
              >
                <span>වසන්න</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Responsive 16:9 Video Frame */}
            <div className="relative w-full aspect-video rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                title={activeVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* 3. Footer Control Bar (වීඩියෝ රාමුවට යටින්) */}
            <div className="bg-[#0b1f19]/90 border border-emerald-800/40 backdrop-blur-xl rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
              
              {/* Video Title & Meta */}
              <div className="space-y-1.5 max-w-xl">
                <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 leading-snug">
                  {activeVideo.title}
                </h3>
                <div className="flex items-center gap-4 text-xs text-emerald-300/70 font-medium">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5 text-amber-400" /> {activeVideo.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-400" /> {activeVideo.duration}
                  </span>
                </div>
              </div>

              {/* Action Buttons (Share & Watch on YouTube) */}
              <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end pt-2 md:pt-0 border-t md:border-t-0 border-emerald-800/40">
                <button
                  onClick={() => handleShare(activeVideo)}
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all border border-white/10 active:scale-95"
                >
                  {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
                  <span>{isCopied ? "Copied Link!" : "Share"}</span>
                </button>

                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 md:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-md active:scale-95"
                >
                  <Youtube className="w-4 h-4 fill-white" />
                  <span>YouTube එකෙන් බලන්න</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

    </section>
  );
}