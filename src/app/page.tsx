import Footer from "@/components/layout/public/footer";
import Header from "@/components/layout/public/header";
import CtaSection from "@/components/modules/home/cta-section";
import FeaturesSection from "@/components/modules/home/features-section";
import HeroSection from "@/components/modules/home/hero-section";
import HowItWorksSection from "@/components/modules/home/how-it-works-section";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950 font-sans selection:bg-emerald-500 selection:text-white">
      <Header />

      <main className="flex flex-1 flex-col">
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
