"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { History, Target, Eye, Music, Shield, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-school-maroon uppercase tracking-widest bg-school-maroon/10 px-3.5 py-1.5 rounded-full">
            අප ගැන (About Us)
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
            අභිමානවත් විද්‍යාලයීය ඉතිහාසය
          </h1>
          <p className="text-slate-600 text-base">
            1948 නිදහස සමගින් ආරම්භ වූ අප විද්‍යාලය, ශ්‍රී ලංකාවේ ප්‍රමුඛ පෙළේ විද්වතුන්, වෛද්‍යවරුන්, ඉංජිනේරුවන් සහ ජාතික නායකයින් රැසක් බිහිකර ඇත.
          </p>
        </div>

        {/* Vision & Mission Cards with curved styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-school-maroon to-school-maroonDark text-white shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
              <Eye className="w-6 h-6 text-school-gold" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-amber-200">දැක්ම (Vision)</h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
              &quot;නූතන ලෝකයේ අභියෝගයන්ට සාර්ථකව මුහුණ දිය හැකි, සදාචාරාත්මක හා බුද්ධිමය වශයෙන් පිරිපුන් ගෝලීය ශ්‍රී ලාංකික පුරවැසියන් බිහිකිරීම.&quot;
            </p>
          </div>

          <div className="p-8 sm:p-10 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
              <Target className="w-6 h-6 text-school-gold" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-amber-200">මෙහෙවර (Mission)</h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              &quot;ගුණාත්මක අධ්‍යාපනය, නවීන තාක්ෂණය, ක්‍රීඩාව සහ විෂය සමගාමී ක්‍රියාකාරකම් තුළින් සිසු කුසලතා ඉහළම තලයට ඔසවා තැබීම.&quot;
            </p>
          </div>
        </div>

        {/* School Crest & Anthem Section */}
        <div className="bg-slate-50 rounded-[2.5rem] p-8 sm:p-12 border border-slate-200">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            {/* School Crest */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 text-school-maroon font-bold text-sm">
                <Shield className="w-5 h-5 text-school-gold" />
                <span>විද්‍යාලයීය ලාංඡනය (School Crest)</span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">ලාංඡනයේ අර්ථය</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                ලාංඡනයේ ඇති පහනෙන් ප්‍රඥාවත්, පුස්කොළ පොතෙන් සාම්ප්‍රදායික හා නූතන අධ්‍යාපනයත්, නෙළුම් මලෙන් පවිත්‍රත්වය හා විනයත් සංකේතවත් කෙරේ. පාසල් වර්ණ වන මෙරූන් සහ රන්වන් පැහැයෙන් අභිමානය හා දීප්තිය විදහා දැක්වේ.
              </p>
            </div>

            {/* School Anthem */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-md">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-school-maroon">
                  <Music className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-base">පාසල් ගීතය (School Anthem)</h4>
                  <span className="text-xs text-slate-400">නිල තනු නිර්මාණය හා පද රචනය</span>
                </div>
              </div>
              
              <div className="p-4 bg-slate-50 rounded-2xl text-xs sm:text-sm text-slate-700 italic leading-loose text-center font-serif border border-slate-100">
                &quot;සිරිලක දිනවන විදුහල් මවුනි... <br />
                නැණ ගුණ වඩනා සුපසන් භූමි... <br />
                විද්‍යා ජය මාවත පාදා දෙන... <br />
                ඔබ පාමුල අපි බැතියෙන් වැඳෙමු...&quot;
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}