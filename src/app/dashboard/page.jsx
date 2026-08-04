"use client";

import Image from "next/image";
import Link from "next/link";
import { useGlobalContext } from "../../context/Store";
import styles from "./dashboard.module.css";

const shortcuts = [
  {
    icon: "bi-calendar2-check",
    title: "Book an appointment",
    text: "Find a time that suits you.",
    href: "/contact",
  },
  {
    icon: "bi-grid-3x3-gap",
    title: "Explore services",
    text: "Discover what feels like you.",
    href: "/services",
  },
  {
    icon: "bi-images",
    title: "View the gallery",
    text: "Save inspiration for later.",
    href: "/gallery",
  },
];

export default function DashboardPage() {
  const { USER } = useGlobalContext();
  const name = USER?.name?.trim() || "there";
  const firstName = name.split(" ")[0];
  const mobile = USER?.phone
    ? `+91 ${USER.phone.slice(0, 5)} ${USER.phone.slice(5)}`
    : "Add a mobile number";
  const profileNeeds = [
    USER?.phone
      ? { icon: "bi-phone-vibrate", title: "Mobile verified", text: mobile }
      : {
          icon: "bi-phone",
          title: "Keep your profile current",
          text: "Add a mobile number for updates.",
        },
    USER?.email
      ? {
          icon: "bi-envelope-check",
          title: "Updates are ready",
          text: USER.email,
        }
      : {
          icon: "bi-envelope",
          title: "Stay in the loop",
          text: "Add an email for appointment updates.",
        },
  ];

  return (
    <main className={styles.dashboard}>
      <section className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>THE LITTLE MANGO TREE</p>
          <h1>
            Hello, {firstName}.
            <br />
            <em>Your style space.</em>
          </h1>
          <p>
            Everything you love about your style journey, gathered in one
            beautiful place.
          </p>
          <div className={styles.quickActions}>
            <Link href="/contact" className={styles.primaryAction}>
              Book an appointment <i className="bi bi-arrow-right" />
            </Link>
            <Link href="/profile" className={styles.primaryAction}>
              Edit profile <i className="bi bi-pencil-square" />
            </Link>
          </div>
        </div>
        <div className={styles.heroMark} aria-hidden="true">
          <span>TLMT</span>
          <i className="bi bi-stars" />
        </div>
      </section>

      <section className={styles.content}>
        <div className={styles.profileBar}>
          {USER?.url ? (
            <div className={styles.profilePhoto}>
              <Image
                src={USER.url}
                alt={`${name}'s profile photo`}
                fill
                sizes="52px"
              />
            </div>
          ) : (
            <div className={styles.avatar} aria-hidden="true">
              {firstName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <span>YOUR PROFILE</span>
            <strong>{name}</strong>
          </div>
          <span className={styles.memberBadge}>
            <i className="bi bi-heart-fill" /> {USER?.userType || "Style"}
          </span>
        </div>
        <div className={styles.sectionHeading}>
          <div>
            <p className={styles.eyebrow}>MAKE IT YOURS</p>
            <h2>What do you need today?</h2>
          </div>
          <span className={styles.status}>
            <i className="bi bi-patch-check-fill" /> Securely signed in
          </span>
        </div>
        <div className={styles.shortcutGrid}>
          {shortcuts.map((shortcut) => (
            <Link
              href={shortcut.href}
              className={styles.shortcut}
              key={shortcut.title}
            >
              <i className={`bi ${shortcut.icon}`} />
              <div>
                <h3>{shortcut.title}</h3>
                <p>{shortcut.text}</p>
              </div>
              <i className="bi bi-arrow-up-right" />
            </Link>
          ))}
        </div>
        <div className={styles.needsGrid}>
          {profileNeeds.map((need) => (
            <div className={styles.need} key={need.title}>
              <i className={`bi ${need.icon}`} />
              <div>
                <span>{need.title}</span>
                <strong>{need.text}</strong>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
