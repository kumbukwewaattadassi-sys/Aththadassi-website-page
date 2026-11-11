"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2, Loader2, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: 'සාමාන්‍ය විමසීම් (General Inquiry)',
    message: ''
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);

    try {
      const { error } = await supabase
        .from('contact_messages')
        .insert([formData]);

      if (error) throw error;

      setSubmitted(true);
      setFormData({
        name: '',
        phone: '',
        email: '',
        subject: 'සාමාන්‍ය විමසීම් (General Inquiry)',
        message: ''
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'පණිවිඩය යැවීමට නොහැකි විය. කරුණාකර නැවත උත්සාහ කරන්න.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Navbar එකට යට නොවීමට pt-28 md:pt-36 Spacing
    <div className="min-h-screen bg-slate-50 pt-28 md:pt-36 pb-20 font-sans">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-[10px] sm:text-xs font-bold text-[#800000] uppercase tracking-widest bg-red-100 px-3 py-1 rounded-full border border-red-200">
            සම්බන්ධ වන්න (Contact)
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
            පාසල් කාර්යාලය අමතන්න
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm">
            ඇතුළත්වීම්, විභාග සහ සාමාන්‍ය විමසීම් සඳහා පණිවිඩයක් එවන්න හෝ කාර්යාලය අමතන්න.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ── 1. කාර්යාලීය තොරතුරු (පෙර පරිදිම රතු පාටින් - SCHOOL MAROON) ── */}
          <div className="lg:col-span-5 bg-[#800000] text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-6">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-amber-200 border-b border-white/15 pb-2">
                කාර්යාලීය තොරතුරු
              </h2>

              <div className="space-y-4 text-xs sm:text-sm text-amber-100/90 mt-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/10 text-amber-300 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white">ලිපිනය:</strong>
                    කුඹුක්වැව, කුඹුක්කල්ල, පුත්තලම.
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/10 text-amber-300 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-white">දුරකථන:</strong>
                    032 226 7320
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-white/10 text-amber-300 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <strong className="block text-white">විද්‍යුත් තැපෑල:</strong>
                    <span className="truncate block">Kumbukwewaattadassi@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-black/20 rounded-2xl text-xs text-amber-100 border border-white/10 flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <span>
                <strong>කාර්යාලීය වේලාවන්:</strong> සඳුදා – සිකුරාදා (පෙ.ව. 7.30 සිට ප.ව. 1.30 දක්වා)
              </span>
            </div>
          </div>

          {/* ── 2. විමසීම් පෝරමය (LIGHT GREEN / SOFT MINT THEME) ── */}
          <div className="lg:col-span-7 bg-emerald-50/70 p-6 sm:p-8 rounded-3xl border border-emerald-200/80 shadow-xs">
            {submitted ? (
              <div className="py-12 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <h3 className="text-lg font-black text-slate-900">ස්තූතියි! ඔබේ පණිවිඩය ලැබුණි.</h3>
                <p className="text-slate-600 text-xs max-w-sm mx-auto">
                  අපගේ පරිපාලන කාර්යාලය විසින් හැකි ඉක්මනින් ඔබව සම්බන්ධ කර ගනු ඇත.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-bold transition-all shadow-xs"
                >
                  තවත් පණිවිඩයක් එවන්න
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border-b border-emerald-200/60 pb-2.5">
                  <h3 className="text-sm sm:text-base font-black text-emerald-950">විමසීම් පෝරමය</h3>
                  <p className="text-emerald-800/80 text-[11px]">පහත තොරතුරු පුරවා ඔබේ පණිවිඩය අප වෙත යොමු කරන්න.</p>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-red-100 text-red-800 text-xs rounded-xl border border-red-200">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">ඔබේ නම *</label>
                    <input
                      type="text"
                      required
                      placeholder="කමල් පෙරේරා"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden text-xs sm:text-sm text-slate-900 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-emerald-950 mb-1">දුරකථන අංකය *</label>
                    <input
                      type="tel"
                      required
                      placeholder="07X XXXXXXX"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden text-xs sm:text-sm text-slate-900 shadow-2xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">විද්‍යුත් තැපෑල (Email) *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden text-xs sm:text-sm text-slate-900 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">විමසීමේ මාතෘකාව *</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden text-xs sm:text-sm text-slate-900 shadow-2xs"
                  >
                    <option value="සාමාන්‍ය විමසීම් (General Inquiry)">සාමාන්‍ය විමසීම් (General Inquiry)</option>
                    <option value="සිසු ඇතුළත් කිරීම් (Student Admission)">සිසු ඇතුළත් කිරීම් (Student Admission)</option>
                    <option value="විභාග සහතිකපත් (Certificates)">විභාග සහතිකපත් (Certificates)</option>
                    <option value="ආදි ශිෂ්‍ය සංගමය (Old Boys / Girls Union)">ආදි ශිෂ්‍ය සංගමය (Old Boys / Girls Union)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-emerald-950 mb-1">පණිවිඩය *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="ඔබට අවශ්‍ය විස්තරය මෙහි සඳහන් කරන්න..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-emerald-200 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden text-xs sm:text-sm text-slate-900 leading-relaxed shadow-2xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-700/20 active:scale-[0.99] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>පණිවිඩය යවමින් පවතී...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>පණිවිඩය යවන්න</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}