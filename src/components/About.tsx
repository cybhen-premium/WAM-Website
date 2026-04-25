import styles from "./About.module.css";

export default function About() {
  return (
    <section id="about" className={styles.aboutSection}>
      <div className="container">
        <div className={styles.content}>
          <span className={styles.badge}>Our History</span>
          <h2 className={styles.title}>The Story Behind Our Name</h2>
          
          <div className={styles.historyText}>
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

          <div className={styles.breakdownGrid}>
            <div className={styles.breakdownItem}>
              <h3>WORLD</h3>
              <p>Indicates the geographical target for our missionary work.</p>
            </div>
            <div className={styles.breakdownItem}>
              <h3>ARK</h3>
              <p>Represents Noah’s Ark—the only safe haven for the saved.</p>
            </div>
            <div className={styles.breakdownItem}>
              <h3>MISSIONS</h3>
              <p>Indicates our mission-minded nature; using all teachings and gifts to bring people to Christ.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
