import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <div className={styles.orbOne} aria-hidden="true" />
      <div className={styles.orbTwo} aria-hidden="true" />

      <section className={styles.card}>
        <span className={styles.badge}>The Little Mango Tree</span>

        <div className={styles.codeWrap}>
          <span className={styles.code}>404</span>
        </div>

        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          The page you are looking for may have moved, been removed, or never
          existed. Let’s guide you back to something beautiful.
        </p>

        <div className={styles.actions}>
          <Link href="/" className={styles.primaryButton}>
            Go Home
          </Link>
          <Link href="/dashboard" className={styles.secondaryButton}>
            Open Dashboard
          </Link>
        </div>
      </section>
    </main>
  );
}
