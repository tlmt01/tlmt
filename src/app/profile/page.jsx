"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import ReactCrop, { centerCrop, makeAspectCrop } from "react-image-crop";
import { useFirebase } from "@/context/FirebaseContext";
import { useGlobalContext } from "@/context/Store";
import { encryptObjData } from "@/modules/encryption";
import styles from "../login/login.module.css";

const emptyProfile = {
  name: "",
  phone: "",
  email: "",
  address: "",
  userType: "customer",
  desig: "customer",
  disabled: false,
  empid: "",
  id: "",
  customerID: "",
  photoPath: "",
  url: "",
};

export default function ProfilePage() {
  const router = useRouter();
  const { state, USER, setUSER, setState } = useGlobalContext();
  const { updateUserProfile, uploadUserPhoto, getUserById } = useFirebase();
  const [profile, setProfile] = useState(emptyProfile);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [cropSource, setCropSource] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const imageRef = useRef(null);

  const authReady = Boolean(state?.authReady);
  const loggedIn = Boolean(state?.loggedIn);

  const profileId = USER?.id || USER?.docId || USER?.customerID || "";
  const displayPhoto = thumbnailUrl || previewUrl || profile.url;

  useEffect(() => {
    if (!authReady) return;
    if (!loggedIn) {
      router.replace("/login");
      return;
    }

    const hydratedProfile = {
      ...emptyProfile,
      ...USER,
      phone: USER.phone || "",
      email: USER.email || "",
      address: USER.address || "",
      name: USER.name || "",
      id: USER.id || "",
      customerID: USER.customerID || "",
      url: USER.url || "",
      photoPath: USER.photoPath || "",
    };

    setProfile(hydratedProfile);
    setPreviewUrl(USER.url || "");
  }, [authReady, loggedIn, router, USER]);

  useEffect(() => {
    return () => {
      if (cropSource) URL.revokeObjectURL(cropSource);
      if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);
    };
  }, [cropSource, thumbnailUrl]);

  const createCenteredCrop = (width, height) =>
    centerCrop(
      makeAspectCrop({ unit: "%", width: 88 }, 1, width, height),
      width,
      height,
    );

  const isPhotoReady = useMemo(() => Boolean(displayPhoto), [displayPhoto]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
  };

  const handlePhotoSelect = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Please choose an image smaller than 10 MB.");
      return;
    }

    if (cropSource) URL.revokeObjectURL(cropSource);
    if (thumbnailUrl) URL.revokeObjectURL(thumbnailUrl);

    setSelectedPhoto(null);
    setPhotoFile(file);
    setPreviewUrl("");
    setThumbnailUrl("");
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

    const compressedPhoto = new File(
      [blob],
      `profile-${profileId || profile.id || "photo"}.jpg`,
      {
        type: "image/jpeg",
      },
    );

    setSelectedPhoto(compressedPhoto);
    setThumbnailUrl(URL.createObjectURL(compressedPhoto));
    setPhotoFile(compressedPhoto);
    setPreviewUrl("");
    URL.revokeObjectURL(cropSource);
    setCropSource("");
    toast.success("Photo cropped and optimized for upload.");
  };

  const cancelCrop = () => {
    if (cropSource) URL.revokeObjectURL(cropSource);
    setCropSource("");
    setPhotoFile(null);
    setSelectedPhoto(null);
    setThumbnailUrl("");
    setPreviewUrl(profile.url || "");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!profile.name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim())) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(profile.phone.replace(/\D/g, "").slice(-10))) {
      toast.error("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!profile.address.trim()) {
      toast.error("Please enter your address.");
      return;
    }

    setSaving(true);
    try {
      let uploadedUrl = profile.url;
      let uploadedPhotoPath = profile.photoPath;

      const photoToUpload = selectedPhoto || photoFile;
      if (photoToUpload) {
        setUploadingPhoto(true);
        const uploadResult = await uploadUserPhoto({
          file: photoToUpload,
          userId:
            profileId || profile.id || profile.customerID || profile.phone,
          oldPhotoPath: profile.photoPath || "",
          oldPhotoUrl: profile.url || "",
        });
        uploadedUrl = uploadResult.url || uploadedUrl;
        uploadedPhotoPath = uploadResult.photoPath || uploadedPhotoPath;
      }

      const updatedProfile = await updateUserProfile({
        userId: profileId || profile.id || profile.customerID || profile.phone,
        name: profile.name,
        phone: profile.phone,
        email: profile.email,
        userType: profile.userType,
        desig: profile.desig,
        disabled: profile.disabled,
        empid: profile.empid,
        photoPath: uploadedPhotoPath,
        customerID: profile.customerID,
        url: uploadedUrl,
        address: profile.address,
      });

      const mergedUser = {
        ...USER,
        ...updatedProfile,
        name: updatedProfile.name,
        phone: updatedProfile.phone,
        email: updatedProfile.email,
        address: updatedProfile.address,
        id: updatedProfile.id || profile.id,
        customerID: updatedProfile.customerID || profile.customerID,
        url: uploadedUrl,
        photoPath: uploadedPhotoPath,
      };

      setUSER(mergedUser);
      setState((current) => ({
        ...current,
        ...mergedUser,
        loggedIn: true,
        authReady: true,
      }));
      setProfile((current) => ({ ...current, ...mergedUser }));
      setPreviewUrl(uploadedUrl || profile.url || "");
      setThumbnailUrl(uploadedUrl || "");
      setProfile((current) => ({
        ...current,
        ...mergedUser,
        photoPath: uploadedPhotoPath || current.photoPath,
      }));

      encryptObjData("user", mergedUser, 15 * 24 * 60);
      window.localStorage.setItem(
        "tlmt-auth-session",
        JSON.stringify(mergedUser),
      );
      toast.success("Your profile information has been updated.");

      const refreshed = await getUserById(
        profileId || profile.id || profile.customerID || profile.phone,
      );
      if (refreshed) {
        const syncUser = {
          ...USER,
          ...refreshed,
          loggedIn: true,
          authReady: true,
        };
        setUSER(syncUser);
        setState((current) => ({
          ...current,
          ...syncUser,
          loggedIn: true,
          authReady: true,
        }));
      }
    } catch (error) {
      toast.error(error.message || "Unable to update your profile right now.");
    } finally {
      setUploadingPhoto(false);
      setSaving(false);
    }
  };

  if (!authReady) return null;
  if (!loggedIn) return null;

  return (
    <main className="container py-5">
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body text-center p-4">
              <div
                className="position-relative mx-auto mb-3"
                style={{ width: 120, height: 120 }}
              >
                {isPhotoReady ? (
                  <img
                    src={displayPhoto}
                    alt="Profile preview"
                    className="rounded-circle object-fit-cover border border-4 border-warning w-100 h-100"
                  />
                ) : (
                  <div className="rounded-circle bg-dark text-white d-flex align-items-center justify-content-center w-100 h-100 fs-3 fw-bold">
                    {profile.name?.charAt(0)?.toUpperCase() || "A"}
                  </div>
                )}
              </div>
              <h2 className="h4 fw-bold mb-1">
                {profile.name || "Your profile"}
              </h2>
              <p className="text-muted mb-3">
                Manage your personal details safely.
              </p>
              <label className="btn btn-outline-dark rounded-pill px-3 d-inline-block">
                <i className="bi bi-camera me-2" />
                Change photo
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  hidden
                  onChange={handlePhotoSelect}
                />
              </label>
              {cropSource && (
                <div className={`${styles.cropper} mt-3`}>
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
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <form
            className="card border-0 shadow-sm rounded-4"
            onSubmit={handleSave}
          >
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full name</label>
                  <input
                    className="form-control"
                    name="name"
                    value={profile.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Mobile number</label>
                  <input
                    className="form-control"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email address</label>
                  <input
                    className="form-control"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="address"
                    value={profile.address}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="d-flex flex-wrap justify-content-between align-items-center mt-4 gap-3">
                <small className="text-muted">
                  {photoFile
                    ? "A new photo will be uploaded when you save."
                    : "Use the photo picker to update your profile picture."}
                </small>
                <button
                  type="submit"
                  className="btn btn-danger rounded-pill px-4"
                  disabled={saving || uploadingPhoto}
                >
                  {saving || uploadingPhoto ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
