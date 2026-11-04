
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Gamepad2, Sparkles } from "lucide-react";

export default function FloatingQuizButton() {
  const pathname = usePathname();

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/quiz")
  ) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        @keyframes quiz-glow {
          0%, 100% {
            box-shadow:
              0 4px 18px rgba(16, 185, 129, 0.20),
              0 0 0 4px rgba(16, 185, 129, 0.06);
          }
          50% {
            box-shadow:
              0 4px 24px rgba(16, 185, 129, 0.35),
              0 0 0 7px rgba(16, 185, 129, 0.08);
          }
        }

        .quiz-circle {
          animation: quiz-glow 3s ease-in-out infinite;
          transform: translateZ(0);
          -webkit-tap-highlight-color: transparent;
        }

        .quiz-circle:hover {
          transform: translateZ(0) scale(1.09);
        }

        .quiz-circle:active {
          transform: translateZ(0) scale(0.94);
        }

        @media (prefers-reduced-motion: reduce) {
          .quiz-circle {
            animation: none !important;
            transition: none !important;
          }
        }
      `}</style>

      <div className="
        fixed
        bottom-5
        right-5
        sm:bottom-7
        sm:right-7
        z-[90]
      ">
        <Link
          href="/quiz"
          aria-label="Play Quiz Game"
          title="Play Quiz Game"
          className="
            quiz-circle
            group
            relative
            flex
            h-[58px]
            w-[58px]
            sm:h-[66px]
            sm:w-[66px]
            items-center
            justify-center
            rounded-full
            border-2
            border-amber-400/80
            bg-gradient-to-br
            from-emerald-600
            via-emerald-800
            to-[#022c22]
            text-amber-300
            transition-transform
            duration-200
            ease-out
          "
        >
          {/* Inner circle */}
          <span className="
            absolute
            inset-[5px]
            rounded-full
            border
            border-white/10
          " />

          {/* Game icon */}
          <Gamepad2
            className="
              relative
              z-10
              h-7
              w-7
              sm:h-8
              sm:w-8
              fill-amber-300/10
              transition-transform
              duration-200
              group-hover:rotate-6
            "
            strokeWidth={2}
          />

          {/* Small sparkle */}
          <Sparkles
            className="
              absolute
              right-2
              top-2
              h-3.5
              w-3.5
              text-amber-200
            "
          />

          {/* Notification dot */}
          <span className="
            absolute
            -right-0.5
            -top-0.5
            h-3.5
            w-3.5
            rounded-full
            border-2
            border-[#022c22]
            bg-amber-400
          " />
        </Link>
      </div>
    </>
  );
}
