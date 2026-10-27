"use client";

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, Share2, Tag } from 'lucide-react';

export default function SingleArticlePage({ params }: { params: { id: string } }) {
  return (
    <article className="py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Back navigation */}
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-school-maroon transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> සියලු පුවත් වෙත ආපසු
        </Link>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-school-maroon/10 text-school-maroon uppercase">
              School Sports
            </span>
            <span className="text-xs text-slate-400">• 2026 මාර්තු 15</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-snug">
            වාර්ෂික මහා ක්‍රිකට් සංග්‍රාමය (Big Match) උත්සවාකාරයෙන් ඇරඹේ
          </h1>

          <div className="flex items-center justify-between py-4 border-y border-slate-200 text-xs sm:text-sm text-slate-500">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-school-maroon text-white flex items-center justify-center font-bold text-xs">
                MU
              </div>
              <span>School Media Unit මගින් වාර්තා කරන ලදී</span>
            </div>
            <button className="flex items-center gap-1.5 text-slate-600 hover:text-school-maroon">
              <Share2 className="w-4 h-4" /> Share
            </button>
          </div>
        </div>

        {/* Feature Image Frame */}
        <div className="w-full h-80 sm:h-96 rounded-[2.5rem] bg-gradient-to-tr from-slate-800 to-slate-900 flex items-center justify-center relative overflow-hidden shadow-xl border border-slate-200">
          <div className="text-center p-6 text-white space-y-2">
            <div className="text-4xl">🏏</div>
            <p className="font-semibold text-lg">Big Match 2026 Official Banner</p>
            <p className="text-xs text-slate-400">Match Day: R. Premadasa International Cricket Stadium</p>
          </div>
        </div>

        {/* Article Body Content */}
        <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 text-base">
          <p>
            දෙවිදුහල් අතර වසර 45 කට අධික කාලයක් මුළුල්ලේ නොබිඳුණු සහෝදරත්වයෙන් සහ ක්‍රීඩාශීලී උද්යෝගයෙන් පවත්වනු ලබන වාර්ෂික මහා ක්‍රිකට් සංග්‍රාමයේ මෙවර අදියර ලබන සති අන්තයේදී අති උත්කර්ෂවත් අන්දමින් පැවැත්වීමට සියලු කටයුතු සූදානම් කර ඇත.
          </p>
          <p>
            විද්‍යාලයීය ක්‍රීඩා සංචිතය මෙහෙයවනු ලබන්නේ ප්‍රවීණ පුහුණුකරු මඩුල්ලකගේ මගපෙන්වීම යටතේ වන අතර, මෙවර කණ්ඩායමේ නායකත්වය දරනු ලබන්නේ සමස්ත ලංකා පාසල් මට්ටමේ දක්ෂතා දැක්වූ අංක එකේ තුන් ඉරියව් ක්‍රීඩකයා විසිනි.
          </p>

          <blockquote className="p-4 my-6 border-l-4 border-school-maroon bg-slate-100 rounded-r-2xl italic text-slate-800 font-medium">
            &quot;ජය පරාජය කුමක් වුවත් විනය හා ක්‍රීඩාශීලිත්වය අප විද්‍යාලයේ අංක එකේ ගුණාංගයයි.&quot;
          </blockquote>

          <h3 className="text-xl font-bold text-slate-900 pt-4">තරග විස්තර සහ සජීවී විකාශය</h3>
          <p>
            තරගයේ සියලුම සජීවී තොරතුරු සහ ලකුණු තත්ත්වයන් විද්‍යාලයීය මාධ්‍ය ඒකකය (Media Unit) ඔස්සේ YouTube සහ නිල Facebook පිටුව හරහා සජීවීව විකාශය කෙරේ.
          </p>
        </div>

      </div>
    </article>
  );
}