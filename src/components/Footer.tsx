"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Lock, X } from 'lucide-react';

interface FooterProps {
  crestUrl?: string;
}

export default function Footer({ 
  crestUrl = "https://res.cloudinary.com/n911ylla/image/upload/q_auto/KRA70oqBWoSNJ4mtw41dxA1npgdd0kPA4dMmELMo34N0h6JCCR6B3JiV24oZEutt8AOccQs3_s160-c-k-c0x00ffffff-no-rj.jpg" 
}: FooterProps) {
  const router = useRouter();
  const [tapCount, setTapCount] = useState(0);
  const [showPinModal, setShowPinModal] = useState(false);
  const [secretPin, setSecretPin] = useState('');
  const [errorMsg, setErrorMsg] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Logo එක මත Clicks හෝ Touches 5ක් එක දිගට සිදු වූ විට ක්‍රියාත්මක වේ
  const handleSecretTouch = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    const currentCount = tapCount + 1;

    if (currentCount >= 5) {
      setShowPinModal(true);
      setTapCount(0);
    } else {
      setTapCount(currentCount);

      // තත්පර 2.5ක් ඇතුළත ඊළඟ touch එක නොලැබුණහොත් count එක reset වේ
      timerRef.current = setTimeout(() => {
        setTapCount(0);
      }, 2500);
    }
  };

  // Password එක තහවුරු කිරීම
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (secretPin === process.env.NEXT_PUBLIC_ADMIN_PIN) {
      setShowPinModal(false);
      setSecretPin('');
      setErrorMsg(false);
      router.push('/admin'); // Admin Panel එකට යොමු කෙරේ
    } else {
      setErrorMsg(true);
      setSecretPin('');
    }
  };

  return (
    <footer className="w-full bg-[#022c22] text-emerald-100 py-10 px-4 sm:px-6 border-t border-emerald-900/80 relative">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        
        {/* Circle එකක් තුළ සම්පූර්ණයෙන්ම Fit වූ Logo එක (රහස් 5-Tap Trigger) */}
        <div className="mb-6 flex justify-center">
          <div 
            onClick={handleSecretTouch}
            onTouchStart={handleSecretTouch}
            role="button"
            tabIndex={0}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-amber-400/80 p-1.5 bg-emerald-950/70 shadow-lg shadow-black/30 flex items-center justify-center cursor-pointer select-none active:scale-95 transition-transform touch-manipulation"
          >
            <img
              src={crestUrl}
              alt="Aththadassi K Vidyalaya Crest"
              className="w-full h-full object-contain rounded-full pointer-events-none select-none"
              loading="lazy"
            />
          </div>
        </div>

        {/* සමාජ මාධ්‍ය අයිකන (Social Media Icons) */}
        <div className="flex items-center justify-center gap-3.5 mb-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="w-9 h-9 rounded-full bg-[#064e3b] text-emerald-200 border border-emerald-600/40 flex items-center justify-center hover:bg-[#F59E0B] hover:text-slate-950 transition-all hover:-translate-y-0.5"
          >
            <Facebook className="w-4 h-4 fill-current" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="w-9 h-9 rounded-full bg-[#064e3b] text-emerald-200 border border-emerald-600/40 flex items-center justify-center hover:bg-[#F59E0B] hover:text-slate-950 transition-all hover:-translate-y-0.5"
          >
            <Twitter className="w-4 h-4 fill-current" />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="w-9 h-9 rounded-full bg-[#064e3b] text-emerald-200 border border-emerald-600/40 flex items-center justify-center hover:bg-[#F59E0B] hover:text-slate-950 transition-all hover:-translate-y-0.5"
          >
            <Instagram className="w-4 h-4" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="w-9 h-9 rounded-full bg-[#064e3b] text-emerald-200 border border-emerald-600/40 flex items-center justify-center hover:bg-[#F59E0B] hover:text-slate-950 transition-all hover:-translate-y-0.5"
          >
            <Youtube className="w-4 h-4 fill-current" />
          </a>
        </div>

        {/* Footer Navigation Links */}
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[13px] sm:text-[14px] font-medium text-emerald-200/90 max-w-2xl mb-7">
          <li>
            <Link href="/lms" className="hover:text-[#F59E0B] hover:underline transition-colors">
              Access The LMS
            </Link>
          </li>
          <li>
            <Link href="/contact" className="hover:text-[#F59E0B] hover:underline transition-colors">
              Contact us
            </Link>
          </li>
          <li>
            <Link href="/privacy" className="hover:text-[#F59E0B] hover:underline transition-colors">
              Privacy Policy
            </Link>
          </li>
          <li>
            <Link href="/sds" className="hover:text-[#F59E0B] hover:underline transition-colors">
              School Development Society
            </Link>
          </li>
          <li>
            <Link href="/union" className="hover:text-[#F59E0B] hover:underline transition-colors">
              Aththadassi Groups
            </Link>
          </li>
        </ul>

        {/* වෙන් කිරීමේ ඉර (Divider Line) */}
        <div className="w-full border-t border-emerald-900/60 mb-6" />

        {/* ප්‍රකාශන හිමිකම් සහ උපහාර පාඨය */}
        <div className="space-y-1.5 text-center">
          <p className="text-[13px] text-emerald-300 font-medium tracking-tight">
            &copy; 2026 Aththadassi K Vidyalaya
          </p>
          <p className="text-[10px] tracking-[0.2em] text-[#F59E0B] font-semibold uppercase">
            Excellence in Education, Sports and Discipline
          </p>
        </div>

      </div>

      {/* Secret Password Popup Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#022c22] border border-amber-400/50 rounded-3xl p-6 sm:p-8 w-full max-w-sm shadow-2xl relative text-center">
            
            <button
              onClick={() => { setShowPinModal(false); setErrorMsg(false); }}
              className="absolute top-4 right-4 text-emerald-400/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 text-[#F59E0B] border border-amber-400/30 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-white mb-1">Admin Verification</h3>
            <p className="text-xs text-emerald-200/70 mb-5">
              පරිපාලක පුවරුවට පිවිසීමට රහස් මුරපදය ඇතුළත් කරන්න
            </p>

            <form onSubmit={handlePinSubmit} className="space-y-4">
              <input
                type="password"
                autoFocus
                placeholder="••••••••"
                value={secretPin}
                onChange={(e) => { setSecretPin(e.target.value); setErrorMsg(false); }}
                className="w-full bg-[#011a14] border border-emerald-700/80 rounded-xl px-4 py-3 text-center text-white placeholder-emerald-800 tracking-widest focus:outline-none focus:border-amber-400 text-base"
              />

              {errorMsg && (
                <p className="text-xs text-red-400 font-medium">මුරපදය වැරදියි! නැවත උත්සාහ කරන්න.</p>
              )}

              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => { setShowPinModal(false); setErrorMsg(false); }}
                  className="flex-1 py-2.5 text-xs font-semibold rounded-xl bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900 transition-colors"
                >
                  අවලංගු කරන්න
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 text-xs font-bold rounded-xl bg-amber-400 text-slate-950 hover:bg-amber-300 transition-colors shadow-lg shadow-amber-400/20"
                >
                  ඇතුල් වන්න
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </footer>
  );
}