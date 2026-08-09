"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useGlobalContext } from "@/context/Store";
import { useFirebase } from "@/context/FirebaseContext";
import Image from "next/image";
import { generateID } from "../../modules/calculatefunctions";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  desig: "worker",
  userType: "worker",
  empid: generateID(),
  id: "",
  photoPath: "",
  customerID: "",
  url: "",
  address: "",
};

export default function AddWorkerPage() {
  const router = useRouter();
  const { state } = useGlobalContext();
  const isAdmin = state?.userType?.toLowerCase() === "admin";
  const authReady = Boolean(state?.authReady);
  const { registerUserProfile, uploadUserPhoto } = useFirebase();

  const [form, setForm] = useState(emptyForm);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [thumbnail, setThumbnail] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authReady) return;
    if (!state?.loggedIn) {
      router.replace("/login");
      return;
    }

    if (!isAdmin) {
      router.replace("/dashboard");
      return;
    }
  }, [authReady, isAdmin, router, state?.loggedIn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((cur) => ({ ...cur, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone)
      return toast.error("Name and phone required.");
    setSaving(true);
    try {
      const payload = {
        ...form,
        userType: "worker",
        desig: form.desig || "worker",
      };

      if (selectedPhoto) {
        try {
          const uploaded = await uploadUserPhoto({
            file: selectedPhoto,
            userId: form.id || form.phone,
          });
          if (uploaded?.url) payload.url = uploaded.url;
          if (uploaded?.photoPath) payload.photoPath = uploaded.photoPath;
        } catch (err) {
          console.warn("Photo upload failed", err);
          toast.warning("Photo upload failed - continuing without photo.");
        }
      }

      await registerUserProfile(payload);
      toast.success("Worker profile created.");
      setForm(emptyForm);
      setSelectedPhoto(null);
      setThumbnail("");
      router.push("/regUsers");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Could not create worker profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="container py-5">
      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white">
          <h3 className="mb-0">Add Worker</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSave}>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="form-control"
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Employee ID</label>
                <input
                  name="empid"
                  value={form.empid}
                  className="form-control"
                  readOnly
                />
                <p className="text-muted text-sm text-center m-0 p-0">
                  Auto-generated{" "}
                  <i
                    className="bi bi-arrow-clockwise text-success"
                    style={{ cursor: "pointer" }}
                    onClick={() => setForm({ ...form, empid: generateID() })}
                  ></i>
                </p>
              </div>

              <div className="col-12">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="form-control"
                  rows={3}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label">Photo</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setSelectedPhoto(file);
                    if (thumbnail) URL.revokeObjectURL(thumbnail);
                    setThumbnail(URL.createObjectURL(file));
                  }}
                />
              </div>

              {thumbnail ? (
                <div className="col-md-6 d-flex align-items-center">
                  <Image
                    src={thumbnail}
                    alt="preview"
                    width={80}
                    height={80}
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                </div>
              ) : null}
            </div>

            <div className="mt-3 text-end">
              <button
                className="btn btn-secondary me-2"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                type="submit"
                disabled={saving}
              >
                {saving ? "Saving..." : "Create worker"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
