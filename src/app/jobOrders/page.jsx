"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { firestore, storage } from "@/lib/firebase";
import { useGlobalContext } from "@/context/Store";
import DesignSketch from "@/app/newOrder/components/DesignSketch";
import { upsertOrderAccountEntry } from "@/lib/accounts";
import dynamic from "next/dynamic";
import { JobOrderPDF } from "../../pdf/JobOrderPDF";
import JobOrderPDFDownloadButton from "../../pdf/JobOrderPDF";
import { InvoicePDF } from "../../pdf/InvoicePDF";
import InvoicePDFDownloadButton from "../../pdf/InvoicePDF";
import { formatDate } from "../../modules/calculatefunctions";
const statusOptions = [
  "Pending",
  "Cutting",
  "Stitching",
  "Trial",
  "Ready",
  "Delivered",
];

const emptyDraft = {
  orderNo: "",
  billNo: "",
  bookingDate: "",
  deliveryDate: "",
  advance: "0",
  totalAmount: "0",
  status: "Pending",
};

const formatRupee = (value) => {
  return `₹ ${Number(value || 0).toLocaleString("en-IN")}`;
};

export default function JobOrdersPage() {
  const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    {
      ssr: false,
      loading: () => <p>Loading...</p>,
    },
  );
  const router = useRouter();
  const { state } = useGlobalContext();
  const authReady = Boolean(state?.authReady);
  const isAdmin = state?.userType?.toLowerCase() === "admin";
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedId, setSelectedId] = useState("");
  const [draftOrder, setDraftOrder] = useState(emptyDraft);
  const [draftMeasurements, setDraftMeasurements] = useState({});
  const [isEditingSketch, setIsEditingSketch] = useState(false);
  const [editingSketchUrl, setEditingSketchUrl] = useState("");
  const [workers, setWorkers] = useState([]);
  const [draftAssignedWorkers, setDraftAssignedWorkers] = useState([]);
  const [showJobOrderDldBtn, setShowJobOrderDldBtn] = useState(false);
  const [showInvoiceDldBtn, setShowInvoiceDldBtn] = useState(false);

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

    const loadOrders = async () => {
      setLoading(true);
      try {
        const snapshot = await getDocs(
          query(collection(firestore, "jobOrders")),
        );
        const rows = snapshot.docs
          .map((item) => ({ docId: item.id, ...item.data() }))
          .sort((a, b) => {
            const aValue = a.createdAt?.seconds || 0;
            const bValue = b.createdAt?.seconds || 0;
            return bValue - aValue;
          });

        setOrders(rows);
        setSelectedId(rows[0]?.docId || "");
      } catch (error) {
        toast.error("Unable to load job orders right now.");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [authReady, isAdmin, router, state?.loggedIn]);

  const isDateInFilter = (dateStr, filter) => {
    if (!filter || filter === "all") return true;
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return false;

    const startOfDay = (dt) =>
      new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
    const today = startOfDay(new Date());

    if (filter === "today") {
      return startOfDay(d).getTime() === today.getTime();
    }

    // week starting sunday
    const day = today.getDay();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - day);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    if (filter === "thisWeek") {
      return (
        startOfDay(d) >= startOfDay(weekStart) &&
        startOfDay(d) <= startOfDay(weekEnd)
      );
    }

    if (filter === "nextWeek") {
      const nextStart = new Date(weekStart);
      nextStart.setDate(weekStart.getDate() + 7);
      const nextEnd = new Date(nextStart);
      nextEnd.setDate(nextStart.getDate() + 6);
      return (
        startOfDay(d) >= startOfDay(nextStart) &&
        startOfDay(d) <= startOfDay(nextEnd)
      );
    }

    if (filter === "thisMonth") {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      const last = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return (
        startOfDay(d) >= startOfDay(first) && startOfDay(d) <= startOfDay(last)
      );
    }

    if (filter === "nextMonth") {
      const first = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const last = new Date(today.getFullYear(), today.getMonth() + 2, 0);
      return (
        startOfDay(d) >= startOfDay(first) && startOfDay(d) <= startOfDay(last)
      );
    }

    return true;
  };

  const filteredOrders = useMemo(() => {
    const needle = searchText.trim().toLowerCase();

    // apply date filter first
    const dateFiltered = orders.filter((order) => {
      // prefer deliveryDate, fallback to bookingDate
      const dateStr = order.deliveryDate || order.bookingDate || "";
      return isDateInFilter(dateStr, dateFilter);
    });

    if (!needle) return dateFiltered;

    return dateFiltered.filter((order) => {
      const text = [
        order.orderNo,
        order.billNo,
        order.status,
        order.customer?.name,
        order.customer?.phone,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(needle);
    });
  }, [orders, searchText, dateFilter]);

  const selectedOrder =
    orders.find((order) => order.docId === selectedId) ||
    filteredOrders[0] ||
    null;

  useEffect(() => {
    if (!selectedOrder) {
      setDraftOrder(emptyDraft);
      setDraftMeasurements({});
      setIsEditingSketch(false);
      setEditingSketchUrl("");
      return;
    }

    setSelectedId(selectedOrder.docId);
    setDraftOrder({
      orderNo: selectedOrder.orderNo || "",
      billNo: selectedOrder.billNo || "",
      bookingDate: selectedOrder.bookingDate || "",
      deliveryDate: selectedOrder.deliveryDate || "",
      advance: String(selectedOrder.advance ?? 0),
      totalAmount: String(selectedOrder.totalAmount ?? 0),
      status: selectedOrder.status || "Pending",
    });

    setDraftMeasurements(
      selectedOrder.measurements &&
        typeof selectedOrder.measurements === "object"
        ? Object.fromEntries(
            Object.entries(selectedOrder.measurements).map(([key, value]) => [
              key,
              String(value ?? ""),
            ]),
          )
        : {},
    );
    setIsEditingSketch(false);
    setEditingSketchUrl(selectedOrder.designSketchUrl || "");
    setDraftAssignedWorkers(selectedOrder.assignedWorkers || []);
  }, [selectedOrder]);

  const summary = useMemo(() => {
    const totals = {
      total: orders.length,
      pending: 0,
      delivered: 0,
      due: 0,
    };

    orders.forEach((order) => {
      if (order.status === "Delivered") totals.delivered += 1;
      if (order.status === "Pending") totals.pending += 1;
      if ((order.balance ?? 0) > 0) totals.due += 1;
    });

    return totals;
  }, [orders]);

  const changeDraft = (name, value) => {
    setDraftOrder((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const changeMeasurement = (name, value) => {
    setDraftMeasurements((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const saveOrder = async (event) => {
    event.preventDefault();
    if (!selectedOrder) return;

    setLoading(true);
    try {
      const payload = {
        deliveryDate: draftOrder.deliveryDate,
        status: draftOrder.status,
        advance: Number(draftOrder.advance || 0),
        totalAmount: Number(draftOrder.totalAmount || 0),
        balance:
          Number(draftOrder.totalAmount || 0) - Number(draftOrder.advance || 0),
        measurements: draftMeasurements,
        // worker assignments
        assignedWorkers: draftAssignedWorkers,
        assignedWorkerIds: (draftAssignedWorkers || []).map(
          (w) => w.id || w.phone || w.docId,
        ),
        updatedAt: serverTimestamp(),
      };

      const orderRef = doc(firestore, "jobOrders", selectedOrder.docId);
      await updateDoc(orderRef, payload);

      let designSketchUrl = selectedOrder.designSketchUrl || "";
      if (
        isEditingSketch &&
        editingSketchUrl !== selectedOrder.designSketchUrl
      ) {
        if (!editingSketchUrl) {
          await updateDoc(orderRef, { designSketchUrl: "" });
          designSketchUrl = "";
        } else {
          const imageRef = ref(
            storage,
            `jobOrders/${selectedOrder.docId}/design-sketch.png`,
          );
          await uploadString(imageRef, editingSketchUrl, "data_url");
          designSketchUrl = await getDownloadURL(imageRef);
          await updateDoc(orderRef, { designSketchUrl });
        }
      }

      await upsertOrderAccountEntry({
        ...selectedOrder,
        ...payload,
        docId: selectedOrder.docId,
        designSketchUrl,
      });

      const updatedOrder = {
        ...selectedOrder,
        ...payload,
        designSketchUrl,
      };

      setOrders((current) =>
        current.map((order) =>
          order.docId === selectedOrder.docId ? updatedOrder : order,
        ),
      );

      toast.success("Job order updated successfully.");
    } catch (error) {
      toast.error("Unable to save the order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadWorkers = async () => {
      try {
        const usersRef = collection(firestore, "users");
        const q = query(usersRef, where("userType", "==", "worker"));
        const snap = await getDocs(q);
        const rows = snap.docs.map((d) => ({ docId: d.id, ...d.data() }));
        setWorkers(rows);
      } catch (err) {
        console.warn("Unable to load workers", err);
      }
    };

    if (isAdmin) loadWorkers();
  }, [isAdmin]);

  const toggleAssignWorker = (worker) => {
    const key = worker.docId || worker.id || worker.phone;
    const exists = draftAssignedWorkers.find(
      (w) => (w.docId || w.id || w.phone) === key,
    );
    if (exists) {
      setDraftAssignedWorkers((cur) =>
        cur.filter((w) => (w.docId || w.id || w.phone) !== key),
      );
    } else {
      setDraftAssignedWorkers((cur) => [...cur, worker]);
    }
  };

  const deleteSelectedOrder = async () => {
    if (!selectedOrder) return;
    if (!window.confirm("Delete this order permanently?")) return;

    setLoading(true);
    try {
      await deleteDoc(doc(firestore, "jobOrders", selectedOrder.docId));
      const remaining = orders.filter(
        (order) => order.docId !== selectedOrder.docId,
      );
      setOrders(remaining);
      setSelectedId(remaining[0]?.docId || "");
      toast.success("Job order removed.");
    } catch {
      toast.error("Could not delete the order.");
    } finally {
      setLoading(false);
    }
  };

  const renderItemLabel = (order) => {
    return `${order.orderNo || "#"}${order.billNo ? ` — ${order.billNo}` : ""}`;
  };

  const renderValue = (value) => value || "—";

  return (
    <section className="job-orders-page">
      <div className="container py-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
          <div>
            <span className="text-uppercase text-muted small">
              Order management
            </span>
            <h1 className="fw-bold mt-2">Job orders dashboard</h1>
            <p className="text-muted mb-0">
              View, update, and manage tailoring job orders from a single admin
              panel.
            </p>
          </div>
          <div className="text-end">
            <div className="badge bg-primary rounded-pill px-3 py-2 me-2">
              Total orders {summary.total}
            </div>
            <div className="badge bg-warning text-dark rounded-pill px-3 py-2 me-2">
              Pending {summary.pending}
            </div>
            <div className="badge bg-success rounded-pill px-3 py-2 me-2">
              Delivered {summary.delivered}
            </div>
            <div className="badge bg-danger rounded-pill px-3 py-2">
              Due {summary.due}
            </div>
          </div>
        </div>

        <div className="row g-4">
          <div className="col-xl-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="mb-3">
                  <input
                    type="search"
                    className="form-control rounded-pill"
                    placeholder="Search orders by number, name, phone, status"
                    value={searchText}
                    onChange={(event) => setSearchText(event.target.value)}
                    aria-label="Search job orders"
                  />
                </div>

                <div className="mb-3 d-flex flex-wrap gap-2">
                  {[
                    ["all", "All"],
                    ["today", "Today"],
                    ["thisWeek", "This week"],
                    ["nextWeek", "Next week"],
                    ["thisMonth", "This month"],
                    ["nextMonth", "Next month"],
                  ].map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setDateFilter(key)}
                      className={`btn btn-sm ${dateFilter === key ? "btn-primary" : "btn-outline-secondary"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div
                  className="list-group overflow-auto"
                  style={{ maxHeight: 560 }}
                >
                  {loading ? (
                    <div className="text-center py-5 text-muted">
                      Loading orders…
                    </div>
                  ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-5 text-muted">
                      No matching orders found.
                    </div>
                  ) : (
                    filteredOrders.map((order) => {
                      const isActive = order.docId === selectedOrder?.docId;
                      return (
                        <button
                          key={order.docId}
                          type="button"
                          onClick={() => setSelectedId(order.docId)}
                          className={`list-group-item list-group-item-action ${
                            isActive ? "active" : ""
                          }`}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <div>
                              <strong>{renderItemLabel(order)}</strong>
                              <div className="small text-muted">
                                {order.customer?.name || "Unknown customer"}
                              </div>
                            </div>
                            <span
                              className={`badge rounded-pill ${
                                order.status === "Delivered"
                                  ? "bg-success"
                                  : order.status === "Pending"
                                    ? "bg-warning text-dark"
                                    : "bg-info text-dark"
                              }`}
                            >
                              {order.status}
                            </span>
                          </div>
                          <div className="small text-muted mt-2">
                            {order.customer?.phone || "No phone"} ·{" "}
                            {renderValue(formatDate(order.deliveryDate))}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                {!selectedOrder ? (
                  <div className="text-center py-5 text-muted">
                    Select an order from the list to manage it.
                  </div>
                ) : (
                  <>
                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-start gap-3 mb-4">
                      <div>
                        <span className="text-uppercase text-muted small">
                          Selected order
                        </span>
                        <h2 className="fw-bold mb-1">
                          {renderItemLabel(selectedOrder)}
                        </h2>
                        <p className="text-muted mb-0">
                          {selectedOrder.customer?.name} ·{" "}
                          {selectedOrder.customer?.phone}
                        </p>
                      </div>
                      <div className="text-end">
                        <div className="badge bg-secondary rounded-pill px-3 py-2 mb-2 d-inline-block">
                          {selectedOrder.orderNo || "No order no"}
                        </div>
                        <div className="badge bg-info text-white rounded-pill px-3 py-2 mb-2 d-inline-block">
                          {selectedOrder.pieceType || "Piece type not set"}
                        </div>
                        <div className="badge bg-light text-dark rounded-pill px-3 py-2 d-inline-block">
                          Balance {formatRupee(selectedOrder.balance)}
                        </div>
                      </div>
                    </div>

                    <form onSubmit={saveOrder}>
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <label className="form-label">Booking date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={draftOrder.bookingDate}
                            readOnly
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Delivery date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={draftOrder.deliveryDate}
                            onChange={(event) =>
                              changeDraft("deliveryDate", event.target.value)
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Bill number</label>
                          <input
                            type="text"
                            className="form-control"
                            value={draftOrder.billNo}
                            onChange={(event) =>
                              changeDraft("billNo", event.target.value)
                            }
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Order status</label>
                          <select
                            className="form-select"
                            value={draftOrder.status}
                            onChange={(event) =>
                              changeDraft("status", event.target.value)
                            }
                          >
                            {statusOptions.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Balance</label>
                          <input
                            type="text"
                            className="form-control bg-light"
                            value={formatRupee(
                              Number(draftOrder.totalAmount || 0) -
                                Number(draftOrder.advance || 0),
                            )}
                            readOnly
                          />
                        </div>
                      </div>

                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <label className="form-label">Total amount</label>
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            value={draftOrder.totalAmount}
                            onChange={(event) =>
                              changeDraft("totalAmount", event.target.value)
                            }
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Advance paid</label>
                          <input
                            type="number"
                            min="0"
                            className="form-control"
                            value={draftOrder.advance}
                            onChange={(event) =>
                              changeDraft("advance", event.target.value)
                            }
                          />
                        </div>
                      </div>
                      {/* <div className="mb-4 d-flex flex-column flex-md-row justify-content-end align-items-center gap-3">
                        {showJobOrderDldBtn ? (
                          <button
                            type="button"
                            className="btn btn-outline-secondary mb-3 py-2"
                            onClick={() =>
                              setShowJobOrderDldBtn(!showJobOrderDldBtn)
                            }
                          >
                            Hide Job Order Invoice
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline-primary mb-3 py-2"
                            onClick={() => setShowJobOrderDldBtn(true)}
                          >
                            Show Job Order Invoice
                          </button>
                        )}
                        {showJobOrderDldBtn && (
                          <PDFDownloadLink
                            document={<JobOrderPDF order={selectedOrder} />}
                            fileName={`Job Order Invoice.pdf`}
                            style={{
                              textDecoration: "none",
                              color: "#fff",
                              backgroundColor: "navy",
                              border: "1px solid #4a4a4a",
                              borderRadius: 10,
                            }}
                            className="btn btn-primary mb-3 py-2"
                            onClick={() =>
                              setTimeout(() => {
                                setShowJobOrderDldBtn(false);
                              }, 500)
                            }
                          >
                            {({ blob, url, loading, error }) =>
                              loading
                                ? "Loading..."
                                : "Download Order Invoice PDF"
                            }
                          </PDFDownloadLink>
                        )}
                      </div>
                      <div className="mb-4 d-flex flex-column flex-md-row justify-content-end align-items-center gap-3">
                        {showInvoiceDldBtn ? (
                          <button
                            type="button"
                            className="btn btn-outline-secondary mb-3 py-2"
                            onClick={() =>
                              setShowInvoiceDldBtn(!showInvoiceDldBtn)
                            }
                          >
                            Hide Invoice
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn btn-outline-primary mb-3 py-2"
                            onClick={() => setShowInvoiceDldBtn(true)}
                          >
                            Show Invoice
                          </button>
                        )}
                        {showInvoiceDldBtn && (
                          <PDFDownloadLink
                            document={<InvoicePDF order={selectedOrder} />}
                            fileName={`Order Invoice.pdf`}
                            style={{
                              textDecoration: "none",
                              color: "#fff",
                              backgroundColor: "navy",
                              border: "1px solid #4a4a4a",
                              borderRadius: 10,
                            }}
                            className="btn btn-primary mb-3 py-2"
                            onClick={() =>
                              setTimeout(() => {
                                setShowInvoiceDldBtn(false);
                              }, 500)
                            }
                          >
                            {({ blob, url, loading, error }) =>
                              loading
                                ? "Loading..."
                                : "Download Order Invoice PDF"
                            }
                          </PDFDownloadLink>
                        )}
                      </div> */}
                      <div className="mb-4 d-flex flex-row flex-md-row justify-content-end align-items-center gap-3">
                        <JobOrderPDFDownloadButton order={selectedOrder} />
                        <InvoicePDFDownloadButton order={selectedOrder} />
                      </div>

                      <div className="row g-4 mb-4">
                        <div className="col-lg-6">
                          <div className="card border-0 bg-light p-3 h-100">
                            <div className="mb-2">
                              <strong>Customer details</strong>
                            </div>
                            <p className="mb-1">
                              {selectedOrder.customer?.name}
                            </p>
                            <p className="mb-1">
                              {selectedOrder.customer?.phone}
                            </p>
                            <p className="mb-0 text-muted">
                              {selectedOrder.customer?.address || "No address"}
                            </p>
                          </div>
                        </div>

                        <div className="card border-0 shadow-sm mt-3">
                          <div className="card-header bg-white">
                            <strong className="mb-0">Assigned workers</strong>
                          </div>
                          <div className="card-body p-3">
                            {workers.length === 0 ? (
                              <div className="text-muted">
                                No workers available.
                              </div>
                            ) : (
                              <div className="d-flex flex-wrap gap-2">
                                {workers.map((w) => {
                                  const key = w.docId || w.id || w.phone;
                                  const active = draftAssignedWorkers.find(
                                    (aw) =>
                                      (aw.docId || aw.id || aw.phone) === key,
                                  );
                                  return (
                                    <button
                                      key={key}
                                      type="button"
                                      onClick={() => toggleAssignWorker(w)}
                                      className={`btn btn-sm ${active ? "btn-primary" : "btn-outline-primary"}`}
                                    >
                                      {w.name || w.empid || w.phone}
                                    </button>
                                  );
                                })}
                              </div>
                            )}

                            {draftAssignedWorkers.length ? (
                              <div className="mt-2 small text-muted">
                                Assigned:{" "}
                                {draftAssignedWorkers
                                  .map((w) => w.name || w.phone)
                                  .join(", ")}
                              </div>
                            ) : null}
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="card border-0 bg-light p-3 h-100">
                            <div className="mb-2">
                              <strong>Order summary</strong>
                            </div>
                            <p className="mb-1">
                              Booking:{" "}
                              {renderValue(
                                formatDate(selectedOrder.bookingDate),
                              )}
                            </p>
                            <p className="mb-1">
                              Delivery:{" "}
                              {renderValue(
                                formatDate(selectedOrder.deliveryDate),
                              )}
                            </p>
                            <p className="mb-1">
                              Status: {selectedOrder.status}
                            </p>
                            <p className="mb-0">
                              Amount: {formatRupee(selectedOrder.totalAmount)}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="row g-4 mb-4">
                        <div className="col-lg-6">
                          <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white">
                              <strong className="mb-0">Measurements</strong>
                            </div>
                            <div className="card-body p-3">
                              {Object.keys(draftMeasurements).length ? (
                                <div className="table-responsive">
                                  <table className="table table-sm mb-0">
                                    <tbody>
                                      {Object.entries(draftMeasurements).map(
                                        ([key, value]) => (
                                          <tr key={key}>
                                            <td className="fw-semibold text-capitalize">
                                              {key.replace(/([A-Z])/g, " $1")}
                                            </td>
                                            <td>
                                              <input
                                                type="text"
                                                className="form-control form-control-sm"
                                                value={value}
                                                onChange={(event) =>
                                                  changeMeasurement(
                                                    key,
                                                    event.target.value,
                                                  )
                                                }
                                              />
                                            </td>
                                          </tr>
                                        ),
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-muted mb-0">
                                  No measurement details available.
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="card border-0 shadow-sm">
                            <div className="card-header bg-white">
                              <strong className="mb-0">Design notes</strong>
                            </div>
                            <div className="card-body p-3">
                              {selectedOrder.design &&
                              Object.keys(selectedOrder.design).length ? (
                                <ul className="list-unstyled mb-0">
                                  {Object.entries(selectedOrder.design).map(
                                    ([key, value]) => (
                                      <li key={key} className="mb-2">
                                        <strong className="text-capitalize">
                                          {key.replace(/([A-Z])/g, " $1")}:
                                        </strong>
                                        <span className="ms-2">{value}</span>
                                      </li>
                                    ),
                                  )}
                                </ul>
                              ) : (
                                <p className="text-muted mb-0">
                                  No design details available.
                                </p>
                              )}
                            </div>
                          </div>

                          <div className="mt-4">
                            <button
                              type="button"
                              className="btn btn-outline-primary me-2 mb-3"
                              onClick={() => {
                                setIsEditingSketch(true);
                                setEditingSketchUrl(
                                  selectedOrder.designSketchUrl || "",
                                );
                              }}
                            >
                              Change design sketch
                            </button>
                            {selectedOrder.designSketchUrl ? (
                              <div className="card border-0 shadow-sm mt-2">
                                <div className="card-header bg-white">
                                  <strong className="mb-0">
                                    Design sketch
                                  </strong>
                                </div>
                                <div className="card-body p-3 text-center">
                                  <img
                                    src={selectedOrder.designSketchUrl}
                                    alt="Saved design sketch"
                                    className="img-fluid rounded"
                                  />
                                </div>
                              </div>
                            ) : null}

                            {isEditingSketch ? (
                              <div className="card border-0 shadow-sm mt-4">
                                <div className="card-header bg-white">
                                  <strong className="mb-0">
                                    Edit design sketch
                                  </strong>
                                </div>
                                <div className="card-body p-3">
                                  <DesignSketch
                                    drawingDataUrl={editingSketchUrl}
                                    onChange={setEditingSketchUrl}
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-outline-secondary mt-3"
                                    onClick={() => setIsEditingSketch(false)}
                                  >
                                    Cancel sketch edit
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div className="d-flex flex-wrap gap-3 justify-content-end">
                        <button
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={deleteSelectedOrder}
                          disabled={loading}
                        >
                          Delete order
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary px-4"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" />
                              Saving...
                            </>
                          ) : (
                            "Save changes"
                          )}
                        </button>
                      </div>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
