import Header from "../components/Header";
import Hero from "../components/Hero";
import InfoSection from "../components/InfoSection";
import MobileFrame from "../components/MobileFrame";

export default function LandingPage() {
  return (
    <div
      data-theme="light"
      className="min-h-screen max-w-sm mx-auto bg-[#F5F0E6]"
    >
      <Header />
      <Hero />
      <InfoSection />
      <MobileFrame />
    </div>
  );
}
