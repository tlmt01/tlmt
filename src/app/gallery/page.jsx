"use client";

import { useEffect, useRef, useState } from "react";
import { useGlobalContext } from "@/context/Store";

const STORAGE_KEY = "tlmt-gallery-designs";

const defaultGallery = [
  {
    id: 1,
    title: "Bridal Elegance",
    description:
      "Soft couture-inspired bridal styling with graceful hand-finished detailing.",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    title: "Modern Festive Look",
    description:
      "A rich festive silhouette designed for celebration and comfort.",
    src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    title: "Signature Blouse Design",
    description:
      "A refined blouse concept with a boutique finish and tailored shape.",
    src: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    title: "Minimal Luxe Set",
    description:
      "Elegant minimal layering with clean structure and premium detailing.",
    src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80",
  },
];

export default function GalleryPage() {
  const { state } = useGlobalContext();
  const fileInputRef = useRef(null);
  const [galleryItems, setGalleryItems] = useState(defaultGallery);
  const [uploadingMessage, setUploadingMessage] = useState("");

  useEffect(() => {
    try {
      const savedGallery = window.localStorage.getItem(STORAGE_KEY);
      if (savedGallery) {
        const parsedGallery = JSON.parse(savedGallery);
        if (Array.isArray(parsedGallery) && parsedGallery.length > 0) {
          setGalleryItems(parsedGallery);
        }
      }
    } catch {
      setGalleryItems(defaultGallery);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(galleryItems));
  }, [galleryItems]);

  const isAdmin = state?.userType?.toLowerCase() === "admin";

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const newDesign = {
        id: Date.now(),
        title: file.name.replace(/\.[^/.]+$/, "") || "New Design",
        description:
          "Admin uploaded design ready to be featured in the gallery.",
        src: reader.result,
      };

      setGalleryItems((prev) => [newDesign, ...prev]);
      setUploadingMessage("Design uploaded successfully.");
      event.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  return (
    <section className="gallery-page">
      <div className="gallery-hero">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-lg-6">
              <span className="services-eyebrow">Own design showcase</span>
              <h1 className="services-title">
                Gallery of signature looks and custom creations.
              </h1>
              <p className="services-copy">
                Browse the boutique’s latest stitched stories and featured work.
                If you are signed in as an admin, you can instantly upload your
                own design images here.
              </p>
            </div>

            <div className="col-lg-6">
              {isAdmin && (
                <div className="upload-panel">
                  <>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <div>
                        <h4 className="fw-bold mb-1">Admin Upload Panel</h4>
                        <p className="text-muted small mb-0">
                          Showcase your new boutique designs in one place.
                        </p>
                      </div>
                      <span className="services-pill">
                        {isAdmin ? "Admin Access" : "View Only"}
                      </span>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="form-control"
                      onChange={handleImageUpload}
                    />
                    <div className="mt-3 d-flex align-items-center gap-2">
                      <button
                        className="btn btn-danger rounded-pill px-4"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Upload Design
                      </button>
                      {uploadingMessage ? (
                        <span className="small text-success fw-semibold">
                          {uploadingMessage}
                        </span>
                      ) : null}
                    </div>
                  </>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-5">
        <div className="text-center mb-5">
          <span className="services-eyebrow">Featured Designs</span>
          <h2 className="fw-bold">A curated display of style and tailoring.</h2>
        </div>

        <div className="row g-4">
          {galleryItems.map((item) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={item.id}>
              <article className="gallery-card h-100">
                <img
                  src={item.src}
                  alt={item.title}
                  className="gallery-image"
                />
                <div className="p-4">
                  <h5 className="fw-bold mb-2">{item.title}</h5>
                  <p className="text-muted mb-0">{item.description}</p>
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
