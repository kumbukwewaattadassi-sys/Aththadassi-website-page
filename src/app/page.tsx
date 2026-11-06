import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import PrincipalAndNewsSection from '@/components/CombinedPrincipalAndNews';
import ClubsAndSocieties from '@/components/ClubsAndSocieties';

// 1. Leaderboard එක Client-side පමණක් smooth fallback එකක් සමඟ Load කිරීම (Layout shift වැළැක්වීමට)
const HomeMobileLeaderboard = dynamic(
  () => import('@/components/HomeMobileLeaderboard'),
  { 
    ssr: false,
    loading: () => <div className="h-28 w-full md:hidden bg-transparent" />
  }
);

// 2. Video section එක Below-the-fold component එකක් බැවින් lazy load කර main thread එක නිදහස් කිරීම
const SchoolMediaVideos = dynamic(
  () => import('@/components/SchoolMediaVideos'),
  {
    loading: () => <div className="h-64 w-full bg-slate-50 animate-pulse" />
  }
);

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8FAFC] overflow-x-hidden transform-gpu">
      {/* Above the fold (කෙලින්ම පෙනෙන කොටස්) */}
      <HeroSection />
      
      <PrincipalAndNewsSection />
      
      {/* Mobile Leaderboard */}
      <HomeMobileLeaderboard />

      {/* Below the fold (Scroll කරද්දී පමණක් GPU render වන සේ සැකසූ කොටස්) */}
      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 500px' }}>
        <SchoolMediaVideos />
      </div>

      <div style={{ contentVisibility: 'auto', containIntrinsicSize: '0 400px' }}>
        <ClubsAndSocieties />
      </div>
    </main>
  );
}