"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, User, Share2, Tag, Loader2, Check } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface ArticleData {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  image_url?: string;
  description: string;
  full_content?: string;
}

export default function SingleArticlePage() {
  const params = useParams();
  const id = params?.id as string;

  const [article, setArticle] = useState<ArticleData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchArticle() {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error("Error fetching single article:", error.message);
        } else if (data) {
          setArticle(data);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      if (navigator.share) {
        navigator.share({
          title: article?.title,
          text: article?.description,
          url: window.location.href,
        }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-emerald-800">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm font-semibold">පුවත් විස්තරය ලබා ගනිමින් පවතී...</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="py-20 max-w-xl mx-auto px-4 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">පුවත හමු නොවීය</h2>
        <p className="text-slate-500 text-sm">ඔබ සොයන පුවත මකා දමා හෝ වැරදි ලිපිනයකි.</p>
        <Link
          href="/news"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#065F46] text-white text-xs font-bold hover:bg-[#022c22] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> සියලු පුවත් වෙත
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-slate-50 py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back navigation */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-[#065F46] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> සියලු පුවත් වෙත ආපසු
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-[#065F46] uppercase tracking-wide">
              {article.category || 'School News'}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-[#F59E0B]" />
              {article.date}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-snug">
            {article.title}
          </h1>

          <div className="flex items-center justify-between py-4 border-y border-slate-200 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#065F46] text-amber-300 flex items-center justify-center font-bold text-xs shadow-sm">
                <User className="w-4 h-4" />
              </div>
              <span className="font-medium text-slate-700">{article.author || 'School Media Unit'} මගින් වාර්තා කරන ලදී</span>
            </div>
            
            <button 
              onClick={handleShare}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-emerald-50 hover:text-[#065F46] hover:border-emerald-300 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              {copied ? 'Link Copied!' : 'Share'}
            </button>
          </div>
        </div>

        {/* Feature Image Frame */}
        {article.image_url ? (
          <div className="w-full h-72 sm:h-[420px] rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-200 bg-slate-900 relative">
            <img
              src={article.image_url}
              alt={article.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-full h-64 rounded-[2rem] bg-gradient-to-tr from-[#022c22] to-[#065F46] flex items-center justify-center text-white shadow-md">
            <p className="font-bold text-lg text-emerald-100">{article.title}</p>
          </div>
        )}

        {/* Article Body Content */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-sm space-y-6 text-slate-700 leading-relaxed text-sm sm:text-base">
          <p className="text-base sm:text-lg font-medium text-slate-900 border-l-4 border-[#F59E0B] pl-4 py-1 bg-amber-50/40 rounded-r-xl">
            {article.description}
          </p>

          {article.full_content && (
            <div className="space-y-4 pt-2">
              <p>{article.full_content}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Aththadassi K Vidyalaya • Official Notice</span>
            <span className="font-mono">{article.date}</span>
          </div>
        </div>

      </div>
    </article>
  );
}