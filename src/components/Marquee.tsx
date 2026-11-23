import styles from "./Marquee.module.css";

export default function Marquee() {
  const marqueeItems = [
    { text: "Salvation", highlight: false },
    { text: "Transformation", highlight: true },
    { text: "Purpose", highlight: false },
    { text: "World Ark Missions", highlight: true },
    { text: "Encounter God", highlight: false },
    { text: "Discover Destiny", highlight: true },
    { text: "Welcome Home", highlight: false },
  ];

  return (
    <section className={styles.marqueeSection} aria-hidden="true">
      <div className="animate-renew-marquee">
        <div className={styles.track}>
          {marqueeItems.map((item, i) => (
            <span key={`a-${i}`} className={styles.item}>
              <span className={item.highlight ? "" : styles.dimWord}>{item.text}</span>
              <span className={styles.star}>✱</span>
            </span>
          ))}
        </div>
        <div className={styles.track}>
          {marqueeItems.map((item, i) => (
            <span key={`b-${i}`} className={styles.item}>
              <span className={item.highlight ? "" : styles.dimWord}>{item.text}</span>
              <span className={styles.star}>✱</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
