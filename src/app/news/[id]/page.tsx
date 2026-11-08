"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Calendar, 
  User, 
  ArrowLeft, 
  Share2, 
  Check, 
  ExternalLink, 
  Images, 
  Loader2,
  Tag
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface NewsArticle {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  date: string;
  author: string;
  image: string;
  description: string;
  link_url?: string;
  link_label?: string;
  gallery?: string[]; // අමතර ඡායාරූප ලැයිස්තුව
}

export default function SingleNewsPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArticle() {
      if (!params?.id) return;
      try {
        const { data, error } = await supabase
          .from("news")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) {
          console.error("Error fetching article:", error.message);
        } else if (data) {
          // Gallery photos array එකක් හෝ string එකක් ලෙස තිබේ නම් parse කිරීම
          let parsedGallery: string[] = [];
          if (Array.isArray(data.gallery)) {
            parsedGallery = data.gallery;
          } else if (typeof data.gallery === "string") {
            try {
              parsedGallery = JSON.parse(data.gallery);
            } catch {
              parsedGallery = data.gallery.split(",").map((s: string) => s.trim());
            }
          }

          setArticle({
            id: data.id,
            title: data.title,
            subtitle: data.subtitle || data.excerpt || "",
            category: data.category || "පුවත්",
            date: data.date || "2026",
            author: data.author || "මාධ්‍ය ඒකකය",
            image: data.image_url || data.image,
            description: data.description || data.content || data.summary || "",
            link_url: data.link_url || data.external_link || "",
            link_label: data.link_label || "වැඩිදුර තොරතුරු මෙතැනින්",
            gallery: parsedGallery,
          });
        }
      } catch (err) {
        console.error("Failed to load article:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchArticle();
  }, [params?.id]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        navigator.share({
          title: article?.title,
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-emerald-800">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          <p className="text-sm font-semibold">පුවත ලබා ගනිමින් පවතී...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-2">පුවත සොයාගත නොහැකි විය</h2>
        <p className="text-xs text-slate-500 mb-5">මෙම පුවත ඉවත් කර හෝ ලිපිනය වැරදි විය හැක.</p>
        <Link
          href="/news"
          className="px-4 py-2 bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs"
        >
          පුවත් පිටුවට යන්න
        </Link>
      </div>
    );
  }

  // Description එක ඡේද (paragraphs) වලට වෙන් කර පෙන්වීම
  const paragraphs = article.description
    .split("\n")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-20 md:pt-28 pb-16 px-3.5 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-5 sm:space-y-7">
        
        {/* Navigation Bar / Action Strip */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ආපසු</span>
          </button>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 text-xs font-bold shadow-2xs hover:bg-slate-50 active:scale-95 transition-all"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied!" : "Share"}</span>
          </button>
        </div>

        {/* ── 1. HEADER SECTION (Category, Title, Subtitle, Metadata) ── */}
        <header className="space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-100 text-emerald-900 font-bold text-[10px] sm:text-xs">
              <Tag className="w-3 h-3 text-emerald-700" />
              {article.category}
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 font-medium">
              <Calendar className="w-3 h-3 text-[#F59E0B]" />
              {article.date}
            </span>
            <span className="text-slate-400 text-xs">•</span>
            <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs text-slate-500 font-medium">
              <User className="w-3 h-3 text-emerald-700" />
              {article.author}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-950 leading-snug tracking-tight">
            {article.title}
          </h1>

          {/* Subtitle / Key Highlights (ඇත්නම් පමණක් දිස්වේ) */}
          {article.subtitle && (
            <p className="text-xs sm:text-base font-semibold text-emerald-900/90 leading-relaxed bg-emerald-50/70 p-3 sm:p-4 rounded-xl border-l-4 border-emerald-600">
              {article.subtitle}
            </p>
          )}
        </header>

        {/* ── 2. FEATURED COVER THUMBNAIL (ප්‍රධාන පින්තූරය) ── */}
        <div className="relative w-full aspect-[16/10] max-h-[460px] rounded-2xl sm:rounded-3xl overflow-hidden shadow-md bg-slate-900 border border-slate-200">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* ── 3. STRUCTURED DESCRIPTION PARAGRAPHS (විස්තර ඡේද) ── */}
        <article className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
          {paragraphs.map((para, idx) => (
            <p
              key={idx}
              className={`text-xs sm:text-[15px] leading-relaxed text-slate-700 font-normal ${
                idx === 0 ? "first-letter:text-2xl first-letter:font-black first-letter:text-emerald-800" : ""
              }`}
            >
              {para}
            </p>
          ))}

          {/* ── ACTION LINK BUTTON (Click කර වෙනත් Link එකකට යාමට) ── */}
          {article.link_url && (
            <div className="pt-4 mt-4 border-t border-slate-100 flex justify-start">
              <a
                href={article.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white text-xs sm:text-sm font-bold shadow-sm active:scale-95 transition-all"
              >
                <span>{article.link_label}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </article>

        {/* ── 4. ADDITIONAL PHOTO GALLERY (අමතර පින්තූර එකතුව) ── */}
        {article.gallery && article.gallery.length > 0 && (
          <section className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-slate-900">
              <Images className="w-4 h-4 text-emerald-700" />
              <h3 className="text-sm sm:text-lg font-black tracking-tight">
                වැඩසටහනේ අමතර ඡායාරූප ({article.gallery.length})
              </h3>
            </div>

            {/* Responsive Grid: Mobile 2 cols, Desktop 3 cols */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3.5">
              {article.gallery.map((photoUrl, i) => (
                <div
                  key={i}
                  onClick={() => setSelectedImage(photoUrl)}
                  className="group relative aspect-[4/3] rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer shadow-2xs hover:shadow-md transition-all active:scale-95"
                >
                  <img
                    src={photoUrl}
                    alt={`Photo ${i + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] font-bold text-white bg-black/60 px-2 py-0.5 rounded-full">
                      විශාල කර බලන්න
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

      {/* ── IMAGE LIGHTBOX PREVIEW MODAL (පින්තූරය ලොකුවට බැලීමට) ── */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-xs animate-in fade-in duration-150"
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl">
            <img
              src={selectedImage}
              alt="Preview"
              className="w-full h-full object-contain max-h-[85vh] rounded-2xl"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 px-3 py-1 bg-black/70 hover:bg-black text-white text-xs font-bold rounded-full border border-white/20"
            >
              වසන්න ✕
            </button>
          </div>
        </div>
      )}
    </main>
  );
}