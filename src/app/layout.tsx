import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import NoticeTicker from '@/components/NoticeTicker';

export const metadata: Metadata = {
  title: 'පු/කුඹුක්වැව අත්ථදස්සි කනිෂ්ඨ විද්‍යාලය | Aththadassi Junior School',
  description: 'Excellence in Education, Sports and Discipline - Official School Portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="si">
      <body className="flex flex-col min-h-screen bg-[#F8FAFC]">
        {/* Single Top Bar Notice */}
        <NoticeTicker />
        
        {/* Sticky Modern Navbar */}
        <Navbar />

        <main className="flex-grow">
          {children}
        </main>
        
        <Footer />
      </body>
    </html>
  );
}