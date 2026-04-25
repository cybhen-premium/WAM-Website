import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import styles from "./Events.module.css";

const events = [
  {
    id: 1,
    title: "Global Missions Summit",
    type: "Conference",
    image: "/assets/grayscale-shot-old-building-interior-surrounded-by-lights_181624-11774.jpg",
  },
  {
    id: 2,
    title: "Youth Awakening Retreat",
    type: "Retreat",
    image: "/assets/hotel-entrance-unfocused_1203-762.jpg",
  },
  {
    id: 3,
    title: "Community Outreach Day",
    type: "Outreach",
    image: "/assets/abstract-blur-wedding-hall_74190-5228.jpg",
  },
];

export default function Events() {
  return (
    <section id="events" className={styles.eventsSection}>
      <div className="container">
        <div className={styles.header}>
          <h2 className="highlight-text">Upcoming Events</h2>
          <p className="sub-text">Never miss an opportunity to connect and grow.</p>
        </div>

        <div className={styles.grid}>
          {events.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.imageWrapper}>
                <Image src={event.image} alt={event.title} width={600} height={400} />
              </div>
              <div className={styles.info}>
                <div className={styles.text}>
                  <h3>{event.title}</h3>
                  <p>{event.type}</p>
                </div>
                <Link href="#" className={styles.iconLink}>
                  <ArrowUpRight size={24} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
