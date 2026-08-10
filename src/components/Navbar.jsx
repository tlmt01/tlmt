"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { deleteAllCookies } from "../modules/encryption";
import {
  emptyUser,
  initialSessionState,
  useGlobalContext,
} from "../context/Store";
import logo from "../images/tlmt.jpg";

export default function Navbar() {
  const router = useRouter();
  const { state, USER, setState, setUSER, setStateArray, setStateObject } =
    useGlobalContext();
  const isLoggedIn = Boolean(state?.loggedIn && USER?.phone);
  const isAdmin = state?.userType?.toLowerCase() === "admin";
  const displayName =
    USER?.name?.trim() ||
    // .split(" ")[0]
    "Account";
  const navItems = [
    { label: "Home", href: "/" },
    { label: "Services", href: "/services" },
    { label: "Gallery", href: "/gallery" },
    { label: "Track Order", href: "/trackOrder" },
    ...(isAdmin
      ? [
          // { label: "Add Customer", href: "/addCustomer" },
          { label: "New Order", href: "/newOrder" },
          { label: "Manage Orders", href: "/jobOrders" },
          { label: "Manage Users", href: "/regUsers" },
          { label: "Add Worker", href: "/addWorker" },
        ]
      : []),
    ...(state?.userType === "worker" || isAdmin
      ? [{ label: "My Jobs", href: "/viewMyJob" }]
      : []),
  ];

  const logout = () => {
    deleteAllCookies();
    window.localStorage.removeItem("tlmt-auth-session");
    setState(initialSessionState);
    setUSER(emptyUser);
    setStateArray([]);
    setStateObject({});
    router.replace("/login");
  };

  const closeNavbar = () => {
    try {
      const el = document.getElementById("tlmtNavbar");
      if (!el) return;
      if (el.classList.contains("show")) {
        el.classList.remove("show");
        const toggler = document.querySelector(".navbar-toggler");
        if (toggler) toggler.setAttribute("aria-expanded", "false");
      }
    } catch (err) {
      // ignore
    }
  };

  return (
    <nav className="navbar navbar-expand-lg tlmt-navbar sticky-top shadow-sm">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-3" href="/">
          <div className="tlmt-logo-wrapper rounded-circle overflow-hidden border border-2 border-warning shadow-sm">
            <Image
              src={logo}
              alt="The Little Mango Tree logo"
              width={50}
              height={50}
              priority
              className="tlmt-logo"
            />
          </div>
          <div className="d-flex flex-column">
            <span className="tlmt-brand-name">The Little Mango Tree</span>
            <small className="tlmt-brand-tag">
              Inspired by your Fashion Sense
            </small>
          </div>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#tlmtNavbar"
          aria-controls="tlmtNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="tlmtNavbar">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-2">
            {navItems.map((item) => (
              <li className="nav-item" key={item.label}>
                <Link
                  className="nav-link px-3 py-2 rounded-pill"
                  href={item.href}
                  onClick={closeNavbar}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link px-3 py-2 rounded-pill"
                    href="/dashboard"
                    onClick={closeNavbar}
                  >
                    <i className="bi bi-grid-1x2 me-2" />
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link px-3 py-2 rounded-pill"
                    href="/profile"
                    onClick={closeNavbar}
                  >
                    <i className="bi bi-person-gear me-2" />
                    Edit Profile
                  </Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <span className="nav-link px-3 py-2">
                    <i className="bi bi-person-circle me-2" />
                    Hi, {displayName}
                  </span>
                </li>
                <li className="nav-item">
                  <button
                    type="button"
                    onClick={() => {
                      closeNavbar();
                      logout();
                    }}
                    className="btn btn-outline-danger rounded-pill px-3"
                  >
                    <i className="bi bi-box-arrow-right me-2" />
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link px-3 py-2 rounded-pill"
                    href="/login"
                    onClick={closeNavbar}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item ms-lg-2">
                  <Link
                    className="btn btn-outline-dark rounded-pill px-3"
                    href="/contact"
                    onClick={closeNavbar}
                  >
                    <i className="bi bi-calendar-check me-2"></i>Appointment
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
