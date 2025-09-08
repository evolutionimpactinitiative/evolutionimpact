import AboutUsSection from "@/components/About";
import ContactSection from "@/components/Contact";
import DonationSection from "@/components/Donation";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import JoinMovementSection from "@/components/Movement";
import Navbar from "@/components/Navbar";
import OurPillarsSection from "@/components/OurPillars";
import ProjectsSection from "@/components/Projects";
import SubscriptionSection from "@/components/Subscription";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero/>
      <AboutUsSection />
      <OurPillarsSection />
      <ProjectsSection />
      <SubscriptionSection/>
      <DonationSection />
      <JoinMovementSection />
      <ContactSection />
      <Footer />
    </>
  );
}
