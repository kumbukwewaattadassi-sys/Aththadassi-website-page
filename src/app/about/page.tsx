"use client";

import React from 'react';
import Link from 'next/link';
import { Target, Eye, Music, Shield, ArrowLeft, Award, Sparkles, BookOpen } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-20 md:pt-28 pb-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto space-y-10 sm:space-y-16">
        
        {/* Navigation Bar / Action Strip */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>මුල් පිටුවට</span>
          </Link>

          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full">
            ස්ථාපිත වර්ෂය: 1963
          </span>
        </div>

        {/* ── HEADER ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-100/80 border border-emerald-300 px-3.5 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>අප ගැන (About Us)</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            පු/කුඹුක්වැව අත්ථදස්සි <br />
            <span className="text-emerald-800">කනිෂ්ඨ විද්‍යාලයීය අභිමානය</span>
          </h1>

          <p className="text-slate-600 text-xs sm:text-base leading-relaxed">
            1963 ජනවාරි 02 වන දින ආරම්භ වූ අප විද්‍යාලය, දශක හයකට අධික කාලයක් පුරා &quot;මානිවතන අභික්කම&quot; යන උදාර ආදර්ශ පාඨය පෙරදැරි කරගෙන දැනුමෙන්, විනයෙන් හා සාරධර්මවලින් පිරිපුන් විශිෂ්ටතම පරපුරක් රටට දායාද කර ඇත.
          </p>
        </div>

        {/* ── QUICK STATS ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          {[
            { value: "1963", label: "ස්ථාපිත වර්ෂය", sub: "Founded" },
            { value: "200+", label: "සිසු ප්‍රජාව", sub: "Students" },
            { value: "26+", label: "ආචාර්ය මණ්ඩලය", sub: "Faculty" },
            { value: "98%", label: "සාමාර්ථ ප්‍රතිශතය", sub: "Pass Rate" },
          ].map((s, i) => (
            <div key={i} className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs text-center space-y-1">
              <p className="text-lg sm:text-2xl font-black text-emerald-900 leading-none">{s.value}</p>
              <p className="text-[11px] sm:text-xs font-bold text-slate-700">{s.label}</p>
              <p className="text-[9px] sm:text-[10px] text-slate-400 uppercase tracking-wider">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── VISION & MISSION CARDS (SIDE BY SIDE IN 1 ROW FOR BOTH MOBILE & PC) ── */}
        <div className="grid grid-cols-2 gap-2.5 sm:gap-6">
          
          {/* Vision Card */}
          <div className="p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#022c22] to-[#064e3b] text-white shadow-md border border-emerald-900 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center mb-2.5 sm:mb-4">
                <Eye className="w-4 h-4 sm:w-6 sm:h-6 text-amber-400" />
              </div>
              <span className="text-[9px] sm:text-xs font-bold tracking-wider uppercase text-amber-400/90 block mb-0.5 sm:mb-1">
                අපගේ දැක්ම
              </span>
              <h2 className="text-xs sm:text-2xl font-black mb-1 sm:mb-3 text-white">
                දැක්ම (Vision)
              </h2>
              <p className="text-emerald-100/90 text-[10px] sm:text-sm leading-relaxed font-normal">
                &quot;දැක්ම (Vision)&quot;
              </p>
            </div>
          </div>

          {/* Mission Card */}
          <div className="p-3.5 sm:p-8 rounded-2xl sm:rounded-3xl bg-white text-slate-900 shadow-sm border border-emerald-200/90 flex flex-col justify-between">
            <div>
              <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center mb-2.5 sm:mb-4">
                <Target className="w-4 h-4 sm:w-6 sm:h-6 text-emerald-800" />
              </div>
              <span className="text-[9px] sm:text-xs font-bold tracking-wider uppercase text-emerald-700 block mb-0.5 sm:mb-1">
                අපගේ මෙහෙවර
              </span>
              <h2 className="text-xs sm:text-2xl font-black mb-1 sm:mb-3 text-slate-900">
                මෙහෙවර (Mission)
              </h2>
              <p className="text-slate-600 text-[10px] sm:text-sm leading-relaxed font-normal">
                &quot;මෙහෙවර&quot;
              </p>
            </div>
          </div>

        </div>

        {/* ── SCHOOL CREST & ANTHEM SECTION ── */}
        <div className="bg-white rounded-3xl p-5 sm:p-10 border border-slate-200/90 shadow-sm space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Left: School Crest */}
            <div className="lg:col-span-5 flex flex-col items-center sm:flex-row lg:flex-col text-center sm:text-left lg:text-center gap-4 sm:gap-6 p-5 sm:p-6 rounded-2xl bg-emerald-50/50 border border-emerald-100">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-3 border-amber-400 bg-white p-1.5 shadow-md shrink-0 overflow-hidden flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/n911ylla/image/upload/q_auto/KRA70oqBWoSNJ4mtw41dxA1npgdd0kPA4dMmELMo34N0h6JCCR6B3JiV24oZEutt8AOccQs3_s160-c-k-c0x00ffffff-no-rj.jpg"
                  alt="Aththadassi K Vidyalaya Crest"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 text-emerald-900 font-bold text-[11px] sm:text-xs bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  <Shield className="w-3.5 h-3.5 text-amber-600" />
                  <span>විද්‍යාලයීය ලාංඡනය</span>
                </div>
                <h3 className="text-sm sm:text-lg font-black text-slate-900">
                  කුඹුක්වැව අත්ථදස්සි ලාංඡනය
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-500 font-medium">
                  &quot;මානිවතන අභික්කම&quot; (පසුනොබසින ඉදිරි ගමන)
                </p>
              </div>
            </div>

            {/* Right: School Anthem */}
            <div className="lg:col-span-7 bg-[#022c22] p-5 sm:p-8 rounded-2xl border border-emerald-900 text-white shadow-md space-y-3.5">
              <div className="flex items-center gap-3 border-b border-emerald-800/80 pb-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shrink-0">
                  <Music className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs sm:text-base">විද්‍යාලයීය ගීතය (School Anthem)</h4>
                  <span className="text-[9.5px] sm:text-xs text-emerald-300/80">අභිමානවත් විදුහල් ගීතය</span>
                </div>
              </div>
              
              <div className="p-3.5 sm:p-6 bg-[#011a14] rounded-xl text-xs sm:text-sm text-emerald-100 leading-loose text-center font-serif border border-emerald-800/50">
                &quot;අත්ථ දස්සි විදුහල් මව්‍ණි <br />
අපි වෙමු ඔබගේ දූ දරුවෝ......//<br /><br />

අවිදු අඳුර නිවා දැමූ <br />
ඥානා ලෝකය පහන දැවූ <br />
නිසි මග අප හට පෙන්වා දුන් <br />
අපි වෙමු ඔබගේ දූ දරුවො......//<br /><br />

ශිල්ප සතර නිසි දැන ගනු රිසියෙන් <br />
මුළු මිහි තලයම පවතීවා <br />
ඔබව සොයා ඒයී පරපුර සැමදා <br />
එ අපගේ ජිවය ඔබ වේ <br /><br />

කිතුගොස දයාව ලොවට පෙවූ<br />
ප්‍රාණ වායුවයි ඔබ අපගෙ......//<br />
ගැති වෙමු අපි ඔබ හට සැමදා<br />
හද බැතියෙන් නමදිමු සැමදා.......//&quot;
              </div>

              <div className="flex items-center justify-between text-[9.5px] sm:text-[10px] text-amber-400 font-semibold pt-1">
                <span>පු/කුඹුක්වැව අත්ථදස්සි කනිෂ්ඨ විද්‍යාලය</span>
                <span className="font-mono">EST. 1963</span>
              </div>
            </div>

          </div>
        </div>

        {/* ── CORE PILLARS ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {[
            {
              icon: <BookOpen className="w-5 h-5 text-emerald-700" />,
              title: "අධ්‍යාපනික විශිෂ්ටත්වය",
              desc: "පළපුරුදු ආචාර්ය මණ්ඩලය යටතේ විෂය නිර්දේශය සහ නවීන දැනුම සිසුන්ට ලබාදීම.",
            },
            {
              icon: <Award className="w-5 h-5 text-amber-600" />,
              title: "විනය සහ නායකත්වය",
              desc: "ශිෂ්‍ය නායක මණ්ඩලය හා බාලදක්ෂ ව්‍යාපාරය තුළින් නායකත්ව ගුණාංග ප්‍රගුණ කිරීම.",
            },
            {
              icon: <Sparkles className="w-5 h-5 text-emerald-700" />,
              title: "සමගාමී කුසලතා",
              desc: "ක්‍රීඩා, මාධ්‍ය ඒකකය, තොරතුරු තාක්ෂණය හා සංගම් තුළින් සහජ දක්ෂතා ඔප්නැංවීම.",
            },
          ].map((p, i) => (
            <div key={i} className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-2xs space-y-1.5">
              <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                {p.icon}
              </div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-900">{p.title}</h3>
              <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}