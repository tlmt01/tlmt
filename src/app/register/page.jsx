"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { OTPWidget } from "@msg91comm/sendotp-sdk";
import Loader from "../../components/Loader";
import { useFirebase } from "../../context/FirebaseContext";
import logo from "../../images/tlmt.jpg";
import styles from "../login/login.module.css";
import { v4 as uuid } from "uuid";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className={styles.loginPage} />}>
      <RegisterPageContent />
    </Suspense>
  );
}

function RegisterPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { registerUserProfile, uploadUserPhoto, verifyEmailOTP } =
    useFirebase();
  const widgetId = process.env.NEXT_PUBLIC_MSG91_WIDGET_ID;
  const authToken = process.env.NEXT_PUBLIC_MSG91_AUTH_TOKEN;
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState(() =>
    (searchParams.get("phone") || "").replace(/\D/g, "").slice(-10),
  );
  const [email, setEmail] = useState("");
  const [displayLoader, setDisplayLoader] = useState(false);
  const [id] = useState(uuid().split("-")[0]);
  const [customerID] = useState(uuid().split("-")[0]);
  const [photoName, setPhotoName] = useState("");
  const [url, setUrl] = useState("");
  const [userType] = useState("customer");
  const [desig] = useState("customer");
  const [disabled] = useState(false);
  const [empid] = useState(uuid().split("-")[0]);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [cropSource, setCropSource] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [mobileReqId, setMobileReqId] = useState("");
  const [mobileOtp, setMobileOtp] = useState("");
  const [mobileOtpSent, setMobileOtpSent] = useState(false);
  const [mobileVerified, setMobileVerified] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const imageRef = useRef(null);

  useEffect(() => {
    if (widgetId && authToken) OTPWidget.initializeWidget(widgetId, authToken);
  }, [widgetId, authToken]);

  const createCenteredCrop = (width, height) =>
    centerCrop(
      makeAspectCrop({ unit: "%", width: 88 }, 1, width, height),
      width,
      height,
    );

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      event.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Please choose an image smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    if (cropSource) URL.revokeObjectURL(cropSource);
    if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);
    setSelectedPhoto(null);
    setPhotoName("");
    setUrl("");
    setThumbnailUrl("");
    setPhotoName(file.name);
    setCropSource(URL.createObjectURL(file));
  };

  const handleCropImageLoad = (event) => {
    const { width, height } = event.currentTarget;
    const centeredCrop = createCenteredCrop(width, height);
    setCrop(centeredCrop);
    setCompletedCrop({
      unit: "px",
      x: (centeredCrop.x / 100) * width,
      y: (centeredCrop.y / 100) * height,
      width: (centeredCrop.width / 100) * width,
      height: (centeredCrop.height / 100) * height,
    });
  };

  const applyCrop = async () => {
    const image = imageRef.current;
    if (!image || !completedCrop?.width || !completedCrop?.height) return;

    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const sourceX = completedCrop.x * scaleX;
    const sourceY = completedCrop.y * scaleY;
    const sourceWidth = completedCrop.width * scaleX;
    const sourceHeight = completedCrop.height * scaleY;
    const outputSize = Math.min(
      900,
      Math.round(Math.min(sourceWidth, sourceHeight)),
    );
    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;
    const context = canvas.getContext("2d");
    if (!context) return;
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      outputSize,
      outputSize,
    );

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.82),
    );
    if (!blob) {
      toast.error("We could not prepare your photo. Please try again.");
      return;
    }

    const compressedPhoto = new File([blob], `profile-${id}.jpg`, {
      type: "image/jpeg",
    });
    setSelectedPhoto(compressedPhoto);
    setThumbnailUrl(URL.createObjectURL(compressedPhoto));
    URL.revokeObjectURL(cropSource);
    setCropSource("");
    toast.success("Photo cropped and optimized for upload.");
  };

  const cancelCrop = () => {
    URL.revokeObjectURL(cropSource);
    setCropSource("");
    setPhotoName("");
  };

  const sendMobileOTP = async () => {
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit mobile number first.");
      return;
    }
    if (!widgetId || !authToken) {
      toast.error("OTP service is not configured. Please contact support.");
      return;
    }
    setDisplayLoader(true);
    try {
      const response = await OTPWidget.sendOTP({ identifier: `91${phone}` });
      if (response.type !== "success") throw new Error();
      setMobileReqId(response.message);
      setMobileOtpSent(true);
      toast.success("Mobile OTP sent.");
    } catch {
      toast.error("We could not send the mobile OTP. Please try again.");
    } finally {
      setDisplayLoader(false);
    }
  };

  const verifyMobileOTP = async () => {
    if (mobileOtp.length !== 6) {
      toast.error("Please enter the 6-digit mobile OTP.");
      return;
    }
    setDisplayLoader(true);
    try {
      const response = await OTPWidget.verifyOTP({
        otp: mobileOtp,
        reqId: mobileReqId,
      });
      if (response.type !== "success") throw new Error();
      setMobileVerified(true);
      toast.success("Mobile number verified.");
    } catch {
      toast.error("That mobile OTP is not valid. Please try again.");
    } finally {
      setDisplayLoader(false);
    }
  };

  const sendEmailOTP = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address first.");
      return;
    }
    setDisplayLoader(true);
    try {
      const response = await fetch("/api/sendOTP", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: name || "there",
        }),
      });
      if (!response.ok) throw new Error();
      setEmailOtpSent(true);
      toast.success("Email OTP sent.");
    } catch {
      toast.error("We could not send the email OTP. Please try again.");
    } finally {
      setDisplayLoader(false);
    }
  };

  const verifyEmailCode = async () => {
    if (emailOtp.length !== 6) {
      toast.error("Please enter the 6-digit email OTP.");
      return;
    }
    setDisplayLoader(true);
    try {
      const isVerified = await verifyEmailOTP({ email, otp: emailOtp });
      if (!isVerified) throw new Error();
      setEmailVerified(true);
      toast.success("Email address verified.");
    } catch {
      toast.error("That email OTP is not valid or has expired.");
    } finally {
      setDisplayLoader(false);
    }
  };

  const registerProfile = async (event) => {
    event.preventDefault();
    if (name.trim().length < 2) {
      toast.error("Please enter your name.");
      return;
    }
    if (!/^\d{10}$/.test(phone)) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!mobileVerified) {
      toast.error("Please verify your mobile number before registering.");
      return;
    }
    if (!emailVerified) {
      toast.error("Please verify your email address before registering.");
      return;
    }
    if (!address.trim()) {
      toast.error("Please enter your address.");
      return;
    }
    setDisplayLoader(true);
    try {
      let uploadedUrl = url;
      let uploadedPhotoName = photoName;
      if (selectedPhoto) {
        setPhotoUploading(true);
        const uploadedPhoto = await uploadUserPhoto({
          file: selectedPhoto,
          userId: id,
        });
        uploadedUrl = uploadedPhoto.url || "";
        uploadedPhotoName = uploadedPhoto.photoName || "";
        setUrl(uploadedUrl);
        if (!uploadedUrl) {
          toast.warning(
            "Photo upload could not be completed, continuing without the profile photo.",
          );
        }
      }
      await registerUserProfile({
        name,
        phone,
        email,
        id,
        userType,
        desig,
        disabled,
        empid,
        photoName: uploadedPhotoName,
        customerID,
        url: uploadedUrl,
        address,
      });
      toast.success(
        "Your profile is ready. Please verify your number to sign in.",
      );
      router.push("/login");
    } catch (error) {
      toast.error(
        error.message || "We could not create your profile. Please try again.",
      );
    } finally {
      setPhotoUploading(false);
      setDisplayLoader(false);
    }
  };

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
          <p className={styles.eyebrow}>BEGIN YOUR STYLE JOURNEY</p>
          <h1>
            Made to feel
            <br />
            <em>like you.</em>
          </h1>
          <p className={styles.showcaseText}>
            Create your profile once, then use a quick, secure one-time code
            whenever you return.
          </p>
          <div className={styles.featureRow}>
            <span>
              <i className="bi bi-person-heart" /> Your personal profile
            </span>
            <span>
              <i className="bi bi-shield-check" /> Protected access
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
            <span>NEW</span> PROFILE &mdash; GET STARTED
          </div>
          <form onSubmit={registerProfile}>
            <h2>Let&apos;s get acquainted</h2>
            <p className={styles.intro}>
              A few details are all we need to create your personal style
              profile.
            </p>
            <label className={styles.fieldLabel} htmlFor="register-name">
              YOUR NAME
            </label>
            <div className={styles.inputShell}>
              <i className="bi bi-person" />
              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value.toUpperCase())}
                placeholder="Enter your full name"
                autoComplete="name"
                required
              />
            </div>
            <label className={styles.fieldLabel} htmlFor="register-mobile">
              MOBILE NUMBER
            </label>
            <div className={styles.phoneGroup}>
              <div className={styles.countryCode}>
                <span>🇮🇳</span> +91
              </div>
              <div className={`${styles.inputShell} ${styles.phoneInput}`}>
                <i className="bi bi-phone" />
                <input
                  id="register-mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  value={phone}
                  onChange={(event) => {
                    setPhone(
                      event.target.value.replace(/\D/g, "").slice(0, 10),
                    );
                    setMobileVerified(false);
                    setMobileOtpSent(false);
                    setMobileOtp("");
                  }}
                  placeholder="Enter 10-digit number"
                  autoComplete="tel"
                  required
                />
              </div>
            </div>
            <div className={styles.verificationAction}>
              <span className={mobileVerified ? styles.verified : ""}>
                <i
                  className={`bi ${mobileVerified ? "bi-patch-check-fill" : "bi-phone"}`}
                />{" "}
                {mobileVerified
                  ? "Mobile verified"
                  : "Verify your mobile number"}
              </span>
              <button
                type="button"
                onClick={sendMobileOTP}
                disabled={mobileVerified}
              >
                {mobileOtpSent ? "Resend OTP" : "Send OTP"}
              </button>
            </div>
            {mobileOtpSent && !mobileVerified && (
              <div className={styles.otpCodeRow}>
                <input
                  value={mobileOtp}
                  onChange={(event) =>
                    setMobileOtp(
                      event.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  placeholder="Enter 6-digit mobile OTP"
                />
                <button type="button" onClick={verifyMobileOTP}>
                  Verify
                </button>
              </div>
            )}
            <label className={styles.fieldLabel} htmlFor="register-email">
              EMAIL ADDRESS
            </label>
            <div className={styles.inputShell}>
              <i className="bi bi-envelope" />
              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setEmailVerified(false);
                  setEmailOtpSent(false);
                  setEmailOtp("");
                }}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>
            <div className={styles.verificationAction}>
              <span className={emailVerified ? styles.verified : ""}>
                <i
                  className={`bi ${emailVerified ? "bi-patch-check-fill" : "bi-envelope"}`}
                />{" "}
                {emailVerified ? "Email verified" : "Verify your email address"}
              </span>
              <button
                type="button"
                onClick={sendEmailOTP}
                disabled={emailVerified}
              >
                {emailOtpSent ? "Resend OTP" : "Send OTP"}
              </button>
            </div>
            {emailOtpSent && !emailVerified && (
              <div className={styles.otpCodeRow}>
                <input
                  value={emailOtp}
                  onChange={(event) =>
                    setEmailOtp(
                      event.target.value.replace(/\D/g, "").slice(0, 6),
                    )
                  }
                  inputMode="numeric"
                  placeholder="Enter 6-digit email OTP"
                />
                <button type="button" onClick={verifyEmailCode}>
                  Verify
                </button>
              </div>
            )}
            <label className={styles.fieldLabel} htmlFor="register-photo">
              PROFILE PHOTO <small>OPTIONAL</small>
            </label>
            <label className={styles.photoPicker} htmlFor="register-photo">
              {thumbnailUrl ? (
                <span className={styles.photoThumbnail}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbnailUrl} alt="Cropped profile photo preview" />
                </span>
              ) : (
                <i className="bi bi-camera" />
              )}
              <span className={styles.photoPickerText}>
                {photoName || "Choose a profile photo"}
              </span>
              <small>
                {thumbnailUrl
                  ? "Square crop ready for registration"
                  : "JPG, PNG or WEBP · Max 5 MB"}
              </small>
              <input
                id="register-photo"
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoChange}
                disabled={photoUploading}
              />
            </label>
            {cropSource && (
              <div className={styles.cropper}>
                <div className={styles.cropperHeader}>
                  <div>
                    <strong>Crop your profile photo</strong>
                    <span>Drag the square to frame your face.</span>
                  </div>
                  <button
                    type="button"
                    onClick={cancelCrop}
                    aria-label="Cancel photo crop"
                  >
                    <i className="bi bi-x-lg" />
                  </button>
                </div>
                <ReactCrop
                  crop={crop}
                  onChange={(pixelCrop, percentCrop) => {
                    setCrop(percentCrop);
                    setCompletedCrop(pixelCrop);
                  }}
                  aspect={1}
                  minWidth={40}
                  minHeight={40}
                  keepSelection
                  ruleOfThirds
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={imageRef}
                    src={cropSource}
                    alt="Crop your profile photo"
                    onLoad={handleCropImageLoad}
                  />
                </ReactCrop>
                <button
                  type="button"
                  className={styles.cropButton}
                  onClick={applyCrop}
                >
                  <i className="bi bi-check2" /> Use cropped photo
                </button>
              </div>
            )}
            <label className={styles.fieldLabel} htmlFor="register-name">
              YOUR ADDRESS
            </label>
            <div className={styles.inputShell}>
              <i className="bi bi-house-add-fill" />
              <input
                id="register-address"
                type="text"
                value={address}
                onChange={(event) =>
                  setAddress(event.target.value.toUpperCase())
                }
                placeholder="Enter your full address"
                autoComplete="address"
                required
              />
            </div>
            <button
              type="submit"
              className={styles.primaryButton}
              disabled={photoUploading || Boolean(cropSource)}
            >
              Create my profile <i className="bi bi-arrow-right" />
            </button>
            <p className={styles.privacy}>
              <i className="bi bi-lock-fill" /> Your details are kept private
              and secure.
            </p>
          </form>
          <a className={styles.secondaryLink} href="/login">
            <i className="bi bi-arrow-left" /> Already have a profile? Sign in
          </a>
        </div>
      </section>
    </main>
  );
}
