import { Heart, Landmark, Smartphone, Copy, Check } from "lucide-react";
import styles from "./Giving.module.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function GivingPage() {
  return (
    <>
      <Navbar />
      <main className={styles.givingPage}>
        <section className={styles.hero}>
          <div className="container">
            <div className={styles.heroContent}>
              <Heart size={48} color="#ff7e33" />
              <h1>Support Our Mission</h1>
              <p>
                Your generosity helps us reach more lives with the message of salvation 
                and transformation. Thank you for partnering with World Ark Missions.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.methods}>
          <div className="container">
            <div className={styles.grid}>
              {/* Mobile Money */}
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Smartphone size={32} />
                </div>
                <h2>Mobile Money</h2>
                <p>Quick and easy giving through MTN or Telecel Cash.</p>
                
                <div className={styles.paymentInfo}>
                  <div className={styles.infoRow}>
                    <span>Merchant Name</span>
                    <strong>World Ark Missions</strong>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Merchant ID</span>
                    <code className={styles.code}>123456</code>
                  </div>
                </div>
                
                <div className={styles.instruction}>
                  <p>Dial <strong>*170#</strong> and use the Merchant ID above.</p>
                </div>
              </div>

              {/* Bank Transfer */}
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <Landmark size={32} />
                </div>
                <h2>Bank Transfer</h2>
                <p>Direct deposits or transfers to our official bank account.</p>
                
                <div className={styles.paymentInfo}>
                  <div className={styles.infoRow}>
                    <span>Bank</span>
                    <strong>Ecobank Ghana</strong>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Account Name</span>
                    <strong>World Ark Missions</strong>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Account Number</span>
                    <code className={styles.code}>0000000000000</code>
                  </div>
                </div>

                <div className={styles.instruction}>
                  <p>Please use "Offering" or "Tithe" as your reference.</p>
                </div>
              </div>
            </div>

            <div className={styles.verse}>
              <blockquote>
                "Each of you should give what you have decided in your heart to give, 
                not reluctantly or under compulsion, for God loves a cheerful giver."
              </blockquote>
              <cite>— 2 Corinthians 9:7</cite>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
