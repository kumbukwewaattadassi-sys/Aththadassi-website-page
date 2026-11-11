"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  GraduationCap, 
  FileText, 
  CheckCircle2, 
  Download, 
  PhoneCall, 
  Mail, 
  Clock, 
  AlertCircle,
  ArrowRight,
  Lock,
  CalendarCheck,
  Loader2
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface AdmissionSettings {
  is_open: boolean;
  academic_year: string;
  notice_title: string;
  notice_description: string;
  expected_open_date: string;
  grade1_pdf_url?: string;
  grade6_pdf_url?: string;
}

export default function AdmissionsPage() {
  const [settings, setSettings] = useState<AdmissionSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdmissionSettings() {
      try {
        const { data, error } = await supabase
          .from('admission_settings')
          .select('*')
          .eq('id', 'current_admission')
          .maybeSingle();

        if (data) {
          setSettings(data);
        } else {
          // Default: ජනවාරි තෙක් වසා ඇති ආකාරය (Closed State)
          setSettings({
            is_open: false,
            academic_year: '2027',
            notice_title: 'නව සිසුන් ඇතුළත් කරගැනීම තවමත් ආරම්භ කර නොමැත',
            notice_description: '1 සහ 6 ශ්‍රේණි සඳහා සිසුන් ඇතුළත් කරගැනීමේ අයදුම්පත් ඉදිරි ජනවාරි මාසයේදී අධ්‍යාපන අමාත්‍යාංශයේ චක්‍රලේඛ අනුව විවෘත වේ.',
            expected_open_date: '2027 ජනවාරි මස මුල් සතියේදී'
          });
        }
      } catch (err) {
        console.error("Admissions fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdmissionSettings();
  }, []);

  const requirements = [
    "දරුවාගේ උප්පැන්න සහතිකයේ මුල් පිටපත සහ ඡායා පිටපතක්",
    "මව්පියන්ගේ / භාරකරුගේ ජාතික හැඳුනුම්පත් ඡායා පිටපත්",
    "පදිංචිය තහවුරු කිරීම සඳහා ග්‍රාම නිලධාරී සහතිකය (පසුගිය මාස 6 තුළ)",
    "ඡන්ද හිමි නාමලේඛන උපුටා ගැනීම් (පසුගිය වසර 5 සඳහා)",
    "දරුවාගේ සායනික සටහන් පොත (ප්‍රතිශක්තිකරණ වාර්තා සහිතව)",
    "අතරමැදි ශ්‍රේණි (6 ශ්‍රේණිය) සඳහා: පෙර පාසලේ හෝ ප්‍රාථමික අංශයේ නිදහස් කිරීමේ සහතිකය"
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-32 pb-16 flex items-center justify-center font-sans">
        <div className="flex items-center gap-2 text-emerald-800">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm font-medium">ඇතුළත් කිරීම් තොරතුරු පරීක්ෂා කරමින් පවතී...</span>
        </div>
      </div>
    );
  }

  const isOpen = settings?.is_open ?? false;

  return (
    <div className="min-h-screen bg-slate-50 pt-24 md:pt-32 pb-16 font-sans">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 space-y-8 md:space-y-12">
        
        {/* ── 1. Page Header ── */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#065F46] text-xs font-bold uppercase tracking-wider">
            <GraduationCap className="w-4 h-4" />
            Admissions {settings?.academic_year || '2027'}
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            පාසලට සිසුන් ඇතුළත් කිරීම්
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
            පු/කුඹුක්වැව අත්ථදස්සි කනිෂ්ඨ විද්‍යාලයේ 1 ශ්‍රේණිය සහ 6 ශ්‍රේණිය සඳහා සිසුන් ඇතුළත් කිරීමේ නිල තොරතුරු පුවරුව.
          </p>
        </div>

        {/* ── 2. STATUS BANNER (CLOSED / OPEN) ── */}
        {!isOpen ? (
          /* [A] ජනවාරි තෙක් වසා ඇති විට පෙන්වන NOTICE CARD */
          <div className="bg-gradient-to-br from-slate-900 via-[#031d14] to-slate-950 border border-emerald-500/30 rounded-3xl p-6 sm:p-10 text-white shadow-xl text-center max-w-3xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-400/50 text-amber-400 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                Notice • ඉදිරි වාරය සඳහා
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-white">
                {settings?.notice_title}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
                {settings?.notice_description}
              </p>
            </div>

            {/* විවෘත වන දිනය */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-amber-300 text-xs sm:text-sm font-bold">
              <CalendarCheck className="w-4 h-4 text-emerald-400" />
              <span>නැවත විවෘත වන අපේක්ෂිත කාලය: {settings?.expected_open_date}</span>
            </div>
          </div>
        ) : (
          /* [B] ඇතුළත් කිරීම් විවෘත වූ විට පෙන්වන ALERT BANNER */
          <div className="bg-emerald-500/15 border-2 border-emerald-500/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600 text-white shrink-0">
                <CheckCircle2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                  Active Now
                </span>
                <h4 className="text-xs sm:text-sm font-black text-slate-900 mt-0.5">
                  1 ශ්‍රේණිය සහ 6 ශ්‍රේණිය සඳහා අයදුම්පත් භාරගැනීම දැන් විවෘතයි!
                </h4>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                  පහතින් නිල අයදුම්පත් PDF බාගත කර සම්පූර්ණ කර පාසල් කාර්යාලය වෙත භාරදෙන්න.
                </p>
              </div>
            </div>
            <a
              href="#download-section"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#065F46] hover:bg-[#047857] text-white text-xs font-bold shrink-0 transition-all shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>අයදුම්පත් බාගත කරගන්න</span>
            </a>
          </div>
        )}

        {/* ── 3. DOWNLOAD SECTION (ADMIN PANEL එකෙන් UPLOAD කරන PDF LINKS) ── */}
        <div id="download-section" className="bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#065F46]" />
                නිල අයදුම්පත් (Official Admission Forms)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {isOpen 
                  ? 'අවශ්‍ය අයදුම්පත තෝරා PDF ආකාරයෙන් බාගත කරගන්න.' 
                  : 'ඇතුළත් කිරීම් විවෘත වූ පසු මෙතැනින් නවතම අයදුම්පත් බාගත කරගත හැක.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* 1 ශ්‍රේණිය අයදුම්පත */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[9.5px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md uppercase">
                  Grade 01 Admission
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1.5">
                  1 ශ්‍රේණිය සඳහා සිසුන් ඇතුළත් කිරීමේ අයදුම්පත
                </h4>
                <p className="text-slate-500 text-xs mt-1">
                  වයස අවුරුදු 5 සපිරෙන දරුවන් ප්‍රාථමික අංශයට ඇතුළත් කිරීම සඳහා වූ නිල ආකෘති පත්‍රය.
                </p>
              </div>

              {isOpen && settings?.grade1_pdf_url ? (
                <a
                  href={settings.grade1_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#065F46] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>1 ශ්‍රේණිය අයදුම්පත (PDF බාගත කරන්න)</span>
                </a>
              ) : (
                <button
                  disabled
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold cursor-not-allowed"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>තවමත් විවෘත කර නොමැත</span>
                </button>
              )}
            </div>

            {/* 6 ශ්‍රේණිය / අතරමැදි ශ්‍රේණි අයදුම්පත */}
            <div className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50 flex flex-col justify-between space-y-3">
              <div>
                <span className="text-[9.5px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md uppercase">
                  Grade 06 & Intermediate
                </span>
                <h4 className="text-sm sm:text-base font-bold text-slate-900 mt-1.5">
                  6 ශ්‍රේණිය (ශිෂ්‍යත්ව පාදක) සහ අතරමැදි ඇතුළත් කිරීම්
                </h4>
                <p className="text-slate-500 text-xs mt-1">
                  5 ශ්‍රේණිය ශිෂ්‍යත්ව විභාගයෙන් පසු හෝ අතරමැදි ශ්‍රේණි සඳහා අයදුම් කරන ආකෘති පත්‍රය.
                </p>
              </div>

              {isOpen && settings?.grade6_pdf_url ? (
                <a
                  href={settings.grade6_pdf_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#065F46] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-xs"
                >
                  <Download className="w-4 h-4" />
                  <span>6 ශ්‍රේණිය අයදුම්පත (PDF බාගත කරන්න)</span>
                </a>
              ) : (
                <button
                  disabled
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-200 text-slate-400 text-xs font-bold cursor-not-allowed"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>තවමත් විවෘත කර නොමැත</span>
                </button>
              )}
            </div>

          </div>
        </div>

        {/* ── 4. Required Documents Section (නිතරම දෙමාපියන්ට බලා සූදානම් වීමට) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base sm:text-lg border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-[#065F46]" />
              <span>අවශ්‍ය ප්‍රධාන ලියකියවිලි (කල්තියා සූදානම් කරගත යුතු දෑ)</span>
            </div>
            <ul className="space-y-2.5">
              {requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* School Office Info */}
          <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 via-[#021811] to-slate-950 text-white rounded-3xl p-5 sm:p-7 border border-emerald-500/30 shadow-md space-y-5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                School Administration
              </span>
              <h3 className="text-base sm:text-lg font-black text-white">
                ප්‍රවේශ අංශය සහ කාර්යාල වේලාවන්
              </h3>
            </div>

            <div className="space-y-3 text-xs sm:text-[13px] text-slate-300">
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>සඳුදා - සිකුරාදා: පෙ.ව. 8.00 - ප.ව. 2.00</span>
              </div>
              <div className="flex items-center gap-3">
                <PhoneCall className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>පාසල් දුරකථන අංකය: (කාර්යාලීය වේලාවන්හිදී)</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>විද්‍යුත් තැපෑල: aththadassikv@gmail.com</span>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-xs"
              >
                <span>සම්පූර්ණ ලිපිනය සහ විමසීම්</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}