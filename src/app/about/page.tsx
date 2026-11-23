import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { Compass, Flame, ArrowRight, ShieldCheck } from "lucide-react";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <main className={styles.aboutPage}>
      <Navbar />
      
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBg}>
          <Image 
            src="/assets/abstract-blur-wedding-hall_74190-5228.jpg" 
            alt="World Ark Missions Sanctuary Heritage" 
            fill 
            sizes="100vw"
            className={styles.bgImage}
            priority
          />
          <div className={styles.overlay}></div>
        </div>
        <div className="container">
          <div className={styles.heroContent}>
            <span className="s-badge">Our Calling · Afienya Sanctuary</span>
            <h1 className={styles.heroTitle}>
              Our Heritage &amp; <span className="serif-italic text-accent">Divine Calling.</span>
            </h1>
            <p className={styles.heroSubTitle}>
              A sanctuary birthed by the Holy Spirit to touch hearts, build believers, 
              and release purpose across the nations of the earth.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className={styles.storySection}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.textContent}>
              <span className="s-badge">Origins · 2010 to Present</span>
              <h2 className={styles.sectionTitle}>
                The Story Behind <span className="serif-italic text-accent">Our Name.</span>
              </h2>
              <div className={styles.storyParagraphs}>
                <p>
                  In the year 2010, <strong>‘The Ark’</strong> was the initial name given to Rev. Benjamin Eturu Adom 
                  as the divine name for the ministry. One day, while meditating upon Mark 16:15-16, he caught the 
                  clear mission-minded assignment. From there, the movement expanded to become <strong>‘The Ark Missions’</strong>.
                </p>
                <p>
                  The final dimension of our identity was revealed during an all-night service at the World Prayer Centre. 
                  The word <strong>‘World’</strong> struck his spirit with profound conviction, and the Spirit of God commanded 
                  its inclusion. Thus, <strong>World Ark Missions</strong> became the consecrated name of the church.
                </p>
              </div>

              <div className={styles.founderNote}>
                <p className={styles.founderQuote}>
                  &ldquo;We are an ark of refuge for the lost, an engine of spiritual transformation, 
                  and a launchpad releasing believers into their divine purpose worldwide.&rdquo;
                </p>
                <span className={styles.founderAuthor}>Rev. Benjamin Eturu Adom · Founder</span>
              </div>
            </div>

            <div className={styles.imageContent}>
              <div className={styles.emblemCard}>
                <Image 
                  src="/assets/logo.png" 
                  alt="World Ark Missions Official Crest" 
                  width={260} 
                  height={260} 
                  className={styles.storyLogo}
                  priority
                />
                <p className={styles.emblemCaption}>Official Crest · World Ark Missions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission Section (Redesigned with Architectural Cards) */}
      <section className={styles.visionSection}>
        <div className="container">
          <div className={styles.visionHeader}>
            <span className="s-badge">Core Mandate</span>
            <h2 className={styles.sectionTitle}>
              Vision &amp; <span className="serif-italic text-accent">Mission.</span>
            </h2>
          </div>

          <div className={styles.visionGrid}>
            {/* Vision Card */}
            <div className={styles.visionCard}>
              <div className={styles.cardTopRow}>
                <span className={styles.visionTag}>Global Horizon</span>
                <div className={styles.visionIconBox}>
                  <Compass size={24} />
                </div>
              </div>
              <h3 className={styles.visionTitle}>Our Vision</h3>
              <p className={styles.visionStatement}>
                &ldquo;To be a global beacon of hope, bringing the light of Christ to every nation 
                and transforming lives through the power of the Gospel.&rdquo;
              </p>
              <div className={styles.visionFooter}>
                <ShieldCheck size={16} className="text-accent" />
                <span>Mark 16:15-16 · Matthew 28:19</span>
              </div>
            </div>

            {/* Mission Card */}
            <div className={styles.visionCard}>
              <div className={styles.cardTopRow}>
                <span className={styles.visionTag}>Divine Mandate</span>
                <div className={styles.visionIconBox}>
                  <Flame size={24} />
                </div>
              </div>
              <h3 className={styles.visionTitle}>Our Mission</h3>
              <p className={styles.visionStatement}>
                &ldquo;To raise a generation of mission-minded believers who are equipped with the Word of God 
                and empowered by the Holy Spirit to rescue souls.&rdquo;
              </p>
              <div className={styles.visionFooter}>
                <ShieldCheck size={16} className="text-accent" />
                <span>Salvation · Transformation · Purpose</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className={styles.pillarsSection}>
        <div className="container">
          <div className={styles.pillarsHeader}>
            <span className="s-badge">The Acronym</span>
            <h2 className={styles.sectionTitle}>
              The Three Pillars of <span className="serif-italic text-accent">W · A · M.</span>
            </h2>
          </div>

          <div className={styles.pillarsGrid}>
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>W</div>
              <h3 className={styles.pillarTitle}>WORLD</h3>
              <p className={styles.pillarDesc}>
                Indicates the geographical target for our missionary work. We are commanded to take the Gospel 
                beyond local boundaries to the ends of the earth.
              </p>
            </div>
            
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>A</div>
              <h3 className={styles.pillarTitle}>ARK</h3>
              <p className={styles.pillarDesc}>
                Represents Noah’s Ark—the consecrated safe haven for the preserved. A place of refuge, peace, 
                and spiritual protection against the storms of life.
              </p>
            </div>
            
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>M</div>
              <h3 className={styles.pillarTitle}>MISSIONS</h3>
              <p className={styles.pillarDesc}>
                Reflects our apostolic and evangelistic heartbeat—mobilizing every teaching, ministry, and spiritual 
                gift to bring people to the saving knowledge of Christ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className={styles.aboutCta}>
        <div className="container">
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Experience God With Us This Sunday</h2>
            <p className={styles.ctaDesc}>
              Whether you are seeking answers, looking for spiritual family, or desiring to deepen your walk with God, 
              there is a place reserved for you in Afienya.
            </p>
            <Link href="/#services" className="s-btn">
              Join us this Sunday <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
