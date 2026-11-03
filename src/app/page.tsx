import { HeroSection } from "@/components/home/hero-section";
import { CategoriesSection } from "@/components/home/categories-section";
import { FeaturedSpacesSection } from "@/components/home/featured-spaces-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { HostGuaranteeSection } from "@/components/home/host-guarantee-section";
import { HostBannerSection } from "@/components/home/host-banner-section";
import { WhyStudiospaceSection } from "@/components/home/why-studiospace-section";
import { BecomeHostSection } from "@/components/home/become-host-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { FaqSection } from "@/components/home/faq-section";
import { CtaBannerSection } from "@/components/home/cta-banner-section";

export default function Home() {
  return (
    <>

      <main className="flex flex-col gap-4 pb-4 sm:pb-6">
        <HeroSection />
        <CategoriesSection />
        <FeaturedSpacesSection />
        <HowItWorksSection />
        <HostGuaranteeSection />
        <HostBannerSection />
        <WhyStudiospaceSection />
        <BecomeHostSection />
        <TestimonialsSection />
        <FaqSection />
        <CtaBannerSection />
      </main>
    </>
  );
}
