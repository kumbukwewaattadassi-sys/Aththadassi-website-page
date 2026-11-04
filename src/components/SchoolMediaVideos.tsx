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
  Clock,
  ChevronDown
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface VideoItem {
  id: string;
  youtubeId: string;
  title: string;
  description?: string;
  category: string;
  duration: string;
  views: string;
  thumbnail: string;
}

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
  const [showAllVideos, setShowAllVideos] = useState<boolean>(false);

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
              description: item.description || "විද්‍යාලයීය නිල මාධ්‍ය ඒකකය මඟින් ඉදිරිපත් කරනු ලබන නවතම වීඩියෝ විකාශනය නරඹන්න.",
              category: item.category || "General",
              duration: item.duration || "Video",
              views: item.views || "1K views",
              thumbnail: item.thumbnail_url || (ytId ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg` : ""),
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

  const visibleVideos = showAllVideos ? videoList : videoList.slice(0, 3);

  return (
    <section id="school-media" className="py-10 md:py-20 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-14 gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-[11px] font-bold uppercase tracking-wider">
              <Youtube className="w-3.5 h-3.5 fill-red-600 text-red-600" />
              <span>විද්‍යාලයීය නිල මාධ්‍ය ඒකකය</span>
            </div>
            <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              පාසල් YouTube වීඩියෝ සංග්‍රහය
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm max-w-xl">
              නවතම පාසල් උත්සව හා සජීවී විකාශන මෙතැනින් නරඹන්න.
            </p>
          </div>

          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md shadow-red-600/20 transition-transform active:scale-95 shrink-0 self-start md:self-auto"
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube Channel</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center justify-center py-16 text-red-600">
            <Loader2 className="w-6 h-6 animate-spin mr-2" />
            <span className="text-xs sm:text-sm font-semibold">වීඩියෝ ලබා ගනිමින් පවතී...</span>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && videoList.length === 0 && (
          <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 text-center text-slate-500 text-xs sm:text-sm">
            තවමත් කිසිදු වීඩියෝවක් එක් කර නොමැත.
          </div>
        )}

        {/* ZIG-ZAG SHOWCASE: Mobile එකෙත් Compact horizontal row එකක් ලෙස වම්/දකුණු මාරු වේ */}
        {!isLoading && visibleVideos.length > 0 && (
          <div className="space-y-4 sm:space-y-8">
            {visibleVideos.map((video, index) => {
              const isEven = index % 2 === 0;

              return (
                <div
                  key={video.id}
                  className="flex flex-row items-center gap-3 sm:gap-8 p-3 sm:p-6 rounded-2xl sm:rounded-[2.5rem] bg-slate-50/80 border border-slate-200/80 hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-200 will-change-transform"
                >
                  
                  {/* Thumbnail Frame (Mobile: 42% width, Desktop: 40% width) */}
                  <div
                    onClick={() => setActiveVideo(video)}
                    className={`w-[42%] sm:w-[40%] shrink-0 relative aspect-video rounded-xl sm:rounded-3xl overflow-hidden bg-slate-900 shadow-sm cursor-pointer group ${
                      isEven ? 'order-1' : 'order-2'
                    }`}
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    <span className="absolute bottom-1 right-1 sm:bottom-2.5 sm:right-2.5 bg-black/85 text-white font-mono text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0.5 rounded font-bold">
                      {video.duration}
                    </span>

                    <span className="hidden sm:inline-block absolute top-2.5 left-2.5 bg-[#065F46]/90 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">
                      {video.category}
                    </span>

                    {/* Centered Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-full bg-red-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                        <Play className="w-3 h-3 sm:w-5 sm:h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Title & Description Column */}
                  <div className={`flex-1 min-w-0 space-y-1 sm:space-y-3 ${
                    isEven ? 'order-2 text-left' : 'order-1 text-left'
                  }`}>
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                      <span className="text-[9px] sm:text-[11px] font-black uppercase text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100 truncate">
                        {index === 0 ? "🔥 Latest" : `Video #${index + 1}`}
                      </span>
                      <span className="text-[9px] sm:text-xs text-slate-400 font-medium truncate">• {video.views}</span>
                    </div>

                    <h3 
                      onClick={() => setActiveVideo(video)}
                      className="text-xs sm:text-lg font-black text-slate-900 hover:text-emerald-800 transition-colors cursor-pointer leading-snug line-clamp-2"
                    >
                      {video.title}
                    </h3>

                    {/* Description: Mobile එකේ පේළි 2කට සීමා වේ */}
                    <p className="text-[10px] sm:text-xs md:text-sm text-slate-600 font-medium leading-relaxed line-clamp-2 sm:line-clamp-3">
                      {video.description}
                    </p>

                    <div className="pt-1 sm:pt-2 flex items-center gap-2">
                      <button
                        onClick={() => setActiveVideo(video)}
                        className="inline-flex items-center gap-1 sm:gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-[10px] sm:text-xs font-bold transition-transform active:scale-95"
                      >
                        <Play className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
                        <span>නරඹන්න</span>
                      </button>

                      <button
                        onClick={() => handleShare(video)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 text-[10px] sm:text-xs font-bold transition-transform active:scale-95"
                      >
                        <Share2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                        <span className="hidden sm:inline">Share</span>
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* SEE MORE VIDEOS BUTTON */}
        {!isLoading && videoList.length > 3 && (
          <div className="mt-8 sm:mt-12 text-center">
            {!showAllVideos ? (
              <button
                onClick={() => setShowAllVideos(true)}
                className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-black transition-transform active:scale-95 shadow-md"
              >
                <span>See More Videos ({videoList.length - 3}+ More)</span>
                <ChevronDown className="w-3.5 h-3.5 animate-bounce" />
              </button>
            ) : (
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 sm:px-8 sm:py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-black transition-transform active:scale-95 shadow-md shadow-red-600/20"
              >
                <Youtube className="w-4 h-4" />
                <span>Visit YouTube Channel</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}

      </div>

      {/* 144FPS HARDWARE ACCELERATED CINEMA MODAL PLAYER */}
      {activeVideo && (
        <div 
          onClick={() => setActiveVideo(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-sm animate-in fade-in duration-150 transform-gpu"
          style={{ willChange: "opacity" }}
        >
          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative w-full max-w-4xl flex flex-col gap-2.5 sm:gap-4 text-white transform-gpu"
            style={{ 
              willChange: "transform, opacity",
              transform: "translateZ(0)",
              backfaceVisibility: "hidden"
            }}
          >
            {/* Modal Top Control */}
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-slate-200">
                  {activeVideo.category} • පාසල් මාධ්‍ය විකාශය
                </span>
              </div>

              <button
                onClick={() => setActiveVideo(null)}
                className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-transform active:scale-95 border border-white/10"
              >
                <span>වසන්න</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Zero-Lag YouTube Frame Container */}
            <div 
              className="relative w-full aspect-video rounded-xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/15 bg-black transform-gpu"
              style={{ 
                transform: "translate3d(0, 0, 0)",
                contain: "paint layout",
                willChange: "contents"
              }}
            >
              <iframe
                className="w-full h-full border-0"
                src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={activeVideo.title}
                loading="eager"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer Bar */}
            <div className="bg-[#0b1f19]/90 border border-emerald-800/40 rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
              <div className="space-y-1 max-w-xl">
                <h3 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                  {activeVideo.title}
                </h3>
                <div className="flex items-center gap-3 text-[11px] text-emerald-300/80 font-medium">
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-amber-400" /> {activeVideo.views}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-emerald-400" /> {activeVideo.duration}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 justify-end">
                <button
                  onClick={() => handleShare(activeVideo)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 active:scale-95 transition-transform"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  <span>{isCopied ? "Copied!" : "Share"}</span>
                </button>

                <a
                  href={`https://www.youtube.com/watch?v=${activeVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-transform active:scale-95 shadow-md"
                >
                  <Youtube className="w-3.5 h-3.5 fill-white" />
                  <span>YouTube</span>
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