import Navbar from "@/components/Navbar";
import LiveSection from "@/components/LiveSection";
import Hero from "@/components/Hero";
import StartHere from "@/components/StartHere";
import Marquee from "@/components/Marquee";
import Founder from "@/components/Founder";
import MissionBanner from "@/components/MissionBanner";
import AgendaSection from "@/components/AgendaSection";
import Ministries from "@/components/Ministries";
import Sermons from "@/components/Sermons";
import About from "@/components/About";
import Events from "@/components/Events";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <LiveSection />
      <Hero />
      <StartHere />
      <Marquee />
      <Founder />
      <MissionBanner />
      <AgendaSection />
      <Ministries />
      <Sermons />
      <About />
      <Events />
      <Testimonials />
      <Newsletter />
      <Footer />
    </main>
  );
}
