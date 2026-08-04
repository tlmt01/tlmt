"use client";

import { useEffect, useRef, useState } from "react";
import { useFirebase } from "@/context/FirebaseContext";
import { useGlobalContext } from "@/context/Store";

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
  const {
    addGalleryItem,
    deleteGalleryItem,
    getGalleryItems,
    updateGalleryItem,
    uploadGalleryImage,
  } = useFirebase();
  const fileInputRef = useRef(null);
  const [galleryItems, setGalleryItems] = useState(defaultGallery);
  const [uploadingMessage, setUploadingMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const loadGalleryItems = async () => {
      try {
        const items = await getGalleryItems();
        setGalleryItems(items.length ? items : defaultGallery);
      } catch {
        setGalleryItems(defaultGallery);
      }
    };

    loadGalleryItems();
  }, [getGalleryItems]);

  const isAdmin = state?.userType?.toLowerCase() === "admin";

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSelectedFile(null);
    setEditingItem(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isAdmin) return;
    if (!title.trim() || !description.trim()) {
      setUploadingMessage("Please enter both the title and description.");
      return;
    }

    if (!editingItem && !selectedFile) {
      setUploadingMessage("Please choose an image before saving.");
      return;
    }

    setIsSaving(true);
    setUploadingMessage("");

    try {
      let nextImageUrl = editingItem?.src || "";
      let nextPhotoPath = editingItem?.photoPath || "";

      if (selectedFile) {
        const uploadResult = await uploadGalleryImage({
          file: selectedFile,
          existingPhotoPath: editingItem?.photoPath || "",
        });
        nextImageUrl = uploadResult.url || nextImageUrl;
        nextPhotoPath = uploadResult.photoPath || nextPhotoPath;
      }

      if (editingItem) {
        const updatedItem = await updateGalleryItem({
          docId: editingItem.docId,
          title,
          description,
          src: nextImageUrl,
          photoPath: nextPhotoPath,
        });

        setGalleryItems((prev) =>
          prev.map((item) =>
            item.docId === editingItem.docId
              ? { ...item, ...updatedItem }
              : item,
          ),
        );
        setUploadingMessage("Design updated successfully.");
      } else {
        const createdItem = await addGalleryItem({
          title,
          description,
          src: nextImageUrl,
          photoPath: nextPhotoPath,
        });

        setGalleryItems((prev) => [createdItem, ...prev]);
        setUploadingMessage("Design saved successfully.");
      }

      resetForm();
    } catch (error) {
      setUploadingMessage(
        error?.message || "Something went wrong while saving the design.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setTitle(item.title || "");
    setDescription(item.description || "");
    setSelectedFile(null);
    setUploadingMessage("");
  };

  const handleDelete = async (item) => {
    if (!isAdmin) return;
    if (!window.confirm("Delete this gallery item?")) return;

    try {
      await deleteGalleryItem({
        docId: item.docId,
        photoPath: item.photoPath || "",
      });
      setGalleryItems((prev) =>
        prev.filter((galleryItem) => galleryItem.docId !== item.docId),
      );
      if (editingItem?.docId === item.docId) {
        resetForm();
      }
      setUploadingMessage("Design deleted successfully.");
    } catch (error) {
      setUploadingMessage(
        error?.message || "Unable to delete the selected design.",
      );
    }
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
                Admins can save new design titles and descriptions to the shared
                gallery database and manage them from here.
              </p>
            </div>

            <div className="col-lg-6">
              {isAdmin && (
                <div className="upload-panel">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <div>
                      <h4 className="fw-bold mb-1">Admin Gallery Panel</h4>
                      <p className="text-muted small mb-0">
                        Add a design title, description, and image in one place.
                      </p>
                    </div>
                    <span className="services-pill">Admin Access</span>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Image Title
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder="Enter design title"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Description
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        placeholder="Enter a short design description"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">
                        Image File
                      </label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(event) =>
                          setSelectedFile(event.target.files?.[0] || null)
                        }
                      />
                    </div>

                    <div className="d-flex flex-wrap gap-2">
                      <button
                        type="submit"
                        className="btn btn-danger rounded-pill px-4"
                        disabled={isSaving}
                      >
                        {isSaving
                          ? "Saving..."
                          : editingItem
                            ? "Update Design"
                            : "Save Design"}
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-secondary rounded-pill px-4"
                        onClick={resetForm}
                      >
                        Clear
                      </button>
                    </div>

                    {uploadingMessage ? (
                      <div className="mt-3 small text-success fw-semibold">
                        {uploadingMessage}
                      </div>
                    ) : null}
                  </form>
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
            <div
              className="col-lg-3 col-md-4 col-sm-6"
              key={item.docId || item.id}
            >
              <article className="gallery-card h-100">
                <img
                  src={item.src}
                  alt={item.title}
                  className="gallery-image"
                />
                <div className="p-4">
                  <h5 className="fw-bold mb-2">{item.title}</h5>
                  <p className="text-muted mb-0">{item.description}</p>

                  {isAdmin && (
                    <div className="d-flex gap-2 mt-3">
                      <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm rounded-pill"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline-danger btn-sm rounded-pill"
                        onClick={() => handleDelete(item)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
