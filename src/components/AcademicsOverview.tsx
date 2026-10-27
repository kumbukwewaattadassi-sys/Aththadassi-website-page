"use client";

import React from 'react';
import { Microscope, Calculator, Briefcase, Palette, Cpu, BookOpen, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AcademicsOverview() {
  const streams = [
    {
      title: "භෞතික විද්‍යා (Physical Science / Maths)",
      desc: "සංයුක්ත ගණිතය, භෞතික විද්‍යාව සහ රසායන විද්‍යාව හෝ තොරතුරු තාක්ෂණය ඔස්සේ ඉංජිනේරු ක්ෂේත්‍රයට පාර.",
      icon: Calculator,
      accent: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "ජෛව විද්‍යා (Biological Science)",
      desc: "ජීව විද්‍යාව, රසායන විද්‍යාව, භෞතික විද්‍යාව සහ කෘෂි විද්‍යාව සමගින් වෛද්‍ය හා පර්යේෂණ ක්ෂේත්‍රයට.",
      icon: Microscope,
      accent: "bg-emerald-50 text-[#065F46] border-emerald-200",
    },
    {
      title: "වාණිජ අංශය (Commerce Stream)",
      desc: "ගිණුම්කරණය, ව්‍යාපාර අධ්‍යයනය, ආර්ථික විද්‍යාව සමගින් මූල්‍ය හා කළමනාකරණ ලෝකය ජය ගන්න.",
      icon: Briefcase,
      accent: "bg-amber-50 text-amber-700 border-amber-200",
    },
    {
      title: "තාක්ෂණවේදය (Technology Stream)",
      desc: "ඉංජිනේරු තාක්ෂණවේදය (ET), ජෛව පද්ධති තාක්ෂණවේදය (BST) සහ තාක්ෂණය සඳහා විද්‍යාව (SFT).",
      icon: Cpu,
      accent: "bg-teal-50 text-teal-700 border-teal-200",
    },
    {
      title: "කලා අංශය (Arts Stream)",
      desc: "භාෂා, සෞන්දර්ය විෂයයන්, දේශපාලන විද්‍යාව සහ ඉතිහාසය ඔස්සේ සමාජයීය විද්‍යා ක්ෂේත්‍රයට.",
      icon: Palette,
      accent: "bg-rose-50 text-rose-700 border-rose-200",
    },
    {
      title: "ප්‍රාථමික & ද්විතීයික (Primary & Secondary)",
      desc: "1 ශ්‍රේණියේ සිට 11 ශ්‍රේණිය (O/L) දක්වා වූ ශක්තිමත් පදනම සහ ශිෂ්‍යත්ව විභාග සූදානම.",
      icon: BookOpen,
      accent: "bg-slate-50 text-slate-700 border-slate-200",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-extrabold text-[#065F46] uppercase tracking-widest bg-emerald-100 px-3.5 py-1.5 rounded-full">
            අධ්‍යයන අංශ (Academics)
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
            විෂය ධාරා සහ අධ්‍යාපනික වැඩසටහන්
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            සෑම සිසුවෙකුගේම දක්ෂතා සහ අනාගත ඉලක්ක සපුරා ගැනීම සඳහා පුළුල් පරාසයක විහිදුණු විෂය නිර්දේශ.
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {streams.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group relative bg-[#F8FAFC] hover:bg-white rounded-3xl p-7 border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-5 border ${item.accent}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-[#065F46] transition-colors mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500 group-hover:text-[#065F46]">
                  <span>විෂය නිර්දේශය බලන්න</span>
                  <ArrowUpRight className="w-4 h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}