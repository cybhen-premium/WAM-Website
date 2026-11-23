"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import styles from "./FAQ.module.css";

const faqs = [
  {
    question: "Where is the church located?",
    answer: "We are located in Afienya - Mataheko. Look for the sign at 18up Junction, right next to the Stephen Block Factory; we are just behind it.",
  },
  {
    question: "Can I watch services online?",
    answer: "Yes, we stream live via YouTube and Facebook.",
  },
  {
    question: "How can I volunteer?",
    answer: "Reach out to our leadership team during any service.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className={styles.faqSection}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.header}>
            <h2 className="highlight-text">Frequently Asked Questions</h2>
            <p className="sub-text">Have questions? We are here to help you get started.</p>
          </div>

          <div className={styles.list}>
            {faqs.map((faq, index) => (
              <div key={index} className={styles.item}>
                <button 
                  className={styles.question}
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                >
                  {faq.question}
                  {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </button>
                {openIndex === index && (
                  <div className={styles.answer}>
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
