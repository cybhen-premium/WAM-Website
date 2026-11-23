"use client";

import styles from "./About.module.css";
import { motion } from "framer-motion";

export default function About() {
  const pillars = [
    {
      word: "WORLD",
      desc: "Our global mandate and geographical target to bring the transformative Gospel of Christ to all nations.",
    },
    {
      word: "ARK",
      desc: "Signifying Noah’s Ark—a haven of salvation, divine refuge, and grace where transformed believers thrive.",
    },
    {
      word: "MISSIONS",
      desc: "Our mission-focused heartbeat—using every teaching, gift, and spiritual calling to lead souls to purposeful living.",
    },
  ];

  return (
    <section id="about" className={styles.section}>
      <div className="container">
        <div className={styles.contentWrapper}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className={styles.header}
          >
            <span className="s-badge">Our Heritage</span>
            <h2 className={styles.title}>
              The story <span className="serif-italic text-accent">behind our name.</span>
            </h2>
            <div className={styles.story}>
              <p>
                In 2010, <strong>‘The Ark’</strong> was given to Rev. Benjamin Eturu Adom as the divine name for the ministry. 
                While meditating upon Mark 16:15-16, he received the clear mission mandate, expanding the name to <strong>‘The Ark Missions’</strong>.
              </p>
              <p>
                During an all-night encounter at the World Prayer Centre, God spoke the word <strong>‘World’</strong> into his spirit. 
                Thus, <strong>World Ark Missions</strong> was established to touch hearts, build believers, and release purpose worldwide.
              </p>
            </div>
          </motion.div>

          <div className={styles.pillarsGrid}>
            {pillars.map((pillar, i) => (
              <motion.div
                key={pillar.word}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={styles.pillarCard}
              >
                <h3 className={styles.pillarWord}>{pillar.word}</h3>
                <p className={styles.pillarDesc}>{pillar.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
