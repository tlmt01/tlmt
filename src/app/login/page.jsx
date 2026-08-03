"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { OTPWidget } from "@msg91comm/sendotp-sdk";
import { titleCase } from "../../modules/calculatefunctions";
import Loader from "../../components/Loader";
import { useFirebase } from "../../context/FirebaseContext";
import { initialSessionState, useGlobalContext } from "../../context/Store";
import { encryptObjData } from "../../modules/encryption";
import logo from "../../images/tlmt.jpg";
import styles from "./login.module.css";

const OTP_LENGTH = 6;
const DEBUG_LOGIN_MOBILE = "9933684468";
const isDebugMode = process.env.NODE_ENV !== "production";

export default function LoginPage() {
  const router = useRouter();
  const widgetId = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID;
  const authToken = process.env.NEXT_PUBLIC_MSG91_AUTH_TOKEN;
  const otpInputs = useRef([]);
  const { getUserByPhone } = useFirebase();
  const { setUSER, setState, state } = useGlobalContext();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [displayLoader, setDisplayLoader] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [reqId, setReqId] = useState("");
  const [needsRegistration, setNeedsRegistration] = useState(false);
  const [newUser, setNewUser] = useState({
    userType: "customer",
    desig: "customer",
    disabled: false,
    email: "",
    empid: "",
    id: "",
    phone: "",
    photoName: "",
    customerID: "",
    name: "",
    url: "",
  });
  useEffect(() => {
    if (widgetId && authToken) {
      OTPWidget.initializeWidget(widgetId, authToken);
    }
  }, [widgetId, authToken]);

  useEffect(() => {
    if (!countdown) return undefined;
    const timer = window.setTimeout(
      () => setCountdown((time) => time - 1),
      1000,
    );
    return () => window.clearTimeout(timer);
  }, [countdown]);

  const startResendTimer = () => {
    setCountdown(30);
  };

  const completeLoginSession = (profile) => {
    const loggedInUser = {
      ...newUser,
      ...profile,
      phone: profile.phone || phone,
      name: profile.name || name,
      userType: profile.userType || "admin",
      desig: profile.desig || "admin",
      loggedIn: true,
      authReady: true,
    };

    encryptObjData("user", loggedInUser, 15 * 24 * 60);
    window.localStorage.setItem(
      "tlmt-auth-session",
      JSON.stringify(loggedInUser),
    );
    setUSER(loggedInUser);
    setState({
      ...initialSessionState,
      ...loggedInUser,
      loggedIn: true,
      authReady: true,
    });
    setPhone("");
    setName("");
    setOtp(Array(OTP_LENGTH).fill(""));
    setOtpSent(false);
    setReqId("");
    setCountdown(0);
    setNeedsRegistration(false);
    toast.success("You are successfully logged in!");
    router.replace("/dashboard");
  };

  const sendVerificationOTP = async () => {
    const normalizedPhone = phone.replace(/\D/g, "").slice(-10);
    if (!/^\d{10}$/.test(normalizedPhone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    setDisplayLoader(true);
    try {
      let profile = await getUserByPhone(normalizedPhone);

      if (!profile && isDebugMode && normalizedPhone === DEBUG_LOGIN_MOBILE) {
        profile = {
          name: "Debug Admin",
          phone: normalizedPhone,
          email: "admin@debug.local",
          userType: "admin",
          desig: "admin",
          disabled: false,
          empid: "DEBUG-001",
          id: "DEBUG-001",
          photoName: "",
          customerID: "DEBUG-001",
          url: "",
          address: "Debug Mode",
        };
      }

      if (!profile) {
        setNeedsRegistration(true);
        return;
      }

      setNeedsRegistration(false);
      if (!name && profile.name) setName(profile.name);
      setUSER((current) => ({
        ...current,
        ...profile,
        name: profile.name || name,
        phone: profile.phone || normalizedPhone,
      }));
      setNewUser((current) => ({
        ...current,
        ...profile,
        name: profile.name || name,
        phone: profile.phone || normalizedPhone,
      }));

      if (isDebugMode && normalizedPhone === DEBUG_LOGIN_MOBILE) {
        setDisplayLoader(false);
        completeLoginSession(profile);
        return;
      }
    } catch {
      toast.error("We could not check your profile. Please try again.");
      return;
    } finally {
      setDisplayLoader(false);
    }

    if (!widgetId || !authToken) {
      toast.error("OTP service is not configured. Please contact support.");
      return;
    }

    setDisplayLoader(true);
    try {
      const response = await OTPWidget.sendOTP({
        identifier: `91${normalizedPhone}`,
      });
      if (response.type === "success") {
        setReqId(response.message);
        setOtpSent(true);
        startResendTimer();
        toast.success("OTP sent to your mobile number.");
        window.setTimeout(() => otpInputs.current[0]?.focus(), 150);
      } else {
        toast.error("We could not send an OTP. Please try again.");
      }
    } catch {
      toast.error("We could not send an OTP. Please try again.");
    } finally {
      setDisplayLoader(false);
    }
  };

  const resendOTP = async () => {
    if (!reqId) return;
    setDisplayLoader(true);
    try {
      const response = await OTPWidget.retryOTP({ reqId, retryChannel: 11 });
      if (response.type === "success") {
        startResendTimer();
        toast.success("A fresh OTP is on its way.");
      } else {
        toast.error("We could not resend the OTP. Please try again.");
      }
    } catch {
      toast.error("We could not resend the OTP. Please try again.");
    } finally {
      setDisplayLoader(false);
    }
  };

  const verifyOTP = async (event) => {
    event?.preventDefault();
    const mobileOTP = otp.join("");
    const normalizedPhone = phone.replace(/\D/g, "").slice(-10);

    if (isDebugMode && normalizedPhone === DEBUG_LOGIN_MOBILE) {
      completeLoginSession(newUser);
      return;
    }

    if (mobileOTP.length !== OTP_LENGTH) {
      toast.error("Please enter the complete 6-digit OTP.");
      return;
    }

    setDisplayLoader(true);
    try {
      const response = await OTPWidget.verifyOTP({ otp: mobileOTP, reqId });
      if (response.type === "success") {
        completeLoginSession(newUser);
      } else {
        toast.error("That OTP is not valid. Please try again.");
      }
    } catch {
      toast.error("We could not verify the OTP. Please try again.");
    } finally {
      setDisplayLoader(false);
    }
  };

  const updateOtp = (value, index) => {
    const digits = value.replace(/\D/g, "");
    if (!digits) {
      setOtp((current) =>
        current.map((digit, i) => (i === index ? "" : digit)),
      );
      return;
    }

    const next = [...otp];
    digits
      .slice(0, OTP_LENGTH - index)
      .split("")
      .forEach((digit, offset) => {
        next[index + offset] = digit;
      });
    setOtp(next);
    const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
    window.setTimeout(() => otpInputs.current[nextIndex]?.focus(), 0);
  };

  const handleOtpKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const changeNumber = () => {
    setOtpSent(false);
    setOtp(Array(OTP_LENGTH).fill(""));
    setReqId("");
    setCountdown(0);
  };
  useEffect(() => {
    if (state?.loggedIn) {
      router.replace("/dashboard");
      return;
    }
  }, []);
  return (
    <main className={styles.loginPage}>
      {displayLoader && <Loader />}
      <section className={styles.showcase} aria-label="The Little Mango Tree">
        <div className={styles.glowOne} />
        <div className={styles.glowTwo} />
        <div className={styles.showcaseContent}>
          <div className={styles.brandLockup}>
            <div className={styles.logoRing}>
              <Image
                src={logo}
                alt="The Little Mango Tree"
                fill
                sizes="88px"
                priority
              />
            </div>
            <span>THE LITTLE MANGO TREE</span>
          </div>
          <p className={styles.eyebrow}>YOUR STYLE, SECURED</p>
          <h1>
            A little more <em>you</em>
            <br />
            in every detail.
          </h1>
          <p className={styles.showcaseText}>
            Sign in to manage your appointments, discover handpicked looks, and
            keep your style journey close.
          </p>
          <div className={styles.featureRow}>
            <span>
              <i className="bi bi-shield-check" /> Secure sign in
            </span>
            <span>
              <i className="bi bi-lightning-charge" /> Fast &amp; simple
            </span>
          </div>
        </div>
        <p className={styles.footerNote}>Inspired by your fashion sense</p>
      </section>

      <section className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.mobileBrand}>
            <div className={styles.mobileLogo}>
              <Image src={logo} alt="" fill sizes="54px" />
            </div>
            <span>THE LITTLE MANGO TREE</span>
          </div>
          <div className={styles.stepLabel}>
            <span>{otpSent ? "02" : "01"}</span> OF 02 &mdash; SECURE ACCESS
          </div>
          {!otpSent ? (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendVerificationOTP();
              }}
            >
              <h2>Welcome Dear</h2>
              {/* <p className={styles.intro}>Enter your number and we&apos;ll send a one-time code to securely sign you in.</p>
              <label className={styles.fieldLabel} htmlFor="name">YOUR NAME <small>OPTIONAL</small></label>
              <div className={styles.inputShell}>
                <i className="bi bi-person" />
                <input id="name" type="text" value={name} onChange={(event) => setName(event.target.value)} placeholder="How should we greet you?" autoComplete="name" />
              </div> */}
              <label className={styles.fieldLabel} htmlFor="mobile">
                MOBILE NUMBER
              </label>
              <div className={styles.phoneGroup}>
                <div className={styles.countryCode}>
                  <span>🇮🇳</span> +91
                </div>
                <div className={`${styles.inputShell} ${styles.phoneInput}`}>
                  <i className="bi bi-phone" />
                  <input
                    id="mobile"
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    value={phone}
                    onChange={(event) => {
                      setPhone(
                        event.target.value.replace(/\D/g, "").slice(0, 10),
                      );
                      setNeedsRegistration(false);
                    }}
                    placeholder="Enter 10-digit number"
                    autoComplete="tel"
                  />
                </div>
              </div>
              {needsRegistration && (
                <div className={styles.registrationNotice}>
                  <i className="bi bi-person-plus" />
                  <div>
                    <strong>
                      We couldn&apos;t find a profile for this number.
                    </strong>
                    <span>
                      Create your profile once to continue with secure sign in.
                    </span>
                  </div>
                  <a href={`/register?phone=${phone}`}>
                    Register now <i className="bi bi-arrow-up-right" />
                  </a>
                </div>
              )}
              <button type="submit" className={styles.primaryButton}>
                Send secure code <i className="bi bi-arrow-right" />
              </button>
              <p className={styles.privacy}>
                <i className="bi bi-lock-fill" /> Your number is used only to
                verify your identity.
              </p>
              <a
                className={styles.secondaryLink}
                href={phone ? `/register?phone=${phone}` : "/register"}
              >
                New here? Create your profile{" "}
                <i className="bi bi-arrow-right" />
              </a>
            </form>
          ) : (
            <form onSubmit={verifyOTP}>
              <h2>Check your phone</h2>
              <p className={styles.intro}>
                Hi {name ? titleCase(name) : "there"}, we sent a 6-digit code to{" "}
                <strong>
                  +91 {phone.slice(0, 5)} {phone.slice(5)}
                </strong>
                .
              </p>
              <div className={styles.otpLabelRow}>
                <label className={styles.fieldLabel}>
                  ENTER VERIFICATION CODE
                </label>
                <span>6 DIGITS</span>
              </div>
              <div className={styles.otpFields}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(element) => {
                      otpInputs.current[index] = element;
                    }}
                    value={digit}
                    onChange={(event) => updateOtp(event.target.value, index)}
                    onKeyDown={(event) => handleOtpKeyDown(event, index)}
                    onPaste={(event) => {
                      event.preventDefault();
                      updateOtp(event.clipboardData.getData("text"), index);
                    }}
                    type="text"
                    inputMode="numeric"
                    autoComplete={index === 0 ? "one-time-code" : "off"}
                    maxLength="1"
                    aria-label={`Digit ${index + 1}`}
                  />
                ))}
              </div>
              <button type="submit" className={styles.primaryButton}>
                Verify &amp; continue <i className="bi bi-arrow-right" />
              </button>
              <div className={styles.resendRow}>
                {countdown > 0 ? (
                  <span>
                    Resend code in{" "}
                    <strong>00:{String(countdown).padStart(2, "0")}</strong>
                  </span>
                ) : (
                  <span>Didn&apos;t receive a code?</span>
                )}
                <button
                  type="button"
                  onClick={resendOTP}
                  disabled={countdown > 0}
                >
                  Resend code
                </button>
              </div>
              <button
                type="button"
                className={styles.changeNumber}
                onClick={changeNumber}
              >
                <i className="bi bi-arrow-left" /> Change mobile number
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
