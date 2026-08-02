import styles from "./page.module.css";

const featureCards = [
  {
    label: "Signature Edit",
    title: "Tailored essentials for city nights",
    text: "Sculpted silhouettes, muted tones, and quiet confidence.",
  },
  {
    label: "Limited Drop",
    title: "The capsule wardrobe that does it all",
    text: "Clean lines, elevated textures, and one polished statement.",
  },
];

const highlights = [
  "New season arrivals",
  "Smart layering",
  "Soft luxury finishing",
];

export default function HomePage() {
  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.eyebrow}>The Little Mango Tree</span>
          <h1>Modern fashion for a confident everyday statement.</h1>
          <p>
            Discover elevated essentials, understated glamour, and a wardrobe
            designed to move with you from morning meetings to after-dark plans.
          </p>

          <div className={styles.ctaRow}>
            <a href="#collections" className={styles.primaryCta}>
              Explore the edit
            </a>
            <a href="#about" className={styles.secondaryCta}>
              View lookbook
            </a>
          </div>

          <div className={styles.tagRow}>
            {highlights.map((item) => (
              <span key={item} className={styles.tag}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.visualCard}>
            <span>Runway Note</span>
            <strong>Soft tailoring</strong>
            <p>Refined textures, effortless lines, and sharp contrast.</p>
          </div>
          <div className={styles.visualBadge}>2026 / Signature Collection</div>
        </div>
      </section>

      <section className={styles.featureSection} id="collections">
        <div className={styles.sectionHeading}>
          <span className={styles.sectionLabel}>Curated Collections</span>
          <h2>Pieces that feel polished, intentional, and timeless.</h2>
        </div>

        <div className={styles.featureGrid}>
          {featureCards.map((card) => (
            <article key={card.title} className={styles.featureCard}>
              <span className={styles.cardLabel}>{card.label}</span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.storySection} id="about">
        <div>
          <span className={styles.sectionLabel}>Style Story</span>
          <h2>Built around quiet luxury and expressive detail.</h2>
        </div>
        <p>
          This homepage embraces a contemporary fashion language with soft
          contrast, editorial spacing, and refined product-first storytelling.
        </p>
      </section>
    </main>
  );
}
