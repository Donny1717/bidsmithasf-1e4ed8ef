import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import PricingSection from '@/components/landing/PricingSection';
import SignatureSection from '@/components/landing/SignatureSection';
import SectorsSection from '@/components/landing/SectorsSection';
import ComplianceSection from '@/components/landing/ComplianceSection';
import CapabilitiesSection from '@/components/landing/CapabilitiesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import FAQSection from '@/components/landing/FAQSection';
import Footer from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <PricingSection />
      <SignatureSection />
      <SectorsSection />
      <ComplianceSection />
      <CapabilitiesSection />
      <TestimonialsSection />
      <FAQSection />
      <Footer />
    </div>
  );
};

export default Index;
