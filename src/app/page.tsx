import HeroSection from '@/components/HeroSection';
import PrincipalAndNewsSection from '@/components/CombinedPrincipalAndNews';
import SchoolMediaVideos from '@/components/SchoolMediaVideos';
import ClubsAndSocieties from '@/components/ClubsAndSocieties';

export default function Home() {
  return (
    <>
      <HeroSection />
      <PrincipalAndNewsSection />
      <SchoolMediaVideos />
      <ClubsAndSocieties />
    </>
  );
}