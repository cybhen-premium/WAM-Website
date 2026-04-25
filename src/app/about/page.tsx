import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import styles from "./AboutPage.module.css";

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <Navbar />
      
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.heroTitle}>About World Ark Missions</h1>
          <p className={styles.heroSubtitle}>A Place of Salvation, Transformation & Purpose</p>
        </div>
      </section>

      <section className={styles.storySection}>
        <div className="container">
          <div className={styles.storyGrid}>
            <div className={styles.textContent}>
              <span className={styles.badge}>Our Journey</span>
              <h2>The Story Behind Our Name</h2>
              <p>
                In the year 2010, <strong>‘The Ark’</strong> was the initial name given to Rev. Benjamin Eturu Adom 
                as the name for the ministry. One day, while meditating on Mark 16:15-16, he caught the mission-minded 
                assignment. From there, the movement became <strong>‘The Ark Missions’</strong>.
              </p>
              <p>
                The final part of the name was given when he visited the World Prayer Centre for an all-night service. 
                The name <strong>‘World’</strong> struck his spirit, and the Spirit of God told him to include it. 
                Thus, <strong>World Ark Missions</strong> became the name of the church.
              </p>
            </div>
            <div className={styles.imageContent}>
              <Image 
                src="/assets/logo.png" 
                alt="World Ark Missions Logo" 
                width={500} 
                height={500} 
                className={styles.storyLogo}
                priority
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.pillarsSection}>
        <div className="container">
          <div className={styles.pillarsGrid}>
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>W</div>
              <h3>WORLD</h3>
              <p>Indicates the geographical target for our missionary work. We are called to reach the ends of the earth.</p>
            </div>
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>A</div>
              <h3>ARK</h3>
              <p>Represents Noah’s Ark—the only safe haven for the saved. A place of refuge, peace, and spiritual safety.</p>
            </div>
            <div className={styles.pillar}>
              <div className={styles.pillarIcon}>M</div>
              <h3>MISSIONS</h3>
              <p>Indicates our mission-minded nature; using all teachings and gifts to bring people to Christ.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.visionSection}>
        <div className="container">
          <div className={styles.visionGrid}>
            <div className={styles.visionCard}>
              <h3>Our Vision</h3>
              <p>To be a global beacon of hope, bringing the light of Christ to every nation and transforming lives through the power of the Gospel.</p>
            </div>
            <div className={styles.visionCard}>
              <h3>Our Mission</h3>
              <p>To raise a generation of mission-minded believers who are equipped with the Word of God and empowered by the Holy Spirit to rescue souls.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
