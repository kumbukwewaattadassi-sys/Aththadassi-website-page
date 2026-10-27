"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";

const LOGO_URL =
  "https://yt3.googleusercontent.com/KRA70oqBWoSNJ4mtw41dxA1npgdd0kPA4dMmELMo34N0h6JCCR6B3JiV24oZEutt8AOccQs3=s160-c-k-c0x00ffffff-no-rj";

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
    const handleScroll = () => setScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? "10px 24px" : "18px 32px",
        transition: "padding 0.3s ease, background 0.3s ease, box-shadow 0.3s ease",
        background: scrolled
          ? "rgba(2, 8, 4, 0.88)"
          : "linear-gradient(180deg, rgba(1, 6, 3, 0.72) 0%, rgba(1, 6, 3, 0.25) 70%, transparent 100%)",
        backdropFilter: scrolled ? "blur(18px)" : "blur(6px)",
        borderBottom: scrolled
          ? "1px solid rgba(193, 162, 96, 0.22)"
          : "1px solid transparent",
        boxShadow: scrolled ? "0 12px 34px rgba(0, 0, 0, 0.45)" : "none",
      }}
    >
      <nav
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 20,
        }}
      >
        {/* ── Circular Logo + School Name ── */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            textDecoration: "none",
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: 56,
              height: 56,
              flexShrink: 0,
              borderRadius: "50%",
              border: "2px solid #C1A260",
              background: "rgba(2, 10, 5, 0.8)",
              boxShadow:
                "0 0 24px rgba(193, 162, 96, 0.32), 0 8px 20px rgba(0, 0, 0, 0.55)",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={LOGO_URL}
              alt="පාසල් ලාංඡනය"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
              onError={(e) => {
                const img = e.currentTarget;
                img.style.display = "none";
                const parent = img.parentElement;
                if (parent) parent.innerText = "🎓";
              }}
            />
          </div>

          <div style={{ minWidth: 0 }}>
            <p
              style={{
                margin: 0,
                color: "#FFFFFF",
                fontWeight: 800,
                fontSize: "clamp(0.82rem, 1.6vw, 1rem)",
                lineHeight: 1.25,
                textShadow: "0 2px 12px rgba(0, 0, 0, 0.85)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              කුඹුක්වැව අත්ථදස්සි
            </p>
            <p
              style={{
                margin: 0,
                color: "#E0C37B",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Junior School • Est. 1948
            </p>
          </div>
        </Link>

        {/* ── Desktop Links ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
          className="navbar-desktop-links"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                padding: "10px 16px",
                borderRadius: 100,
                color: "rgba(255, 255, 255, 0.82)",
                fontSize: 13.5,
                fontWeight: 600,
                textDecoration: "none",
                transition: "color 0.2s ease, background 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#E5C16C";
                e.currentTarget.style.background = "rgba(193, 162, 96, 0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "rgba(255, 255, 255, 0.82)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/admissions"
            style={{
              marginLeft: 10,
              display: "inline-flex",
              alignItems: "center",
              padding: "11px 22px",
              borderRadius: 100,
              background: "linear-gradient(135deg, #D4B26F 0%, #B8934C 100%)",
              color: "#050F08",
              fontSize: 13.5,
              fontWeight: 800,
              textDecoration: "none",
              boxShadow: "0 8px 22px rgba(193, 162, 96, 0.32)",
              whiteSpace: "nowrap",
              transition: "transform 0.18s ease, box-shadow 0.18s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04)";
              e.currentTarget.style.boxShadow =
                "0 12px 28px rgba(193, 162, 96, 0.48)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow =
                "0 8px 22px rgba(193, 162, 96, 0.32)";
            }}
          >
            ලියාපදිංචිය 2026
          </Link>
        </div>

        {/* ── Mobile Menu Button ── */}
        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Menu"
          style={{
            display: "none",
            width: 46,
            height: 46,
            borderRadius: "50%",
            border: "1px solid rgba(193, 162, 96, 0.45)",
            background: "rgba(2, 10, 5, 0.65)",
            color: "#E5C16C",
            fontSize: 20,
            cursor: "pointer",
          }}
          className="navbar-mobile-button"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* ── Mobile Dropdown ── */}
      <div
        style={{
          maxHeight: menuOpen ? 420 : 0,
          opacity: menuOpen ? 1 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s ease, opacity 0.25s ease",
          marginTop: menuOpen ? 14 : 0,
          borderRadius: 18,
          background: "rgba(2, 8, 4, 0.96)",
          border: "1px solid rgba(193, 162, 96, 0.25)",
          boxShadow: "0 20px 45px rgba(0, 0, 0, 0.55)",
        }}
        className="navbar-mobile-menu"
      >
        <div style={{ padding: "14px 16px" }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                display: "block",
                padding: "13px 16px",
                borderRadius: 12,
                color: "rgba(255, 255, 255, 0.85)",
                fontSize: 14.5,
                fontWeight: 600,
                textDecoration: "none",
                borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
              }}
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/admissions"
            onClick={() => setMenuOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 14,
              padding: "14px 18px",
              borderRadius: 100,
              background: "linear-gradient(135deg, #D4B26F 0%, #B8934C 100%)",
              color: "#050F08",
              fontSize: 14,
              fontWeight: 800,
              textDecoration: "none",
            }}
          >
            ලියාපදිංචිය 2026
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @media (max-width: 1024px) {
          .navbar-desktop-links {
            display: none !important;
          }
          .navbar-mobile-button {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }

        @media (max-width: 480px) {
          header {
            padding: 10px 14px !important;
          }
        }
      `}</style>
    </header>
  );
}