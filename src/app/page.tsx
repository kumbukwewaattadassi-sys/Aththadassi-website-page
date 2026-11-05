import HeroSection from '@/components/HeroSection';
import PrincipalAndNewsSection from '@/components/CombinedPrincipalAndNews';
import HomeMobileLeaderboard from '@/components/HomeMobileLeaderboard';
import SchoolMediaVideos from '@/components/SchoolMediaVideos';
import ClubsAndSocieties from '@/components/ClubsAndSocieties';

export default function Home() {
  return (
    <>
      <HeroSection />
      
      {/* ප්‍රධාන විදුහල්පති සහ නවතම පුවත් කොටස */}
      <PrincipalAndNewsSection />
      
      {/* Mobile view එකේදී පමණක් නවතම පුවත්වලට යටින් දිස්වන Leaderboard එක */}
      <HomeMobileLeaderboard />

      <SchoolMediaVideos />
      <ClubsAndSocieties />
    </>
  );
}