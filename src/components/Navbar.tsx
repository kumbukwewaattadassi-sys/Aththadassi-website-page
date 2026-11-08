"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const LOGO_URL =
  "https://res.cloudinary.com/n911ylla/image/upload/q_auto/copy_of_kra70oqbwosnj4mtw41dxa1npgdd0kpa4dmmelmo34n0h6jccr6b3jiv24ozeutt8aoccqs3_s160-c-k-c0x00ffffff-no-rj.jpg";

const navLinks = [
  { label: "මුල් පිටුව", href: "/" },
  { label: "අපේ පාසල", href: "/about" },
  { label: "අධ්‍යාපනය", href: "/academics" },
  { label: "ප්‍රවෘත්ති", href: "/news" },
  { label: "අපව අමතන්න", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 25);
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] transform-gpu transition-colors duration-200 ${
        scrolled
          ? "bg-[#020804] border-b border-[#C1A260]/30 shadow-md"
          : "bg-gradient-to-b from-[#010603]/85 via-[#010603]/40 to-transparent border-b border-transparent"
      }`}
      style={{
        padding: "10px 16px",
      }}
    >
      <nav className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* ── Circular Logo + School Name ── */}
        <Link
          href="/"
          className="flex items-center gap-3 no-underline min-w-0"
        >
          <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full border-2 border-[#C1A260] bg-[#020a05] shadow-xs flex-shrink-0 flex items-center justify-center overflow-hidden">
            <img
              src={LOGO_URL}
              alt="පාසල් ලාංඡනය"
              className="w-full h-full object-cover block"
              onError={(e) => {
                const img = e.currentTarget;
                img.style.display = "none";
                const parent = img.parentElement;
                if (parent) parent.innerText = "🎓";
              }}
            />
          </div>

          <div className="min-w-0">
            <p className="m-0 text-white font-extrabold text-[13px] sm:text-base leading-tight truncate">
              කුඹුක්වැව අත්ථදස්සි
            </p>
            <p className="m-0 text-[#E0C37B] text-[9.5px] font-bold tracking-wider uppercase mt-0.5">
              Junior School • Est. 1963
            </p>
          </div>
        </Link>

        {/* ── Desktop Links (hidden on mobile/tablet) ── */}
        <div className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3.5 py-2 rounded-full text-white/85 text-[13.5px] font-semibold no-underline hover:text-[#E5C16C] hover:bg-[#C1A260]/10 transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/admissions"
            className="ml-2 inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-[#D4B26F] to-[#B8934C] text-[#050F08] text-[13.5px] font-extrabold no-underline shadow-sm hover:scale-105 active:scale-95 transition-transform"
          >
            ලියාපදිංචිය 2026
          </Link>
        </div>

        {/* ── Mobile Menu Hamburger Button ── */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          className="lg:hidden w-10 h-10 rounded-full border border-[#C1A260]/40 bg-[#020a05]/90 text-[#E5C16C] text-lg flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* ── Mobile Dropdown Menu (Lag-free Solid Layer) ── */}
      <div
        className={`lg:hidden transition-all duration-200 overflow-hidden ${
          menuOpen ? "max-h-[380px] opacity-100 mt-3" : "max-h-0 opacity-0 pointer-events-none"
        } rounded-2xl bg-[#020804] border border-[#C1A260]/30 shadow-xl`}
      >
        <div className="p-3 space-y-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-white/90 text-sm font-semibold no-underline active:bg-white/10 border-b border-white/5"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/admissions"
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center mt-2.5 py-3 rounded-full bg-gradient-to-r from-[#D4B26F] to-[#B8934C] text-[#050F08] text-sm font-extrabold no-underline active:scale-95 transition-transform"
          >
            ලියාපදිංචිය 2026
          </Link>
        </div>
      </div>
    </header>
  );
}