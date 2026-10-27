import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Facebook, Youtube, Globe, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="relative bg-[#022C22] text-emerald-100 pt-16 pb-8 overflow-hidden">
      {/* Top curved SVG divider */}
      <div className="absolute top-0 left-0 right-0 overflow-hidden leading-none transform rotate-180">
        <svg className="relative block w-full h-8 sm:h-12 text-slate-100" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0 C150,90 350,-40 500,60 C650,160 900,10 1200,40 L1200,120 L0,120 Z" fill="currentColor"></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/60">
          
          {/* Column 1: Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#065F46] text-[#F59E0B] flex items-center justify-center font-bold text-lg border border-amber-400">
                SL
              </div>
              <h3 className="text-white font-bold text-lg">ශ්‍රී ලංකා විද්‍යාලය</h3>
            </div>
            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
              &quot;විද්‍යාවෙන් සදා විජයග්‍රහණය කරා&quot; - ශ්‍රී ලාංකේය සිසු දරුවන්ගේ අනාගතය සුපෝෂණය කරන විශිෂ්ටතම හරිත පාසල් පදනම.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-full bg-emerald-900/60 hover:bg-[#065F46] flex items-center justify-center text-emerald-300 hover:text-white transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-emerald-900/60 hover:bg-red-600 flex items-center justify-center text-emerald-300 hover:text-white transition-all">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-emerald-900/60 hover:bg-[#F59E0B] hover:text-slate-900 flex items-center justify-center text-emerald-300 transition-all">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 border-l-2 border-[#F59E0B] pl-2">
              ප්‍රධාන පිටු (Quick Links)
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-emerald-200/80">
              <li><Link href="/" className="hover:text-amber-300 transition-colors">මුල් පිටුව (Home)</Link></li>
              <li><Link href="/about" className="hover:text-amber-300 transition-colors">පාසල් ඉතිහාසය (History)</Link></li>
              <li><Link href="/academics" className="hover:text-amber-300 transition-colors">විෂය ධාරා (Academic Streams)</Link></li>
              <li><Link href="/news" className="hover:text-amber-300 transition-colors">ප්‍රවෘත්ති සහ සිදුවීම් (News)</Link></li>
              <li><Link href="/clubs" className="hover:text-amber-300 transition-colors">ක්‍රීඩා සහ සංගම් (Sports & Societies)</Link></li>
            </ul>
          </div>

          {/* Column 3: Notice Board Highlights */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 border-l-2 border-[#F59E0B] pl-2">
              නවතම නිවේදන
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="group">
                <span className="text-[11px] text-[#F59E0B] block font-semibold">2026 O/L Seminar Series</span>
                <p className="text-xs text-emerald-200/70 group-hover:text-white transition-colors">අ.පො.ස. සා/පෙළ සම්මන්ත්‍රණ මාලාව ලබන සතියේ ආරම්භ වේ.</p>
              </li>
              <li className="group">
                <span className="text-[11px] text-[#F59E0B] block font-semibold">Annual Sports Meet 2026</span>
                <p className="text-xs text-emerald-200/70 group-hover:text-white transition-colors">වාර්ෂික නිවාසාන්තර මලල ක්‍රීඩා උළෙලේ නිවාස පුහුණුවීම් ඇරඹේ.</p>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4 border-l-2 border-[#F59E0B] pl-2">
              සම්බන්ධ කර ගැනීමට
            </h4>
            <div className="space-y-3 text-xs text-emerald-200/80">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#F59E0B] mt-0.5 shrink-0" />
                <span>විද්‍යාලය මාවත, කොළඹ / නගරය, ශ්‍රී ලංකාව.</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>+94 11 234 5678 / +94 11 234 5679</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span>info@collegesrilanka.sch.lk</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-400/80 gap-3">
          <p>© 2026 ශ්‍රී ලංකා ජාතික විද්‍යාලය. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            Designed with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> by Media Unit & IT Society
          </p>
        </div>
      </div>
    </footer>
  );
}