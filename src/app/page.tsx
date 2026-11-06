import dynamic from 'next/dynamic';
import HeroSection from '@/components/HeroSection';
import PrincipalAndNewsSection from '@/components/CombinedPrincipalAndNews';
import SchoolMediaVideos from '@/components/SchoolMediaVideos';
import ClubsAndSocieties from '@/components/ClubsAndSocieties';

// Client-side එකේදී පමණක් Leaderboard එක Load වන සේ dynamic import කිරීම
const HomeMobileLeaderboard = dynamic(
  () => import('@/components/HomeMobileLeaderboard'),
  { ssr: false }
);

export default function Home() {
  return (
    <>
      <HeroSection />
      <PrincipalAndNewsSection />
      
      {/* Mobile Leaderboard */}
      <HomeMobileLeaderboard />

      <SchoolMediaVideos />
      <ClubsAndSocieties />
    </>
  );
}