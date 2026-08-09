"use client";

import { useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { firestore } from "@/lib/firebase";

const formatRupee = (value) => {
  return `₹ ${Number(value || 0).toLocaleString("en-IN")}`;
};

export default function TrackOrderPage() {
  const [query, setQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();

    const trimmedQuery = query.trim();
    if (!trimmedQuery) {
      setOrders([]);
      setError("Please enter your phone number or order number.");
      return;
    }

    setLoading(true);
    setError("");
    setOrders([]);

    try {
      const snapshot = await getDocs(collection(firestore, "jobOrders"));
      const normalizedQuery = trimmedQuery.toLowerCase();
      const phoneQuery = trimmedQuery.replace(/\D/g, "");

      const matches = snapshot.docs
        .map((item) => ({ docId: item.id, ...item.data() }))
        .filter((order) => {
          const orderNo = String(order.orderNo || "").toLowerCase();
          const billNo = String(order.billNo || "").toLowerCase();
          const phone = String(order.customer?.phone || "").replace(/\D/g, "");

          return (
            orderNo.includes(normalizedQuery) ||
            billNo.includes(normalizedQuery) ||
            phone.includes(phoneQuery)
          );
        })
        .sort((a, b) => {
          const aValue = a.createdAt?.seconds || 0;
          const bValue = b.createdAt?.seconds || 0;
          return bValue - aValue;
        });

      setOrders(matches);

      if (matches.length === 0) {
        setError(
          "No order matched your search. Please try another phone number or order number.",
        );
      }
    } catch (err) {
      console.error(err);
      setError("Unable to load your order right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
            <div className="card-body p-4 p-md-5">
              <div className="text-center mb-4">
                <span className="badge bg-warning text-dark rounded-pill px-3 py-2 mb-3">
                  Track your order
                </span>
                <h1 className="fw-bold mb-2">Find your tailoring order</h1>
                <p className="text-muted mb-0">
                  Enter your phone number or order number to view the latest
                  status of your job.
                </p>
              </div>

              <form onSubmit={handleSearch} className="row g-3 align-items-end">
                <div className="col-md-9">
                  <label className="form-label fw-semibold">
                    Phone number or order number
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Example: 9876543210 or JO123456"
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>
                <div className="col-md-3">
                  <button
                    className="btn btn-primary btn-lg w-100"
                    type="submit"
                  >
                    {loading ? "Searching..." : "Search"}
                  </button>
                </div>
              </form>

              {error ? (
                <div className="alert alert-warning mt-4 mb-0" role="alert">
                  {error}
                </div>
              ) : null}

              {loading ? (
                <div className="text-center text-muted py-5">
                  Loading your order…
                </div>
              ) : null}

              {orders.length > 0 ? (
                <div className="mt-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Matching orders</h5>
                    <span className="badge bg-secondary rounded-pill">
                      {orders.length} result{orders.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="row g-3">
                    {orders.map((order) => (
                      <div className="col-12" key={order.docId}>
                        <div className="card border-0 shadow-sm h-100">
                          <div className="card-body">
                            <div className="d-flex flex-column flex-md-row justify-content-between gap-2">
                              <div>
                                <h5 className="fw-bold mb-1">
                                  {order.orderNo || order.billNo || "Order"}
                                </h5>
                                <div className="text-muted small">
                                  {order.customer?.name || "Customer"} ·{" "}
                                  {order.customer?.phone || "—"}
                                </div>
                              </div>
                              <span className="badge bg-info text-dark rounded-pill px-3 py-2">
                                {order.status || "Pending"}
                              </span>
                            </div>

                            <div className="row mt-3 g-3">
                              <div className="col-md-6">
                                <p className="mb-1">
                                  <strong>Bill number:</strong>{" "}
                                  {order.billNo || "—"}
                                </p>
                                <p className="mb-1">
                                  <strong>Delivery date:</strong>{" "}
                                  {order.deliveryDate || "—"}
                                </p>
                                <p className="mb-0">
                                  <strong>Piece type:</strong>{" "}
                                  {order.pieceType || "—"}
                                </p>
                              </div>
                              <div className="col-md-6">
                                <p className="mb-1">
                                  <strong>Total amount:</strong>{" "}
                                  {formatRupee(order.totalAmount)}
                                </p>
                                <p className="mb-1">
                                  <strong>Advance paid:</strong>{" "}
                                  {formatRupee(order.advance)}
                                </p>
                                <p className="mb-0">
                                  <strong>Balance:</strong>{" "}
                                  {formatRupee(order.balance)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
