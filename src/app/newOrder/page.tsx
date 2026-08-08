"use client";

import { useState } from "react";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";

import { firestore, storage } from "@/lib/firebase";

import CustomerSearch, { Customer } from "./components/CustomerSearch";

import MeasurementForm from "./components/MeasurementForm";
import DesignSection from "./components/DesignSection";
import DesignSketch from "./components/DesignSketch";

export default function NewJobOrder() {
  const [loading, setLoading] = useState(false);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [orderInfo, setOrderInfo] = useState({
    orderNo: "",
    billNo: "",
    bookingDate: new Date().toISOString().substring(0, 10),
    deliveryDate: "",
    advance: "",
    totalAmount: "",
  });

  const [measurements, setMeasurements] = useState<Record<string, string>>({});

  const [design, setDesign] = useState<Record<string, string>>({});
  const [designSketchUrl, setDesignSketchUrl] = useState("");

  const [pieceType, setPieceType] = useState("Kurti");

  const resetForm = () => {
    setCustomer({
      name: "",
      phone: "",
      address: "",
    });

    setOrderInfo({
      orderNo: "",
      billNo: "",
      bookingDate: new Date().toISOString().substring(0, 10),
      deliveryDate: "",
      advance: "",
      totalAmount: "",
    });

    setMeasurements({});
    setDesign({});
    setDesignSketchUrl("");
  };

  const generateOrderNo = () => {
    return "JO" + Date.now().toString().slice(-6);
  };

  const saveCustomer = async () => {
    const ref = doc(firestore, "customers", customer.phone);

    const snap = await getDoc(ref);

    if (!snap.exists()) {
      await setDoc(ref, {
        name: customer.name,
        phone: customer.phone,
        address: customer.address,
        totalOrders: 1,
        lastOrder: orderInfo.orderNo,
        createdAt: serverTimestamp(),
      });
    } else {
      const data = snap.data();

      await setDoc(
        ref,
        {
          ...data,
          name: customer.name,
          address: customer.address,
          totalOrders: (data.totalOrders || 0) + 1,
          lastOrder: orderInfo.orderNo,
        },
        { merge: true },
      );
    }
  };

  const saveJobOrder = async () => {
    if (!customer.phone) {
      alert("Enter Customer Mobile Number");
      return;
    }

    if (!customer.name) {
      alert("Enter Customer Name");
      return;
    }

    if (!orderInfo.deliveryDate) {
      alert("Select Delivery Date");
      return;
    }

    try {
      setLoading(true);

      const orderNo = orderInfo.orderNo || generateOrderNo();

      const docRef = await addDoc(collection(firestore, "jobOrders"), {
        customer,
        pieceType,
        measurements,
        design,

        orderNo,

        billNo: orderInfo.billNo,

        bookingDate: orderInfo.bookingDate,

        deliveryDate: orderInfo.deliveryDate,

        advance: Number(orderInfo.advance || 0),

        totalAmount: Number(orderInfo.totalAmount || 0),

        balance:
          Number(orderInfo.totalAmount || 0) - Number(orderInfo.advance || 0),

        status: "Pending",

        createdAt: serverTimestamp(),
      });

      if (designSketchUrl) {
        const imageRef = ref(
          storage,
          `jobOrders/${docRef.id}/design-sketch.png`,
        );
        await uploadString(imageRef, designSketchUrl, "data_url");
        const savedUrl = await getDownloadURL(imageRef);
        await updateDoc(doc(firestore, "jobOrders", docRef.id), {
          designSketchUrl: savedUrl,
        });
      }

      await saveCustomer();

      alert("Job Order Saved Successfully");

      resetForm();
    } catch (err) {
      console.log(err);

      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const title =
    pieceType === "Blouse" ? "Blouse Measurements" : "Kurti Measurements";

  return (
    <div className="container-fluid py-4">
      <div className="card shadow border-0">
        <div className="card-header bg-success text-white">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h3 className="mb-0">New Job Order</h3>

              <small>The Little Mango Tree</small>
            </div>

            <button className="btn btn-warning" onClick={resetForm}>
              New
            </button>
          </div>
        </div>

        <div className="card-body">
          <div className="row">
            <div className="col-lg-6 mb-4">
              <CustomerSearch
                phone={customer.phone}
                onPhoneChange={(phone) =>
                  setCustomer((prev) => ({
                    ...prev,
                    phone,
                  }))
                }
                onCustomerSelect={(c: Customer) =>
                  setCustomer({
                    name: c.name,
                    phone: c.phone,
                    address: c.address,
                  })
                }
              />
            </div>

            <div className="col-lg-6"></div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Customer Name</label>

              <input
                className="form-control"
                value={customer.name}
                onChange={(e) =>
                  setCustomer((prev) => ({
                    ...prev,
                    name: e.target.value.toUpperCase(),
                  }))
                }
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label">Address</label>

              <textarea
                className="form-control"
                rows={2}
                value={customer.address}
                onChange={(e) =>
                  setCustomer((prev) => ({
                    ...prev,
                    address: e.target.value.toUpperCase(),
                  }))
                }
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Bill No</label>

              <input
                className="form-control"
                value={orderInfo.billNo}
                onChange={(e) =>
                  setOrderInfo((prev) => ({
                    ...prev,
                    billNo: e.target.value,
                  }))
                }
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Booking Date</label>

              <input
                type="date"
                className="form-control"
                value={orderInfo.bookingDate}
                onChange={(e) =>
                  setOrderInfo((prev) => ({
                    ...prev,
                    bookingDate: e.target.value,
                  }))
                }
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Delivery Date</label>

              <input
                type="date"
                className="form-control"
                value={orderInfo.deliveryDate}
                onChange={(e) =>
                  setOrderInfo((prev) => ({
                    ...prev,
                    deliveryDate: e.target.value,
                  }))
                }
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Total Amount</label>

              <input
                type="number"
                className="form-control"
                value={orderInfo.totalAmount}
                onChange={(e) =>
                  setOrderInfo((prev) => ({
                    ...prev,
                    totalAmount: e.target.value,
                  }))
                }
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Advance</label>

              <input
                type="number"
                className="form-control"
                value={orderInfo.advance}
                onChange={(e) =>
                  setOrderInfo((prev) => ({
                    ...prev,
                    advance: e.target.value,
                  }))
                }
              />
            </div>

            <div className="col-md-3 mb-3">
              <label className="form-label">Piece Type</label>
              <select
                className="form-select"
                value={pieceType}
                onChange={(e) => setPieceType(e.target.value)}
              >
                <option value="Kurti">Kurti</option>
                <option value="Blouse">Blouse</option>
              </select>
            </div>
          </div>
          {/* ================= Measurements ================= */}

          <MeasurementForm
            pieceType={pieceType}
            measurements={measurements}
            setMeasurements={setMeasurements}
          />

          {/* ================= Design ================= */}

          <DesignSection
            pieceType={pieceType}
            design={design}
            setDesign={setDesign}
          />

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-info text-white fw-bold">
              Design Sketch
            </div>
            <div className="card-body">
              <DesignSketch
                drawingDataUrl={designSketchUrl}
                onChange={setDesignSketchUrl}
              />
            </div>
          </div>

          {/* ================= Payment Summary ================= */}

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">Payment Summary</h5>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-md-4">
                  <label className="form-label">Total Amount</label>

                  <input
                    type="number"
                    className="form-control"
                    value={orderInfo.totalAmount}
                    onChange={(e) =>
                      setOrderInfo((prev) => ({
                        ...prev,
                        totalAmount: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Advance Paid</label>

                  <input
                    type="number"
                    className="form-control"
                    value={orderInfo.advance}
                    onChange={(e) =>
                      setOrderInfo((prev) => ({
                        ...prev,
                        advance: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="col-md-4">
                  <label className="form-label">Balance</label>

                  <input
                    type="number"
                    className="form-control fw-bold bg-light"
                    value={
                      Number(orderInfo.totalAmount || 0) -
                      Number(orderInfo.advance || 0)
                    }
                    readOnly
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ================= Order Status ================= */}

          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-warning">
              <h5 className="mb-0">Order Status</h5>
            </div>

            <div className="card-body">
              <div className="row">
                <div className="col-md-6">
                  <label className="form-label">Current Status</label>

                  <select className="form-select" defaultValue="Pending">
                    <option>Pending</option>
                    <option>Cutting</option>
                    <option>Stitching</option>
                    <option>Trial</option>
                    <option>Ready</option>
                    <option>Delivered</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label">Balance Amount</label>

                  <div
                    className={`alert mt-2 ${
                      Number(orderInfo.totalAmount || 0) -
                        Number(orderInfo.advance || 0) >
                      0
                        ? "alert-danger"
                        : "alert-success"
                    }`}
                  >
                    ₹{" "}
                    {Number(orderInfo.totalAmount || 0) -
                      Number(orderInfo.advance || 0)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= Sticky Action Bar ================= */}

          <div
            className="sticky-bottom bg-white border-top p-3 mt-5"
            style={{
              zIndex: 100,
            }}
          >
            <div className="d-flex justify-content-end gap-3">
              <button className="btn btn-secondary" onClick={resetForm}>
                Reset
              </button>

              <button
                className="btn btn-success px-5"
                disabled={loading}
                onClick={saveJobOrder}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  "Save Job Order"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
