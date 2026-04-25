import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Founder from "@/components/Founder";
import Ministries from "@/components/Ministries";
import Services from "@/components/Services";
import Sermons from "@/components/Sermons";
import Events from "@/components/Events";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

import LiveSection from "@/components/LiveSection";

export default function Home() {
  return (
    <main>
      <Navbar />
      <LiveSection />
      <Hero />
      <Founder />
      <Ministries />
      <Services />
      <Sermons />
      <Events />
      <Testimonials />
      <Newsletter />
      <Contact />
      <Footer />
    </main>
  );
}
