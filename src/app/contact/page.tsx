"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-bold text-school-maroon uppercase tracking-widest bg-school-maroon/10 px-3.5 py-1.5 rounded-full">
            සම්බන්ධ වන්න (Contact)
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900">
            පාසල් කාර්යාලය අමතන්න
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            ඇතුළත්වීම්, විභාග සහ සාමාන්‍ය විමසීම් සඳහා විදුහල් කාර්යාලය සමග සම්බන්ධ වන්න.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Details & Info */}
          <div className="lg:col-span-5 bg-school-maroon text-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-amber-200">කාර්යාලීය තොරතුරු</h2>
              <div className="space-y-4 text-sm text-amber-100/90">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-school-gold mt-1 flex-shrink-0" />
                  <div>
                    <strong className="block text-white">ලිපිනය:</strong>
                    විද්‍යාලය මාවත, ශ්‍රී ලංකා ජාතික පාසල.
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-school-gold flex-shrink-0" />
                  <div>
                    <strong className="block text-white">දුරකථන:</strong>
                    +94 11 234 5678 / +94 11 234 5679
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-school-gold flex-shrink-0" />
                  <div>
                    <strong className="block text-white">විද්‍යුත් තැපෑල:</strong>
                    office@collegesrilanka.sch.lk
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white/10 rounded-2xl text-xs text-amber-100 border border-white/15">
              ⏰ <strong>කාර්යාලීය වේලාවන්:</strong> සඳුදා සිට සිකුරාදා දක්වා පෙරවරු 7.30 සිට පස්වරු 1.30 දක්වා.
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto" />
                <h3 className="text-2xl font-bold text-slate-900">ස්තූතියි! ඔබේ පණිවිඩය ලැබුණි.</h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto">
                  අපගේ පරිපාලන කාර්යාලය විසින් හැකි ඉක්මනින් ඔබව සම්බන්ධ කර ගනු ඇත.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2.5 rounded-full bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
                >
                  තවත් පණිවිඩයක් එවන්න
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="text-xl font-bold text-slate-900">විමසීම් පෝරමය</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">ඔබේ නම</label>
                    <input
                      type="text"
                      required
                      placeholder="කමල් පෙරේරා"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-school-maroon/20 focus:border-school-maroon text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">දුරකථන අංකය</label>
                    <input
                      type="tel"
                      required
                      placeholder="07X XXXXXXX"
                      className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-school-maroon/20 focus:border-school-maroon text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">විද්‍යුත් තැපෑල (Email)</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-school-maroon/20 focus:border-school-maroon text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">විමසීමේ මාතෘකාව</label>
                  <select className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-school-maroon/20 focus:border-school-maroon text-sm">
                    <option>සාමාන්‍ය විමසීම් (General Inquiry)</option>
                    <option>සිසු ඇතුළත් කිරීම් (Student Admission)</option>
                    <option>විභාග සහතිකපත් (Certificates)</option>
                    <option>ආදි ශිෂ්‍ය සංගමය (Old Boys / Girls Union)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">පණිවිඩය</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="ඔබට අවශ්‍ය විස්තරය මෙහි සඳහන් කරන්න..."
                    className="w-full px-4 py-2.5 rounded-2xl border border-slate-300 focus:ring-2 focus:ring-school-maroon/20 focus:border-school-maroon text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-2xl bg-school-maroon hover:bg-school-maroonDark text-white font-bold text-sm shadow-lg shadow-school-maroon/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Send className="w-4 h-4" /> පණිවිඩය යවන්න
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}