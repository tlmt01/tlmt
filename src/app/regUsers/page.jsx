"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { firestore } from "@/lib/firebase";
import { useGlobalContext } from "@/context/Store";
import Image from "next/image";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  userType: "customer",
  desig: "customer",
  disabled: false,
  empid: "",
  id: "",
  photoPath: "",
  customerID: "",
  url: "",
  address: "",
};

export default function RegUsersPage() {
  const router = useRouter();
  const { state } = useGlobalContext();
  const authReady = Boolean(state?.authReady);
  const isAdmin = state?.userType?.toLowerCase() === "admin";
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedPhone, setSelectedPhone] = useState("");
  const [formData, setFormData] = useState(emptyForm);
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

    const loadUsers = async () => {
      try {
        const snapshot = await getDocs(collection(firestore, "users"));
        const rows = snapshot.docs.map((item) => ({
          docId: item.id,
          ...item.data(),
          id: item.data().id || item.id,
        }));

        setUsers(rows);
        if (rows.length) {
          const firstUser = rows[0];
          setSelectedPhone(firstUser.phone);
          setFormData({ ...emptyForm, ...firstUser });
        }
      } catch {
        toast.error("Unable to load user records right now.");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [authReady, isAdmin, router, state?.loggedIn]);

  const filteredUsers = useMemo(() => {
    const needle = searchText.trim().toLowerCase();
    if (!needle) return users;

    return users.filter((user) => {
      return [user.name, user.phone, user.email, user.userType, user.desig]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(needle));
    });
  }, [searchText, users]);

  const selectedUser =
    users.find((user) => user.phone === selectedPhone) ||
    filteredUsers[0] ||
    null;

  useEffect(() => {
    if (!selectedUser) return;
    setFormData({ ...emptyForm, ...selectedUser });
    setSelectedPhone(selectedUser.phone);
  }, [selectedUser]);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (!selectedUser) return;

    const normalizedPhone = formData.phone.replace(/\D/g, "").slice(-10);
    const normalizedEmail = formData.email.trim().toLowerCase();
    const normalizedName = formData.name.trim();

    if (!normalizedPhone || !normalizedName) {
      toast.error("Name and phone number are required.");
      return;
    }

    const payload = {
      ...formData,
      name: normalizedName,
      phone: normalizedPhone,
      email: normalizedEmail,
      address: formData.address.trim(),
      updatedAt: serverTimestamp(),
    };

    setSaving(true);
    try {
      const oldPhone = selectedUser.phone;
      const oldRef = doc(
        firestore,
        "users",
        selectedUser.docId || selectedUser.id,
      );

      if (oldPhone !== normalizedPhone) {
        const phoneMatches = await getDocs(
          query(
            collection(firestore, "users"),
            where("phone", "==", normalizedPhone),
          ),
        );
        const duplicatePhone = phoneMatches.docs.find(
          (item) => item.id !== selectedUser.docId,
        );
        if (duplicatePhone) {
          toast.error("That phone number already belongs to another user.");
          return;
        }
      }

      await updateDoc(oldRef, payload);

      const updatedRows = users.map((user) =>
        user.docId === selectedUser.docId
          ? { ...payload, docId: selectedUser.docId, id: selectedUser.id }
          : user,
      );
      setUsers(updatedRows);
      setSelectedPhone(normalizedPhone);
      setFormData({
        ...emptyForm,
        ...payload,
        docId: selectedUser.docId,
        id: selectedUser.id,
      });
      toast.success("User details updated successfully.");
    } catch {
      toast.error("Could not update this user profile.");
    } finally {
      setSaving(false);
    }
  };

  const adminCount = users.filter((user) => user.userType === "admin").length;
  const activeCount = users.filter((user) => !user.disabled).length;

  if (!authReady) return null;
  if (!isAdmin && !state?.loggedIn) return null;

  return (
    <section className="admin-users-page">
      <div className="container py-5">
        <div className="admin-page-header mb-4">
          <div>
            <span className="services-eyebrow">Admin controls</span>
            <h1 className="fw-bold mb-2">Registered users management</h1>
            <p className="text-muted mb-0">
              Review every registered user, update profile details, and keep
              your boutique database precise.
            </p>
          </div>
        </div>

        <div className="row g-4 align-items-start">
          <div className="col-lg-4">
            <div className="admin-list-card">
              <div className="row g-2 mb-3">
                <div className="col-12">
                  <input
                    type="text"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    className="form-control rounded-pill"
                    placeholder="Search by name, phone, email"
                  />
                </div>
              </div>

              <div className="admin-stat-grid mb-3">
                <div className="admin-stat-box">
                  <span>Total</span>
                  <strong>{users.length}</strong>
                </div>
                <div className="admin-stat-box">
                  <span>Admins</span>
                  <strong>{adminCount}</strong>
                </div>
                <div className="admin-stat-box">
                  <span>Active</span>
                  <strong>{activeCount}</strong>
                </div>
              </div>

              <div className="admin-user-list">
                {loading ? (
                  <div className="text-muted">Loading users...</div>
                ) : filteredUsers.length ? (
                  filteredUsers.map((user) => (
                    <button
                      type="button"
                      key={user.phone}
                      className={`admin-user-item ${
                        selectedPhone === user.phone ? "active" : ""
                      }`}
                      onClick={() => setSelectedPhone(user.phone)}
                    >
                      <div>
                        <strong>{user.name || "Unnamed user"}</strong>
                        <div className="small text-muted">{user.phone}</div>
                      </div>
                      <span className="badge rounded-pill bg-light text-dark">
                        {user.userType || "customer"}
                      </span>
                    </button>
                  ))
                ) : (
                  <div className="text-muted">No matching users found.</div>
                )}
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <form className="admin-form-card" onSubmit={handleSave}>
              <div className="d-flex flex-column align-items-center">
                {formData.url && (
                  <>
                    <div className="mb-2">
                      <Image
                        src={formData.url}
                        alt="Profile Photo"
                        width={100}
                        height={100}
                        style={{ objectFit: "cover", borderRadius: "50%" }}
                      />
                    </div>
                    <label
                      htmlFor="profilePhoto"
                      className="form-label d-block text-center mt-1 text-muted"
                    >
                      Photo Path: {formData.photoPath || "N/A"}
                    </label>
                  </>
                )}
              </div>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Full name</label>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Designation</label>
                  <input
                    name="desig"
                    value={formData.desig}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Role</label>
                  <select
                    name="userType"
                    value={formData.userType}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="worker">Worker</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Employee ID</label>
                  <input
                    name="empid"
                    value={formData.empid}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Customer ID</label>
                  <input
                    name="customerID"
                    value={formData.customerID}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Photo Path</label>
                  <input
                    name="photoPath"
                    value={formData.photoPath}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">User ID</label>
                  <input
                    name="id"
                    value={formData.id}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="form-control"
                    rows="4"
                  />
                </div>

                <div className="col-12">
                  <label className="form-check-label me-3">
                    Account disabled
                  </label>
                  <input
                    type="checkbox"
                    name="disabled"
                    checked={Boolean(formData.disabled)}
                    onChange={handleChange}
                    className="form-check-input"
                  />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button
                  type="submit"
                  className="btn btn-danger rounded-pill px-4"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
