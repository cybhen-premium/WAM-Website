"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./Testimonials.module.css";
import { motion } from "framer-motion";
import { User } from "lucide-react";

interface Testimonial {
  id?: string;
  name: string;
  role?: string;
  content: string;
  image?: string;
  imageUrl?: string;
}

const defaultTestimonials: Testimonial[] = [
  {
    name: "Sarah Mensah",
    role: "Women of Grace Member",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477251/world-ark-missions/portrait-young-smiling-woman-wearing-sportswear-morning-park_93675-133003.jpg",
    content: "World Ark Missions changed my entire perspective on faith and family. I found warmth, divine purpose, and a sisterhood that truly prays with you.",
  },
  {
    name: "Kwame Asante",
    role: "Youth Leader",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477256/world-ark-missions/smiling-african-american-man-looking_74855-5149.jpg",
    content: "The teachings by Rev. Benjamin Adom challenged me to lead with biblical integrity and pursue my career with Kingdom conviction.",
  },
  {
    name: "Eunice & David Baah",
    role: "Church Family",
    image: "https://res.cloudinary.com/dm5bp1efp/image/upload/v1795477236/world-ark-missions/female-male-patients-applauding_23-2148398348.jpg",
    content: "When we stepped into World Ark Missions in Afienya, we knew we had arrived home. The presence of God during Sunday worship is undeniable.",
  },
];

export default function Testimonials() {
  const [list, setList] = useState<Testimonial[]>(defaultTestimonials);

  useEffect(() => {
    fetch(`/api/testimonials?t=${Date.now()}`, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setList(data);
        }
      })
      .catch((err) => console.error("Failed to load testimonials:", err));
  }, []);

  return (
    <section id="testimonials" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <span className="s-badge">Testimonies</span>
          <h2 className={styles.title}>
            Voices of <span className="serif-italic text-accent">transformation.</span>
          </h2>
        </div>

        <div className={styles.grid}>
          {list.map((t, idx) => {
            const avatarUrl = t.imageUrl || t.image;
            return (
              <motion.div
                key={t.id || t.name + idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className={styles.testimonialCard}
              >
                <p className={styles.quoteText}>
                  &ldquo;{t.content}&rdquo;
                </p>

                <div className={styles.authorRow}>
                  <div className={styles.avatarWrapper}>
                    {avatarUrl ? (
                      <Image 
                        src={avatarUrl} 
                        alt={t.name} 
                        fill 
                        sizes="44px"
                        className={styles.avatar}
                      />
                    ) : (
                      <div style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "rgba(255,255,255,0.1)",
                        color: "#b8d432"
                      }}>
                        <User size={20} />
                      </div>
                    )}
                  </div>
                  <div className={styles.authorMeta}>
                    <strong className={styles.authorName}>{t.name}</strong>
                    <span className={styles.authorRole}>{t.role}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
