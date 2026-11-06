"use client";

import React from 'react';
import { Camera, Globe, Shield, Trophy, Activity, Music } from 'lucide-react';

export default function ClubsAndSocieties() {
  const clubs = [
    { 
      name: "මාධ්‍ය ඒකකය (Media Unit)", 
      desc: "පාසල් මාධ්‍ය ජාලය, සජීවී විකාශන සහ ඡායාරූපකරණය.", 
      icon: Camera 
    },
    { 
      name: "තොරතුරු තාක්ෂණ සංගමය (IT Club)", 
      desc: "වෙබ් සංවර්ධනය, Coding, AI සහ Graphic Design පුහුණුව.", 
      icon: Globe 
    },
    { 
      name: "ශිෂ්‍ය නායක මණ්ඩලය (Prefects' Guild)", 
      desc: "නායකත්වය, විනය සහ පාසල් කළමනාකරණ කාර්යයන්.", 
      icon: Shield 
    },
     
     
  ];

  return (
    <section className="py-10 md:py-20 bg-white relative overflow-hidden transform-gpu">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14 space-y-2 md:space-y-3">
          <span className="text-[10px] md:text-xs font-black text-[#065F46] uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full inline-block">
            ශිෂ්‍ය ජීවිතය (Student Life)
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            ක්‍රීඩා සහ ශිෂ්‍ය සංගම්
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto">
            පන්ති කාමරයෙන් ඔබ්බට ගිය පෞරුෂ සංවර්ධනය සහ කුසලතා ඔප්නංවන විෂය සමගාමී ක්‍රියාකාරකම්.
          </p>
        </div>

        {/* 
          Lag-Free Responsive Grid:
          - Mobile: Clean flat cards without heavy GPU gradients
          - Desktop: Elegant multi-column grid
        */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-6">
          {clubs.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="p-4 sm:p-6 rounded-2xl sm:rounded-[2rem] bg-slate-50 border border-slate-200/90 hover:border-emerald-300 hover:bg-white hover:shadow-md transition-all duration-200 flex items-start gap-3.5 sm:gap-4 transform-gpu"
              >
                {/* Icon Frame */}
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#065F46] text-[#F59E0B] flex items-center justify-center shrink-0 shadow-xs">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {/* Club Details */}
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-slate-900 text-xs sm:text-base leading-snug mb-0.5 truncate">
                    {c.name}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed font-normal">
                    {c.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}