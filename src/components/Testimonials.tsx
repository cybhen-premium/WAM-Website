"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./Testimonials.module.css";

const testimonials = [
  {
    id: 1,
    name: "John Doe",
    date: "Oct 2024",
    category: "Healing",
    title: "Miraculous Healing",
    content: "I came in broken and left whole. The prayer sessions and the support from the church community were instrumental in my recovery. I am a living testimony of God's power.",
    image: "/assets/11.jpg",
    bgImage: "/assets/11.jpg"
  },
  {
    id: 2,
    name: "Sarah Mensah",
    date: "Sep 2024",
    category: "Purpose",
    title: "New Purpose",
    content: "I found a family and a community that truly cares. My life has a clear direction now. Every service feels like a step closer to my destiny.",
    image: "/assets/12.jpg",
    bgImage: "/assets/12.jpg"
  },
  {
    id: 3,
    name: "Emmanuel Addo",
    date: "Aug 2024",
    category: "Study",
    title: "Spiritual Growth",
    content: "Deep and refreshing. The teachings at World Ark Mission have opened my eyes to the power of the Word. I am growing every single day.",
    image: "/assets/13.jpg",
    bgImage: "/assets/13.jpg"
  },
  {
    id: 4,
    name: "Mercy Boateng",
    date: "July 2024",
    category: "Family",
    title: "Restored Family",
    content: "Through the marriage counseling and prayers at WAM, my home has been restored. We have found a new way to love and support each other as a family.",
    image: "/assets/14.jpg",
    bgImage: "/assets/14.jpg"
  },
  {
    id: 5,
    name: "David Kojo",
    date: "June 2024",
    category: "Provision",
    title: "Financial Breakthrough",
    content: "The principles of tithing and stewardship taught here changed my perspective. I've seen God's faithfulness in my business and personal finances.",
    image: "/assets/15.jpg",
    bgImage: "/assets/15.jpg"
  },
  {
    id: 6,
    name: "Linda Appiah",
    date: "May 2024",
    category: "Peace",
    title: "Peace in the Storm",
    content: "In a very dark season of loss, this church was my anchor. The peace I found through the worship and community is something I can't explain.",
    image: "/assets/16.jpg",
    bgImage: "/assets/16.jpg"
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const scrollToSlide = useCallback((index: number) => {
    if (scrollRef.current) {
      const clientWidth = scrollRef.current.clientWidth;
      scrollRef.current.scrollTo({
        left: index * clientWidth,
        behavior: "smooth"
      });
      setActiveIndex(index);
    }
  }, []);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  useEffect(() => {
    if (!isPaused) {
      autoplayTimerRef.current = setInterval(() => {
        const nextIndex = (activeIndex + 1) % testimonials.length;
        scrollToSlide(nextIndex);
      }, 5000); // 5 seconds interval
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current);
      }
    };
  }, [activeIndex, isPaused, scrollToSlide]);

  return (
    <section id="testimonials" className={styles.testimonialSection}>
      <div className={styles.headerContainer}>
        <div className="container">
          <div className={styles.header}>
            <h2 className="highlight-text">Transformed Lives</h2>
            <p className={styles.subText}>Hear how our community has found purpose, healing, and home.</p>
          </div>
        </div>
      </div>

      <div className={styles.marqueeWrapper}>
        <div className={styles.marqueeContent}>
          {[...testimonials, ...testimonials].map((t, index) => (
            <div key={`${t.id}-${index}`} className={styles.card}>
              <div className={styles.contentSide}>
                <div className={styles.contentTop}>
                  <span className={styles.category}>{t.category}</span>
                  <div className={styles.textGroup}>
                    <h3>{t.title}</h3>
                    <blockquote className={styles.quote}>"{t.content}"</blockquote>
                  </div>
                </div>
                
                <div className={styles.authorInfo}>
                  <div className={styles.avatarWrapper}>
                    <Image 
                      src={t.image} 
                      alt={t.name} 
                      fill 
                      className={styles.avatar}
                    />
                  </div>
                  <div className={styles.authorMeta}>
                    <strong>{t.name}</strong>
                    <span>{t.date}</span>
                  </div>
                </div>
              </div>

              <div className={styles.imageSide}>
                <Image 
                  src={t.bgImage} 
                  alt="Community Life" 
                  fill 
                  className={styles.mainImage}
                  priority
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
