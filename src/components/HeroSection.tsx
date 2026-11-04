"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const slides = [
  {
    url: "https://res.cloudinary.com/n911ylla/image/upload/f_auto,q_auto/685919899_1430362865799214_5670876124687149843_n",
    label: "ශිෂ්‍ය ජීවන රටා",
  },
  {
    url: "https://res.cloudinary.com/n911ylla/image/upload/q_auto/832247094_1580265014142331_668856309073154634_n.jpg",
    label: "ශිෂ්‍ය ජීවන රටා",
  },
  {
    url: "https://res.cloudinary.com/n911ylla/image/upload/q_auto/732984997_1485544940281006_4701285444358849644_n.jpg",
    label: "ශිෂ්‍ය ජීවන රටා",
  },
];

const stats = [
  { value: "200+", sinhala: "සිසු ප්‍රජාව", english: "Students" },
  { value: "26+", sinhala: "ආචාර්ය මණ්ඩලය", english: "Faculty" },
  { value: "98%", sinhala: "සාමාර්ථ ප්‍රතිශතය", english: "Pass Rate" },
  { value: "1963", sinhala: "ස්ථාපිත වර්ෂය", english: "Founded" },
]; 

export default function HeroSection() {
  const [active, setActive] = useState(0);

  // Smooth Slide Switch
  useEffect(() => {
    const timer = setInterval(() => {
      setActive((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* ──────────────────────────────────────────────────────────
          1. REFINED FRAMELESS MOBILE VIEW (md:hidden)
      ────────────────────────────────────────────────────────── */}
      <div className="block md:hidden bg-[#030a05] text-white pt-20 pb-8 px-4 font-sans relative overflow-hidden">
        
        <div className="flex flex-col gap-5 relative z-10">
          
          {/* 1. Header Information (Emblem, Name, Motto, Title) */}
          <div className="flex flex-col items-center text-center space-y-2.5 pt-2">
            
            {/* Center Logo */}
            <div className="w-20 h-20 rounded-full border-2 border-[#E0C37B] bg-[#020a05] shadow-[0_0_20px_rgba(224,195,123,0.35)] flex items-center justify-center overflow-hidden">
              <img
                src="https://res.cloudinary.com/n911ylla/image/upload/q_auto/KRA70oqBWoSNJ4mtw41dxA1npgdd0kPA4dMmELMo34N0h6JCCR6B3JiV24oZEutt8AOccQs3_s160-c-k-c0x00ffffff-no-rj.jpg"
                alt="School Emblem"
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                  const fb = target.parentElement?.querySelector(".m-logo-fb") as HTMLElement;
                  if (fb) fb.style.display = "flex";
                }}
              />
              <span className="m-logo-fb hidden text-3xl">🎓</span>
            </div>

            {/* School Name & Founded */}
            <div>
              <h2 className="text-white font-extrabold text-sm tracking-wide">
                පු/කුඹුක්වැව අත්ථදස්සි කනිෂ්ඨ විද්‍යාලය
              </h2>
              <p className="text-[#E0C37B] text-[10px] font-semibold mt-0.5 tracking-wider">
                පාසල් ආරම්භය :- 1963/ 01/ 02
              </p>
            </div>

            {/* Motto Badge */}
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#E0C37B]/10 border border-[#E0C37B]/40 text-[#F6DE95] text-[10.5px] font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              &quot; මානිවතන අභික්කම &quot;
            </div>

            {/* Title */}
            <h1 className="text-3xl font-black leading-tight text-white tracking-tight pt-1">
              දැනුමෙන් සන්නද්ධ <br />
              <span className="text-[#F5CE68]">විශිෂ්ටතම පරපුරක්</span>
            </h1>
          </div>

          {/* 2. Frameless Clean Photo Slider (කිසිදු ඝන frame එකක් නොමැතිව පිරිසිදුව) */}
          <div className="relative w-full aspect-[16/10] max-h-64 rounded-3xl overflow-hidden shadow-2xl bg-[#08170c]">
            {slides.map((s, idx) => (
              <img
                key={idx}
                src={s.url}
                alt={s.label}
                loading={idx === 0 ? "eager" : "lazy"}
                className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-700 ease-in-out ${
                  idx === active ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                }`}
              />
            ))}

            {/* Subtle Gradient for Bottom Details */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            {/* Slide Label Badge */}
            <div className="absolute bottom-3 left-4 z-20">
              <span className="text-[9.5px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-black/60 text-[#F5CE68] border border-white/20 backdrop-blur-sm">
                Aththadassi kv • {slides[active].label}
              </span>
            </div>

            {/* Indicator Dots */}
            <div className="absolute bottom-3 right-4 z-20 flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/20">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === active ? "w-5 bg-[#F5CE68]" : "w-1.5 bg-white/40"
                  }`}
                  aria-label={`Slide ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* 3. Description Card */}
          <div className="bg-[#06150b] p-4 rounded-2xl border border-white/10 text-center shadow-md">
            <p className="m-0 text-[#E2ECE5] text-[11.5px] leading-relaxed font-normal">
              “මානිවතන අභික්කම” යන අපගේ ආදර්ශ පාඨය පෙරදැරි කරගෙන, දැනුමෙන්, හැකියාවෙන් සහ යහපත් ගුණාංගවලින් පිරිපුන් අනාගත පරපුරක් ගොඩනැගීම සඳහා අපි එක්ව ඉදිරියට යමු.
            </p>
          </div>

          {/* 4. Action Buttons */}
          <div className="flex items-center gap-2.5">
            <Link
              href="/about"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-full bg-gradient-to-r from-[#E2BC6B] to-[#C39947] text-[#050F08] text-xs font-black shadow-lg active:scale-95 transition-transform"
            >
              <span>අපේ පාසල ගැන</span>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 7h10M7 2l5 5-5 5" stroke="#050F08" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            <Link
              href="/contact"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-full bg-[#06150b] text-white text-xs font-bold border border-[#E0C37B]/60 shadow-md active:scale-95 transition-transform"
            >
              <span>විමසීම්</span>
            </Link>
          </div>

          {/* 5. Trust Badges */}
          <div className="flex items-center gap-1.5 justify-center flex-wrap pt-0.5">
            {[
              { icon: "🏅", label: "Junior College" },
              { icon: "✅", label: "Skills Development" },
              { icon: "📋", label: "Teaching Excellence" },
            ].map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#06150b] border border-white/10 text-[9.5px] text-[#E2ECE5] font-medium"
              >
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>

          {/* 6. Stats Grid */}
          <div className="grid grid-cols-4 gap-1.5 pt-2 border-t border-white/10 text-center">
            {stats.map((s, i) => (
              <div key={i} className="p-2 rounded-xl bg-white/5 border border-white/5">
                <p className="m-0 text-sm font-black text-white leading-none">{s.value}</p>
                <p className="m-0 mt-1 text-[9px] font-bold text-[#F5CE68] leading-tight">{s.sinhala}</p>
                <p className="m-0 text-[7px] text-white/40 uppercase">{s.english}</p>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          2. PC & TABLET VIEW (hidden md:flex) - කිසිදු වෙනසක් කර නොමැත
      ────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex flex-col min-h-screen relative overflow-hidden font-sans">
        <section
          style={{
            minHeight: "100vh",
            background: "#030805",
            display: "flex",
            flexDirection: "column",
            position: "relative",
            overflow: "hidden",
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            width: "100%",
          }}
        >
          {/* BACKGROUND SLIDESHOW */}
          <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
            {slides.map((s, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  inset: 0,
                  transition: "opacity 1.2s ease, transform 5s linear",
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "scale(1.02)" : "scale(1)",
                }}
              >
                <img
                  src={s.url}
                  alt={s.label}
                  loading={i === 0 ? "eager" : "lazy"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center 30%",
                    filter: "brightness(0.92) contrast(1.04)",
                  }}
                />
              </div>
            ))}

            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: "28%",
                background:
                  "linear-gradient(180deg, rgba(2, 6, 3, 0.72) 0%, rgba(2, 6, 3, 0.25) 60%, transparent 100%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                height: "75%",
                background:
                  "linear-gradient(0deg, rgba(2, 7, 4, 0.95) 0%, rgba(2, 7, 4, 0.75) 45%, rgba(2, 7, 4, 0.3) 78%, transparent 100%)",
                pointerEvents: "none",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "radial-gradient(ellipse 65% 55% at 50% 52%, rgba(2, 6, 3, 0.42) 0%, transparent 75%)",
                pointerEvents: "none",
              }}
            />
          </div>

          {/* PC TOP CENTER CIRCULAR LOGO */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 110,
            }}
          >
            <div
              style={{
                width: 112,
                height: 112,
                borderRadius: "50%",
                border: "2.5px solid #E0C37B",
                background: "rgba(3, 10, 6, 0.65)",
                boxShadow:
                  "0 0 35px rgba(224, 195, 123, 0.45), 0 8px 24px rgba(0, 0, 0, 0.6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                marginBottom: 14,
                cursor: "pointer",
                transition: "transform 0.25s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1.05)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "scale(1)";
              }}
            >
              <img
                src="https://yt3.googleusercontent.com/KRA70oqBWoSNJ4mtw41dxA1npgdd0kPA4dMmELMo34N0h6JCCR6B3JiV24oZEutt8AOccQs3=s160-c-k-c0x00ffffff-no-rj"
                alt="School Emblem"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
                onError={(e) => {
                  const target = e.currentTarget as HTMLImageElement;
                  target.style.display = "none";
                  const fb = target.parentElement?.querySelector(".pc-logo-fb") as HTMLElement;
                  if (fb) fb.style.display = "flex";
                }}
              />
              <span
                className="pc-logo-fb"
                style={{
                  display: "none",
                  fontSize: 44,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                🎓
              </span>
            </div>

            <h2
              style={{
                margin: 0,
                color: "#ffffff",
                fontSize: "clamp(1.05rem, 2.3vw, 1.4rem)",
                fontWeight: 800,
                letterSpacing: "0.03em",
                textAlign: "center",
                textShadow: "0 2px 14px rgba(0, 0, 0, 0.9), 0 1px 3px rgba(0, 0, 0, 1)",
              }}
            >
              පු/කුඹුක්වැව අත්ථදස්සි කනිෂ්ඨ විද්‍යාලය
            </h2>

            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <div style={{ width: 28, height: 1.5, background: "rgba(224, 195, 123, 0.65)" }} />
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#E0C37B" }} />
              <span
                style={{
                  color: "#E0C37B",
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textShadow: "0 1px 6px rgba(0,0,0,0.8)",
                }}
              >
                පාසල් ආරම්භය :- 1963/ 01/ 02
              </span>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#E0C37B" }} />
              <div style={{ width: 28, height: 1.5, background: "rgba(224, 195, 123, 0.65)" }} />
            </div>
          </div>

          {/* PC TYPOGRAPHY */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "20px 20px 0",
            }}
          >
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 20px",
                borderRadius: 100,
                background: "rgba(2, 10, 5, 0.72)",
                border: "1px solid rgba(224, 195, 123, 0.55)",
                boxShadow: "0 4px 16px rgba(0, 0, 0, 0.5)",
                marginBottom: 18,
              }}
            >
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#F59E0B" }} />
              <p
                style={{
                  margin: 0,
                  color: "#F6DE95",
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                }}
              >
                &quot; මානිවතන අභික්කම &quot;
              </p>
            </div>

            <h1
              style={{
                margin: "0 0 20px",
                lineHeight: 1.15,
                fontWeight: 900,
                letterSpacing: "-0.02em",
                maxWidth: 900,
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(2.7rem, 6.2vw, 4.8rem)",
                  color: "#FFFFFF",
                  textShadow:
                    "0 3px 20px rgba(0, 0, 0, 0.95), 0 1px 4px rgba(0, 0, 0, 0.9)",
                  filter: "drop-shadow(0 4px 16px rgba(0, 0, 0, 0.85))",
                }}
              >
                දැනුමෙන් සන්නද්ධ
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(2.3rem, 5.2vw, 4.2rem)",
                  color: "#F5CE68",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  marginTop: 4,
                  textShadow:
                    "0 3px 24px rgba(0, 0, 0, 0.9), 0 0 35px rgba(245, 206, 104, 0.45)",
                }}
              >
                විශිෂ්ටතම පරපුරක්
              </span>
            </h1>

            <div
              style={{
                background: "rgba(1, 8, 4, 0.58)",
                padding: "12px 24px",
                borderRadius: 20,
                border: "1px solid rgba(255, 255, 255, 0.12)",
                maxWidth: "54ch",
                marginBottom: 32,
                boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
              }}
            >
              <p
                style={{
                  margin: 0,
                  color: "#F3F7F4",
                  fontSize: "clamp(0.92rem, 1.35vw, 1.05rem)",
                  lineHeight: 1.8,
                  fontWeight: 500,
                  textShadow: "0 1px 8px rgba(0, 0, 0, 0.8)",
                }}
              >
                “මානිවතන අභික්කම” යන අපගේ ආදර්ශ පාඨය පෙරදැරි කරගෙන, දැනුමෙන්, හැකියාවෙන් සහ යහපත් ගුණාංගවලින් පිරිපුන් අනාගත පරපුරක් ගොඩනැගීම සඳහා අපි එක්ව ඉදිරියට යමු.
              </p>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              <Link
                href="/about"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "14px 34px",
                  borderRadius: 100,
                  background: "linear-gradient(135deg, #E2BC6B 0%, #C39947 100%)",
                  color: "#050F08",
                  fontSize: 14,
                  fontWeight: 800,
                  textDecoration: "none",
                  letterSpacing: "0.02em",
                  boxShadow:
                    "0 6px 24px rgba(226, 188, 107, 0.45), 0 2px 8px rgba(0, 0, 0, 0.5)",
                  transition: "transform 0.18s ease, box-shadow 0.18s ease",
                }}
                onMouseEnter={(e) => {
                  const a = e.currentTarget as HTMLAnchorElement;
                  a.style.transform = "scale(1.05)";
                  a.style.boxShadow = "0 10px 30px rgba(226, 188, 107, 0.6)";
                }}
                onMouseLeave={(e) => {
                  const a = e.currentTarget as HTMLAnchorElement;
                  a.style.transform = "scale(1)";
                  a.style.boxShadow = "0 6px 24px rgba(226, 188, 107, 0.45)";
                }}
              >
                අපේ පාසල ගැන
                <svg width="15" height="15" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path
                    d="M2 7h10M7 2l5 5-5 5"
                    stroke="#050F08"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </Link>

              <Link
                href="/contact"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "13px 32px",
                  borderRadius: 100,
                  background: "rgba(1, 8, 4, 0.65)",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                  border: "1.5px solid rgba(224, 195, 123, 0.55)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
                  transition: "background 0.2s, border-color 0.2s, transform 0.18s",
                }}
                onMouseEnter={(e) => {
                  const a = e.currentTarget as HTMLAnchorElement;
                  a.style.background = "rgba(224, 195, 123, 0.2)";
                  a.style.borderColor = "#E2BC6B";
                  a.style.transform = "scale(1.03)";
                }}
                onMouseLeave={(e) => {
                  const a = e.currentTarget as HTMLAnchorElement;
                  a.style.background = "rgba(1, 8, 4, 0.65)";
                  a.style.borderColor = "rgba(224, 195, 123, 0.55)";
                  a.style.transform = "scale(1)";
                }}
              >
                විමසීම්
              </Link>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginTop: 36,
                flexWrap: "wrap",
                justifyContent: "center",
              }}
            >
              {[
                { icon: "🏅", label: "Junior College" },
                { icon: "✅", label: "Skills Development" },
                { icon: "📋", label: "Teaching Excellence" },
              ].map((b, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "7px 18px",
                    borderRadius: 100,
                    background: "rgba(1, 8, 4, 0.65)",
                    border: "1px solid rgba(255, 255, 255, 0.16)",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
                  }}
                >
                  <span style={{ fontSize: 13 }}>{b.icon}</span>
                  <span
                    style={{
                      color: "#E2ECE5",
                      fontSize: 12,
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {b.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* PC BOTTOM STATS */}
          <div
            style={{
              position: "relative",
              zIndex: 10,
              padding: "0 48px 34px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: 24,
              marginTop: 40,
            }}
          >
            <div style={{ display: "flex", alignItems: "flex-end", gap: 0, flexWrap: "wrap" }}>
              {stats.map((s, i) => (
                <div
                  key={i}
                  style={{
                    paddingRight: i < stats.length - 1 ? 32 : 0,
                    marginRight: i < stats.length - 1 ? 32 : 0,
                    borderRight: i < stats.length - 1 ? "1px solid rgba(255, 255, 255, 0.15)" : "none",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: "clamp(1.4rem, 2.5vw, 1.9rem)",
                      fontWeight: 800,
                      color: "#FFFFFF",
                      lineHeight: 1,
                      letterSpacing: "-0.03em",
                      textShadow: "0 2px 10px rgba(0, 0, 0, 0.9)",
                    }}
                  >
                    {s.value}
                  </p>
                  <p style={{ margin: "5px 0 0", fontSize: 11.5, fontWeight: 700, color: "#F5CE68" }}>
                    {s.sinhala}
                  </p>
                  <p
                    style={{
                      margin: "1px 0 0",
                      fontSize: 10,
                      color: "rgba(255, 255, 255, 0.55)",
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                    }}
                  >
                    {s.english}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
              <p
                style={{
                  margin: 0,
                  fontSize: 10.5,
                  color: "rgba(255, 255, 255, 0.7)",
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  textShadow: "0 1px 4px rgba(0,0,0,0.8)",
                }}
              >
                {slides[active].label}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    aria-label={`Slide ${i + 1}`}
                    style={{
                      all: "unset",
                      cursor: "pointer",
                      height: 3.5,
                      borderRadius: 2,
                      background: i === active ? "#F5CE68" : "rgba(255, 255, 255, 0.35)",
                      width: i === active ? "32px" : "18px",
                      transition: "all 0.3s ease",
                    }}
                  />
                ))}
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  color: "rgba(255, 255, 255, 0.5)",
                  fontVariantNumeric: "tabular-nums",
                  fontWeight: 600,
                }}
              >
                {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}