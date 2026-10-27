"use client";

import React from 'react';
import { Camera, Radio, Globe, Shield, Trophy, Activity } from 'lucide-react';

export default function ClubsAndSocieties() {
  const clubs = [
    { name: "මාධ්‍ය ඒකකය (Media Unit)", desc: "පාසල් මාධ්‍ය ජාලය, සජීවී විකාශන සහ ඡායාරූපකරණය.", icon: Camera },
    { name: "තොරතුරු තාක්ෂණ සංගමය (IT Club)", desc: "වෙබ් සංවර්ධනය, Coding, AI සහ Graphic Design පුහුණුව.", icon: Globe },
    { name: "ශිෂ්‍ය නායක මණ්ඩලය (Prefects' Guild)", desc: "නායකත්වය, විනය සහ පාසල් කළමනාකරණ කාර්යයන්.", icon: Shield },
    { name: "ක්‍රිකට් සංචිතය (School Cricket Team)", desc: "13 න්, 15 න්, 17 න් සහ 19 න් පහළ සමස්ත ලංකා තරගාවලි.", icon: Trophy },
    { name: "බාලදක්ෂ ව්‍යාපාරය (Scout Troop)", desc: "කඳවුරු බැඳීම, ප්‍රථමාධාර සහ සමාජ සේවා වැඩසටහන්.", icon: Activity },
    { name: "ගුවන්විදුලි සංගමය (Radio Club)", desc: "දෛනික පාසල් ගුවන්විදුලි විකාශනය සහ නිවේදන කටයුතු.", icon: Radio },
  ];

  return (
    <section className="py-16 md:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold text-[#065F46] uppercase tracking-widest bg-emerald-100 px-3.5 py-1.5 rounded-full">
            ශිෂ්‍ය ජීවිතය (Student Life)
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            ක්‍රීඩා සහ ශිෂ්‍ය සංගම්
          </h2>
          <p className="text-slate-600 text-sm">
            පන්ති කාමරයෙන් ඔබ්බට ගිය පෞරුෂ සංවර්ධනය සහ කුසලතා ඔප්නංවන විෂය සමගාමී ක්‍රියාකාරකම්.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-[2rem] bg-gradient-to-br from-slate-50 to-emerald-50/30 border border-slate-200 hover:border-emerald-300 hover:bg-white transition-all shadow-xs hover:shadow-lg flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#065F46] text-[#F59E0B] flex items-center justify-center shrink-0 shadow-md">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base mb-1">{c.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}