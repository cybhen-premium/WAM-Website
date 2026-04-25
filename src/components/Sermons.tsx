import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./Sermons.module.css";

const sermons = [
  {
    id: 1,
    title: "Living with Purpose",
    speaker: "Rev. Benjamin Adom",
    date: "Oct 24, 2024",
    image: "/assets/person-looking-finance-graphs_52683-116602.jpg",
    category: "Message",
  },
  {
    id: 2,
    title: "Power of Prayer",
    speaker: "Rev. Benjamin Adom",
    date: "Oct 18, 2024",
    image: "/assets/men-city_1157-5053.jpg",
    category: "Rescue Hour",
  },
  {
    id: 3,
    title: "Grace in Crisis",
    speaker: "Rev. Benjamin Adom",
    date: "Oct 11, 2024",
    image: "/assets/businessman-using-his-mobile-phone_53876-25169.jpg",
    category: "Sunday Word",
  },
];

export default function Sermons() {
  return (
    <section id="sermons" className={styles.sermonsSection}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="highlight-text">Sermons & Media Hub</h2>
          <p className="sub-text">Access transformative messages anywhere, anytime.</p>
        </div>

        <div className={styles.grid}>
          {sermons.map((sermon) => (
            <article key={sermon.id} className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image src={sermon.image} alt={sermon.title} width={400} height={400} />
                <span className={styles.category}>{sermon.category}</span>
              </div>
              <div className={styles.content}>
                <h3>{sermon.title}</h3>
                <div className={styles.meta}>
                  <p className={styles.speaker}>{sermon.speaker}</p>
                  <p className={styles.date}>{sermon.date}</p>
                </div>
                <Link href="#" className={styles.readMore}>
                  Read Message
                  <ArrowUpRight size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
