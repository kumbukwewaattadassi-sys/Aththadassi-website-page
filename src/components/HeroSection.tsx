"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const slides = [
  {
    url: "https://scontent.fcmb12-1.fna.fbcdn.net/v/t39.30808-6/732984997_1485544940281006_4701285444358849644_n.jpg?stp=cp6_dst-jpg_tt6&cstp=mx2048x1152&ctp=s2048x1152&_nc_cat=106&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFdr6E9pjA3TStkDFaEmUP1-E7YT3wTVWD4TthPfBNVYBu9ZFB3kegCAyUIRetZJ5q-DJG2AZj_gJzhh7QKwTly&_nc_ohc=wf3ghtWxWCEQ7kNvwHShEfB&_nc_oc=AdpccqHO5HsIrTVN-w57pqgNUI3E5aR9k5RcN1ZPx6f2RObzGiM05nvUMTl-LTfxyl8&_nc_zt=23&_nc_ht=scontent.fcmb12-1.fna&_nc_gid=oCVuRX8v1Z721LejEuDlDw&_nc_ss=7a2a8&oh=00_AQNRUh3w5ZdNmtAtvQODYvznrzEEeuji-zGAS7h4279kbA&oe=6AE68CA5",
    label: "ප්‍රධාන අධ්‍යාපන සංකීර්ණය",
  },
  {
    url: "https://scontent.fcmb3-2.fna.fbcdn.net/v/t39.30808-6/733145991_1485539623614871_1429121932923332965_n.jpg?stp=dst-jpg_tt6&cstp=mx1280x960&ctp=s1280x960&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeE2zp2_ibBC4pufmVOxOU36WIqiLFzszO9YiqIsXOzM75siM9MQibbonWGE35jTg02ezJfSuAIotPLolhRtR4Bc&_nc_ohc=GuX3puRMoLMQ7kNvwH8oGyT&_nc_oc=AdpIK32Y7I7d1OcCVon4hBxFXJ39YuTlZeABtLkjsucxbSirYcn1vh8jfQwljVOJpaQ&_nc_zt=23&_nc_ht=scontent.fcmb3-2.fna&_nc_gid=Pc5wyEfQca5pL_wPVipjSA&_nc_ss=7a2a8&oh=00_AQNudc2yjr0suHDFtjNOanF4V57FkF9i1mPfosou5eVmOw&oe=6AE6B36C",
    label: "ක්‍රීඩා සහ සංස්කෘතික පරිශ්‍රය",
  },
  {
    url: "https://scontent.fcmb3-2.fna.fbcdn.net/v/t39.30808-6/685919899_1430362865799214_5670876124687149843_n.jpg?stp=dst-jpg_tt6&cstp=mx1280x960&ctp=s590x590&_nc_cat=109&_nc_map=urlgen_bucketless&ccb=1-7&_nc_sid=833d8c&_nc_eui2=AeFuG8alA5tFIrrnkxuwCel8U_bcK9-qcyVT9twr36pzJU4mz7DLG_HA4ASw9fxU322uUM3v9SeSIjExsQwvrIa5&_nc_ohc=qdhNngAkhrkQ7kNvwFm-0PQ&_nc_oc=Adq4IRZHpIG4M2sg2dbZb5P382qAv2aA4jwZQYHi5zgLY6pUsuwYUP1HLHYcZeBsb4U&_nc_zt=23&_nc_ht=scontent.fcmb3-2.fna&_nc_gid=aNtMPzw8YPhevnhUmhqWvQ&_nc_ss=7b2a8&oh=00_AQM_Bn6WWVPFUiy02xoutX2BsOWYPjbt3Ns9WM3_yzAWLA&oe=6AE6A056",
    label: "ශිෂ්‍ය ජීවන රටාව",
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
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const DURATION = 5500;

  useEffect(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0);
    const start = Date.now();
    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / DURATION) * 100, 100);
      setProgress(pct);
      if (elapsed >= DURATION) {
        setActive((prev) => (prev + 1) % slides.length);
      }
    }, 30);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  return (
    <>
      {/* ──────────────────────────────────────────────────────────
          1. MOBILE VIEW (md:hidden)
          පිරිසිදු, ආකර්ෂණීය Curved Architecture එකක් සහිත Mobile Design එක
      ────────────────────────────────────────────────────────── */}
      <div className="block md:hidden bg-[#040e07] text-white pt-24 pb-12 px-4 relative overflow-hidden font-sans min-h-screen flex flex-col justify-between">
        
        {/* Soft Ambient Curved Glowing Blobs */}
        <div className="absolute -top-16 -left-16 w-64 h-64 bg-[#10B981]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-16 w-64 h-64 bg-[#E0C37B]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-5">
          {/* 1. Mobile Center Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 rounded-full border-2 border-[#E0C37B] bg-[#020a05] shadow-[0_0_25px_rgba(224,195,123,0.35)] flex items-center justify-center overflow-hidden mb-2">
              <img
                src="https://yt3.googleusercontent.com/KRA70oqBWoSNJ4mtw41dxA1npgdd0kPA4dMmELMo34N0h6JCCR6B3JiV24oZEutt8AOccQs3=s160-c-k-c0x00ffffff-no-rj"
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

            <h2 className="text-white font-extrabold text-sm tracking-wide">
              පු/කුඹුක්වැව අත්ථදස්සි කනිෂ්ඨ විද්‍යාලය
            </h2>
            <p className="text-[#E0C37B] text-[10px] font-semibold mt-0.5 tracking-wider">
              පාසල් ආරම්භය :- 1963/ 01/ 02
            </p>
          </div>

          {/* 2. Mobile Title & Motto Badge */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E0C37B]/10 border border-[#E0C37B]/40 text-[#F6DE95] text-[10.5px] font-bold tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              &quot; මානිවතන අභික්කම &quot;
            </div>

            <h1 className="text-3xl font-black leading-tight text-white tracking-tight">
              දැනුමෙන් සන්නද්ධ <br />
              <span className="text-[#F5CE68]">විශිෂ්ටතම පරපුරක්</span>
            </h1>
          </div>

          {/* 3. Mobile Dedicated Curved Photo Showcase Frame (Under Title) */}
          <div className="relative mx-auto w-full max-w-sm">
            <div className="w-full h-56 rounded-[2.5rem] bg-gradient-to-tr from-[#065F46] via-[#10B981] to-[#E0C37B] p-1.5 shadow-2xl relative overflow-hidden">
              <div className="w-full h-full rounded-[2.2rem] bg-slate-900 overflow-hidden relative">
                {slides.map((s, idx) => (
                  <div
                    key={idx}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                      idx === active ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
                    }`}
                  >
                    <img
                      src={s.url}
                      alt={s.label}
                      className="w-full h-full object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                    
                    {/* Caption Overlay */}
                    <div className="absolute bottom-3 left-4 right-4 text-white">
                      <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F5CE68] text-slate-950 inline-block mb-1">
                        Campus Life
                      </span>
                      <p className="text-xs font-bold text-white truncate drop-shadow">
                        {s.label}
                      </p>
                    </div>
                  </div>
                ))}

                {/* Mobile Slider Indicator Dots */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1 bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
                  {slides.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActive(i)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === active ? "w-5 bg-[#F5CE68]" : "w-1.5 bg-white/50"
                      }`}
                      aria-label={`Slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. Mobile Description Card with Curved Border */}
          <div className="bg-[#020d06]/80 p-3.5 rounded-2xl border border-white/10 shadow-lg text-center backdrop-blur-md">
            <p className="m-0 text-[#E2ECE5] text-xs leading-relaxed font-normal">
              “මානිවතන අභික්කම” යන අපගේ ආදර්ශ පාඨය පෙරදැරි කරගෙන, දැනුමෙන්, හැකියාවෙන් සහ යහපත් ගුණාංගවලින් පිරිපුන් අනාගත පරපුරක් ගොඩනැගීම සඳහා අපි එක්ව ඉදිරියට යමු.
            </p>
          </div>

          {/* 5. Mobile CTA Action Buttons */}
          <div className="flex items-center gap-2.5 pt-1">
            <Link
              href="/about"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-full bg-gradient-to-r from-[#E2BC6B] to-[#C39947] text-[#050F08] text-xs font-black shadow-lg"
            >
              <span>අපේ පාසල ගැන</span>
              <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden>
                <path d="M2 7h10M7 2l5 5-5 5" stroke="#050F08" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>

            <Link
              href="/contact"
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 px-4 rounded-full bg-[#020d06]/90 text-white text-xs font-bold border border-[#E0C37B]/60 shadow-md backdrop-blur-md"
            >
              <span>විමසීම්</span>
            </Link>
          </div>

          {/* 6. Mobile Trust Badges */}
          <div className="flex items-center gap-1.5 justify-center flex-wrap pt-1">
            {[
              { icon: "🏅", label: "Junior College" },
              { icon: "✅", label: "Skills Development" },
              { icon: "📋", label: "Teaching Excellence" },
            ].map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#020d06]/70 border border-white/10 text-[9.5px] text-[#E2ECE5] font-medium"
              >
                <span>{b.icon}</span>
                <span>{b.label}</span>
              </div>
            ))}
          </div>

          {/* 7. Mobile Stats Grid: 4 columns in one line */}
          <div className="grid grid-cols-4 gap-1.5 pt-3 border-t border-white/10 text-center">
            {stats.map((s, i) => (
              <div key={i} className="p-1.5 rounded-xl bg-white/5 border border-white/5">
                <p className="m-0 text-sm font-black text-white leading-none">{s.value}</p>
                <p className="m-0 mt-1 text-[9px] font-bold text-[#F5CE68] leading-tight">{s.sinhala}</p>
                <p className="m-0 text-[7.5px] text-white/40 uppercase">{s.english}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────
          2. PC & TABLET VIEW (hidden md:flex)
          ඔබ ලබා දුන් මුල් PC Code එකේ කිසිදු වෙනසක් සිදු කර නැත
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
                  transition: "opacity 1.5s cubic-bezier(0.4, 0, 0.2, 1), transform 6s ease-out",
                  opacity: i === active ? 1 : 0,
                  transform: i === active ? "scale(1.02)" : "scale(1)",
                }}
              >
                <img
                  src={s.url}
                  alt={s.label}
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
                backdropFilter: "blur(6px)",
                transition: "transform 0.3s ease",
                cursor: "pointer",
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
                backdropFilter: "blur(8px)",
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
                backdropFilter: "blur(6px)",
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
                  backdropFilter: "blur(8px)",
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
                    backdropFilter: "blur(8px)",
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
                      width: i === active ? `${Math.max(26, progress * 0.55)}px` : "20px",
                      transition: "background 0.3s, width 0.08s linear",
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