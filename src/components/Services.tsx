"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import styles from "./Services.module.css";

const services = [
  {
    id: 1,
    title: "Sunday Service",
    time: "8:00 AM",
    description: "A time of powerful worship and life-changing word.",
    image: "/assets/SUNDAY.jpeg",
  },
  {
    id: 2,
    title: "Wednesday (Know Jesus More)",
    time: "6:30 PM",
    description: "Deep dive into scripture and spiritual growth.",
    image: "/assets/KJMC.jpeg",
  },
  {
    id: 3,
    title: "Friday (Rescue Hour)",
    time: "6:30 PM",
    description: "Intercession, healing, and breakthroughs.",
    image: "/assets/rescue.jpeg",
  },
  {
    id: 4,
    title: "Saturday (Visitation)",
    time: "Saturday AM",
    description: "Saturday morning intercession and community visitation.",
    image: "/assets/COM.jpeg",
  },
];

export default function Services() {
  return (
    <section id="services" className={styles.servicesSection}>
      <div className="container">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className={styles.header}
        >
          <span className={styles.badge}>Our Services</span>
          <h2 className="highlight-text">Join Us For Worship</h2>
          <p className="sub-text">Experience the power of God in our weekly services.</p>
        </motion.div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <motion.div 
              key={service.id} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className={styles.card}
            >
              <div className={styles.cardContent}>
                <div className={styles.textSide}>
                  <span className={styles.number}>{service.id}</span>
                  <h3>{service.title}</h3>
                  <p className={styles.time}>{service.time}</p>
                  <p className={styles.desc}>{service.description}</p>
                </div>
                <div className={styles.imageSide}>
                  <Image src={service.image} alt={service.title} width={600} height={400} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
